---
title: "How to use"
sidebar_position: 3
---


# How to use

Pick the class an item belongs to (food, drink, smoke, liquor), list it in `Config.Consumables`, and make sure the item exists in the shared items. Players use it from the inventory; this resource does the rest.

## What happens when a player uses an item

- Kora Core calls the useable handler registered by `registerUseable`. If the player already has a use in flight (`using[src]`), the handler returns `false` and nothing happens.
- The server triggers the Kora callback `kora_consumables:progress` on that player with `{ class, item }`. The client looks the item up in its own `Config.Consumables`, merges the movement rules and starts `Kora.progressbar.start`.
- If the item has `effects`, the client plays the visual only when the progress bar completed.
- The client reports the result. In the default mode (`Config.applyStatusOn = 'complete'`) the server ignores a result that came back faster than the item duration minus 250 ms, prints `[kora_consumables] <src> used <item> faster than its <ms>ms duration; ignored`, and applies nothing.
- Otherwise the server runs `applyUse`: it consumes the item (`takeItem`), adds the status values with `exports.kora_core:incrementMetaData(src, key, value, 0, 100)` and, when `data.event` is set, fires that event on the player's client with the item name.
- With `Config.applyStatusOn = 'start'` the order changes: the item is consumed and the status applied first, then the progress bar runs; the call still blocks until the client answers (`Kora.callback.trigger` always awaits), but the returned result is discarded.

## Add a new item

Add an entry under the matching class in `shared/Config.lua`. An empty table is valid (`chips = {}`); every missing field is filled by `ApplyConsumableDefaults` from the class defaults in `shared/deafaults.lua`.

```lua title="shared/Config.lua"
-- shared/Config.lua: add a new food item. Anything left out comes from the class defaults.
Config.Consumables.food.taco = {
    duration = 5000,
    status = { hunger = 30, stress = -2 },
    prop = { model = "prop_taco_01" },
}
```

## Add an item from another resource

Server resources written for qb-smallresources can call the legacy exports. They require the item to already exist in the shared items and not to be configured yet.

```lua title="server.lua"
-- server script of another resource (runs once at start, after kora_consumables)
local ok, reason = exports.kora_consumables:AddFood('burrito', 35)
if not ok then print(('burrito not added: %s'):format(reason)) end
```

> **Note:** These exports only change the running session. Items added this way are kept in memory and are lost when this resource restarts, so call them again from your own `onResourceStart` handler for `kora_consumables` as well as on your own start.

## Item classes

- `food`: eating animation, hunger +20, prop `prop_cs_burger_01` in the left hand.
- `drink`: bottle animation, thirst +20, prop `prop_ld_flow_bottle` in the left hand.
- `liquor`: right-handed drink animation, thirst +10, `buzzed` visual for 15 seconds (screen effect, camera shake, drunk walking style when `Config.DrunkWalk` is on).
- `smoke`: smoking animation, stress -10 and health -5, `alien` visual for 15 seconds.
- `custom`: only created by `AddCustom`. Label, duration 4000 and the movement block are defaulted, there is no animation, prop, status or visual unless supplied.

## More detail

- [How it works](./how-it-works.md): startup, movement, screen effects and labels.
- [Server exports](./api/server-exports.md) and [Configuration](./api/configuration.md): the full reference.
- [Items](./items.md): the default consumables.
