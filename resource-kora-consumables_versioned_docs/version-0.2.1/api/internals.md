---
title: "Internals and local functions"
sidebar_position: 3
---


# Internals and local functions

Everything in this module is either a global of this resource or a file-local function. None of it is exported. It is documented so you know what the exports and the config actually do. The other private functions are listed in the table below.

Namespace: `kora_consumables` · Source: `shared/deafaults.lua, server/server.lua, client/client.lua`

## Local functions and what they do

| Function | Realm | File | Behavior |
| --- | --- | --- | --- |
| addStatus(src, status) | server | server/server.lua | Calls `exports.kora_core:incrementMetaData(src, key, value, 0, 100)` for each of `hunger`, `thirst`, `stress`, `health`, `armor`, `drunk`, `high` that is set (truthy) in `status`. Other keys are ignored. |
| takeItem(src, item, data, itemData) | server | server/server.lua | If the stack's `info.uses` exists, decrements it through `exports['qb-inventory']:SetItemData` and removes one item only when it reaches 0 (a failed update returns false). Otherwise removes one item with `exports.kora_inventory:removeItem(src, item, 1, slot)` unless `data.keep` is set. Returns true when the effect may apply. |
| applyUse(src, item, data, itemData) | server | server/server.lua | `takeItem`, then `addStatus`, then `TriggerClientEvent(data.event, src, item)` when `data.event` is set. |
| useConsumable(src, category, item, data, itemData) | server | server/server.lua | Runs the progress callback and the speed check (`FINISH_TOLERANCE` = 250 ms), or applies first when `Config.applyStatusOn == 'start'`. |
| registerUseable(category, item, data) | server | server/server.lua | Registers the Kora Core useable and wraps it in the per-player `using` lock; errors are re-raised after the lock is released. |
| registerUseables() | server | server/server.lua | Registers every item in `Config.Consumables`. Called at load and when `kora_inventory` starts. |
| registerCigarette() | server | server/server.lua | Registers a shared item `cigarette` (weight 10, useable) if `exports.kora_core:getShared('items', 'cigarette')` is empty. |
| amount(value) | server | server/server.lua | Returns the value only when it is a number, not NaN, from 0 to 100; otherwise nil. |
| vec(value) | server | server/server.lua | Turns a table or vector3 with numeric x, y, z into `{x, y, z}`; otherwise nil. |
| customData(source) | server | server/server.lua | Translates the `AddCustom` table into this resource's item format. |
| legacyAdd(export, name, value) | server | server/server.lua | Shared body of the four exports. |
| buzzed(duration) | client | client/client.lua | Applies the `drug_drive_blend01` timecycle (strength 0.6), `DRUNK_SHAKE` camera shake, optional notification and drunk walking style; clears them after `duration`. A newer call cancels the older timer through `buzzedToken`. |
| addVisuals(effect) | client | client/client.lua | Maps `effect.visual` to `buzzed` (local), or `Kora.visuals.alien`, `coke`, `crack`, `meth`, `trevor`. `'none'` or a missing effect does nothing. Duration defaults to 15000. |
| usableProp(prop, item) | client | client/client.lua | Returns nil for a prop whose model is invalid when `Config.skipInvalidProps` is not false. |
| movementAllowed(itemData, class) | client | client/client.lua | Resolves per-item `allowMovement`, then `Config.allowMovement` (boolean or per-class table), default true. |
| movableAnim(anim) | client | client/client.lua | Returns a copy of the animation with flag `(flag or 1) \| 48`, so the legs stay free. |

## How it works

`ApplyConsumableDefaults` and `ConsumableLabel` are the only function globals. `ConsumableLabel(class, item, data)` is used by the client to complete a defaulted label from the kora_core item registry when the item is used. The default tables themselves (`defaults`, `classSetting`, `resolveProp`) are file-local to `shared/deafaults.lua`. If `Config.Consumables` is nil when that file loads, it waits in a `repeat Wait(20)` loop until it exists.

## Functions

The main global function of the resource (the other is `ConsumableLabel`).

### `ApplyConsumableDefaults(class, item, data) -> nil`

A global function defined in `shared/deafaults.lua` (not an export, so other resources cannot call it). Fills the missing fields of one item with the class defaults. It runs for every configured item at load, in both client and server, and again inside `legacyAdd` for runtime items.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `class` | string | Required. A class with defaults: `food`, `drink`, `smoke`, `liquor` or `custom`. An unknown class raises an error because the class default is indexed. |
| `item` | string | Required. Item name, used to build the default label from the shared item label. |
| `data` | table | Required. The item table. It is modified in place. |

**Returns**

No value.

**Example**

```lua
-- Effect of the defaults on Config.Consumables.liquor.beer = {} after load:
-- label    'Drinking <shared item label>'
-- duration 4000
-- anim     { dict = 'amb@world_human_drinking@coffee@male@idle_a', clip = 'idle_c' }
-- prop     prop_cs_beer_bot_01 on the right hand (bone 28422)
-- disable  { move = true, combat = true, vehicle = true }
-- status   { thirst = 10 }
-- effects  { visual = 'buzzed', duration = 15000 }
```

**Representative console output**

```text
-- no console output
```

## Limits and related APIs

Local functions cannot be called from other resources and are not a stable API. Their behavior can change without notice.

## Related guides

- [Server exports](./server-exports.md)
- [Configuration](./configuration.md)
