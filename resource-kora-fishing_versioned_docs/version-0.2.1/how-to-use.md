---
title: "How to use"
sidebar_position: 3
---


# How to use

Fishing happens inside poly zones. A player with a pole uses it to start fishing if they are standing in a zone that lists that pole, then repeatedly requests a catch from the server until they stop or leave the zone.

## Fishing zones and poles

Each entry in `Config.zones` is a polygon (`Kora.zones.poly`) with a `points` list, a `thickness` used to pad the height range above/below the lowest/highest point, and a `poles` table mapping pole item names to their bait/catch data (normally one of the two tables declared in `Config.poles`). Only poles listed under a zone's `poles` can be used inside it.

- A rod item (`fishing_pole` or `magnet_pole`) is registered as a useable item via `exports.kora_core:createUseable`. Using it while already fishing stops the current session; using it while on a fishing-zone cooldown (2 seconds after a previous use) is rejected with a notification; using it while standing in a zone that accepts that pole starts fishing and triggers `kora_fishing:client:goFish` on the client.
- The client loop (`client/fishing.lua`) requests a catch from `Kora.callback.trigger('kora_fishing:server:beginCatch')` and, once the server reports the wait is over, runs the `Kora.minigames.play('fishing', nil, authorization)` minigame and sends the result to `kora_fishing:server:catchFish`. Leaving the zone, losing the pole, or a minigame that errors breaks the loop; a minigame that is merely failed sends no proof and the loop continues with a new catch request (`client/fishing.lua:47-55`).

## Picking a bait and catch time

Bait choice is automatic: the server scans the current pole's `baits` table for the bait with the lowest `level` requirement that the player both meets (fishing level, from `exports.kora_skills:getRep(src, 'fishing').level`, defaulting to 1) and currently holds (`exports['qb-inventory']:HasItem`). If no bait qualifies, the catch cannot start.

- Catch duration scales linearly between each bait's `baseTime` (at the bait's required level) and `Config.fishing.minTime` (at `Config.fishing.maxLevel`), floored at `minTime`.
- On success the server picks one random item from the bait's `catch` list, removes one of the bait item, adds the caught item, and grants `exports.kora_skills:addRep(src, 'fishing', bait.xp)`.

## Selling, buying and refining

- Buyer NPCs (`Config.Locations.buyer`) open the `kora_fishing:buyer` NUI app, built only from items the player currently holds; selecting one and entering an amount fires `kora_fishing:server:sellItem`.
- The gear shop (`Config.Shop`) opens the `kora_fishing:shop` app, filtered to items the player's fishing level meets; purchasing fires `kora_fishing:server:purchaseItem`.
- Breakdown/refine points (`Config.Locations.breakdown`) open the `kora_fishing:breakdown` app, listing only salvage items the player holds; refining fires `kora_fishing:server:refineItem` after a 5-second cancellable progress bar.
- All three menus are rebuilt from scratch on open (`Kora.nui.updateApp` with fresh navigation), so stock/quantity is always read from the player's current inventory rather than cached.

## Step-by-step reference

The sections below were derived from the code and describe the exact server checks, timings and default data.


### Using a pole

1. The player uses `fishing_pole` or `magnet_pole` (both are registered as usable items on the server through `kora_core`).
2. If the player is already fishing, using the pole again stops fishing ("You reel in your line.").
3. A 2 second per-player cooldown applies between starts ("You must wait before fishing again.").
4. The server checks the player is inside a zone from `Config.zones` (polygon plus height range, see [Configuration](./api/configuration.md)) and that the zone lists this pole. Otherwise: "You are not in a fishing zone."
5. The client starts the fishing animation and requests a catch from the server.

### A catch

The client loops until fishing stops. For each catch:

