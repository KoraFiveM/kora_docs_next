---
title: "Server exports"
sidebar_position: 2
---


# Server exports

Four exports registered with `exports(name, handler)`, one per legacy qb-smallresources function: `AddFood`, `AddDrink`, `AddAlcohol`, `AddCustom`. Each is also registered under `qb-smallresources` with `Kora.compat.provideExport('qb-smallresources', name, handler)`, so `exports['qb-smallresources']:AddFood(...)` reaches the same handler. They exist on the server only; there are no client or shared exports.

Namespace: `exports.kora_consumables` · Source: `server/server.lua (exports(...) and Kora.compat.provideExport in the loop over legacyClass; local function legacyAdd)`

## How it works

All four go through the private `legacyAdd(export, name, value)`. It rejects the call if the name is invalid, if the name is already a key in any class table of `Config.Consumables`, if the value is not valid for the class, or if the shared item does not exist. On success it stores the entry in `Config.Consumables[class][name]`, runs `ApplyConsumableDefaults(class, name, data)`, registers the useable with Kora Core, records the entry for late joiners and broadcasts it to every client with `TriggerClientEvent('kora_consumables:register', -1, ...)`. A player who joins later receives the stored entries through `kora_consumables:sync`.

## Terms used on this page

| Term | Meaning |
| --- | --- |
| class | The key under `Config.Consumables`: `food`, `drink`, `smoke`, `liquor` or `custom`. It selects the defaults. The exports map to `food`, `drink`, `liquor` and `custom`; `smoke` can only be configured in `Config`. |
| replenish | A number from 0 to 100 added to hunger (food) or thirst (drink, alcohol) through `incrementMetaData`, clamped to 0-100. |
| useable | An item handler registered with `exports.kora_core:createUseable`. It runs when a player uses the item from the inventory. |

## Functions

Signatures use the form produced by the source. Both return values (`boolean, string`) are produced by every path; the second value is the reason. Check the second value when you need to know why a call failed.

### `exports.kora_consumables:AddFood(name, replenish) -> boolean, string`

Registers a food item at runtime in the `food` class. The item gets the food defaults (eating animation, prop, 4000 ms) and adds `replenish` to the player's hunger when used. Also reachable as `exports['qb-smallresources']:AddFood`.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `name` | string | Required. Item name. Must be a non-empty string, must not already appear under any class in `Config.Consumables`, and must exist in the Kora shared items. |
| `replenish` | number | Required. Hunger added on use. Must be a finite number from 0 to 100 inclusive (NaN, negative or above 100 is rejected). Values are added, not set, and the metadata is clamped 0-100. |

**Returns**

- **true, 'success'** — item registered and sent to every online client.
- **false, 'invalid arguments'** — name is not a non-empty string, or `replenish` is not a number from 0 to 100.
- **false, 'already added'** — the item name is already configured in any class.
- **false, 'item does not exist'** — `exports.kora_core:getShared('items', name)` returned nothing.

**Example**

```lua
local ok, reason = exports.kora_consumables:AddFood('burrito', 35)
if not ok then
    print(('AddFood failed: %s'):format(reason))
end
```

**Representative console output**

```text
-- ok == true, reason == 'success'
-- second call with the same name: false, already added
```

### `exports.kora_consumables:AddDrink(name, replenish) -> boolean, string`

Registers a drink item at runtime in the `drink` class. Adds `replenish` to thirst when used. Also reachable as `exports['qb-smallresources']:AddDrink`.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `name` | string | Required. Item name. Must be a non-empty string, must not already appear under any class in `Config.Consumables`, and must exist in the Kora shared items. |
| `replenish` | number | Required. Thirst added on use. Must be a finite number from 0 to 100 inclusive (NaN, negative or above 100 is rejected). Values are added, not set, and the metadata is clamped 0-100. |

**Returns**

- **true, 'success'** — item registered and sent to every online client.
- **false, 'invalid arguments'** — name is not a non-empty string, or `replenish` is not a number from 0 to 100.
- **false, 'already added'** — the item name is already configured in any class.
- **false, 'item does not exist'** — `exports.kora_core:getShared('items', name)` returned nothing.

**Example**

```lua
local ok, reason = exports.kora_consumables:AddDrink('lemonade', 30)
if not ok then
    print(('AddDrink failed: %s'):format(reason))
end
```

**Representative console output**

```text
-- ok == true, reason == 'success'
```

### `exports.kora_consumables:AddAlcohol(name, replenish) -> boolean, string`

