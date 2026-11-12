---
title: kora_consumables
sidebar_position: 1
---

# kora_consumables

`kora_consumables` makes food, drinks, liquor and smokeables usable from the inventory. The server checks the item, then the client shows a progress bar with an animation and an optional hand prop. When the bar finishes, the server removes the item and applies its status changes, such as hunger, thirst or stress. Liquor and smokeables can also start a screen effect. Each item is configured in one shared Lua table. Other server resources can add consumables at runtime through QBCore-compatible `qb-smallresources` exports.

## Features

- **Server-validated use**: every configured item is registered as a useable item with `kora_core`. The server tracks each use, removes the item through `kora_inventory`, and changes the player's metadata. The client only plays the progress bar. See [How it works](./how-it-works.md).
- **Effects applied on completion (default)**: by default, the item is consumed and its status applied only after the progress bar finishes. If the player cancels, nothing is consumed or applied. You can change this with the `applyStatusOn` option.
- **Anti-spam and timing check**: a player can only have one consumable use in progress at a time. If a use reports completion faster than its configured duration allows, the server ignores it.
- **Status changes**: `hunger`, `thirst`, `stress`, `health`, `armor`, `drunk` and `high` metadata are changed and clamped to 0-100.
- **Four item classes**: `drink`, `food`, `smoke` and `liquor`. Each class has default labels, durations, animations, props, control restrictions, status changes and effects, and each item can override them. Runtime additions from `AddCustom` use a fifth class, `custom`.
- **Hand props**: each class has a configured default hand and offsets for both hands. The hand and bone can be overridden per class or per item. Props with invalid models are skipped by default so the item can still be used.
- **Walk while consuming**: by default, the animation plays on the upper body and the player can keep walking. Combat and vehicle entry stay blocked. This can be configured globally, per class or per item.
- **Screen effects**: liquor uses a built-in "buzzed" effect: a timecycle modifier, camera shake, an optional drunk walk and an optional notification. Smokeables use the kora_lib visuals `alien`, `coke`, `crack`, `meth` or `trevor`.
- **Limited-use items**: an item with `info.uses` metadata loses one use each time it is used. It is removed only when no uses are left. Items with `keep = true` are never removed.
- **QBCore compatibility exports**: `AddFood`, `AddDrink`, `AddAlcohol` and `AddCustom` are available as `kora_consumables` exports and as `qb-smallresources` exports. Items added this way are sent to online clients and to players who join later. See [Exports](./exports.md).
- **Cigarette item**: if no other resource defines a `cigarette` shared item, this resource registers one.

## Requirements

| Resource | Why |
| --- | --- |
| [kora_lib](https://github.com/KoraFiveM/kora_lib) | Declared `dependency`; loaded via `@kora_lib/init.lua`. Provides `Kora.callback`, `Kora.progressbar`, `Kora.visuals`, `Kora.notify`, `Kora.config` and `Kora.compat`. |
| [kora_core](https://github.com/KoraFiveM/kora_core) | Declared `dependency`. Provides `getShared`, `registerShared`, `createUseable` and `incrementMetaData`. |
| [kora_inventory](https://github.com/KoraFiveM/kora_inventory) | Not declared in `fxmanifest.lua`, but required at runtime: items are removed with `exports.kora_inventory:removeItem`. Limited-use items are updated through the `qb-inventory` compatibility export `SetItemData`. |

## Installation

1. Put the resource in your resources folder.
2. Start it after its dependencies in `server.cfg`:

   ```cfg
   ensure kora_lib
   ensure kora_core
   ensure kora_inventory
   ensure kora_consumables
   ```

3. No SQL import is needed. This resource has no database tables. See [Database](#database).
4. Make sure every configured item exists in the `kora_core` shared items. The default items, except `cigarette`, already ship with `kora_core`. This resource registers `cigarette` if it is missing. For new items, see [Items](./items.md).

## Database

This resource does not create or query any database tables. Status changes are written through `kora_core` player metadata.

## Commands

This resource registers no commands or key mappings.

## Pages

- [How it works](./how-it-works.md): the use flow, validation and effects.
- [Configuration](./configuration.md): every `Config` option and the per-item fields.
- [Items](./items.md): the default consumables and their effective values, and how to add items.
- [Exports](./exports.md): the `AddFood`, `AddDrink`, `AddAlcohol` and `AddCustom` exports and the `qb-smallresources` compatibility layer.
- [Events](./events.md): net events, the progress callback and custom client events.
- [Troubleshooting](./troubleshooting.md): common problems and how to fix them.
