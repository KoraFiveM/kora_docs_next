---
title: Exports
sidebar_position: 5
---

# Exports

This resource has only server exports. It has no client exports.

These are QBCore `qb-smallresources` style functions. They are available as:

- `exports.kora_consumables:<name>(...)`
- `exports['qb-smallresources']:<name>(...)`, through `Kora.compat.provideExport`

They add a consumable at runtime. The item then uses the normal server-validated flow (see [How it works](./how-it-works.md)): the player must hold it, and the server removes it.

## Common behaviour

- **Return values**: `ok, reason`. On success, they return `true, 'success'`. On failure, they return `false` with one of these reasons:
  - `'invalid arguments'`: `name` is not a non-empty string, or `replenish`/`data` is invalid.
  - `'already added'`: the item is already configured in any class, including items from `Config.lua`. Configured items cannot be overridden.
  - `'item does not exist'`: no `kora_core` shared item has this name.
- **Replenish value**: `replenish` must be a number from 0 to 100. Other values, including NaN and negative numbers, are rejected.
- **Class defaults**: the class defaults are applied to the new entry. See [Configuration](./configuration.md#class-defaults).
- **Client sync**: the entry is sent to all online clients with `kora_consumables:register`. Players who join later receive it through `kora_consumables:sync`.
- **Lifetime**: runtime additions are kept only in memory and disappear when the resource restarts.

## AddFood

```lua
local ok, reason = exports.kora_consumables:AddFood(name, replenish)
```

Adds `name` to the `food` class with `status = { hunger = replenish }`.

## AddDrink

```lua
local ok, reason = exports.kora_consumables:AddDrink(name, replenish)
```

Adds `name` to the `drink` class with `status = { thirst = replenish }`.

## AddAlcohol

```lua
local ok, reason = exports.kora_consumables:AddAlcohol(name, replenish)
```

Adds `name` to the `liquor` class with `status = { thirst = replenish }`. It also gets the liquor defaults, including the `buzzed` effect.

## AddCustom

```lua
local ok, reason = exports.kora_consumables:AddCustom(name, data)
```

Adds `name` to the `custom` class. `data` must be a table in the stock `qb-smallresources` format. Every part is optional. Invalid parts are ignored.

| Field | Type | Maps to |
| --- | --- | --- |
| `progress.label` | string | `label` (default `Using ` + item label) |
| `progress.time` | number greater than 0 | `duration` in ms (default 4000) |
| `animation.animDict`, `animation.anim`, `animation.flags` | string, string, number | `anim = { dict, clip, flag }`. Both strings are required. |
| `prop.model` | string | Prop model. Required for a prop. |
| `prop.bone` | number | Bone. Default `60309`. |
| `prop.coords` | vector3 or `{ x, y, z }` | Offset. Default zero. |
| `prop.rotation` | vector3 or `{ x, y, z }` | Rotation. Default zero. |
| `replenish.type` | `'Hunger'` or `'Thirst'` | Status key. Other values give no status. |
| `replenish.replenish` | number 0-100 | Status amount. Out-of-range values are ignored, but the item is still added. |
| `replenish.isAlcohol` | boolean | Adds `effects = { visual = 'buzzed', duration = 15000 }`. |
| `replenish.event` | string | Client event that the server sends to the player after a completed use, with the item name as its argument. |
| `replenish.server` | boolean | If `true`, `replenish.event` is not wired. Stock `qb-smallresources` triggers such server events from the client, which this resource does not allow. |

The custom class has no default animation or prop, and it uses `disable = { move = true, combat = true, vehicle = true }`.

## Examples

```lua
-- Server script in another resource
local ok, reason = exports['qb-smallresources']:AddFood('jerky', 35)
if not ok then print('jerky not added: ' .. reason) end

exports.kora_consumables:AddCustom('pill', {
    progress = { label = 'Swallowing', time = 2500 },
    animation = { animDict = 'mp_suicide', anim = 'pill', flags = 49 },
    prop = { model = 'prop_cs_pills', bone = 18905, coords = vector3(0.1, 0.02, 0.0) },
    replenish = { type = 'Hunger', replenish = 10, event = 'myresource:client:pillTaken' },
})
```
