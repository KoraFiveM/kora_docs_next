---
title: Configuration
sidebar_position: 2
---

# Configuration

All options are in `config.lua`, a shared script loaded on both client and server. At the end of the file the table is passed through `Kora.config.adopt` (kora_lib). That lets per-server overrides go in a generated `config.local.lua`, which is git-ignored, while the public `Config` table keeps its shape.

Some keys are defined but **not read by the current code**. They are marked *unused* below. Changing them has no effect until the code reads them.

## General

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `Config.debug` | boolean | `false` | Draws the kora_target debug spheres for the studio zones |
| `Config.notifyTitle` | string | `'Kora Cards'` | Title used for notifications |
| `Config.jobName` | string | `'cardstudio'` | Job name used for registration and studio authorization. Duty toggling and the Studio tab check the literal `'cardstudio'`, so don't rename it. |
| `Config.adminPermission` | string | `'admin'` | Permission required for the admin commands |

## Commands

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `Config.commands.cards` | string | `'cards'` | *Unused.* The client registers `/cards` with a hard-coded name. |
| `Config.commands.reload` | string | `'kora_cards_reload'` | Name of the catalog reload command |
| `Config.commands.season` | string | `'kora_cards_season'` | Name of the season preview/close command |

## Capture (`Config.capture`)

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `resource` | string | `'screenshot-basic'` | *Unused.* The code checks and calls `screenshot-basic` directly. |
| `maxBytes` | number | `2.5 * 1024 * 1024` | Largest allowed WebP capture or catalog image, in bytes |
| `sessionSeconds` | number | `45` | How long a capture request stays valid. Clamped to 5–120. |
| `cleanupHours` | number | `24` | Unprinted drafts older than this are deleted with their image. Clamped to 1–168. Cleanup runs at start and every hour. |
| `encoding` | string | `'webp'` | Encoding passed to `screenshot-basic` |
| `quality` | number | `0.86` | Quality passed to `screenshot-basic` |
| `minFov` / `maxFov` / `defaultFov` | number | `20.0` / `70.0` / `50.0` | *Unused.* The camera uses hard-coded limits of 20–70 and starts at 45. |
| `publicBaseUrl` | string | `''` | Public base URL for card artwork. When empty, clients use `http://` plus the server endpoint plus `/kora_cards/media/`. Set it when media goes through a reverse proxy. |

## Studio (`Config.studio`)

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `ipl` | string | `'facelobby'` | IPL requested on client start and removed when the resource stops |
| `actionDistance` | number | `2.25` | Server-side maximum distance from a station for station actions |
| `targetRadius` | number | `0.8` | kora_target sphere radius for the station zones |
| `locations.duty` | vector table | Lifeinvader lobby | Clock in/out point |
| `locations.locker` | vector table | | Camera checkout point |
| `locations.supply` | vector table | | Supply purchase point |
| `locations.editor` | vector table | | Point for editing, activating, archiving and cloning designs |
| `locations.printer` | vector table | | Printing point |
| `locations.publicShop` | vector table | | Public shop point. Buying from the shop requires being within `actionDistance` of it. |
| `duelZone.center` | vector table | `-1047.90, -233.00, 39.00` | Center of the duel zone |
| `duelZone.radius` | number | `18.0` | Players must stay within this distance of the center to challenge and keep playing. It is also the radius of the "Open Duel Table" target zone. |
| `duelZone.challengeDistance` | number | `5.0` | Maximum distance between the two players |

Each location is `{ x, y, z, heading }`. `heading` is not used.

```lua
Config.studio.locations.printer = { x = -1047.12, y = -229.94, z = 39.01, heading = 28.0 }
```

## Job (`Config.job`)

Registered as the `cardstudio` job with `Kora.shared.register('jobs', ...)` unless a job with that name already exists.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | string | `'Card Studio'` | Job label |
| `type` | string | `'entertainment'` | Job type |
| `defaultDuty` | boolean | `false` | Duty state on login |
| `offDutyPay` | boolean | `false` | Whether off-duty employees are paid |
| `grades` | table | see below | Grade definitions |

| Grade | Name | Payment | Boss |
| --- | --- | --- | --- |
| 1 | Assistant | 30 | |
| 2 | Photographer | 45 | |
| 3 | Editor | 60 | |
| 4 | Studio Manager | 85 | yes |

## Items (`Config.items`)

Definitions for `card_camera`, `card_film`, `blank_card`, `card_ink` and `trading_card`. Each is registered with kora_core unless an item with that name already exists. Fields: `name`, `label`, `weight`, `type`, `image`, `imageUrl`, `unique`, `useable`, `shouldClose`, `description`. See [Items](./items.md).

