---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Interior is a client-only collection of interior "shell" models (houses, apartments, garages, offices, stash houses, motels...) bundled as a stream (`.ytyp`) with exports that spawn one as a frozen, streamed-in object at a given coordinate. It answers to both its own export name and the legacy `qb-interior` / `kora_interior` names.

## Install Kora Interior

1. **Add the folder** — Place the `kora_interior` folder in your resources directory (on the Kora recipe it is `resources/[kora]/kora_interior`).

2. **Keep Kora Lib running first** — Kora Interior declares `dependency 'kora_lib'` and loads `@kora_lib/init.lua` before its own client scripts, so Kora Lib must be started earlier in `server.cfg`.

   ```lua title="fxmanifest.lua" {5,7}
   fx_version 'cerulean'
   game 'gta5'
   lua54 'yes'

   provide 'qb-interior'

   dependency 'kora_lib'

   shared_scripts {
       'config.lua'
   }

   client_scripts {
       '@kora_lib/init.lua',
       'client/main.lua',
       'client/optional.lua'
   }

   files {
       'stream/starter_shells_k4mb1.ytyp'
   }

   data_file 'DLC_ITYP_REQUEST' 'stream/starter_shells_k4mb1.ytyp'
   ```

3. **Start it** — Add this to `server.cfg`, after `kora_lib`:

   ```bash title="server.cfg"
   ensure kora_lib
   ensure kora_interior
   ```

## What the manifest declares

- `provide 'qb-interior'` makes the legacy resource name resolvable, so a resource that still does `exports['qb-interior']:CreateApartmentFurnished(...)` or checks for `qb-interior` keeps working without that resource existing on disk.
- `this_is_a_map 'yes'` and the `files` / `data_file 'DLC_ITYP_REQUEST'` entries stream the bundled `stream/starter_shells_k4mb1.ytyp`, which supplies the shell models referenced by the `SHELLS` tables below.
- The resource is client-only: there are no server scripts and no server exports.

## Load order

- `kora_lib` before `kora_interior` (manifest dependency; `@kora_lib/init.lua` is loaded before `client/main.lua`).
- `client/main.lua` before `client/optional.lua` is not required by either file individually, but `client/optional.lua`'s shell factories call back into this resource's own `createShell` export (`exports[GetCurrentResourceName()]:createShell(...)`), so both files must be part of the same running resource — do not split them into separate resources.
- Nothing else in `kora_interior` depends on load order relative to other `kora_*` resources; it has no server-side state and no config consumed by other resources.

## Requirements

| Resource | Used for |
| --- | --- |
| [kora_lib](https://github.com/KoraFiveM/kora_lib) | Declared with `dependency`. Provides `Kora.stream.loadModel`, `Kora.visuals.fade`, `Kora.resources.registry`, `Kora.compat.provideExport` and `Kora.util.isFiniteNumber` |

`qb-clothes` is only triggered as a client event (`qb-clothes:client:CreateFirstCharacter`) by `CreateApartmentFurnished`; it is not a dependency. In this repository only `kora_robberies` (which declares `dependency 'kora_interior'`) was found calling the exports.

## Full manifest

The excerpt in step 2 is abbreviated. The shipped `fxmanifest.lua` also sets `author`, `description`, `version` and `this_is_a_map 'yes'`, and registers `tests/*.feature` with `qa_feature` for `kora_qa`. The release version is the `version` field of `fxmanifest.lua`.

## Other notes

- No SQL import and no locale files are needed.
- For the optional factories, install and stream the matching shell packs separately. See [Troubleshooting](./troubleshooting.md).
- Offline tests are described in [Testing](./testing.md).
