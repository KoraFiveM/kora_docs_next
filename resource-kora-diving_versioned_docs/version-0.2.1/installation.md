---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Diving lets players equip scuba gear, breathe a limited oxygen supply underwater, and collect coral from fixed sea-floor spawns to sell to an NPC. It has no commands and no public exports: everything runs through net events wired to Kora Core useable items and Kora Target.

## Install Kora Diving

1. **Add the folder** — Place `kora_diving` in your resources directory.

2. **Dependencies** — Kora Diving declares `dependency 'kora_lib'` and `dependency 'kora_core'` in its manifest, and calls `exports.kora_inventory` and `exports.kora_target` at runtime. Start `kora_lib`, `kora_core`, `kora_inventory` and `kora_target` before it.

3. **Register the items** — The resource expects two useable items to exist in your item definitions: `diving_gear` (equips/removes the suit) and `diving_fill` (refills oxygen). It registers their use-handlers itself via `exports.kora_core:createUseable`, but the items themselves must be defined wherever your item catalog lives (Kora Core / Kora Inventory).

4. **Start it** — Add this to `server.cfg` after its dependencies:

   ```bash title="server.cfg"
   ensure kora_lib
   ensure kora_core
   ensure kora_inventory
   ensure kora_target
   ensure kora_diving
   ```

## Config at a glance

- `Config.OxygenLevel` (default `200`) — starting oxygen units a full `diving_fill` item grants; the oxygen loop ticks this down by 1 per second underwater.
- `Config.model` (default `prop_coral_pillar_01`) — the prop model used for each visible coral pickup entity.
- `Config.RemoveDivingGear` (default `false`) — when `true`, the mask/tank props are deleted (instead of just unequipped) the moment oxygen hits 0 underwater.
- `Config.CoralLocations` — fixed table of `{ coords, PickedUp }` sea-floor spots where coral entities spawn.
- `Config.CoralTypes` — table of `{ item, min, max, price }` entries; each pickup grants one random type.
- `Config.SellLocations` — `{ coords, model }` entries where an NPC ped is spawned to buy coral.
- Config is adopted into Kora Lib via `Config = Kora.config.adopt(Config)` at the end of `shared/config.lua`, making it reachable through Kora Lib's shared config registry as well as the local `Config` global.

## Used but not declared

The code also calls the following resources, which the manifest does not list. Start them before `kora_diving`.

| Resource | Used for |
| --- | --- |
| `kora_inventory` | `AddItem`, `RemoveItem` and `GetItemCount` exports on the server. |
| `kora_target` | `addEntity` for the coral and buyer ped target options. |
| `InteractSound` | The client triggers `InteractSound_SV:PlayOnSource` for breathing sounds. Without it the sounds are silent. |

`kora_core` provides `createUseable` (usable items) and `addMoney` (cash payout).

## All items to register

Besides the two useable items above, register the two coral items (`dendrogyra_coral`, `antipatharia_coral`) in `kora_inventory`, see [Items](./items.md). Full option details are on the [Configuration](./configuration.md) page.

## Locales

`locales/**.lua` is shipped for several languages (ar, da, de, en, es, et, fr, is, it, nl, pt-br, tr). Language selection is handled by `kora_lib` through `Kora.lang`.

## Tests

`test/run.sh` runs offline Lua regression scripts (`test/server.lua`, `test/client.lua`) and `tests/checklist-activities.feature` holds kora_qa scenarios.
