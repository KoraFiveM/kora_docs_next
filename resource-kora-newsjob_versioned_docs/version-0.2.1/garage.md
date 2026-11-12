---
title: Garage
sidebar_position: 7
---

# Garage

## Opening

News employees (`job.name == 'news'`, read through `exports.kora_core:getPlayerData`) see the "Vehicles" option at the garage zone and the "Helicopters" option at the heli zone. Both open the same `kora_lib` NUI app, `qb-newsjob:garage` ("Weazel News Garage"), with a Vehicles view and a Helicopters view. Each lists the configured vehicles with a "Take vehicle" action; an empty list shows "No vehicles available".

## Spawning

1. The client calls the server callback `qb-newsjob:server:spawnVehicle` with the location (`vehicle` or `heli`) and the list index.
2. The server checks the player is a news employee, that the entry exists, and that the player is within 5.0 units of the garage coordinates. The model and position come from config, never from the client.
3. The server creates the vehicle (type `automobile` or `heli`), puts it in the player's routing bucket and records it as owned by that player.
4. The client waits up to about 5 seconds for the entity, takes control, sets a `WZNW####` plate, heading, 100 fuel, warps the player in, sets key ownership, starts the engine and applies the livery.
5. For vans only, the client then asks the server to stock the trunk (see [Events](./events.md)).

Every vehicle spawned this way is deleted by the server when the resource stops.

## Trunk items

`qb-newsjob:server:addVehicleItems` adds `Config.VehicleItems` to the `trunk-<plate>` inventory. The server requires a news job, a netId it spawned for that same player, a living entity, that items were not already granted for it, and that `qb-vehiclekeys:HasKeys` is true for the plate.

## Blip

On player load and on every player update the blip is removed and, for news employees, re-created at the garage coordinates: label "Weazel News Vehicles", sprite 225, colour 1, scale 0.6, short range.

## Building doors

Two `kora_target` box zones teleport with a 500 ms fade: "Enter" at the outside coordinates to the inside coordinates, and "Go outside" the other way. Both require the news job.

## Storing vehicles

`storeCurrentVehicle` (client, global) deletes the vehicle the player is in if its plate was recorded when this client spawned it, and asks `qb-vehiclekeys` to remove the keys. Nothing in this resource calls it, so there is no built-in "store" option.
