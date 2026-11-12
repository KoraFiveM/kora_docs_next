---
title: "Match engine"
sidebar_position: 4
---


# Match engine

A self-contained, dependency-free Lua module (no FiveM, kora_lib, JSON or database calls inside `shared/match.lua` itself) implementing a two-player, turn-based card battle: Basic/Stage-1/Stage-2 Units with HP, weakness/resistance, attacks with resource costs and an allow-listed effect system (draw, search, damage, heal, attach/discard resource, switch, apply_status, modifier), a bench of up to 5, a single Venue slot, 6 prizes per player, and knockout/promotion/win resolution. `server/matches.lua` is the only caller: it supplies validated decks, a UTC clock, persists `engine:exportState()` after every change, and is the sole bridge to kora_core money, kora_sql and TriggerClientEvent.

Namespace: `KoraCardsMatch (shared/match.lua)` · Source: `shared/match.lua, shared/rules.lua, server/matches.lua`

## How it works

Every mutating call goes through `apply()`, which re-derives the legal action set for the acting player and rejects anything not in it — the client never sends a free-form action type, only a server-issued `actionId` from the last snapshot. Combat math: weakness doubles (or a custom multiplier) raw damage, resistance subtracts a flat amount (default 30), 'this_attack' and venue modifiers are folded in before damage is applied, and confusion has a 50% chance to redirect 30 damage onto the attacker's own active unit instead of attacking. A knocked-out unit awards its `prizeValue` (1-3) in prizes to the opponent; running out of prizes or the opponent having no units left ends the match (simultaneously for both conditions, a draw).

## Running a match from scratch

1. **Validate both decks** — `validateDeck` on each 60-entry deck before anything else.
2. **Create the engine** — `Engine.new` deals opening hands and starts turn 1 for the player chosen as `order[1]`.
3. **Persist, then announce** — Export and store `state_json` before either client is told the match exists, so a crash immediately after creation can still be recovered.
4. **Apply, persist, push** — Every `apply()` that returns `ok = true` is immediately persisted again and pushed to both players via `kora_cards:client:matchState`.
5. **Tick every second** — Drives turn timeouts, disconnect forfeits and reconnection grace independent of player input.

## Terms used on this page

| Term | Meaning |
| --- | --- |
| Revision | Monotonically increasing integer on the engine; every successful `apply()` increments it. Clients must echo back the revision they last saw or the action is rejected as stale. |
| Legal action spec | A short-lived, server-generated action id (`a:<revision>:<playerId>:<n>`) describing exactly what that id does (type, card, target options); the only thing a client may send back as `actionId`. |
| Venue | A single shared slot (`self.venue`) that either player can occupy by playing a Venue card; it grants a standing modifier to one side while on the field and is discarded when replaced. |
| Needs promotion | A player whose active unit was knocked out with a bench available must choose a replacement before the turn can continue; `engine:apply` exposes a `promote` action during this phase. |

## Effect ops and targets (shared/rules.lua allow-list)

Only these effect operations and targets are ever executed; anything else fails validation or is skipped at runtime.

| Option | Type | Description |
| --- | --- | --- |
| `draw / search / damage / heal` | effect op | Draw N cards (1-5), search the deck for matching cards (1-4, by kind/element/id/stage), deal damage (0-200) or heal (0-200) to resolved targets. |
| `attach_resource / discard_resource` | effect op | Move 1-3 matching resource cards between deck/discard and a unit's attached resources. |
| `switch` | effect op | Swap the active unit with a bench unit for `self` or `opponent`. |
| `apply_status / modifier` | effect op | Apply a special condition (Poisoned, Burned, Asleep, Paralyzed, Confused), or a numeric stat modifier (damage, received_damage, retreat_cost, attack_cost) with a duration (this_attack, until_end_turn, until_next_turn, attached, venue). |
| `self / opponent / self_active / opponent_active` | target | The acting or opposing player's whole side, or specifically their active unit. |
| `chosen_friendly / chosen_opponent / attached` | target | A unit chosen by the acting player on their own or the opponent's side, or the unit a Gear card is being attached to. |
| `all_friendly / all_opposing` | target | Every unit (active + bench) on one side — used by Venue cards. |

