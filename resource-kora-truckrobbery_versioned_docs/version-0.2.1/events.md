---
title: Events
sidebar_position: 7
---

# Events

The resource registers no commands. All names keep the legacy `qb-truckrobbery` prefix.

## Callback

| Name | Side | Description |
| --- | --- | --- |
| `qb-truckrobbery:server:startRobbery` | server, via `Kora.callback` | Starts a robbery. Returns `true` when started and `false` when too few police are on duty or a robbery is already running. Asserts the caller is within 5.0 m of `Config.DealerCoords`. Picks a random spawn and drop-off, publishes them and starts the 10 minute reset timer. |

## Net event

| Name | Direction | Description |
| --- | --- | --- |
| `qb-truckrobbery:server:endRobbery` | client to server | Sent after the 10 second "Rob Truck" progress bar completes. The server asserts a robbery is in progress with both coordinates set, the player is within 10.0 m of the drop-off, and a `stockade` is within 10 m of the drop-off. On success it clears the state. Failed asserts raise a server error and leave the state unchanged. |

## State bag

`GlobalState.TruckRobbery` is a table with `inProgress` (boolean), `coords` (spawn vector or `nil`) and `endCoords` (drop-off vector or `nil`). The client reads it to hide the dealer option and to learn the spawn and drop-off after a start.

## Events triggered on other resources

| Name | Side | Description |
| --- | --- | --- |
| `qb-vehiclekeys:client:AddKeys` | client, local | Triggered with the truck plate when the player takes the keys from the driver. Handled by a vehicle keys resource, not by this one. |

## Exports used

- `exports.kora_core:getDutyCountByType('leo')` (server)
- `exports.kora_target:addEntity(entity, options)` (client)
