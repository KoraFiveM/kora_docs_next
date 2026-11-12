---
title: Configuration
sidebar_position: 3
---

# Configuration

All configuration is in [`shared/Config.lua`](https://github.com/KoraFiveM/kora_consumables/blob/dev/shared/Config.lua). Class defaults are in [`shared/deafaults.lua`](https://github.com/KoraFiveM/kora_consumables/blob/dev/shared/deafaults.lua). Both files are shared, so the client and server use the same values. After the defaults are applied, the table is registered with kora_lib's config system through `Kora.config.adopt(Config)`.

## General options

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `Config.applyStatusOn` | enum `'complete'` or `'start'` | `'complete'` | When the item is consumed and its status applied. `'complete'` (shown in the config UI as "Finished") does this after the progress bar finishes; cancelling consumes nothing. `'start'` does it immediately and cancelling does not undo it. This option is not in `Config.lua`. It is declared in `deafaults.lua` as a live kora_lib config enum, so it can be changed at runtime through the kora_lib config UI. |
| `Config.skipInvalidProps` | boolean | `true` | If the prop model is not a valid game model, the prop is skipped and the item can still be used. If `false`, the invalid prop is passed to the progress bar, which then fails. |
| `Config.Debug` | boolean | `false` | Prints a client console line when a prop is skipped or a progress bar fails. |
| `Config.DrunkWalk` | boolean | `true` | Adds a drunk walk style while the `buzzed` effect lasts. |
| `Config.DrunkWalkClipset` | string | `'move_m@drunk@verydrunk'` | Movement clipset used for the drunk walk. |
| `Config.DrunkNotify` | boolean | `true` | Shows a "Drunk" notification when the `buzzed` effect starts. |
| `Config.allowMovement` | boolean or table | `true` | Lets the player walk while consuming. The animation is played on the upper body and only movement is unlocked. Can be a table per class, for example `{ food = true, drink = true, smoke = false, liquor = false }`; classes left out count as `true`. Per-item `allowMovement` overrides it. |
| `Config.propHand` | string or table | `{ drink = 'left', food = 'left', liquor = 'right' }` | Hand the class prop is attached to: `'left'` or `'right'`. As a table, the setting is per class; missing classes use their class default. Each hand has its own bone, offset and rotation in the class defaults. |
| `Config.propBone` | number, table or nil | `nil` | Optional bone ID override applied on top of the selected hand, for example `18905`. As a table, the setting is per class. `nil` keeps the hand's bone. |
| `Config.Consumables` | table | see [Items](./items.md) | Consumable items, grouped by class: `Config.Consumables.<class>.<item> = { ... }`. Classes are `drink`, `food`, `smoke` and `liquor`. Items added with `AddCustom` use `custom`. |

`propHand` and `propBone` are read once at startup, when the class defaults are applied to each item.

## Per-item fields

Each entry in `Config.Consumables.<class>` is keyed by the item name, which must match a shared item. An empty table `{}` uses all class defaults. If you set one of the fields below, it replaces the class default for that field. `prop` is the exception: it is merged with the class prop.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | string | class prefix + shared item label | Progress bar label. |
| `duration` | number (ms) | `4000` | Progress bar duration. The server ignores a completion that arrives more than 250 ms early. |
| `anim` | table | class default | `{ dict = '...', clip = '...', flag = n }` passed to the progress bar. |
| `prop` | table or `false` | class default | Hand prop. See [Props](#props). Set it to `false` for no prop. |
| `disable` | table | `{ move = true, combat = true, vehicle = true }` | Progress bar control restrictions. If movement is allowed, `move` is cleared for that use, and `vehicle` is copied to `car`. |
| `status` | table | class default | Metadata changes applied on use. Keys: `hunger`, `thirst`, `stress`, `health`, `armor`, `drunk`, `high`. Values can be negative, and results are clamped to 0-100. |
| `effects` | table | class default | `{ visual = '...', duration = ms }`. `visual` is one of `none`, `buzzed`, `alien`, `coke`, `crack`, `meth` or `trevor`. `duration` defaults to 15000. |
| `allowMovement` | boolean | unset | Per-item override of `Config.allowMovement`. |
| `canCancel` | boolean | `true` | Whether the progress bar can be cancelled. |
| `useWhileDead` | boolean | `false` | Passed to the progress bar. |
| `emote` | any | unset | Passed as-is to `Kora.progressbar.start`'s `emote` option. |
| `keep` | boolean | unset | If `true`, the item is not removed on use, unless it has `info.uses`. |
| `event` | string | unset | Client event the server sends to the player after a completed use. The argument is the item name. |

The client also reads `disableMovement`, but only if `disable` is `nil`. Class defaults always set `disable`, so `disableMovement` has no effect for configured items.

### Class defaults

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
