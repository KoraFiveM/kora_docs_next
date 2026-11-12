---
title: Items
sidebar_position: 4
---

# Items

Every key in `Config.Consumables` is registered as a useable item. The item must also exist as a `kora_core` shared item, or players cannot hold it.

## Default consumables

The table below shows the values each item uses after class defaults are applied. Durations are 4000 ms for all of them.

### Drinks (`drink`)

| Item | Status | Prop | Notes |
| --- | --- | --- | --- |
| `water` | thirst +20 | `prop_ld_flow_bottle`, left hand, z offset -0.03 | |
| `coffee` | thirst +20 | `p_amb_coffeecup_01`, bone 28422 (right hand), rotation z 130 | Uses the `amb@world_human_drinking@coffee@male@idle_a` / `idle_c` animation. |
| `water_bottle` | thirst +40 | `prop_ld_flow_bottle`, left hand, z offset -0.03 | `kora_inventory` also has a built-in handler; this resource overrides it. |
| `soda` | thirst +25, stress -3 | `prop_ecola_can`, bone 28422, rotation z 130 | Coffee animation. |

### Food (`food`)

| Item | Status | Prop |
| --- | --- | --- |
| `sandwich` | hunger +20 | `prop_sandwich_01`, left hand, z offset -0.02 |
| `chips` | hunger +20 | `prop_cs_burger_01` (class default), left hand |
| `egg_sandwich` | hunger +20 | `prop_sandwich_01`, left hand, z offset -0.02 |
| `hot_dog` | hunger +20 | `prop_cs_hotdog_01`, left hand, z offset -0.02 |
| `bread` | hunger +20 | `prop_cs_burger_01` (class default), left hand, z offset -0.02 |
| `chocolate_bar` | hunger +15, stress -5 | `prop_choc_ego`, left hand, z offset -0.02 |

### Smokeables (`smoke`)

Smokeables have no prop. All of them use stress -10 and health -5.

| Item | Effect |
| --- | --- |
| `cigarette` | none (`visual = 'none'`) |
| `joint`, `ak47_joint`, `amnesia_joint`, `blue_dream_joint`, `og_kush_joint`, `purple_haze_joint`, `skunk_joint` | `alien`, 15 s |

### Liquor (`liquor`)

All liquor items use the class defaults: thirst +10, `prop_cs_beer_bot_01` in the right hand, and the `buzzed` effect for 15 s.

`ambeer`, `beer`, `beer_dusche`, `beer_logger`, `beer_pisswaser`, `beer_pisswaser2`, `beer_pisswaser3`, `beer_pisswaser4`, `whiskey`, `vodka`, `wine`

## Shared item definitions

`kora_core` already provides the shared item definitions for every default consumable except `cigarette`. Its upstream item list includes the beers, `chips`, `egg_sandwich` and `hot_dog`. When this resource starts, it registers `cigarette` if no other resource has defined it:

```lua
{
    name = 'cigarette', label = 'Cigarette', weight = 10, type = 'item', image = 'cigarette.png',
    unique = false, useable = true, shouldClose = true, description = 'A single cigarette.',
}
```

The repository does not include a `cigarette.png` image.

The repository also includes a QBCore-format item list and images. These files are outside the docs. The list also includes drug-processing items that this resource does not use:

- [items/items.md](https://github.com/KoraFiveM/kora_consumables/blob/dev/items/items.md)
- [items/images](https://github.com/KoraFiveM/kora_consumables/tree/dev/items/images)

## Adding an item

1. Make sure the item exists as a shared item in `kora_core` and set `useable = true`.
2. Add it to the matching class in `Config.Consumables` (see [Configuration](./configuration.md)):

   ```lua
   Config.Consumables.food.burger = {
       status = {hunger = 35},
   }
   ```

3. Restart the resource.

Another resource can add an item at runtime with the [exports](./exports.md) instead of editing the config.

## Limited uses

If an item instance has an `info.uses` number in its inventory metadata, each use lowers it by one. The item is removed only when it reaches 0. This resource does not set `uses`; another resource must give the item with that metadata.
