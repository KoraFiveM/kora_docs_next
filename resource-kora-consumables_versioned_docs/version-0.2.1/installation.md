---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Consumables makes food, drink, liquor and smoke items usable. The player holds the item, a progress bar runs on the client, and the server removes the item and applies hunger, thirst, stress and similar status values only after the bar finishes. It exposes four server exports for legacy QBCore resources and is otherwise configured through `Config`.

## Install Kora Consumables

1. **Add the folder** — Place `kora_consumables` in your resources directory (on the Kora recipe it is `resources/[kora]/kora_consumables`). Keep the folder name: other resources and the progress callback use the `kora_consumables` identity.

2. **Make sure the dependencies exist** — The manifest declares `kora_lib` and `kora_core`. The server script also calls `exports.kora_inventory:removeItem` and `exports['qb-inventory']:SetItemData` (the latter is registered by `kora_inventory/server/compat/qb.lua`), but `kora_inventory` is NOT declared in the manifest. Start it before this resource. Without it, finishing a use fails when the item is removed.

3. **Start it after its dependencies** — Start it after Kora Lib, Kora Core and Kora Inventory.

   ```bash title="server.cfg"
   ensure kora_lib
   ensure kora_core
   ensure kora_inventory
   ensure kora_consumables
   ```

4. **Check the manifest** — The shared scripts load the Kora Lib loader first, then every `shared/**.lua` file (`Config.lua`, then `deafaults.lua`; the spelling of that file name is the source's).

   ```lua title="fxmanifest.lua"
   fx_version 'cerulean'
   game 'gta5'
   lua54 'yes'
   version '0.2.0'

   dependency 'kora_lib'
   dependency 'kora_core'

   shared_script {
       '@kora_lib/init.lua',
       'shared/**.lua'
   }

   server_script 'server/**.lua'

   client_scripts {
       'client/**.lua'
   }
   ```

5. **No tables to create** — The resource has no SQL, no schema and no database access. Nothing needs to be imported.

6. **Make sure the items exist** — Every key you list under `Config.Consumables.<class>` should be a real item in the Kora shared items (`exports.kora_core:getShared('items', name)`). `items/items.md` in the resource holds ready-made QBCore item definitions and `items/images/` holds the matching icons; neither is loaded automatically, copy them into your inventory yourself. The one exception is `cigarette`, which the server registers for you if no other resource defined it (see Edge cases).

## Start order and startup behavior

- On load the server calls `registerCigarette()` and `registerUseables()`. `registerUseables` walks `Config.Consumables` and calls `exports.kora_core:createUseable(item, handler)` for every item of every class.
- When `kora_inventory` starts (or restarts) after this resource, the `onResourceStart` handler in `server/server.lua` calls `registerUseables()` again, because the inventory's own built-in handlers would otherwise replace ours.
- The client asks the server for items added at runtime by legacy exports (`kora_consumables:sync`) as soon as it starts. The server answers at most once per 5 seconds per player, and only when at least one item was added.
- A full item configuration is merged at load by `ApplyConsumableDefaults` (see Configuration). Edits to `shared/Config.lua` need a resource restart.

## Things that surprise people

- There are no commands and no event API to call. Everything starts from an inventory use of the item.
- The only exports are the four legacy ones documented here. They are registered under `exports.kora_consumables` and also under `exports['qb-smallresources']`.
- In `shared/Config.lua` the liquor keys are `beer_pisswaser3` and `beer_pisswaser4`, matching the item names in `items/items.md`.

## Requirements

| Resource | Why |
| --- | --- |
| [kora_lib](https://github.com/KoraFiveM/kora_lib) | Declared `dependency`; loaded via `@kora_lib/init.lua`. Provides `Kora.callback`, `Kora.progressbar`, `Kora.visuals`, `Kora.notify`, `Kora.config` and `Kora.compat`. |
| [kora_core](https://github.com/KoraFiveM/kora_core) | Declared `dependency`. Provides `getShared`, `registerShared`, `createUseable` and `incrementMetaData`. |
| [kora_inventory](https://github.com/KoraFiveM/kora_inventory) | Not declared in `fxmanifest.lua`, but required at runtime: items are removed with `exports.kora_inventory:removeItem`. Limited-use items are updated through the `qb-inventory` compatibility export `SetItemData`. |

## Database

This resource does not create or query any database tables. Status changes are written through `kora_core` player metadata.

## Commands

This resource registers no commands or key mappings.

See [Items](./items.md) for the default consumables and how to add new ones.
