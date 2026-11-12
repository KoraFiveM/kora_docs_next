---
title: Events and callbacks
sidebar_position: 6
---

# Events and callbacks

Names keep the legacy `qb-scrapyard` prefix. The resource exposes no exports and no commands.

## Server callbacks

Registered with `Kora.callback.register` and called from the client with `Kora.callback.trigger`. Handlers receive the player source first.

| Name | Arguments | Returns | Purpose |
| --- | --- | --- | --- |
| `qb-scrapyard:server:getVehicleList` | none | table of model names | Returns the current wanted list. |
| `qb-scrapyard:server:beginScrap` | `model`, `locationKey`, `netId` | `true`, or `false` and an error message | Validates and reserves a dismantle job. |
| `qb-scrapyard:server:cancelScrap` | ignored | `true` | Releases the player's job and model claim. |
| `qb-scrapyard:server:finishScrap` | `model`, `locationKey`, `netId` | `true`, or `false` and an error message | Re-validates, grants rewards and consumes the list entry. |

### Validation

Both `beginScrap` and `finishScrap` check that: the location key exists; the player is within 5.0 m of the bay; the model is on the current list and is not claimed by another player; the network entity is a vehicle the player is driving; its model matches; its plate is not in `player_vehicles` (rows with `deleted_at` set are ignored). The checks are repeated after the database query. `finishScrap` additionally requires the job from `beginScrap` to exist, to be less than 60 seconds old, and to match the model, location and network id.

A player can hold one job at a time. A model can only be claimed by one player at a time. Jobs are released when the player disconnects (`playerDropped`).

## Client events

| Event | Direction | Arguments | Purpose |
| --- | --- | --- | --- |
| `qb-scrapyard:client:setVehicleList` | server to client | list of model names | Replaces the client's copy of the wanted list. Sent to everyone on rotation and after each completed or rolled-back job. |

The client also listens to the local event `kora_core:client:playerLoaded` to fetch the list, and to `onClientResourceStart` / `onClientResourceStop` for `kora_lib` and `kora_target` to rebuild the delivery zones.
