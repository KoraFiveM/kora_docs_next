---
title: "Client events and local command"
sidebar_position: 3
---


# Client events and local command

Net events the server (or a trusted local script) can trigger to drive the client UI, plus the `/cards` command. None of these are kora_lib callbacks — they are one-way, fire-and-forget `TriggerClientEvent`/`RegisterCommand` calls.

Namespace: `kora_cards:client:*` · Source: `client/main.lua`

## How it works

All UI-opening events funnel through `openCards(view, snapshot?)`, which fetches a fresh snapshot via the `kora_cards:server:action` callback unless one is already supplied, and redirects to the match overlay whenever `snapshot.match` is present.

## Functions

Five net events plus the command.

### `RegisterNetEvent('kora_cards:client:open', function(view) end)`

Opens the AppShell app at the given view id, or the match overlay if a match is already active.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `view` | string | One of `binder`, `decks`, `play`, `shop`, `studio`, `ranked`. Any other string is still passed through as the AppShell `viewId`. |

**Returns**

- **No return value.**

**Example**

```lua
TriggerClientEvent('kora_cards:client:open', src, 'shop')
```

**Representative console output**

```text
Not validated against the caller in any way. Safe to call from trusted server code; do not expose it to untrusted triggers.
```

### `RegisterNetEvent('kora_cards:client:showCard', function(view) end)`

Pops the private viewer overlay for one print/design without opening the full app.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `view` | table | `{ print = { id, serial, bound }, design }` as returned by the `viewer` action, or the equivalent flattened fields. |

**Returns**

- **No return value.**

**Example**

```lua
-- Sent server-side by Cards.showNearby to every player within 5 metres
```

**Representative console output**

```text
Used internally for the 'show nearby players' card reveal; not intended as a general-purpose API.
```

### `RegisterNetEvent('kora_cards:client:useCamera', function(slot) end)`

Starts the in-game scripted camera minigame for a checked-out studio camera item.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `slot` | number | Inventory slot of the `card_camera` item being used. |

**Returns**

- **No return value.**

**Example**

```lua
-- Triggered by kora_inventory's CreateUsableItem('card_camera', ...) hook
```

**Representative console output**

```text
Zoom 20-70mm (`Config.capture.minFov`/`maxFov`), shutter on control 38, cancel on 177/200. Disabled while `duelLocked`.
```

### `RegisterNetEvent('kora_cards:client:challenge', function(challenge) end)`

Delivers (or clears, with `false`) an incoming match challenge and opens the Play view.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `challenge` | table \| false | `{ id, fromName, mode, expiresAt }`, or `false` to clear an expired/withdrawn challenge. |

**Returns**

- **No return value.**

**Example**

```lua
-- Sent by Play.challenge on the server
```

**Representative console output**

```text
The AppShell Play view shows an accept/decline banner while `pendingChallenge` is set.
```

### `RegisterNetEvent('kora_cards:client:matchState', function(state) end)`

Pushes the authoritative match snapshot (or `false` to end/clear it) for the live duel overlay.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `state` | table \| false | A `uiSnapshot` from `server/matches.lua`, or `false` after the 5-second post-match delay. |

**Returns**

- **No return value.**

**Example**

```lua
-- Sent on every engine revision change, from Play.push
```

**Representative console output**

```text
Closes the AppShell app and opens/updates the private match overlay automatically.
```

### `RegisterNetEvent('kora_cards:client:duelLock', function(locked) end)`

Freezes/unfreezes and (in)validates the player for the duration of a match.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `locked` | boolean | `true` on match start/reconnect, `false` on match end. |

**Returns**

- **No return value.**

**Example**

```lua
-- Sent alongside kora_cards:client:matchState transitions
```

**Representative console output**

```text
While locked: position frozen, invincible, firing disabled, camera/menu controls disabled every frame. Restores the pre-duel frozen/invincible state on unlock.
```

### `RegisterCommand('cards', function() openCards('binder') end, false)`

Opens the Binder view.

**Parameters**



**Returns**

- **No return value.**

**Example**

```lua
/cards
```

**Representative console output**

```text
Also added as a chat suggestion.
```

## Limits and related APIs

A modified client can fire these locally, but they only change what that client displays — every underlying mutation still goes through the server action channel and is re-validated there.

## Related guides

- [Server action channel](./action-channel.md)

## Server callback reference: kora_cards:server:action

Per-action payloads and effects, plus the listened-to events and NUI callbacks, as implemented in the code.



Kora Cards has **no exports** and **no server net events**. Clients send every mutation through a single kora_lib callback, and the server pushes state to clients with net events.

### Server callback: `kora_cards:server:action`

Registered with `Kora.callback.register` and rate-limited to 45 calls per 10 seconds. It is called as `Kora.callback.trigger('kora_cards:server:action', action, payload)`. Until the schema and catalog have loaded, it returns `nil, 'Kora Cards is still loading.'`. Each handler returns a result table, or `nil` and an error message.