Registers an alcoholic drink at runtime in the `liquor` class. Adds `replenish` to thirst (not to a drunk value) and inherits the liquor defaults, including the `buzzed` visual. Also reachable as `exports['qb-smallresources']:AddAlcohol`.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `name` | string | Required. Item name. Must be a non-empty string, must not already appear under any class in `Config.Consumables`, and must exist in the Kora shared items. |
| `replenish` | number | Required. Thirst added on use. Must be a finite number from 0 to 100 inclusive (NaN, negative or above 100 is rejected). Values are added, not set, and the metadata is clamped 0-100. |

**Returns**

- **true, 'success'** — item registered and sent to every online client.
- **false, 'invalid arguments'** — name is not a non-empty string, or `replenish` is not a number from 0 to 100.
- **false, 'already added'** — the item name is already configured in any class.
- **false, 'item does not exist'** — `exports.kora_core:getShared('items', name)` returned nothing.

**Example**

```lua
local ok, reason = exports.kora_consumables:AddAlcohol('tequila', 8)
if not ok then
    print(('AddAlcohol failed: %s'):format(reason))
end
```

**Representative console output**

```text
-- ok == true, reason == 'success'
```

### `exports.kora_consumables:AddCustom(name, data) -> boolean, string`

Registers an item at runtime in the `custom` class from a table in the stock qb-smallresources layout. Only the fields listed below are read; everything else is ignored. Also reachable as `exports['qb-smallresources']:AddCustom`.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `name` | string | Required. Item name, with the same rules as `AddFood`. |
| `data` | table | Required. A non-table value is rejected with `invalid arguments`. An empty table is accepted and produces an item with only the `custom` defaults. |
| `data.progress` | table | Optional. `label` (string) becomes the progress label; `time` (number above 0, in milliseconds) becomes the duration. |
| `data.animation` | table | Optional. Used only when both `animDict` and `anim` are strings: becomes `anim = { dict, clip, flag = animation.flags }`. |
| `data.prop` | table | Optional. Used only when `model` is a string. `bone` (number, default 60309), `coords` (becomes the offset, default 0,0,0) and `rotation` (default 0,0,0) are read; a vector or table with numeric x, y, z is accepted for both. |
| `data.replenish` | table | Optional. `type = 'Hunger'` or `'Thirst'` together with `replenish` (number 0-100) sets that status. `isAlcohol = true` adds the `buzzed` visual for 15000 ms. `event` (non-empty string) is raised on the player's client after a completed use, unless `replenish.server` is truthy, in which case the event is dropped. |

**Returns**

- **true, 'success'** — item registered and sent to every online client.
- **false, 'invalid arguments'** — `name` is not a non-empty string or `data` is not a table.
- **false, 'already added'** — the item is already configured in any class.
- **false, 'item does not exist'** — no matching shared item.

**Example**

```lua
local ok, reason = exports.kora_consumables:AddCustom('energy_shot', {
    progress = { label = 'Drinking energy shot', time = 3000 },
    animation = { animDict = 'mp_player_intdrink', anim = 'loop_bottle' },
    prop = { model = 'prop_energy_drink', bone = 60309 },
    replenish = { type = 'Thirst', replenish = 15, event = 'myresource:client:energy' },
})
if not ok then print(reason) end
```

**Representative console output**

```text
-- ok == true, reason == 'success'
-- after a completed use the player's client receives myresource:client:energy with 'energy_shot'
```

## Limits and related APIs

There is no export to remove or change an item, to read the configuration, or to apply status values directly. Items added through these exports are not saved and disappear when the resource restarts. Calling `AddFood` and friends from the client is not possible (server exports only). The dispatch does not check who the calling resource is: any server resource can add items.

## Related guides

- [Configuration](./configuration.md)
- [Internals and local functions](./internals.md)

## Common behaviour of the exports

- **Return values**: `ok, reason`. On success, they return `true, 'success'`. On failure, they return `false` with one of these reasons:
  - `'invalid arguments'`: `name` is not a non-empty string, or `replenish`/`data` is invalid.
  - `'already added'`: the item is already configured in any class, including items from `Config.lua`. Configured items cannot be overridden.
  - `'item does not exist'`: no `kora_core` shared item has this name.
- **Replenish value**: `replenish` must be a number from 0 to 100. Other values, including NaN and negative numbers, are rejected.
- **Class defaults**: the class defaults are applied to the new entry. See [Configuration](./configuration.md#class-defaults).
- **Client sync**: the entry is sent to all online clients with `kora_consumables:register`. Players who join later receive it through `kora_consumables:sync`.
- **Lifetime**: runtime additions are kept only in memory and disappear when the resource restarts.

## AddCustom field mapping

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


## More examples

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
