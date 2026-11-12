---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Jewellery is the Vangelico jewelry-store robbery: players smash display-case vitrines for randomized jewelry items while an alarm (after the first smash attempt) summons police. It declares only `kora_lib` and `kora_core` as hard dependencies, but its event handlers call out to several other resources at runtime, so those must also be running for the heist to actually work.

## Declared dependencies

- `kora_lib` — shared script `@kora_lib/init.lua` must load first; provides `Kora.notify`, `Kora.callback`, `Kora.progressbar`, `Kora.blips`, `Kora.distance`, `Kora.state`, `Kora.stream`, `Kora.lang` and the config adoption helper used at the bottom of `shared/config.lua`.
- `kora_core` — only used for `exports.kora_core:isWearingGloves()` (client, fingerprint roll) and `exports.kora_core:getDutyCountByType('leo')` (server, the on-duty police count checked everywhere a cop requirement applies).

## Undeclared runtime dependencies (not in fxmanifest.lua)

These are called through `exports` or `TriggerServerEvent` but are not listed with `dependency` in the manifest. FiveM does not guarantee they start before kora_jewellery, so start them earlier in `server.cfg` yourself.

- `kora_target` — client startup registers a box zone per `Config.Locations` entry via `exports.kora_target:addBoxZone`. Without it the vitrines have no interaction at all.
- `kora_dispatch` — `exports.kora_dispatch:createCall({ jobTypes = { 'leo' }, ... })` is how the alarm reaches police. Without it the alarm still activates (state, cooldown, dispatch call just errors/no-ops depending on your setup) but no call goes out.
- An inventory resource that answers to the legacy export name `qb-inventory` (`exports['qb-inventory']:CanAddItem` / `:AddItem`) — on the Kora stack this is `kora_inventory`, which `provide`s that identity.
- `evidence` (fingerprint drops, `TriggerServerEvent('evidence:server:CreateFingerDrop', coords)`) and an interact-sound resource (`TriggerServerEvent('InteractSound_SV:PlayOnSource', 'breaking_vitrine_glass', 0.25)`) for the smash sound. Both are fire-and-forget: if the target resource is missing the event is simply never heard by anything, it does not error.

## Install it

1. **Add the folder** — Place `kora_jewellery` in your resources directory. It has no exports of its own; see [How to use](./how-to-use.md) and [Events](./events.md).

2. **Load order** — Start the framework and the resources it calls into before kora_jewellery itself:

   ```bash title="server.cfg"
   ensure kora_lib
   ensure kora_sql
   ensure kora_core
   ensure kora_target      # client box zones on the vitrines
   ensure kora_dispatch    # alarm -> police dispatch call
   ensure kora_inventory   # provides the 'qb-inventory' export identity used for the reward
   ensure kora_jewellery  
   ```

3. **Manifest shape** — For reference, the shipped manifest:

   ```lua title="fxmanifest.lua"
   fx_version 'cerulean'
   game 'gta5'
   lua54 'yes'

   dependency 'kora_lib'
   dependency 'kora_core'

   shared_scripts {
       '@kora_lib/init.lua',   -- creates the Kora namespace (must come first)
       'shared/config.lua',
   }

   client_script { 'client/**.lua' }
   server_scripts { 'server/**.lua' }
   ```

## Additional setup notes

- No SQL import is needed; the resource does not use the database. `kora_sql` in the load order above is not used by this resource.
- Make sure the reward items exist in your item list (see [Items](./items.md)), then adjust [Configuration](./api/configuration.md).
- The `UseTarget` convars described in the old README are not read by this resource; targets always use `kora_target`.
- The manifest shown above omits `author`, `description`, `version`, a `files` entry for `locales/**.lua` and the `qa_feature 'tests/*.feature'` line used by `kora_qa`; see `fxmanifest.lua` for the full file.

## Requirements summary

| Resource | Declared | Used for |
| --- | --- | --- |
| `kora_lib` | yes | The `Kora` API: config adoption, locales, notifications, callbacks, distance checks, blips, progress bar, streaming, global state wait |
| `kora_core` | yes | `getDutyCountByType` (police on duty) and `isWearingGloves` |
| `kora_target` | no | `exports.kora_target:addBoxZone` for the case targets (client) |
| `kora_dispatch` | no | `exports.kora_dispatch:createCall` for the alarm call (server) |
| `kora_inventory` (provides `qb-inventory`) | no | `exports['qb-inventory']:CanAddItem` and `AddItem` for rewards (server) |
| `kora_police` (or any resource handling the event) | no | Net event `evidence:server:CreateFingerDrop` for fingerprints |
| InteractSound-compatible resource such as `kora_sound` | no | Net event `InteractSound_SV:PlayOnSource` for the glass sound `breaking_vitrine_glass` |

## Testing

- `lua test/smoke/reset_timeout.lua` (run from the repository root with `kora_lib` checked out next to it, or pass the paths as arguments) checks the alarm and reset-timeout flow with stubbed host functions. It does not start FiveM.
- `tests/checklist-crime.feature` contains manual QA scenarios for `kora_qa` (registered with `qa_feature` in `fxmanifest.lua`).