**Internal.** This is the resource's own UI channel. The server checks job, grade, duty, station distance, ownership and match seat on every action, but other resources should not call it. It is listed here for reference and debugging.

| Action | Payload | Effect |
| --- | --- | --- |
| `snapshot`, `refresh` | none | Returns the player's full UI snapshot: binder, physical cards, decks, starters, shop, Studio data, rating, leaderboard and active match |
| `claimStarter` | `starter` | Claims a starter deck |
| `deposit` | `slot` | Moves a physical `trading_card` into the binder |
| `withdraw` | `printId` | Moves a binder print into the inventory |
| `saveDeck` | `deckId` or `id`, `name`, `printIds` | Creates or updates a deck |
| `deleteDeck` | `deckId` or `id` | Deletes a deck |
| `buyShop` / `shopBuy` | `id` / `designId` | Buys a print from the shop |
| `viewer` | `printId` or `slot` | Returns a verified print and its design |
| `showNearby` | `printId` or `slot` | Shows the card to every player within 5 m, including the sender |
| `buySupply` | `item`, `amount` | Buys studio supplies |
| `toggleDuty` | none | Clocks in or out at the duty station |
| `checkoutCamera` | none | Issues a studio camera |
| `capture` | `slot` | Takes a photo with the camera in `slot` |
| `saveDraft` / `updateDraft` | `designId`, `fields` | Saves the draft text, element, archetype, stage, predecessor and crop |
| `activate` / `activateDesign` | `id` / `designId` | Activates a draft and rolls its rarity |
| `print` / `printDesign` | `id` / `designId` | Prints one card |
| `archive` / `archiveDesign` | `id` / `designId` | Archives a design |
| `clone` / `cloneDesign` | `id` / `designId` | Clones a design into a new draft |
| `challenge` | `target`, `deckId`, `mode` | Challenges a nearby player |
| `challengeRespond` | `challengeId`, `accept`, `deckId` | Accepts or declines a challenge |
| `matchAction` | `matchId`, `actionId`, `expectedRevision`, `cardId`, `targetId`, `resourceIds` | Applies a legal match action |

### Client net events (server to client)

These are triggered by the server. They are **internal**. Triggering them from other resources only changes what that client displays. Ownership and state stay on the server.

| Event | Payload | Effect |
| --- | --- | --- |
| `kora_cards:client:useCamera` | `slot` (number) | Starts the first-person studio camera for the camera item in that slot |
| `kora_cards:client:open` | `view` (string, for example `binder`, `decks`, `play`, `shop`, `studio`, `ranked`) | Opens the AppShell on that view. Sent to the challenger when a challenge is declined (`play`). |
| `kora_cards:client:showCard` | viewer table: `print` (`id`, `serial`, `designId`, `bound`), `design`, `withdrawable` | Opens the card viewer overlay. Used when the item is used and by Show nearby. |
| `kora_cards:client:challenge` | `id`, `fromName`, `mode`, `expiresAt`, or `false` | Shows or clears an incoming challenge and opens the Play tab |
| `kora_cards:client:matchState` | match UI snapshot, or `false` | Opens or updates the match board. `false` closes it, 5 seconds after the match ends. |
| `kora_cards:client:duelLock` | boolean | `true` freezes the ped, makes it invincible and disables combat controls for the duel. `false` restores the previous state. |

### Events this resource listens to

| Event | Side | Handling |
| --- | --- | --- |
| `kora_core:server:playerLoaded` | Server | Removes leftover cameras, re-seats the player in an unfinished match, then after 1.5 seconds recovers interrupted operations and pays pending rewards |
| `kora_core:server:playerDropped` | Server | Marks the player disconnected in their match (the disconnect grace starts) and clears their camera token |
| `QBCore:Server:SetDuty` | Server | When `onDuty` is false, removes the player's studio cameras (legacy duty event) |
| `onResourceStart` (`kora_inventory`) | Server | Registers usable items and the camera swap hook again |
| `weaponDamageEvent` | Server | Cancels weapon damage dealt by or to a player in a match. Otherwise records recent combat for both players. |
| `onClientResourceStart` (`kora_target`) | Client | Registers the studio target zones again |
| `onResourceStop` (`kora_cards`) | Client | Stops the camera, releases the duel lock, closes the UI and removes the IPL |

### NUI callbacks (private overlay)

The resource's own NUI page (`web/build`) only handles the card viewer, the portrait editor and the match board. It posts to:

| Callback | Purpose |
| --- | --- |
| `ready` | The frame has loaded. Queued overlay messages are flushed. |
| `close` | Closes the overlay. The viewer and editor return to the AppShell view they were opened from. |
| `action` | Forwards `{ action, payload }` to the server callback. Only allowed per overlay: viewer can send `showNearby` and `withdraw`, editor can send `updateDraft`, match can send `matchAction`. |

The client sends overlay messages `kora_cards:viewer`, `kora_cards:editor` and `kora_cards:match`, with `false` as the payload to close them.
