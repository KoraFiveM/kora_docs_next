---
title: "Configuration"
sidebar_position: 2
---


# Configuration

A single `Config` table loaded on both sides (via `shared_scripts`). There is no database-backed or in-game editor; changes require a resource restart.

Namespace: `Config` · Source: `shared/config.lua`

## Fields

Every field below is read from the global `Config` table. Defaults are listed under Defaults and details.

| Option | Type | Description |
| --- | --- | --- |
| `Config.npcIgnoreTempEvents` | boolean | Makes every spawned shop and buyer NPC ped ignore combat/flee temp events (default `true`, `shared/config.lua:4`). |
| `Config.fishing.maxLevel` | integer | Fishing level at which catch time bottoms out at `minTime` for every bait. |
| `Config.fishing.minTime` | integer (ms) | Floor for catch duration regardless of level. |
| `Config.poles` | table | Keyed by pole item name (`fishing_pole`, `magnet_pole`). Each has a `baits` table keyed by bait item name, with `level` (min fishing level to use it), `baseTime` (ms catch time at that level), `xp` (reward on catch) and `catch` (list of item names the bait can produce). |
| `Config.Locations.buyer` | table | `items` (keyed list of `{ item, price }` sellable to the buyer) and `locations` (list of `{ coords, model, blip }` peds). |
| `Config.Locations.breakdown` | table | `items` (keyed list of `{ item, rank }` salvage that can be refined — `rank` is how many random material rolls it yields), `locations` (list of `{ coords, blip }` box zones), `receiveItems` (pool of material item names) and `receiveAmounts` (`{ min, max }` per roll). |
| `Config.Shop` | table | `blipData`, `locations` (list of `{ coords, model, blip }` peds) and `items` (list of `{ name, amount, price, level? }` purchasable gear; `amount` is shown as "In Stock" and acts as a per-purchase cap: the server rejects a larger amount (`server/shops.lua:18`) but never deducts stock). |
| `Config.zones` | table | List of fishing polygons: `zone = 'poly'`, `points` (vector3 list), `thickness` (height padding), `poles` (subset of `Config.poles` usable here) and an optional `blip`. |

## Functions

The configuration module has no functions. Key fields are listed in the Fields table above.

## Limits and related APIs

All of these are read directly as globals (`Config.xxx`), not through an accessor function, so any resource sharing the same Lua state convention could in principle read them — but kora_fishing exposes no export to do so from another resource.

## Defaults and details

Defaults and field details derived from `shared/config.lua` and the server and client scripts.


All options are in `shared/config.lua` (a shared script, so clients see the whole table). Restart the resource after editing.

### Top level

| Option | Default | Description |
| --- | --- | --- |
| `Config.npcIgnoreTempEvents` | `true` | Shop and buyer peds ignore temporary events, do not flee or fight and cannot ragdoll |

### Config.fishing

| Option | Default | Description |
| --- | --- | --- |
| `maxLevel` | `99` | Level at which the wait time reaches `minTime`; also shown as "Max Level" in the catalog |
| `minTime` | `4000` | Shortest wait per catch in milliseconds |

### Config.poles

Table keyed by pole item name, each with `baits` keyed by bait item name:

| Field | Description |
| --- | --- |
| `level` | Required fishing level (default 1 if missing) |
| `baseTime` | Wait in ms at the required level (default 12000 if missing) |
| `xp` | Fishing XP added per successful catch |
| `catch` | List of item names; one is chosen at random |

Poles and baits used in a zone are the ones in that zone's `poles` table. The default zones all use `dockPoles`, which points at `Config.poles.fishing_pole` and `Config.poles.magnet_pole`. The `/fishcatalog` command lists `Config.poles` directly.

### Config.zones

A list of zones. Index order matters: the server returns the first zone that contains the player.

| Field | Description |
| --- | --- |
| `zone` | `'poly'` (only used as a label; all zones are polygons) |
| `points` | List of `vector3` polygon corners |
| `thickness` | Height padding in metres added above the highest and below the lowest point |
| `poles` | Table of allowed poles (see above) |
| `blip` | Optional `{ blipData = { title, color, sprite, scale, display, shortRange, category } }`; the blip is placed at the first point |

Default zones, in order: 1 Sandy Bay Dock, 2 and 3 unnamed Del Perro pier zones, 4 Pier Lower Dock, 5 an unnamed copy of zone 2's polygon with thickness 3.5 (never matched by the server, because zone 2 contains it and comes first), 6 Highway Dock, 7 Right Side Dock (Paleto) and 8 "New Area".

### Config.Locations.buyer

| Field | Description |
| --- | --- |
| `items` | List of `{ item, price }`; price is paid in cash per item |
| `locations` | List of `{ coords = vector4, model, blip }`; `blip` is `{ label, sprite, color, scale, shortRange }` |

### Config.Locations.breakdown

| Field | Description |
| --- | --- |
| `items` | List of `{ item, rank }`; `rank` is the number of material batches given |
| `locations` | List of `{ coords = vector3, blip }` |
| `receiveItems` | Item names that batches are drawn from (default rubber, metalscrap, plastic, iron, copper, glass, steel) |
| `receiveAmounts` | `{ min, max }` amount per batch (default 4 to 10) |

### Config.Shop

| Field | Description |
| --- | --- |
| `blipData` | Blip settings (`title`, `color`, `sprite`, `scale`, `display`, `shortRange`, `category`) shared by all shop locations |
| `locations` | List of `{ coords = vector4, model, blip }`; the blip is created when `blip` is truthy |
| `items` | List of `{ name, amount, price, level }`: item, per-purchase cap, cash price each, and fishing level required |

Notes:

- The server treats the position of an entry in `buyer.items`, `breakdown.items` and `Shop.items` as its identifier. Do not reorder these lists while players have menus open.
- Prices are always cash. There is no bank option.
- Shop and buyer ped heading comes from the `w` component of the buyer location, and is fixed at `20.0` for shop peds regardless of the configured heading.