## Supplies (`Config.supplies`)

Prices for studio supplies, which are bought at the supply station (grade 1 or higher, on duty, 1–20 per purchase).

| Item | `price` | `account` |
| --- | --- | --- |
| `card_film` | 50 | `cash` |
| `blank_card` | 15 | `cash` |
| `card_ink` | 10 | `cash` |

The server charges these prices. The Studio tab button labels (`$50`, `$15`, `$10`) are hard-coded, so update `client/main.lua` too if you change them.

## Permissions (`Config.permissions`)

*Unused.* This table lists the intended minimum grade per studio action (`checkoutCamera = 1`, `captureDraft = 1`, `activateBasic = 2`, `print = 2`, `editShared = 3`, `linkEvolution = 3`, `archive = 4`). The server hard-codes the same values. See [Card Studio job](./features/studio.md#grade-permissions).

## Text limits (`Config.textLimits`)

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | number | `32` | Maximum card name length checked during catalog validation |
| `flavor` | number | `120` | Maximum flavor text length |
| `moveName` | number | `24` | Maximum move name length |

The draft editor and the save handler also hard-code 32, 120 and 24.

## Deck (`Config.deck`)

*Unused.* The values (`size = 60`, `maxCopies = 4`, `maxRarityPoints = 24`, `openingHand = 7`, `prizes = 6`, `bench = 5`) match the rules hard-coded in the server and the match engine. See [Matches and game rules](./features/matches.md).

## Match (`Config.match`)

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `turnSeconds` | number | `90` | Turn and promotion timer, clamped by the engine to 5–3600 |
| `disconnectGraceSeconds` | number | `120` | How long a disconnected player has to rejoin before forfeiting, clamped to 5–3600 |
| `rankedMinimumTurnsForPayout` | number | `6` | Completed turns required before a ranked win pays out |
| `rankedMinimumSecondsForPayout` | number | `180` | Match duration required before a ranked win pays out |
| `rankedWinPayment` | number | `500` | Bank payout for an eligible ranked win |
| `rankedPaidWinsPerUtcDay` | number | `5` | Paid ranked wins allowed per character per UTC day |
| `eloInitial` | number | `1000` | *Unused.* New ratings are always 1000. |
| `eloK` | number | `32` | Elo K-factor |
| `recentCombatSeconds` | number | `15` | Players who dealt or took weapon damage this many seconds ago or less can't challenge or keep playing |

The Play tab shows "90 seconds" and "5 metres" as fixed text.

## Season (`Config.season`)

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `placementMinimumMatches` | number | `5` | Ranked matches needed to qualify for season rewards |
| `rewards` | number array | `{ 15000, 10000, 5000 }` | Bank rewards for places 1, 2 and 3 |

The Ranked tab text ("five completed ranked matches", "$15,000, $10,000, and $5,000") is hard-coded.

## Starters (`Config.starters`)

Each starter is a key with a `label`, a `description` and `cards`, a map from design ID to copy count. A starter must add up to exactly 60 cards. Every listed design must be active in the catalog, or the claim fails.

```lua
Config.starters = {
    street_circuit = {
        label = 'Street Circuit',
        description = 'Fast Heat units, city tech, and aggressive utility.',
        cards = { street_runner = 4, heat_charge = 16, --[[ ... ]] },
    },
}
```

| Starter | Contents |
| --- | --- |
| `street_circuit` | Street Runner x4, Signal Hound x4, Alley Spark x4, Night Rider x3, Circuit Ace x2, Block Burner x3, Heat Charge x16, City Charge x8, Quick Route x4, Tool Kit x4, Pit Stop x3, Power Surge x3, Rush Hour x2 |
| `harbor_guard` | Dock Pup x4, Harbor Hound x3, Port Guardian x2, Pier Scout x4, Tide Warden x3, Harbor Captain x2, Gull Watcher x2, Tide Charge x16, Wild Charge x8, Shift Briefing x4, First Aid x4, Safe Passage x3, Supply Manifest x3, High Tide x2 |

The Binder tab only offers buttons for `street_circuit` and `harbor_guard`. A comment in `config.lua` mentions `002_city_legends_catalog.sql`, but that file doesn't exist. The catalog is seeded from `server/schema.lua`.

## Not configurable

These are hard-coded constants, documented on the feature pages:

- Rarity weights, print caps and deck points (`shared/rules.lua`)
- Challenge expiry (30 seconds)
- The card show radius (5 metres)
- The callback rate limit (45 calls per 10 seconds)
