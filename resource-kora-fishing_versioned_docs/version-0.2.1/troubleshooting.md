---
title: Troubleshooting
sidebar_position: 9
---

# Troubleshooting

## "You are not in a fishing zone."

The server uses the polygon and height range of `Config.zones` (lowest point minus `thickness` to highest point plus `thickness`). Check the coordinates and that the zone's `poles` table contains the pole you are using.

## "You have no usable bait for this pole."

You need a bait from that zone's pole table that you own and meet the level of. Bait selection takes the lowest level you qualify for, so a `worm` in the inventory is always used before better baits.

## Catches never complete

- The `fishing` minigame must be configured in `kora_lib`; a minigame error prints `kora_fishing: fishing minigame failed` in the client console.
- Catches are rejected if the player left the zone, no longer has the pole or bait, or the proof or authorization is invalid.
- Overlapping zones: the server uses the first matching zone while the client sends the zone it last entered. The default config has two zones with the same polygon (indexes 2 and 5), so a catch can be dropped if the client reports the later one. Not verified in game.

## Shop or buyer menu shows nothing

The buyer and refine menus list only items you own; the shop lists only items at or below your fishing level. An item name that does not exist in the `kora_core` shared items shows its raw name with no image.

## Refine gives nothing

The reward names in `receiveItems` (rubber, metalscrap, and so on) must exist in your shared items, otherwise the reward cannot be added (not verified against `kora_inventory`).

## Other

- The resource's `fxmanifest.lua` does not declare `kora_lib` or `kora_target`; start both before this resource.
- Notifications are titled "qb-fishing" in several places; that is the legacy name.
