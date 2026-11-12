---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Fishing lets players fish poly-zone docks with rods and bait, sell the catch to an NPC buyer, break down salvage items for crafting materials, and buy gear from a shop — all built on Kora NUI apps, Kora zones and the Kora minigame/proof system. It is server-authoritative: sales, purchases and catches are all re-validated on the server.

## Install Kora Fishing

1. **Add the folder** — Place `kora_fishing` in your resources directory.

2. **Start its dependencies first** — The manifest declares `dependency { kora_core, kora_skills, kora_inventory }`, plus the shared load of `@kora_lib/init.lua` and `@kora_core/init.lua`. `kora_inventory` must be started before `kora_fishing`: `client/sales.lua` and `client/breakdown.lua` call `exports['qb-inventory']:HasItem` while building their NUI menus at resource-load time, and that export only exists once `kora_inventory` (which also `provide`s the legacy `qb-inventory` name) has started. The call is wrapped in `pcall` (`client/sales.lua:3`, `client/breakdown.lua:3`), so if `kora_inventory` is not yet running the menus are built as if the player held nothing instead of raising an error.

   ```lua title="fxmanifest.lua" {4,5}
   dependency {
       'kora_core',
       'kora_skills',
       -- client/sales.lua and client/breakdown.lua call exports['qb-inventory']:HasItem at load;
       -- kora_inventory registers that export, so it must start first.
       'kora_inventory'
   }
   ```

3. **Also needs kora_target and kora_skills running** — Buyer, shop and breakdown NPCs are given target options via `exports.kora_target:addEntity`/`addBoxZone`, and fishing level/XP is tracked through `exports.kora_skills:getRep`/`addRep` under the `fishing` skill key. Both must be ensured for the resource to work, even though only `kora_core`, `kora_skills` and `kora_inventory` are declared as manifest dependencies.

4. **Ensure it** — Add it to `server.cfg` after its dependencies:

   ```bash title="server.cfg"
   ensure kora_core
   ensure kora_skills
   ensure kora_inventory
   ensure kora_target
   ensure kora_fishing
   ```

5. **Review shared/config.lua** — Fishing zones, poles, baits, the buyer menu, the breakdown (refine) menu and the gear shop are all defined in `shared/config.lua`. Edit the `Config` table directly — there is no in-game config UI.

## Legacy compatibility

kora_fishing registers no exports (see [Events](./events.md) for its callbacks and net events). Event and callback names use the `kora_fishing:*` prefix.

## Requirements

Declared as `dependency` in `fxmanifest.lua`:

| Resource | Used for |
| --- | --- |
| `kora_core` | Shared items (`getShared`), usable items (`createUseable`), money (`addMoney`, `removeMoney`) |
| `kora_skills` | The `fishing` skill: `getRep` (level) and `addRep` (XP) |
| `kora_inventory` | `addItem`, `removeItem` exports and the `qb-inventory` compatibility export (`HasItem`, `RemoveItem`, `AddItem`) |

Used but not declared as a dependency:

| Resource | Used for |
| --- | --- |
| `kora_lib` | Loaded through `@kora_lib/init.lua` in `shared_scripts`: NUI apps, callbacks, minigames (`Kora.minigames`), zones, blips, notifications, progress bar, entities, distance checks |
| `kora_target` | `addEntity` for the shop and buyer peds, `addBoxZone` for the refine spot (client) |

## Setup checklist

1. Place the resource in your resources folder.
2. Ensure it after its dependencies in `server.cfg`:

   ```cfg
   ensure kora_lib
   ensure kora_core
   ensure kora_skills
   ensure kora_inventory
   ensure kora_target
   ensure kora_fishing
   ```

3. No SQL import is needed, the resource has no tables of its own (see [Database](./database.md)).
4. Every item the config names must exist in the `kora_core` shared items list, including the refine rewards. The fishing items are listed in [Items](./items.md). Item images are loaded from `nui://kora_inventory/images/`; copies are also in this resource's `images/` folder.
5. Make sure `kora_lib` has a `fishing` minigame configured, and `kora_skills` has the `fishing` skill (it ships in its default `skillOrder`).
6. Adjust [Configuration](./api/configuration.md).

## Testing

- `tests/run.sh` runs `tests/catches.lua` (catch authority, timing, proof binding, replay, client lifecycle, shop eligibility) and `tests/breakdown.lua` (refine app) with the system `lua`. `tests/breakdown.lua` reads `../kora_core/shared/items.lua`, so `kora_core` must be checked out next to this resource.
- `tests/checklist-jobs.feature` holds manual QA scenarios for `kora_qa` (registered with `qa_feature` in `fxmanifest.lua`).
