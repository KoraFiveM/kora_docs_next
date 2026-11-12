---
title: "Configuration"
sidebar_position: 5
---


# Configuration

`config.lua` is a shared script, so `Config` exists on both client and server. The last line calls `Kora.config.adopt(Config)` when `kora_lib` provides it, registering this resource's configuration with kora_lib's config system without changing the public `Config` table's shape.

Namespace: `Config` · Source: `config.lua`

## All options

Every top-level key of `Config` in `config.lua`.

| Key | Type | Default | Controls | Applies / notes |
| --- | --- | --- | --- | --- |
| debug | boolean | false | Unused in the read source beyond being adopted into `Kora.config`; `addZone` reads `Config.Debug == true or Config.debug == true` for kora_target zone debug visuals. |  |
| notifyTitle | string | 'Kora Cards' | Title on every `Kora.notify.send` call from client and server. | Immediately. |
| jobName | string | 'cardstudio' | The job name created and checked for every studio permission gate. | Restart (job already registered under the old name stays until manually removed). |
| adminPermission | string | 'admin' | Permission required for `/kora_cards_reload` and `/kora_cards_season`. | Next command registration (restart). |
| commands.cards / reload / season | string | 'cards' / 'kora_cards_reload' / 'kora_cards_season' | The literal chat command names. `commands.cards` is not read: the client registers `/cards` with a hard-coded name (`client/main.lua:743`). | Restart. |
| capture.resource | string | 'screenshot-basic' | Not read: the code checks and calls `screenshot-basic` by its literal name (`server/studio.lua:69`). | No effect observed. |
| capture.maxBytes | number | 2.5 * 1024 * 1024 | Maximum accepted capture file size; oversized or empty captures are deleted and rejected. | Immediately. |
| capture.sessionSeconds | number | 45 | Clamped 5-120. How long a capture ticket stays valid while the client screenshot call is in flight. | Immediately. |
| capture.cleanupHours | number | 24 | Clamped 1-168. Drafts with zero prints older than this are deleted by the hourly cleanup thread. | Immediately (next hourly sweep). |
| capture.encoding / quality | string / number | 'webp' / 0.86 | Passed straight to `screenshot-basic`'s `requestClientScreenshot`. | Immediately. |
| capture.minFov / maxFov / defaultFov | number | 20.0 / 70.0 / 50.0 | Not read: the client camera hard-codes the limits 20 and 70 and starts at 45 (`client/main.lua:808`, `client/main.lua:825-826`). | No effect observed. |
| capture.publicBaseUrl | string | '' (auto) | Base URL for served card images. Empty means the client derives `http://<server endpoint>/kora_cards/media/`. | Immediately. |
| studio.ipl | string | 'facelobby' | Interior IPL requested on resource start and removed on stop. | Restart. |
| studio.actionDistance | number | 2.25 | Default proximity radius for `KoraCards.Auth.near` studio stations. | Immediately. |
| studio.targetRadius | number | 0.8 | Default `kora_target` sphere zone radius for studio stations (duty, locker, supply, editor, printer, shop). | Restart (zones are created once). |
| studio.locations.&lt;name> | table &#123;x,y,z,heading&#125; | 6 named points | duty, locker, supply, editor, printer, publicShop coordinates. | Restart. |
| studio.duelZone | table &#123;center, radius, challengeDistance&#125; | center ~(-1047,-233,39), radius 18.0, challengeDistance 5.0 | Where players must stand to challenge and duel; `radius` gates ongoing matches (a player who leaves it is auto-forfeited), `challengeDistance` gates issuing a challenge. | Immediately. |
| job | table | Card Studio, 4 grades (Assistant 30, Photographer 45, Editor 60, Studio Manager 85, isboss) | Registered once with `Kora.shared.register('jobs', ...)` if not already defined. | Restart to re-register; existing job definitions elsewhere are not overwritten. |
| items.&lt;name> | table | card_camera, card_film, blank_card, card_ink, trading_card | Registered once with `Kora.shared.register('items', ...)` if not already defined. | Restart to re-register. |
| supplies.&lt;item> | &#123; price, account &#125; | card_film $50 / blank_card $15 / card_ink $10, all `cash` | Price and `exports.kora_core:removeMoney` account for `buySupply`. | Immediately. |
| permissions.* | table | checkoutCamera 1, captureDraft 1, activateBasic 2, print 2, editShared 3, linkEvolution 3, archive 4 | Not read anywhere in the server code: every grade check in `server/studio.lua` and `KoraCards.Auth.studio` is a hard-coded number, not a lookup into this table. | No effect observed — edit the hard-coded grade numbers in server/studio.lua instead. |
| textLimits.name / flavor / moveName | number | 32 / 120 / 24 | Passed to `Rules.validateDesign`/`normaliseDesign` as character limits for catalog text. | Immediately. |
| deck.size / maxCopies / maxRarityPoints / openingHand / prizes / bench | number | 60 / 4 / 24 / 7 / 6 / 5 | Not read anywhere in the server or engine code: deck size, copy limit and rarity cap are hard-coded (60 / 4 / 24) in `server/cards.lua`'s `localDeckValidation` and `shared/rules.lua`'s defaults; opening hand (7), prizes (6) and bench (5) are hard-coded in `shared/match.lua`. | No effect observed. |
| match.turnSeconds / disconnectGraceSeconds | number | 90 / 120 | Per-turn clock and reconnect grace window passed into `Engine.new`. | New matches only. |
| match.rankedMinimumTurnsForPayout / rankedMinimumSecondsForPayout | number | 6 / 180 | Minimum turns and duration before a ranked win pays out. | Immediately. |
| match.rankedWinPayment / rankedPaidWinsPerUtcDay | number | 500 / 5 | Bank reward per eligible ranked win and the daily cap (UTC) per character. | Immediately. |
| match.eloInitial | number | 1000 | Not read anywhere in the server code: the new-player rating of 1000 is hard-coded in `server/matches.lua` (`INSERT IGNORE ... VALUES (?,?,1000)`) and the snapshot default. | No effect observed. |
| match.eloK | number | 32 | K-factor used by the ELO update in `server/matches.lua`'s `elo()`. | Immediately. |
| match.recentCombatSeconds | number | 15 | Cooldown after taking or dealing weapon damage before a player is duel-eligible again. | Immediately. |
| season.placementMinimumMatches | number | 5 | Minimum ranked matches played this season to be eligible for a placement reward. | Immediately. |
| season.rewards | number[3] | 15000, 10000, 5000 | Pending bank reward for 1st, 2nd and 3rd place on season close. | Immediately. |
| starters.&lt;key> | &#123; label, description, cards &#125; | street_circuit, harbor_guard — each a 60-card composition map of design slug/id to count | Account-bound starter deck definitions. Must sum to exactly 60 or `claimStarter` fails. | Immediately for new claims. |

