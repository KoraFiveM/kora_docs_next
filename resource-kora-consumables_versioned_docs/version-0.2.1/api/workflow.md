---
title: "Use flow, security and edge cases"
sidebar_position: 5
---


# Use flow, security and edge cases

How a use is validated, which checks are built in, what stays your responsibility, and the behaviors to expect in odd situations. The resource has no public API besides the four legacy exports.

Namespace: `kora_consumables` · Source: `server/server.lua, client/client.lua`

## Use flow

1. **Inventory use** — Kora Core runs the handler registered by `registerUseable` with `(source, itemData)`. It returns `false` immediately if `using[source]` is set.
2. **Progress callback** — The server calls `Kora.callback.trigger(src, 'kora_consumables:progress', { class, item })`. The client handler asserts both fields exist, then looks the item up in its own config. An unknown item returns `false`.
3. **Progress bar** — The client builds the label, duration, animation, prop, disable block and emote, calls `Kora.progressbar.start` inside `pcall`, plays any visual and returns the bar result. A bar error returns `false`.
4. **Server check** — In `'complete'` mode a falsy result ends the use with nothing consumed. A result faster than `duration - 250` ms is ignored and logged.
5. **Apply** — `takeItem` consumes the item (or one `info.uses`), then `addStatus` adds the values, then the optional `event` is fired.

## Terms used on this page

| Term | Meaning |
| --- | --- |
| using lock | The server table `using[src]`. It is set before the use and cleared afterwards (also on error), so one player cannot stack two uses. |
| uses | A field `info.uses` on a stack. Each completed use decrements it; the item is removed at 0. |

## Built-in checks

Server side, `server/server.lua`: per-player lock in `registerUseable`; finish-time check in `useConsumable` (the client reports its own result, so an instant answer is ignored); the item is held and removed by the server in `takeItem`; the progress payload is built by the server, not the client; `legacyAdd`, `amount` and `vec` validate the types and range of everything the legacy exports receive; `kora_consumables:sync` is rate limited per player to 5 seconds. Client side, `client/client.lua`: the `kora_consumables:register` handler type-checks each entry before storing it.

## Developer responsibility

Only server resources can call the exports, but they do not check the caller, so never wire them to player input. `replenish.event` is trusted: the event name comes from your config or export call and is fired on the client without arguments other than the item name. The items and their shared definitions (including `useable = true`) must exist. The `kora_consumables:register` event is a plain client event: it only fills the local config, but a modified client can change its own copy of the config. The server still decides consumption and status from its own `Config.Consumables`.

## Status keys and Kora Core

`addStatus` writes `hunger`, `thirst`, `stress`, `health`, `armor`, `drunk` and `high` through `incrementMetaData`. This resource does not check that the metadata key exists or what it means; that is defined by Kora Core.

## Limits and related APIs

Edge cases: (1) `cigarette` is in the config but has no shared item, so `registerCigarette` creates it (weight 10, `cigarette.png`, `useable`, `shouldClose`) unless another resource defined it first. (2) The liquor keys `beer_pisswaser3` and `beer_pisswaser4` match the item names in `items/items.md`. (3) If an item stack has `info.uses` and `SetItemData` fails, the use is aborted and nothing is applied. (4) If the inventory removal returns a falsy value, no status is applied. (5) If the client progress callback errors or returns nothing, in `'complete'` mode nothing is consumed. (6) Items with an invalid prop model are used without the prop unless `Config.skipInvalidProps` is false. (7) If `kora_inventory` handles the same item name instantly (the config comments mention `water_bottle`), the handler registered last wins, which is why `registerUseables` runs again when the inventory starts. (8) Runtime items from the legacy exports vanish on a resource restart.
