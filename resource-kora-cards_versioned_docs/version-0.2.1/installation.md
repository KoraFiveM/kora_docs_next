---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Cards is the City Legends trading-card job, collection, shop, deck builder and real-time duel system: a photography job prints draft card designs, a studio approves and mechanically generates them, players collect exact serialized prints in a binder, build 60-card decks, and challenge each other to turn-based matches with ranked ELO and season payouts.

## Install Kora Cards

1. **Add the folder** — Place `kora_cards` in your resources directory (on the Kora recipe it is `resources/[kora]/kora_cards`).

2. **Have the dependencies running** — The manifest declares `kora_theme`, `kora_lib`, `kora_sql`, `kora_core`, `kora_target` and `kora_inventory`. `kora_lib` provides the shared AppShell UI, notifications and config adoption; `kora_sql` is the database layer; `kora_core` supplies player data, jobs, duty and money; `kora_target` provides the studio/shop/duel interaction zones; `kora_inventory` holds the physical items (`card_camera`, `card_film`, `blank_card`, `card_ink`, `trading_card`) and its usable-item hooks.

3. **Start it after its dependencies** — Add it after the six dependencies.

   ```bash title="server.cfg" {7}
   ensure kora_theme
   ensure kora_lib
   ensure kora_sql
   ensure kora_target
   ensure kora_inventory
   ensure kora_core
   ensure kora_cards
   ```

4. **screenshot-basic is optional** — The studio photography flow (`server/studio.lua`) calls `exports['screenshot-basic']:requestClientScreenshot`. It is detected at runtime with `GetResourceState('screenshot-basic')`, not declared as a manifest dependency: if it is missing or not started, only photography is disabled (`requestCapture` fails with 'Photography storage is unavailable'). Binder, shop, deck building and matches keep working.

5. **Tables are created automatically** — On start, `server/schema.lua` defines `KoraCardsSchema` and `server/database.lua`'s `Database.start()` applies it with `Kora.sql.ensureTables` (additive only). Thirteen tables are created: `kora_cards_designs`, `kora_cards_prints`, `kora_cards_binder`, `kora_cards_decks`, `kora_cards_deck_cards`, `kora_cards_starter_claims`, `kora_cards_seasons`, `kora_cards_ratings`, `kora_cards_ranked_pair_days`, `kora_cards_matches`, `kora_cards_pending_rewards`, `kora_cards_operations`, `kora_cards_ranked_settlements`. `kora_cards_designs` seeds (once) 27 starter catalog cards (set `CLS`, City Legends Set) and `kora_cards_seasons` seeds one `Launch Season`. Nothing needs to be run by hand.

6. **The job, items and usable hooks register themselves** — At boot, `server/main.lua`'s `registerShared()` registers the `cardstudio` job (`Config.job`, four grades: Assistant, Photographer, Editor, Studio Manager) and the five `Config.items` with `Kora.shared.register` if they are not already defined elsewhere. When `kora_inventory` is running (checked at boot and again on its `onResourceStart`), `card_camera` and `trading_card` become usable items (`CreateUsableItem`) that open the capture flow or show a card to nearby players.

7. **Review the config** — Open `config.lua`: studio locations and the duel zone are tuned to a `facelobby` IPL interior near `-1047, -233, 39`. Change `Config.studio.locations`, `Config.studio.duelZone` and the IPL for your own map placement before going live. See the Configuration page for every option.

## Manifest reference

Script load order is deliberate and commented in the manifest: storage and persistence (`server/storage.lua`, `server/schema.lua`, `server/database.lua`) establish the APIs the catalog, cards and studio modules consume, and `server/main.lua` loads last to wire everything together. `ui_page 'web/build/index.html'` is this resource's own private NUI frame — it is separate from kora_lib's shared AppShell frame and is used only for the full card viewer, the portrait/crop editor and the live match overlay (see How To Use). Ordinary list/menu pages (binder, decks, shop, studio, ranked, play) are rendered through kora_lib's AppShell instead.

```lua title="fxmanifest.lua"
fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'kora_cards'

dependency 'kora_theme'
dependency 'kora_lib'
dependency 'kora_sql'
dependency 'kora_core'
dependency 'kora_target'
dependency 'kora_inventory'

shared_script '@kora_lib/init.lua'
shared_script '@kora_core/init.lua'

shared_scripts {
    'config.lua',
    'shared/rules.lua',
    'shared/match.lua',
}

server_scripts {
    '@kora_sql/init.lua',
    'server/storage.lua',
    'server/schema.lua',
    'server/database.lua',
    'server/catalog.lua',
    'server/cards.lua',
    'server/studio.lua',
    'server/matches.lua',
    'server/main.lua',
}

client_scripts {
    '@kora_theme/client/bridge.lua',
    'client/main.lua',
}

ui_page 'web/build/index.html'
```

- `files` also declares `web/build/assets/**/*`, `assets/*.svg` (the five item icons) and `storage/catalog/**/*` (bundled catalog artwork shipped with the resource).
- `config.lua`, `shared/rules.lua` and `shared/match.lua` are shared scripts, so `Config`, `KoraCardsRules` and `KoraCardsMatch` exist on both client and server. The client only reads `Config`; the match engine and rules module are exercised server-side.

## Requirements

Declared in `fxmanifest.lua` and used at runtime:

| Resource | Purpose |
| --- | --- |
| [kora_theme](https://github.com/KoraFiveM/kora_theme) | Theme tokens and the client theme bridge for the private overlays |
| [kora_lib](https://github.com/KoraFiveM/kora_lib) | AppShell UI, callbacks, commands, notifications, config adoption, instructional buttons |
| [kora_sql](https://github.com/KoraFiveM/kora_sql) | Database access and the declarative schema (`Kora.sql.ensureTables`) |
| [kora_core](https://github.com/KoraFiveM/kora_core) | Player data, jobs and duty, money, shared item and job registration |
| [kora_target](https://github.com/KoraFiveM/kora_target) | Interaction zones at the studio |
| [kora_inventory](https://github.com/KoraFiveM/kora_inventory) | Items, usable items and the camera swap hook |

Optional: [screenshot-basic](https://github.com/citizenfx/screenshot-basic) for live photography, which must start before `kora_cards`. The leaderboard query joins the `players` table owned by kora_core so it can show character names. See [Database](./api/database.md) and [Items](./items.md).

## NUI build

`web/build/` is committed. Rebuild only if you change `web/src`:

```bash
npm --prefix web install
npm --prefix web run build
```

## Media storage

Captured and catalog artwork lives under `kora_cards/storage/`. Back up the database and the whole `storage/` directory together. See [Catalog authoring](./features/catalog.md#media-storage-and-http-handler).

## Tests

```bash
./tests/run.sh
npm --prefix web run build
```

`tests/run.sh` runs plain-Lua test suites covering the rules, match engine, NUI, storage and stock. `tests/checklist-activities.feature` holds kora_qa Gherkin checklist scenarios (registered with `qa_feature` in `fxmanifest.lua`).
