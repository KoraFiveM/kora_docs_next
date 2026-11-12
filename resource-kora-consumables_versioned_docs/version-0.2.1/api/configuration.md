---
title: "Configuration"
sidebar_position: 4
---


# Configuration

All options live in the global `Config` table, loaded on both client and server. `shared/deafaults.lua` ends with `Config = Kora.config.adopt(Config)`, Kora Lib's config bridge. Each realm builds its own copy of `Config.Consumables`, so keep the file identical on both sides. Changes require restarting the resource.

Namespace: `Config` · Source: `shared/Config.lua, shared/deafaults.lua`

## Config options (shared/Config.lua)

| Option | Type | Default | Meaning |
| --- | --- | --- | --- |
| Config.skipInvalidProps | boolean | true | A configured prop whose model is not a valid game model is skipped and the item is still used. `false` lets the progress bar raise the error (the client then reports a failed use). |
| Config.Debug | boolean | false | Prints a client line when a prop is skipped or a progress bar fails. |
| Config.DrunkWalk | boolean | true | Alcohol also sets a drunk movement clipset for as long as the buzzed effect lasts. Only an explicit `false` disables it. |
| Config.DrunkWalkClipset | string | 'move_m@drunk@verydrunk' | Movement clipset used for the drunk walk. If it does not load within 5 seconds the walk is skipped. |
| Config.DrunkNotify | boolean | true | Show a `Drunk` notification through `Kora.notify.send` when the buzzed effect starts. Only an explicit `false` disables it. |
| Config.allowMovement | boolean or table | true | `true`: the player can walk while using the item (animation flag gets `\| 48`, `disable.move` is turned off). `false`: movement is frozen. A table keyed by class (`food`, `drink`, `smoke`, `liquor`) sets it per class; classes left out count as true. A per-item `allowMovement` wins. |
| Config.propHand | string or table | &#123; drink = 'left', food = 'left', liquor = 'right' &#125; | `'left'` or `'right'`, or a table per class. Chooses which hand's bone, offset and rotation defaults the prop uses. A class left out uses its own default hand. |
| Config.propBone | number, table or nil | nil | Bone id (for example 18905) or a table per class, applied on top of the chosen hand. `nil` keeps the hand's bone. |
| Config.applyStatusOn | 'complete' \| 'start' | 'complete' | Set in `shared/deafaults.lua` through `Kora.config.enum` (live, shown as `Apply effects when`). `'complete'`: item consumed and status applied only after the bar finishes; a cancelled use consumes nothing. `'start'`: both happen before the animation and cancelling does not undo them. |
| Config.Consumables | table | see below | Item definitions grouped by class: `drink`, `food`, `smoke`, `liquor`. |

## Item fields (Config.Consumables.&lt;class>.&lt;item>)

Every field is optional; an item may be `{}`. Missing `label`, `duration`, `anim`, `prop`, `disable`, `status` and `effects` are filled from the class defaults by `ApplyConsumableDefaults`. A field you set replaces the default entirely (tables are not merged), except `prop` (see below). A `?` after a name means the option is optional.

| Option | Type | Description |
| --- | --- | --- |
| `label?` | string | Progress bar label. Default is the class label plus the shared item label, for example `Drinking Beer`. |
| `duration?` | number | Progress duration in milliseconds. Default 4000 (the progress callback falls back to 1000 if the field is missing). On the server it is also the minimum time a use must take. |
| `anim?` | table | `{ dict, clip, flag? }`. Class default animation if omitted. `flag` is OR-ed with 48 when movement is allowed. |
| `prop?` | table | `{ model?, bone?, offset?, rotation? }`. Missing parts are inherited from the class default for the chosen hand (and `Config.propBone`). A prop table that has a `coords` field is passed to the progress bar as is. If the field is nil the class default prop is used (food, drink and liquor have one; smoke and custom have none). |
| `disable?` | table | `{ move, combat, vehicle }` booleans. `vehicle` is also accepted as `car`. Default is all true for every class. |
| `disableMovement?` | boolean or table | Legacy alias read by the client when `disable` is nil. Because `ApplyConsumableDefaults` fills `disable` at load, it has no effect on items that go through the defaults. |
| `allowMovement?` | boolean | Per-item override of `Config.allowMovement`. |
| `status?` | table | Keys `hunger`, `thirst`, `stress`, `health`, `armor`, `drunk`, `high` with numeric deltas (negative reduces). Applied with min 0, max 100. |
| `effects?` | table | `{ visual, duration? }`. `visual` is `'buzzed'`, `'alien'`, `'coke'`, `'crack'`, `'meth'`, `'trevor'` or `'none'`. Duration defaults to 15000 ms. |
| `event?` | string | Client event name fired on the player after a completed use, with the item name as the only argument. |
| `keep?` | boolean | When true the item is not removed on use (only when the stack has no `info.uses`). |
| `useWhileDead?` | boolean | Passed to the progress bar. Default false. |
| `canCancel?` | boolean | Passed to the progress bar. Default true (anything but an explicit `false`). |
| `emote?` | any | Passed unchanged to `Kora.progressbar.start`. |

## Class defaults

`drink`: 4000 ms, `mp_player_intdrink` `loop_bottle`, prop `prop_ld_flow_bottle`, thirst +20. `food`: 4000 ms, `mp_player_inteat@burger` `mp_player_int_eat_burger` (flag 49), prop `prop_cs_burger_01`, hunger +20. `smoke`: 4000 ms, `mp_player_int_uppersmoke` `mp_player_int_smoke`, stress -10, health -5, `alien` visual 15 s, no prop. `liquor`: 4000 ms, coffee `idle_c` animation, prop `prop_cs_beer_bot_01` in the right hand, thirst +10, `buzzed` visual 15 s. `custom`: 4000 ms and the movement block only.