## Deck and card rules (also enforced independently by the deck/save/starter code in server/cards.lua)

Exactly 60 cards, at most 4 copies of any one design except Resource cards flagged `basic = true` (the two 'Charge' resource types per element, unlimited), at least 1 Basic Unit, at most 24 total rarity points (Common 0, Uncommon 1, Rare 2, Epic 4, Legendary 7 by default from `Rules.Rarities`).

## Rarity and templates

`Rules.rollRarity` weights Common 55%, Uncommon 25%, Rare 13%, Epic 6%, Legendary 1% (configurable only by editing `shared/rules.lua`). `Rules.unitTemplate` derives HP, retreat cost, weakness/resistance and both attacks' damage/cost purely from stage, rarity rank and archetype (Striker/Guardian/Medic/Trickster), so a photographer's flavor text and crop never influence mechanics.

## Content hash and locking

`Rules.contentHash` canonically hashes the mechanically relevant fields of a design (FNV-1a). Once a design is printed, its `locked_hash` is set and any later edit that would change the hash is rejected by the catalog loader — this is what keeps an already-printed physical card's stats fixed forever.

## Functions

The module-level functions used to run a match, plus the instance methods on the object `Engine.new`/`Engine.restore` return.

### `KoraCardsMatch.validateDeck(entries, catalog)`

Validates a deck of exact print entries before a match starts: exactly 60 cards, no duplicate print ids, at most 4 copies of a non-basic-Resource design, at least one Basic Unit, at most 24 total rarity points.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `entries` | table[] | Each `{ printId, designId, design? }`. Required. |
| `catalog` | table | Map of design id to design, used to resolve `designId` when `design` is absent. |

**Returns**

- **`true, { points, basics, counts }` on success.**
- **`nil, { code, detail }` on failure** — codes: `deck_size`, `invalid_card`, `unknown_design`, `design_without_id`, `missing_print`, `duplicate_print`, `copy_limit`, `rarity_points`, `no_basic_unit`.

**Example**

```lua
local ok, detail = KoraCardsMatch.validateDeck(deckEntries, KoraCards.Catalog.byId)
```

**Representative console output**

```text
Called by `server/matches.lua`'s `loadDeck` every time a player's saved deck is loaded for a challenge, so a deck that became illegal after saving (for example an archived design) cannot start a match.
```

### `KoraCardsMatch.new({ id, mode, catalog, players, turnSeconds, disconnectGraceSeconds })`

Creates a new match: shuffles both decks, deals a 7-card opening hand (re-mulliganing up to 128 times until a hand contains a Basic Unit), auto-benches available Basics, sets 6 prizes per player, and starts the first turn.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `id` | string | Match id (a UUID from `KoraCards.Storage.uuid()`). |
| `mode` | string | `casual` or `ranked`. |
| `catalog` | table | Design lookup by id. |
| `players` | table[2] | `{ { id, deck }, { id, deck } }` where `deck` is the validated 60-entry array. |
| `turnSeconds` | number | Per-turn clock, from `Config.match.turnSeconds`. |
| `disconnectGraceSeconds` | number | Reconnect grace window, from `Config.match.disconnectGraceSeconds`. |

**Returns**

- **`engine | nil, err`** — the match engine instance, or a validation error if either deck fails `validateDeck`.

**Example**

```lua
local engine, err = KoraCardsMatch.new({ id = matchId, mode = 'ranked', catalog = KoraCards.Catalog.byId, players = { { id = citizenA, deck = deckA }, { id = citizenB, deck = deckB } }, turnSeconds = 90, disconnectGraceSeconds = 120 })
```

**Representative console output**