1. The server checks that the player is still in the same zone, still holds the pole, and has usable bait. It picks the bait: of the baits for that pole in that zone that the player owns and has the level for, the one with the lowest `level` is used. The wait time is calculated and the server issues a minigame authorization.
2. The client waits that long (1 second steps), then plays the `fishing` minigame from `kora_lib`.
3. The client sends the result. The server only rewards it if the wait elapsed, the authorization and minigame proof are valid, the player is still in the same zone with pole and bait, and the level requirement is still met.
4. On success one bait is removed, one random item from the bait's `catch` list is added, and the bait's `xp` is added to the `fishing` skill. A failed minigame consumes nothing and ends the loop only when the minigame errors; a cancelled or failed attempt sends no proof and clears the pending catch.

Errors are shown as notices ("You have no usable bait for this pole.", "You do not meet the level requirement for this bait.", "You have left the fishing zone.").

Leaving a zone, or using the pole again, calls stop: the animation ends and a nearby `prop_fishing_rod_01` object is deleted.

### Timing by level

Wait time per catch (milliseconds), with `level` the bait's required level:

- Below the bait's level: not allowed.
- At or above `Config.fishing.maxLevel` (or if `maxLevel` is not above the bait level): `Config.fishing.minTime`.
- Otherwise it falls linearly from the bait's `baseTime` at its required level to `minTime` at `maxLevel`, never below `minTime`.

With the defaults `minTime` is 4000, so the `worm` (`baseTime` 1000, lower than `minTime`) always takes 4000 ms.

Players without a skill record are treated as level 1.

### Default poles and baits

| Pole | Bait | Level | Base time | XP | Catch |
| --- | --- | --- | --- | --- | --- |
| `fishing_pole` | `worm` | 0 | 1000 | 8 | flounder, reddrum, tuna |
| `fishing_pole` | `plug_bait` | 15 | 12000 | 16 | steelhead, blue_fish, halibut |
| `fishing_pole` | `soft_plastic_bait` | 30 | 12000 | 24 | catfish, white_bass, salmon |
| `fishing_pole` | `spinner_bait` | 45 | 12000 | 32 | bass, trout |
| `magnet_pole` | `magnet_2lb` | 15 | 12000 | 16 | rusty_usb, rusty_motherboard, rusty_scanner, rusty_antenna, copper_pipe, rusty_scrap_metal, rusty_pistol |
| `magnet_pole` | `magnet_5lb` | 30 | 12000 | 32 | rusty_sign, rusty_chain, rusty_tire, rusty_box |
| `magnet_pole` | `magnet_10lb` | 45 | 12000 | 48 | rusty_shotgun, rusty_ak, rusty_bike, rusty_wheelchair |
| `magnet_pole` | `magnet_20lb` | 60 | 12000 | 64 | closed_safe |

All catches in a bait's list are equally likely.

### Fishing Shop

A ped at each `Config.Shop.locations` entry (default: Paleto Bay) has a "Open Fishing Shop" target option. The app lists items from `Config.Shop.items` whose `level` the player has reached, with "In Stock" and price text. Buying takes an amount, charges cash, and adds the items. If the inventory cannot take them the cash is refunded. The server checks distance (5.0), level, and rejects an amount above the item's `amount`.

The `amount` is a per-purchase cap only: stock is never reduced.

### Fish Buyer

A ped at each `Config.Locations.buyer.locations` entry (default: Del Perro pier) has an "Open Buyer Menu" option. The app lists only the configured items the player currently owns. Selling removes the amount and pays `price * amount` in cash. Without any sellable items the player gets "You do not have any items to sell."

### Refine spot

A 2x2x2 box target zone at each `Config.Locations.breakdown.locations` entry (default: Davis) with an "Open Refine Menu" option. The app lists the salvage items the player owns. Refining runs a 5 second cancellable progress bar, then the server removes one item and gives one batch of random materials per `rank` of that item: each batch is a random entry from `receiveItems` in a random amount between `receiveAmounts.min` and `max`. Without salvage the player gets "You do not have any items to refine."

Default ranks: rank 1 for the `magnet_2lb` catches, rank 2 for the `magnet_5lb` catches, rank 3 for the `magnet_10lb` catches, rank 4 for `closed_safe`.
