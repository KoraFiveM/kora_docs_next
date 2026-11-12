---
title: Events
sidebar_position: 9
---

# Events

## Server callbacks

| Name | Arguments | Returns |
| --- | --- | --- |
| `qb-newsjob:server:spawnVehicle` | `location` (`vehicle` or `heli`), `index` | net id of the spawned vehicle, or `false` on any failed check |

## Net events (client to server)

| Event | Arguments | Checks |
| --- | --- | --- |
| `qb-newsjob:server:addVehicleItems` | `netId`, `plate` | news job, vehicle spawned by this resource for the caller, not yet granted, entity exists, caller has keys for `plate` |
| `qb-newsjob:server:requestedEquipment` | `item` | news job, item is `newscam`, `newsmic` or `newsbmic` |

## Net events (server to client)

| Event | Effect |
| --- | --- |
| `Cam:ToggleCam` | toggle the news camera |
| `Mic:ToggleMic` | toggle the boom mic |
| `Mic:ToggleBMic` | toggle the hand mic |

The client-side handlers only check the news job, so these events should be triggered only by the server.

## Events consumed from other resources

- `QBCore:Client:OnPlayerLoaded` and `QBCore:Client:OnPlayerUpdated` refresh the blip.
- `qb-vehiclekeys:server:RemoveVehicleKeys` (triggered by `storeCurrentVehicle`) and `vehiclekeys:client:SetOwner` (triggered after a spawn).

The resource exposes no exports and registers no commands.
