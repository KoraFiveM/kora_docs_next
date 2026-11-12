---
title: How it works
sidebar_position: 2
---

# How it works

## Startup

1. `shared/Config.lua` defines the `Config` table and the configured consumables.
2. `shared/deafaults.lua` (the filename is misspelled in the repo) fills missing fields for each configured item from its class defaults. It also declares `Config.applyStatusOn` as a live kora_lib config enum and registers the whole `Config` with `Kora.config.adopt`.
3. The server registers each configured item with `exports.kora_core:createUseable`. Before that, it registers a `cigarette` shared item if no resource has defined one.
4. `kora_inventory` has its own instant handlers for some of the same items, such as `water_bottle`, `sandwich` and `beer`. To keep this resource's handlers active, the server registers all useables again whenever `kora_inventory` starts.
5. When the client script starts, it sends `kora_consumables:sync` to the server. The server replies with any items that other resources added at runtime through the [exports](./exports.md).

## Using an item

When a player uses a configured item from the inventory:

1. The server checks whether the player already has a use in progress. If so, it ignores the new use and the useable callback returns `false`.
2. With `applyStatusOn = 'complete'` (default):
   1. The server triggers the client callback `kora_consumables:progress` with the payload `{ class, item }` and waits for the result.
   2. The client looks up the item config. It drops the prop if its model is invalid (see `skipInvalidProps`). It applies the movement rules and starts `Kora.progressbar.start` with the label, duration, animation, prop, `disable` flags, `canCancel`, `useWhileDead` and `emote`.
   3. If the player finishes the bar, the client starts the item's screen effect, if any, and returns `true`. If the player cancels or the progress bar fails, it returns `false`.
   4. If the result is not `true`, nothing happens: the item is kept and no status is applied.
   5. The server also checks timing. If the result arrived sooner than the item's `duration` (default `1000` ms) minus 250 ms, the use is ignored and a line is printed to the server console.
   6. Otherwise, the server consumes the item and applies its status (see below).
3. With `applyStatusOn = 'start'`, the server consumes the item and applies its status right away, then shows the progress bar. Cancelling the bar does not undo the item use or status changes. The screen effect still runs only if the bar finishes.

### Consuming the item

- If the used item has an `info.uses` number, it is decremented and saved with `exports['qb-inventory']:SetItemData`. The item is removed only when `uses` reaches 0. If the save fails, nothing is applied.
- If the item has no `info.uses` and is not marked `keep = true`, one is removed from the used slot with `exports.kora_inventory:removeItem`. If the removal fails, for example because the player no longer has the item, nothing is applied.
- Items with `keep = true` and no `uses` are not removed.

### Applying status

Each key in the item's `status` table is added to the matching player metadata value through `exports.kora_core:incrementMetaData` and clamped to 0-100. Supported keys are `hunger`, `thirst`, `stress`, `health`, `armor`, `drunk` and `high`. Negative values lower the value. Other keys are ignored.

If the item has an `event` field, the server sends that client event to the player afterwards with the item name as its argument. See [Events](./events.md).

## Movement while using

On the client, movement rules are resolved in this order:

1. The item's own `allowMovement` (`true` or `false`), if set.
2. `Config.allowMovement`: a boolean, or a table keyed by class, where a missing class counts as `true`.
3. If neither is set, movement is allowed.

When movement is allowed, `disable.move` is changed to `false` for that use. Flags 16 (upper body) and 32 (player control) are added to the animation flag, with a base of `1` if the animation has no flag. Combat and vehicle restrictions are not changed. A `disable.vehicle` value is also copied to `disable.car` for the progress bar.

## Screen effects

When the bar finishes, the client starts the item's `effects` according to `effects.visual`:

| `visual` | Effect |
| --- | --- |
| `none` (or no `effects`) | No effect. |
| `buzzed` | Built-in drunk effect: timecycle `drug_drive_blend01` at strength 0.6 and `DRUNK_SHAKE` camera shake. If `Config.DrunkWalk` is on, it also sets the `Config.DrunkWalkClipset` walk style; if `Config.DrunkNotify` is on, it shows a "Drunk" notification. Everything is reset after `duration`. If another buzzed effect starts, its timer replaces the earlier one. |
| `alien`, `coke`, `crack`, `meth`, `trevor` | Calls `Kora.visuals.<name>(duration)` from kora_lib. |

`effects.duration` is in milliseconds and defaults to 15000.

## Label

If an item has no `label`, it uses the class prefix (`Drinking `, `Eating `, `Smoking `, `Using `) followed by the item's shared-item label. The client may load this resource before its `kora_core` item registry is ready, so the label is completed again when the item is used.
