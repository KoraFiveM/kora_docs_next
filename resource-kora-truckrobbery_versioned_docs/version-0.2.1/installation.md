---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Truckrobbery is a single-instance, server-wide heist: talk to a dealer NPC, a security truck with a driver and two armed guards spawns and drives off, kill the guards, take the keys, drive the truck to one of two drop-off points and loot it. Only one robbery can be active on the whole server at a time.

## Install Kora Truckrobbery

1. **Add the folder** — Place `kora_truckrobbery` in your resources directory (on the Kora recipe it is `resources/[kora]/kora_truckrobbery`).

2. **Have the dependency running** — The manifest only declares `dependency 'kora_lib'` (for `Kora.callback`, `Kora.entities`, `Kora.zones`, `Kora.progressbar`, `Kora.notify`, `Kora.lang`, `Kora.distance`). In practice `exports.kora_core` (for the on-duty police count) and `exports.kora_target` (for every interaction point) are also required at runtime even though the manifest does not list them as `dependency` — start both before this resource.

3. **Start it** — Order only matters relative to kora_lib, kora_core and kora_target.

   ```bash title="server.cfg"
   ensure kora_lib
   ensure kora_core
   ensure kora_target
   ensure kora_truckrobbery
   ```

4. **Optional: key integration** — Taking the driver's keys fires the client event `qb-vehiclekeys:client:AddKeys` with the truck's plate. If kora_vehiclekeys is not running, this event is simply never handled — the robbery still works, but the player will not have bindable vehicle keys for the stolen truck through that system.

5. **Nothing to configure in the database** — This resource keeps no state in SQL. The one active robbery's spawn/drop-off coordinates and in-progress flag live in a synced `GlobalState.TruckRobbery` table, visible to every client, with the server holding the authoritative copy.

## Manifest reference

```lua title="fxmanifest.lua"
description 'Allows players to rob specific trucks for money and items'

dependency 'kora_lib'

shared_script {'@kora_lib/init.lua', 'shared/**.lua'}
client_script 'client/**.lua'
server_script 'server/**.lua'
files {'locales/**.lua'}
```

- The manifest's own description promises "money and items" on completion. As documented below under Rewards, no such payout currently exists in the code — only the mission state is cleared on a successful robbery.

## Configuration

The whole of `shared/config.lua`: five values, registered with kora_lib's config system via `Kora.config.adopt(Config)` but not individually wrapped in `Kora.config.boolean/integer/string(...)`, so none of them carry labels, descriptions or live-reload metadata in the config editor.

```lua title="shared/config.lua"
Config.DealerCoords = vector3(960.78, -216.25, 76.25)   -- where the "start robbery" NPC stands
Config.VehicleSpawn = { vector3(-1327.47, -86.045, 49.31), ... }   -- 5 candidate truck spawn points (random pick)
Config.VehicleDropOff = { vector3(-3107.05, 1225.22, 10.70), vector3(999.75, -1556.26, 30.76) }  -- 2 candidate drop-offs (random pick)
Config.NavWeap = `WEAPON_MICROSMG`   -- declared but unused; guards are actually given WEAPON_ASSAULTRIFLE
Config.ActivePolice = 2               -- on-duty 'leo' police required to start
```

- `Config.DealerCoords` — single point; the robbery can only be started from here.
- `Config.VehicleSpawn` / `Config.VehicleDropOff` — pools of candidate points; one of each is picked at random per robbery.
- `Config.ActivePolice` — minimum on-duty `leo` police required to start a robbery.
- `Config.NavWeap` is defined but never read anywhere in the client or server code — it has no effect.

## Requirements

Declared in `fxmanifest.lua`:

| Resource | Used for |
| --- | --- |
| [kora_lib](https://github.com/KoraFiveM/kora_lib) | `Kora.callback`, `Kora.entities`, `Kora.zones`, `Kora.progressbar`, `Kora.notify`, `Kora.distance`, `Kora.lang`, `Kora.config.adopt` |

Used but not declared as a dependency:

| Resource | Used for |
| --- | --- |
| `kora_core` | Server export `getDutyCountByType('leo')` for the police count |
| `kora_target` | Client export `addEntity` for the dealer, driver and truck options |
| `qb-vehiclekeys` provider | Handler of the `qb-vehiclekeys:client:AddKeys` event (`kora_vehiclekeys` registers a handler for it). If nothing handles it, taking the keys only removes the blip and sets the waypoint |

## Other manifest entries

The excerpt above omits these lines of `fxmanifest.lua` (current `version` is `0.2.0`):

- `fft_hooks.lua` (client) and `fft_hooks_server.lua` (server) are loaded last. They return immediately unless the convar `fft_kora_hooks` is `true`. See [Development](./development.md).
- `qa_feature 'tests/*.feature'` registers the QA scenarios for `kora_qa`.

## No commands, ACE permissions or database

The resource registers no commands, defines no ACE permissions and uses no database. Its only exports are the optional development hooks described in [Development](./development.md). All options and fixed values are listed in [Configuration](./configuration.md).
