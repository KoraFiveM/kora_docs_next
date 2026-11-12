---
title: kora_truckrobbery
sidebar_position: 1
---

# kora_truckrobbery

`kora_truckrobbery` is a one-at-a-time armored truck mission for Kora servers. A dealer NPC starts the mission when enough police are on duty. A `stockade` with a driver and two armed guards spawns at a random configured location and drives off. The player kills the crew, can take the keys from the driver, delivers the truck to a random drop-off and robs it there. It is a port of `qb-truckrobbery` and still uses the `qb-truckrobbery:*` event and callback names.

Current version: see `version` in `fxmanifest.lua`.

## Features

- **Dealer NPC** - a frozen, invincible `a_m_m_skater_01` ped at `Config.DealerCoords` with a "start Robbery" `kora_target` option. The option is hidden while a robbery is in progress.
- **Police requirement** - the server counts on-duty `leo` players and refuses the start when fewer than `Config.ActivePolice` are on duty. The player sees "There are not enough police on duty."
- **Single mission** - only one robbery can be active at a time. The server keeps the state in `GlobalState.TruckRobbery` and resets it when the robbery ends or after 10 minutes.
- **Truck and crew** - the truck spawns at a random entry of `Config.VehicleSpawn`. The driver and two guards get 200 health, 100 armour, an assault rifle and aggressive combat settings. The driver drives wandering at speed 80. A red "Robbery Truck" blip (sprite 477) follows the truck.
- **Take keys** - a "Take Keys" option on the driver triggers `qb-vehiclekeys:client:AddKeys` with the truck plate, removes the blip and sets a waypoint to the drop-off.
- **Rob the truck** - inside a 5 by 5 by 5 box at the drop-off, a "Rob Truck" option on the truck becomes available once the driver and both guards are dead. A 10 second progress bar runs, then the client reports completion and deletes the truck and crew.
- **Server validation of completion** - the server only ends the robbery when the player is within 10 m of the drop-off and a `stockade` is within 10 m of it. See [Events](./events.md).

This resource does not pay out any money or items. Completing the robbery only clears the mission state. See [Troubleshooting](./troubleshooting.md).

## Requirements

`kora_lib` is the declared dependency. `kora_core`, `kora_target` and a `qb-vehiclekeys` provider are used at runtime. See [Installation](./installation.md#requirements).

## Commands, exports and permissions

The resource registers no commands, defines no ACE permissions and uses no database. Its only exports are the optional development hooks described in [Development](./development.md).

## Documentation map

- [Installation](./installation.md) - install steps, requirements, manifest and `shared/config.lua` reference
- [How to use](./how-to-use.md) - starting the robbery, truck and guards, looting, the server drop-off check and the missing reward
- [Configuration](./configuration.md) - all `Config` options and the fixed values in the code
- [Events](./events.md) - callback, net event, state bag and external events
- [Development](./development.md) - FFT hooks, smoke test and QA scenarios
- [Troubleshooting](./troubleshooting.md) - known caveats and common problems
