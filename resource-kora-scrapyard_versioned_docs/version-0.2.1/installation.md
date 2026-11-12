---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Scrapyard is a public vehicle-scrapping activity. The server publishes a rotating list of wanted vehicle models, a player drives a listed, unowned vehicle into a delivery bay, dismantles it and receives random materials. It is a standalone activity: it exposes no exports and no commands.

## Install Kora Scrapyard

1. **Add the folder** — Place `kora_scrapyard` in your resources directory (on the Kora recipe: `resources/[kora]/kora_scrapyard`).

2. **Dependencies** — The manifest declares `kora_lib`, `kora_sql`, `kora_core` and `kora_target`. `kora_lib` and `kora_core` load through their `init.lua` includes in `shared_scripts`; `kora_sql` loads through `@kora_sql/init.lua` in `server_scripts` only. Kora Lib provides interaction zones, NUI app, progress bar, notifications, blips, entities and token-gated callbacks. Kora Core provides the `Kora.shared` vehicle registry and `exports.kora_core:addItem`. Kora SQL provides `Kora.sql.scalar`. Kora Target provides the attendant ped target and, when `Config.UseTargetForDemolish` is true, the delivery bay zone.

3. **Start order** — Start it after its dependencies. `kora_inventory` is not in the manifest, but rewards are granted through Kora Core's inventory gateway, so it should be running too.

   ```bash title="server.cfg"
   ensure kora_lib
   ensure kora_sql
   ensure kora_core
   ensure kora_inventory
   ensure kora_target
   ensure kora_scrapyard
   ```

4. **Manifest** — No exports are registered, so `exports['kora_scrapyard']` has nothing to call.

   ```lua title="fxmanifest.lua"
   fx_version 'cerulean'
   game 'gta5'
   lua54 'yes'
   version '0.2.0'

   dependency 'kora_lib'
   dependency 'kora_sql'
   dependency 'kora_core'
   dependency 'kora_target'

   shared_scripts {
       '@kora_lib/init.lua',
       '@kora_core/init.lua',
       'shared/config.lua',
       'locales/*.lua',
   }
   client_scripts { 'client/**.lua' }
   server_scripts { '@kora_sql/init.lua', 'server/server.lua' }
   ```

5. **Tables** — This resource creates no tables and ships no SQL file. It only reads `player_vehicles` (columns `plate`, `deleted_at`), which belongs to the vehicle-ownership system, to refuse owned vehicles.

6. **Items** — Rewards are item names from `Config.Items` plus `rubber`. The items `metalscrap`, `plastic`, `copper`, `rubber`, `iron`, `aluminum`, `steel` and `glass` are defined in `kora_core/shared/items.lua`. If you add other names to `Config.Items`, define them in your item registry first, otherwise `addItem` fails for them.

## Startup behavior

- On server start a thread builds the first vehicle list immediately, then rebuilds it every 60 minutes (`Wait(60 * 60 * 1000)`). Nothing else is persisted: the list and active jobs live in memory and reset on resource restart.
- Clients load the list through the callback `qb-scrapyard:server:getVehicleList` one second after the client script starts and again on `kora_core:client:playerLoaded`. The server also pushes updates with the net event `qb-scrapyard:client:setVehicleList`.
- The delivery zones are registered at load and re-registered when `kora_lib` or `kora_target` (re)start on the client, replacing earlier zones.
