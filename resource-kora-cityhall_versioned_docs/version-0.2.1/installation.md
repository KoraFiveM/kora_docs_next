---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Cityhall is a small City Services resource: one or more City Hall peds where a player can buy identity items (ID card, driver license, weapon license) with cash, apply for a job, and where new characters receive their pending starter items. It has no database tables of its own and no web page of its own: its menu is a Kora NUI app registered through kora_lib.

## Install Kora Cityhall

1. **Add the folder** — Place the `kora_cityhall` folder in your resources directory (on the Kora recipe it is `resources/[kora]/kora_cityhall`). The manifest also declares `provide 'qb-cityhall'`, so scripts that use `exports['qb-cityhall']` or the `qb-cityhall:*` event names resolve to this resource.

2. **Start it after its dependencies** — The manifest declares only two hard dependencies, `kora_lib` and `kora_core`. The code also calls `qb-inventory` exports (provided by `kora_inventory`), `kora_multijob` and `kora_target`, none of which are declared as dependencies, so start them before this resource yourself:

   ```bash title="server.cfg"
   ensure kora_lib
   ensure kora_core
   ensure kora_inventory   # provides qb-inventory (AddItem / CanAddItem / GetFreeWeight)
   ensure kora_multijob    # applying for a job calls exports.kora_multijob:addJob
   ensure kora_target      # the City Hall ped is clicked through kora_target
   ensure kora_cityhall    # provides qb-cityhall
   ```

3. **Check the items exist** — The default licenses are the item names `id_card`, `driver_license` and `weaponlicense`. All three are defined in kora_core's shared item list (`shared/upstream/items.lua`) with weight 0. The client reads each item's `label` and `image` from `exports.kora_core:getShared('items', name)`, and the image is loaded from `nui://kora_inventory/images/<image>`. If you add a license to `Config.Cityhalls[n].licenses`, the item must exist in the shared items.

4. **Check the jobs exist** — Every name in `Config.AvailableJobs` (default `trucker`, `taxi`, `tow`, `news`, `garbage`, `bus`, `hotdog`) must be a job known to kora_core (`getShared('jobs', name)` supplies the label) and acceptable to `kora_multijob`, which performs the actual assignment. This resource does not create jobs.

5. **Review the configuration** — Open `shared/config.lua`: set license prices, add City Hall locations and decide on `Config.ConfirmActions`, `Config.PurchaseDistance`, `Config.RequireFreeWeight` and `Config.GiveStarterItems`. See the Configuration module.

## What the resource needs

- Required by the manifest: `kora_lib` (provides the `Kora` namespace: `Kora.config`, `Kora.lang`, `Kora.nui`, `Kora.entities`, `Kora.blips`, `Kora.notify`, `Kora.distance`) and `kora_core` (player data, metadata, money, shared items and jobs).
- Used but not declared: `qb-inventory` exports (served by `kora_inventory`), `kora_multijob` (export `addJob`), `kora_target` (client export `addEntity`).
- Optional triggers: `kora_clothing` (fires `qb-clothing:client:CreateFirstCharacter` and `qb-clothing:client:onMenuClose`) and `kora_multichar` (fires `kora_multichar:client:spawnComplete`). They only drive the starter-item hand-out; the rest of the resource works without them.
- Database: no tables, no SQL files and no direct database calls. Persistence is entirely through kora_core (character metadata, money), the inventory and kora_multijob.
- Items and jobs: none are created. The resource only refers to existing item and job names.
- Commands and permissions: none are registered (see the Commands section).
- Locale files in `locales/*.lua` (34 language files, `en.lua` is the reference) are listed in the manifest `files` block and are read through `Kora.lang`. How kora_lib picks the active language is not part of this resource.

## Requirements (resources and what they are used for)

| Resource | Used for |
| --- | --- |
| [kora_lib](https://github.com/KoraFiveM/kora_lib) | `@kora_lib/init.lua`, config, locales, NUI app, entities, blips, notifications, distance checks (declared `dependency`) |
| [kora_core](https://github.com/KoraFiveM/kora_core) | Player data, metadata, money, shared items/jobs, starter items (declared `dependency`) |
| [kora_target](https://github.com/KoraFiveM/kora_target) | Clerk ped interaction (`exports.kora_target:addEntity`) |
| [kora_inventory](https://github.com/KoraFiveM/kora_inventory) | Adds items through the `qb-inventory` exports (`AddItem`, `CanAddItem`, `GetFreeWeight`); item images come from `nui://kora_inventory/images/` |
| [kora_multijob](https://github.com/KoraFiveM/kora_multijob) | Job applications (`exports.kora_multijob:addJob`) |
| [kora_clothing](https://github.com/KoraFiveM/kora_clothing) / [kora_multichar](https://github.com/KoraFiveM/kora_multichar) | Starter-item triggers (`qb-clothing:client:CreateFirstCharacter`, `qb-clothing:client:onMenuClose`, `kora_multichar:client:spawnComplete`) |

Only `kora_lib` and `kora_core` are declared as `dependency` in `fxmanifest.lua`. No SQL import is needed. See [Database](./database.md).