## Shipped item list

drink: `water`, `coffee`, `water_bottle`, `soda`. food: `sandwich`, `chips`, `egg_sandwich`, `hot_dog`, `bread`, `chocolate_bar`. smoke: `cigarette` (visual `none`), `joint`, `ak47_joint`, `amnesia_joint`, `blue_dream_joint`, `og_kush_joint`, `purple_haze_joint`, `skunk_joint`. liquor: `ambeer`, `beer`, `beer_dusche`, `beer_logger`, `beer_pisswaser`, `beer_pisswaser2`, `beer_pisswaser3`, `beer_pisswaser4`, `whiskey`, `vodka`, `wine`.

## Not configurable

The 250 ms tolerance on the finish check, the 5000 ms sync cooldown, the 5 s clipset load timeout, the buzzed timecycle (`drug_drive_blend01`, strength 0.6) and camera shake (`DRUNK_SHAKE`, 0.6) are constants in the source.

## Limits and related APIs

Adding an item to `Config.Consumables` only makes an existing shared item useable. It does not create the item, its image or its weight.

## Source files and timing

The configuration is in [`shared/Config.lua`](https://github.com/KoraFiveM/kora_consumables/blob/dev/shared/Config.lua). Class defaults are in [`shared/deafaults.lua`](https://github.com/KoraFiveM/kora_consumables/blob/dev/shared/deafaults.lua). Both files are shared, so the client and server use the same values. After the defaults are applied, the table is registered with kora_lib's config system through `Kora.config.adopt(Config)`.

`propHand` and `propBone` are read once at startup, when the class defaults are applied to each item.

## Additional field notes

- Setting `prop = false` on an item gives it no prop (only a missing `prop` takes the class default).
- If `disable.vehicle` is set, the client also copies it to `disable.car` for the progress bar. When movement is allowed, `disable.move` is cleared for that use.
- The server ignores a completion that arrives more than 250 ms before the item `duration`.

## Class defaults by class (table)

| Class | Label prefix | Animation | Prop (hand) | Status | Effects |
| --- | --- | --- | --- | --- | --- |
| `drink` | `Drinking ` | `mp_player_intdrink` / `loop_bottle` | `prop_ld_flow_bottle` (left) | thirst +20 | none |
| `food` | `Eating ` | `mp_player_inteat@burger` / `mp_player_int_eat_burger`, flag 49 | `prop_cs_burger_01` (left) | hunger +20 | none |
| `smoke` | `Smoking ` | `mp_player_int_uppersmoke` / `mp_player_int_smoke` | none | stress -10, health -5 | `alien`, 15000 ms |
| `liquor` | `Drinking ` | `amb@world_human_drinking@coffee@male@idle_a` / `idle_c` | `prop_cs_beer_bot_01` (right) | thirst +10 | `buzzed`, 15000 ms |
| `custom` | `Using ` | none | none | none | none |

All classes use `duration = 4000` and `disable = { move = true, combat = true, vehicle = true }`.

Default hand attachments:

| Class | Left hand (bone 60309) | Right hand (bone 28422) |
| --- | --- | --- |
| `drink`, `food` | offset 0,0,0, rotation 0,0,0 | offset 0,0,0, rotation 0,0,130 |
| `liquor` | offset -0.01,-0.01,-0.06, rotation 0,0,0 | offset 0.01,-0.01,-0.06, rotation 0,0,0 |

## Props

A `prop` table can contain:

| Field | Type | Description |
| --- | --- | --- |
| `model` | string | Prop model name. |
| `bone` | number | Ped bone ID. Setting it fixes the prop to this bone. |
| `offset` | table | `{ x, y, z }` in metres, in the bone's local space. |
| `rotation` | table | `{ x, y, z }` in degrees. |
| `coords` | any | If present, class defaults are not merged. The table is passed as the progress bar's single `prop` option instead of the `props` list. |

The prop is resolved in this order:

1. The class prop and the attachment for the hand chosen by `Config.propHand`.
2. `Config.propBone`, if set.
3. The fields set on the item itself.

If you set only `offset` or `rotation`, the prop stays on the selected hand's bone.

```lua
Config.Consumables.drink = {
    -- Default bottle, moved down slightly in the left palm.
    water = {prop = {offset = {x = 0.0, y = 0.0, z = -0.03}, rotation = {x = 0.0, y = 0.0, z = 0.0}}},
    -- Own animation and a cup fixed to the right hand bone.
    coffee = {
        anim = {dict = "amb@world_human_drinking@coffee@male@idle_a", clip = "idle_c"},
        prop = {model = "p_amb_coffeecup_01", bone = 28422,
            offset = {x = 0.0, y = 0.0, z = 0.0}, rotation = {x = 0.0, y = 0.0, z = 130.0}},
    },
}
```

## Examples

Make a food item lower stress and disable walking only for smoking and liquor:

```lua
Config.allowMovement = { smoke = false, liquor = false }

Config.Consumables.food.donut = {
    prop = {model = "prop_choc_ego"}, -- inherits the food class hand, bone and offset
    status = {hunger = 15, stress = -5},
}
```

Keep a reusable item and run a client event after each use:

```lua
Config.Consumables.drink.flask = {
    keep = true,
    duration = 2500,
    event = 'myresource:client:flaskUsed',
}
```

The item name used as the key, such as `donut` or `flask` above, must exist as a shared item. Otherwise, players cannot hold or use it.