## How it works

Several tables exist in `config.lua` but are not actually consulted anywhere in the Lua source read for this page (`permissions`, `deck`, `match.eloInitial`) — the corresponding behavior is hard-coded elsewhere instead. These are called out explicitly below so you do not edit them expecting an effect.

## Options

Pass an options table as the final argument to a play function. Omit the table or any field to use its default.

| Option | Type | Description |
| --- | --- | --- |
| `debug` | boolean | Default false. Unused in the read source beyond being adopted into `Kora.config`; `addZone` reads `Config.Debug == true or Config.debug == true` for kora_target zone debug visuals. |
| `notifyTitle` | string | Default 'Kora Cards'. Title on every `Kora.notify.send` call from client and server. Immediately. |
| `jobName` | string | Default 'cardstudio'. The job name created and checked for every studio permission gate. Restart (job already registered under the old name stays until manually removed). |
| `adminPermission` | string | Default 'admin'. Permission required for `/kora_cards_reload` and `/kora_cards_season`. Next command registration (restart). |
| `commands.cards / reload / season` | string | Default 'cards' / 'kora_cards_reload' / 'kora_cards_season'. The literal chat command names. `commands.cards` is not read: the client registers `/cards` with a hard-coded name (`client/main.lua:743`). Restart. |
| `capture.resource` | string | Default 'screenshot-basic'. Not read: the code checks and calls `screenshot-basic` by its literal name (`server/studio.lua:69`). No effect observed. |
| `capture.maxBytes` | number | Default 2.5 * 1024 * 1024. Maximum accepted capture file size; oversized or empty captures are deleted and rejected. Immediately. |
| `capture.sessionSeconds` | number | Default 45. Clamped 5-120. How long a capture ticket stays valid while the client screenshot call is in flight. Immediately. |
| `capture.cleanupHours` | number | Default 24. Clamped 1-168. Drafts with zero prints older than this are deleted by the hourly cleanup thread. Immediately (next hourly sweep). |
| `capture.encoding / quality` | string / number | Default 'webp' / 0.86. Passed straight to `screenshot-basic`'s `requestClientScreenshot`. Immediately. |
| `capture.minFov / maxFov / defaultFov` | number | Default 20.0 / 70.0 / 50.0. Not read: the client camera hard-codes the limits 20 and 70 and starts at 45 (`client/main.lua:808`, `client/main.lua:825-826`). No effect observed. |
| `capture.publicBaseUrl` | string | Default '' (auto). Base URL for served card images. Empty means the client derives `http://<server endpoint>/kora_cards/media/`. Immediately. |
| `studio.ipl` | string | Default 'facelobby'. Interior IPL requested on resource start and removed on stop. Restart. |
| `studio.actionDistance` | number | Default 2.25. Default proximity radius for `KoraCards.Auth.near` studio stations. Immediately. |
| `studio.targetRadius` | number | Default 0.8. Default `kora_target` sphere zone radius for studio stations (duty, locker, supply, editor, printer, shop). Restart (zones are created once). |
| `studio.locations.<name>` | table &#123;x,y,z,heading&#125; | Default 6 named points. duty, locker, supply, editor, printer, publicShop coordinates. Restart. |
| `studio.duelZone` | table &#123;center, radius, challengeDistance&#125; | Default center ~(-1047,-233,39), radius 18.0, challengeDistance 5.0. Where players must stand to challenge and duel; `radius` gates ongoing matches (a player who leaves it is auto-forfeited), `challengeDistance` gates issuing a challenge. Immediately. |
| `job` | table | Default Card Studio, 4 grades (Assistant 30, Photographer 45, Editor 60, Studio Manager 85, isboss). Registered once with `Kora.shared.register('jobs', ...)` if not already defined. Restart to re-register; existing job definitions elsewhere are not overwritten. |
| `items.<name>` | table | Default card_camera, card_film, blank_card, card_ink, trading_card. Registered once with `Kora.shared.register('items', ...)` if not already defined. Restart to re-register. |
| `supplies.<item>` | &#123; price, account &#125; | Default card_film $50 / blank_card $15 / card_ink $10, all `cash`. Price and `exports.kora_core:removeMoney` account for `buySupply`. Immediately. |
| `permissions.*` | table | Default checkoutCamera 1, captureDraft 1, activateBasic 2, print 2, editShared 3, linkEvolution 3, archive 4. Not read anywhere in the server code: every grade check in `server/studio.lua` and `KoraCards.Auth.studio` is a hard-coded number, not a lookup into this table. No effect observed — edit the hard-coded grade numbers in server/studio.lua instead. |
| `textLimits.name / flavor / moveName` | number | Default 32 / 120 / 24. Passed to `Rules.validateDesign`/`normaliseDesign` as character limits for catalog text. Immediately. |
| `deck.size / maxCopies / maxRarityPoints / openingHand / prizes / bench` | number | Default 60 / 4 / 24 / 7 / 6 / 5. Not read anywhere in the server or engine code: deck size, copy limit and rarity cap are hard-coded (60 / 4 / 24) in `server/cards.lua`'s `localDeckValidation` and `shared/rules.lua`'s defaults; opening hand (7), prizes (6) and bench (5) are hard-coded in `shared/match.lua`. No effect observed. |
| `match.turnSeconds / disconnectGraceSeconds` | number | Default 90 / 120. Per-turn clock and reconnect grace window passed into `Engine.new`. New matches only. |
| `match.rankedMinimumTurnsForPayout / rankedMinimumSecondsForPayout` | number | Default 6 / 180. Minimum turns and duration before a ranked win pays out. Immediately. |
| `match.rankedWinPayment / rankedPaidWinsPerUtcDay` | number | Default 500 / 5. Bank reward per eligible ranked win and the daily cap (UTC) per character. Immediately. |
| `match.eloInitial` | number | Default 1000. Not read anywhere in the server code: the new-player rating of 1000 is hard-coded in `server/matches.lua` (`INSERT IGNORE ... VALUES (?,?,1000)`) and the snapshot default. No effect observed. |
| `match.eloK` | number | Default 32. K-factor used by the ELO update in `server/matches.lua`'s `elo()`. Immediately. |
| `match.recentCombatSeconds` | number | Default 15. Cooldown after taking or dealing weapon damage before a player is duel-eligible again. Immediately. |
| `season.placementMinimumMatches` | number | Default 5. Minimum ranked matches played this season to be eligible for a placement reward. Immediately. |
| `season.rewards` | number[3] | Default 15000, 10000, 5000. Pending bank reward for 1st, 2nd and 3rd place on season close. Immediately. |
| `starters.<key>` | &#123; label, description, cards &#125; | Default street_circuit, harbor_guard — each a 60-card composition map of design slug/id to count. Account-bound starter deck definitions. Must sum to exactly 60 or `claimStarter` fails. Immediately for new claims. |

