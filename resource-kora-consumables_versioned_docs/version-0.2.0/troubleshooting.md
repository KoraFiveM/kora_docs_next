---
title: Troubleshooting
sidebar_position: 7
---

# Troubleshooting

## Using an item does nothing or acts instantly with no progress bar

- Make sure `kora_consumables` is started in `server.cfg` after `kora_lib`, `kora_core` and `kora_inventory`.
- `kora_inventory` has its own instant handlers for some items. This resource registers its handlers again when `kora_inventory` starts. If you restart another resource that registers useables for the same item names, restart `kora_consumables` afterwards.
- The item must exist as a shared item and be marked `useable`.

## The item is not removed and no status is applied

- In the default `'complete'` mode, cancelling the progress bar keeps the item and does nothing. This is intended.
- If the server console shows `[kora_consumables] <id> used <item> faster than its <n>ms duration; ignored`, the client reported completion too early. This is usually a modified client or an item whose `duration` does not match the real progress bar.
- If removing the item from the used slot fails, nothing is applied. For limited-use items, the same happens if saving `info.uses` fails.

## A second item cannot be used

Each player can only have one consumable use in progress. Wait for the current progress bar to finish or cancel it.

## The prop is missing or in the wrong place

- Set `Config.Debug = true` to print a line when a prop is skipped because its model is not valid.
- Adjust `offset`/`rotation` per item, or change `Config.propHand`/`Config.propBone`. See [Configuration](./configuration.md#props). These are read at resource start, so restart the resource after changing them.

## Drunk effect or notification is unwanted

Set `Config.DrunkWalk = false` and/or `Config.DrunkNotify = false`. To remove the effect from one item, set `effects = { visual = 'none' }` on that item.

## Items added with the exports disappear

Runtime additions are kept only in memory. Call the exports again whenever the calling resource starts, or add the items to `Config.Consumables`.