```text
Instantiated once per match by `beginMatch` in `server/matches.lua` and immediately persisted (`exportState`) before the match is announced to either client.
```

### `KoraCardsMatch.restore({ state, catalog })`

Rebuilds a live engine instance from a previously exported state (used on server restart to resume in-progress matches).

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `state` | table | The table returned by `engine:exportState()`. |
| `catalog` | table | Design lookup by id; designs are re-attached by id, so a since-archived or deleted design can make restore fail. |

**Returns**

- **`engine | nil, err`.**

**Example**

```lua
local engine, err = KoraCardsMatch.restore({ state = decodedState, catalog = KoraCards.Catalog.byId })
```

**Representative console output**

```text
If restore fails, `server/matches.lua`'s `Play.recover` abandons the match (`KoraCards.Database.abandonMatch`) rather than risk serving corrupt state.
```

### `engine:apply(playerId, { expectedRevision, actionId, cardId?, targetId?, resourceIds? })`

Applies one turn action if it is currently legal for that player, using optimistic concurrency on `expectedRevision`.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `playerId` | string | The citizen ID seated in this match. |
| `expectedRevision` | number | Must equal the engine's current `revision` or the call fails with `stale_revision`. |
| `actionId` | string | One of the ids returned by `engine:legalActions(playerId)` for the current snapshot — not a free-form action type. |
| `cardId / targetId / resourceIds` | string / string / string[] | Only required when the matching legal-action spec carries them. |

**Returns**

- **`{ ok = true, revision, snapshot }` on success.**
- **`{ ok = false, code, revision, snapshot }` on failure** — `unknown_player`, `invalid_request`, `missing_action_id`, `stale_revision`, `illegal_action`, `invalid_card_reference`, `invalid_target`, `unsupported_action`, or an action-specific code (for example `bench_full`, `retreat_cost`, `attack_cost`, `condition_blocks_attack`).

**Example**

```lua
local result = engine:apply(citizenid, { expectedRevision = 12, actionId = 'a:12:ABC123:3', targetId = unitUid })
```

**Representative console output**

```text
A duplicate `actionId` already consumed in this revision replays the prior result instead of re-applying it, so a retried request after a dropped response cannot double-act.
```

### `engine:snapshot(playerId)`

Builds the player-facing view (own hand visible, opponent hand hidden) and recomputes legal actions for the requested player.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `playerId` | string | Required. |

**Returns**

- **`table | nil, 'unknown_player'`** — includes `revision`, `status`, `phase`, `turnPlayer`, `deadline`, both sides' public state, `venue`, `needsPromotion`, `legalActions`.

**Example**

```lua
local view = engine:snapshot(citizenid)
```

**Representative console output**

```text
`server/matches.lua`'s `uiSnapshot` wraps this with player names, labels and a human-readable outcome message before sending it to the client.
```

### `engine:tick(now)`

Clock and connection maintenance, called once per second from `server/matches.lua`'s loop for every in-progress match.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `now` | number | Unix seconds. |

**Returns**

- **`tick`: `boolean`** — true if something changed (timeout auto-pass, forfeit on both-disconnected). `forfeit(playerId, reason)`, `disconnect(playerId, at)`, `reconnect(playerId, at)`: `boolean`.

**Example**

```lua
engine:tick(os.time())
```

**Representative console output**

```text
Both players disconnected ends the match in a draw; one player past `disconnectGraceSeconds` (default 120s) forfeits automatically. A reconnect within the grace window extends the turn deadline by the paused duration.
```

## Limits and related APIs

The engine trusts its caller completely: it does not re-check that `players[].deck` entries really belong to that citizen ID, that is `server/matches.lua`'s job via `loadDeck`. `shared/match.lua` has no FiveM calls, so it can be required and unit-tested outside the resource (see `tests/`, not read for this page).

## Related guides

- [Server action channel](./action-channel.md)
- [Database tables](./database.md)