## Map placement

Every coordinate (`studio.locations`, `studio.duelZone`, the `facelobby` IPL) is tuned to the default kora recipe's interior. Reposition all of them together for your own map.

## Dead configuration

`Config.permissions`, `Config.deck`, `Config.match.eloInitial`, `Config.commands.cards`, `Config.capture.resource` and `Config.capture.minFov` / `maxFov` / `defaultFov` are present but unused by the code paths this page documents — grade gates live in `server/studio.lua`/`server/main.lua`, deck limits in `server/cards.lua` and `shared/rules.lua`, and the starting rating in `server/matches.lua`.

## Limits and related APIs

Changing `jobName`, `commands.*` or the studio coordinates after players already have progress does not migrate anything; existing job/permission data and target zones follow the new values only after the listed restart.

## Related guides

- [Server action channel](./action-channel.md)
- [Database tables](./database.md)

## Reference by group (from the code)



All options are in `config.lua`, a shared script loaded on both client and server. At the end of the file the table is passed through `Kora.config.adopt` (kora_lib). That lets per-server overrides go in a generated `config.local.lua`, which is git-ignored, while the public `Config` table keeps its shape.

Some keys are defined but **not read by the current code**. They are marked *unused* below. Changing them has no effect until the code reads them.

### General

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `Config.debug` | boolean | `false` | Draws the kora_target debug spheres for the studio zones |
| `Config.notifyTitle` | string | `'Kora Cards'` | Title used for notifications |
| `Config.jobName` | string | `'cardstudio'` | Job name used for registration and studio authorization. Duty toggling and the Studio tab check the literal `'cardstudio'`, so don't rename it. |
| `Config.adminPermission` | string | `'admin'` | Permission required for the admin commands |

