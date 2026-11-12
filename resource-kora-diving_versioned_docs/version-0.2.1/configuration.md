---
title: Configuration
sidebar_position: 4
---

# Configuration

All options live in `shared/config.lua` and are registered with `Kora.config.adopt`.

| Option | Default | Description |
| --- | --- | --- |
| `Config.OxygenLevel` | `200` | Oxygen units a refill gives. One unit is used per second underwater. |
| `Config.model` | `prop_coral_pillar_01` | Prop model spawned at each coral location. |
| `Config.RemoveDivingGear` | `false` | When true, the mask and tank props are deleted when oxygen reaches 0. |
| `Config.CoralLocations` | 25 entries | List of `{ coords = vector3, PickedUp = false }`. Coral spawns at each coords. Keep `PickedUp` as `false`; it is runtime state. |
| `Config.CoralTypes` | 2 entries | Possible pick rewards and sell prices, see below. |
| `Config.SellLocations` | 1 entry | Buyer peds: `{ coords = vector4, model = ped model }`. Default is the Del Perro pier area. |

## Coral types

Each entry is `{ item, min, max, price }` and optionally `sellPrice`.

- A pick chooses one entry at random (equal chance) and gives a random amount from `min` to `max` (defaults 1 and 3 if missing).
- When selling, the per-item payout is `sellPrice` if set, otherwise `price`. Items with a price of 0 or less are not sold.
- Defaults: `dendrogyra_coral` (1 to 5, price random 70 to 100) and `antipatharia_coral` (2 to 7, price random 50 to 70).
- The default `price` uses `math.random` when the config file loads, so it is fixed per resource start and changes on restart.

## Fixed values in code

These are not configurable: coral respawn 5 minutes, pick and sell distance check 10.0 units, gear progress bars 5 seconds, pick and sell progress bars 2 to 4 seconds (random).
