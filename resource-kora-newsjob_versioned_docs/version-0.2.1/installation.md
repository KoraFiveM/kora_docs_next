---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Newsjob is a single-job resource: a Weazel News garage (car + helicopter), an equipment shop, and three carryable/useable news items (camera, boom mic, hand mic) with their own ragdoll-free held-prop animation and, for the camera, a recording-style camera overlay. It is a port of `qb-newsjob` and still uses the legacy `qb-newsjob:*` event names and the `qb-inventory` export name.

## Install Kora Newsjob

1. **Add the folder** — Place `kora_newsjob` in your resources directory (on the Kora recipe it is `resources/[kora]/kora_newsjob`).

2. **Start its dependencies first** — It declares `dependency` on `kora_lib`, `kora_core` and `kora_target`. `kora_target` is listed explicitly because `client/main.lua` calls `exports.kora_target:addBoxZone` as soon as the client script loads — without that dependency the load order is not guaranteed and the call can fail on a cold start.

   ```bash title="server.cfg"
   ensure kora_lib
   ensure kora_core
   ensure kora_target
   ensure kora_newsjob
   ```

3. **Required job and items** — A `news` job must exist in `kora_core`'s job list and the `news` grade(s) are the only ones this resource checks (every gate below is `Player.job.name == 'news'` or the equivalent `getPlayerData(..., { 'job', 'name' })` read — grade is never checked). The items `newscam`, `newsmic` and `newsbmic` must be registered in your item list (the resource grants them through the `qb-inventory` export, `server/main.lua`), and `qb-vehiclekeys`, `qb-inventory` and `kora_fuel` must all be running — `client/spawner.lua` calls `exports.kora_fuel:SetFuel` unconditionally when spawning a vehicle, and `server/main.lua`'s trunk-item grant calls `exports['qb-vehiclekeys']:HasKeys` directly.

4. **Load order inside the resource** — Shared scripts load `@kora_lib/init.lua` then `config.lua`. Client scripts load in a fixed order: `client/main.lua` (zones, blips, the equipment shop) first, then `client/spawner.lua` (the garage NUI and vehicle spawn flow), then `client/camera.lua` (useable-item prop/animation/camera handling) last.

   ```lua title="fxmanifest.lua" {6,7,8}
   fx_version 'cerulean'
   game 'gta5'
   lua54 'yes'


   dependency 'kora_lib'
   dependency 'kora_core'
   dependency 'kora_target'   -- client/main.lua calls exports.kora_target:addBoxZone at load

   shared_scripts {
       '@kora_lib/init.lua',
       'config.lua',
   }

   client_scripts {
       'client/main.lua',
       'client/spawner.lua',
       'client/camera.lua',
   }

   server_script 'server/main.lua'

   files { 'locales/*.lua' }
   ```

## Requirements

Declared in `fxmanifest.lua`:

| Resource | Used for |
| --- | --- |
| `kora_lib` | `Kora.nui`, `Kora.camera`, `Kora.interact`, blips, locales, callbacks, entity and vehicle helpers |
| `kora_core` | `getPlayerData` (job check) and `createUseable` |
| `kora_target` | `exports.kora_target:addBoxZone` for the door zones |

Used but not declared as dependencies:

| Resource | Used for |
| --- | --- |
| `qb-inventory` (export name) | `CreateInventory` and `AddItem` for trunk and counter items |
| `qb-vehiclekeys` | `HasKeys` export, `qb-vehiclekeys:server:RemoveVehicleKeys` and `vehiclekeys:client:SetOwner` events |
| `kora_fuel` | `SetFuel` export to fill spawned vehicles |

## Full start order

Ensure the undeclared dependencies before this resource too:

```cfg title="server.cfg"
ensure kora_lib
ensure kora_core
ensure kora_target
ensure qb-inventory
ensure qb-vehiclekeys
ensure kora_fuel
ensure kora_newsjob
```

No SQL import is needed. Then adjust [Configuration](./configuration.md).

## Testing

- `lua test/locales.lua` (with `kora_lib` checked out alongside) checks the locale loading of the translated files.
- `lua test/native_apis.lua` is an offline check script in `test/`.
- `tests/checklist-jobs.feature` holds `kora_qa` scenarios (registered with `qa_feature` in `fxmanifest.lua`).