### Commands

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `Config.commands.cards` | string | `'cards'` | *Unused.* The client registers `/cards` with a hard-coded name. |
| `Config.commands.reload` | string | `'kora_cards_reload'` | Name of the catalog reload command |
| `Config.commands.season` | string | `'kora_cards_season'` | Name of the season preview/close command |

### Capture (`Config.capture`)

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

### Studio (`Config.studio`)

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

### Job (`Config.job`)

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

### Items (`Config.items`)

Definitions for `card_camera`, `card_film`, `blank_card`, `card_ink` and `trading_card`. Each is registered with kora_core unless an item with that name already exists. Fields: `name`, `label`, `weight`, `type`, `image`, `imageUrl`, `unique`, `useable`, `shouldClose`, `description`. See [Items](../items.md).

### Supplies (`Config.supplies`)

Prices for studio supplies, which are bought at the supply station (grade 1 or higher, on duty, 1–20 per purchase).

| Item | `price` | `account` |
| --- | --- | --- |
| `card_film` | 50 | `cash` |
| `blank_card` | 15 | `cash` |
| `card_ink` | 10 | `cash` |

The server charges these prices. The Studio tab button labels (`$50`, `$15`, `$10`) are hard-coded, so update `client/main.lua` too if you change them.

### Permissions (`Config.permissions`)

*Unused.* This table lists the intended minimum grade per studio action (`checkoutCamera = 1`, `captureDraft = 1`, `activateBasic = 2`, `print = 2`, `editShared = 3`, `linkEvolution = 3`, `archive = 4`). The server hard-codes the same values. See [Card Studio job](../features/studio.md#grade-permissions).

### Text limits (`Config.textLimits`)

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | number | `32` | Maximum card name length checked during catalog validation |
| `flavor` | number | `120` | Maximum flavor text length |
| `moveName` | number | `24` | Maximum move name length |

The draft editor and the save handler also hard-code 32, 120 and 24.

### Deck (`Config.deck`)

*Unused.* The values (`size = 60`, `maxCopies = 4`, `maxRarityPoints = 24`, `openingHand = 7`, `prizes = 6`, `bench = 5`) match the rules hard-coded in the server and the match engine. See [Matches and game rules](../features/matches.md).

### Match (`Config.match`)

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

### Season (`Config.season`)

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `placementMinimumMatches` | number | `5` | Ranked matches needed to qualify for season rewards |
| `rewards` | number array | `{ 15000, 10000, 5000 }` | Bank rewards for places 1, 2 and 3 |

The Ranked tab text ("five completed ranked matches", "$15,000, $10,000, and $5,000") is hard-coded.

### Starters (`Config.starters`)

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

### Not configurable

These are hard-coded constants, documented on the feature pages:

- Rarity weights, print caps and deck points (`shared/rules.lua`)
- Challenge expiry (30 seconds)
- The card show radius (5 metres)
- The callback rate limit (45 calls per 10 seconds)
