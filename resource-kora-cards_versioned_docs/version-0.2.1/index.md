---
title: Kora Cards
sidebar_position: 1
---

# Kora Cards

Kora Cards adds **City Legends** to a Kora server: a Card Studio photography job at the Lifeinvader building, a collection of uniquely serialized trading cards, a binder and deck builder, a card shop, and a server-run trading card game with Casual and Ranked matches, Elo ratings and seasons. Every action the player takes is checked on the server. The client only shows server snapshots and sends requests.

## Features

- **Card Studio job (`cardstudio`).** Employees clock in at the studio, buy supplies, check out a studio camera, take in-game portraits with `screenshot-basic`, edit them into card designs, activate them (the server rolls a permanent rarity) and print serialized cards. See [Card Studio job](./features/studio.md).
- **Serialized prints.** Every printed, bought or starter card is one database row with its own serial number. Lifetime print caps depend on rarity. See [Collection and decks](./features/collection.md).
- **Binder and physical cards.** Cards can be stored in the account binder or held as `trading_card` inventory items, which players can trade through `kora_inventory`. Deposit and withdraw move one exact print between the two.
- **Starter decks.** Each character can claim one 60-card, account-bound starter deck, either Street Circuit or Harbor Guard. Bound cards can never leave the binder.
- **Deck builder.** Build 60-card decks from your exact binder prints. Decks follow copy and rarity-point limits.
- **Shop.** Buy catalog designs with bank money. Each purchase creates a new print in the binder.
- **Card viewer.** View any card full-screen and show it to players within 5 metres.
- **Match engine.** Two-player, turn-based matches with units, evolutions, resources, items, tactics, gear, venues, special conditions, prizes, a turn timer and disconnect grace. The server owns hidden information. See [Matches and game rules](./features/matches.md).
- **Ranked play and seasons.** Elo ratings, a top-50 leaderboard, capped daily win payouts, season placement rewards and an admin season rollover. See [Ranked and seasons](./features/ranked.md).
- **Database-authored catalog.** Card designs live in `kora_cards_designs`. The server validates them, then reloads the catalog atomically. After the first print, a design's content is locked by a hash. See [Catalog authoring](./features/catalog.md).
- **Crash-safe transactions.** Prints, deposits, withdrawals, shop purchases and reward payouts are logged in an operations journal. Unfinished operations are recovered when the player next loads in. See [Database](./api/database.md).

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

Optional: [screenshot-basic](https://github.com/citizenfx/screenshot-basic) for live photography. The server checks for it at runtime. Without it (or when saving a capture fails), the shutter fails and no film is used. The binder, shop and matches still work.

The leaderboard query joins the `players` table owned by kora_core so it can show character names.

The resource has **no exports**. Other resources talk to it through the net events and actions described in [Events and callbacks](./api/events.md).

## Installation

1. Put `kora_cards` in your resources folder and start it after its dependencies:

   ```cfg
   ensure kora_theme
   ensure kora_sql
   ensure kora_lib
   ensure kora_core
   ensure kora_target
   ensure kora_inventory
   ensure screenshot-basic
   ensure kora_cards
   ```

   `screenshot-basic` is optional, but it must start before `kora_cards` if you use photography.

2. **Database.** You don't need to import any SQL. On start, the resource creates or updates its tables with `Kora.sql.ensureTables` (changes are only ever added), seeds the 27-design City Legends launch catalog once, and seeds `Launch Season` as the active season. See [Database](./api/database.md).

3. **Items and job.** At start, the resource registers the items `card_camera`, `card_film`, `blank_card`, `card_ink` and `trading_card`, plus the `cardstudio` job, with kora_core's shared registry. It skips any entry that already exists. You don't need to add them by hand. See [Items](./items.md).

4. **NUI build.** `web/build/` is committed. Rebuild only if you change `web/src`:

   ```bash
   npm --prefix web install
   npm --prefix web run build
   ```

5. **Media storage.** Captured and catalog artwork lives under `kora_cards/storage/`. Back up the database and the whole `storage/` directory together. See [Catalog authoring](./features/catalog.md#media-storage-and-http-handler).

## Documentation map

- [Installation](./installation.md): dependencies, start order, automatic setup, manifest reference
- [How to use](./how-to-use.md): player walkthrough, architecture, opening the UI from another resource
- [Commands](./commands.md): `/cards`, `/kora_cards_reload`, `/kora_cards_season` and the studio camera controls
- API reference:
  - [API overview](./api/index.md): the modules and namespaces
  - [Server action channel](./api/action-channel.md): the `kora_cards:server:action` callback and its payloads
  - [Client events and local command](./api/events.md): client net events, the callback action table, listened-to events and NUI callbacks
  - [Match engine](./api/match-engine.md): `KoraCardsMatch` functions, rules and effect ops
  - [Configuration](./api/configuration.md): every `config.lua` option, with defaults and notes
  - [Database tables](./api/database.md): tables, columns, helper functions and operation recovery
- [Items](./items.md): the five registered items and how they are used
- [User interface](./ui.md): AppShell tabs and the private overlays
- [Troubleshooting](./troubleshooting.md): common problems and fixes
- Features:
  - [Card Studio job](./features/studio.md)
  - [Collection and decks](./features/collection.md)
  - [Matches and game rules](./features/matches.md)
  - [Ranked and seasons](./features/ranked.md)
  - [Catalog authoring](./features/catalog.md)

## Tests

```bash
./tests/run.sh
npm --prefix web run build
```

`tests/run.sh` runs plain-Lua test suites covering the rules, match engine, NUI, storage and stock. `tests/checklist-activities.feature` holds kora_qa Gherkin checklist scenarios (registered with `qa_feature` in `fxmanifest.lua`).
