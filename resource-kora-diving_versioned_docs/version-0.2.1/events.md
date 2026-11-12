---
title: Events and callbacks
sidebar_position: 6
---

# Events and callbacks

## Server net events

| Event | Arguments | Behaviour |
| --- | --- | --- |
| `qb-diving:server:PickCoral` | `index` | Asserts the index exists, the coral is not already picked, and the player is within 10.0 of it. Marks it picked, updates `GlobalState.Corals`, tells all clients to remove it, gives a random coral item, then respawns it after 5 minutes. |
| `qb-diving:server:sellCoral` | none | Asserts the player is within 10.0 of a sell location. Removes all coral items from the inventory and pays the total as cash through `kora_core:addMoney`. Pays nothing if the player has none. |

## Client events (server to client)

| Event | Target | Behaviour |
| --- | --- | --- |
| `qb-diving:client:UseGear` | the user | Toggle gear. Removes it if worn. Otherwise errors if oxygen is 0 or the player is swimming or in a vehicle, else equips. |
| `qb-diving:client:SetOxygenLevel` | the user | Errors if oxygen is not 0. Otherwise calls the fill callback and sets oxygen to `Config.OxygenLevel`. |
| `qb-diving:client:RemoveCoral` | all | `index`. Removes that coral prop. |
| `qb-diving:client:RespawnCoral` | all | `index`. Recreates that coral prop if it is not picked. |
| `qb-diving:client:init` | local | Creates props for all coral not yet picked. Triggered once when the client script loads. |

## Callbacks

| Name | Side | Behaviour |
| --- | --- | --- |
| `qb-diving:server:fillOxygen` | server | Removes one `diving_fill` and returns true on success. |

## Usable items

The server registers `diving_gear` and `diving_fill` with `kora_core:createUseable`.

## State

`GlobalState.Corals` mirrors `Config.CoralLocations` (including each `PickedUp` flag) and is read by clients.
