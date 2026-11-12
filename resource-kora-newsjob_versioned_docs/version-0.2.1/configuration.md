---
title: Configuration
sidebar_position: 6
---

# Configuration

All options are in `config.lua`, a shared script. The table is passed to `Kora.config.adopt` when `kora_lib` provides it.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `Config.UseableItems` | `true` | Not read anywhere in the code. The usable items are always registered. |
| `Config.Locations.main` | `vector4(-597.89, -929.95, 24.0, 271.5)` | Not read anywhere in the code. |
| `Config.Locations.outside` | `vector4(-598.25, -929.86, 23.86, 86.5)` | Outside door zone ("Enter") and the arrival point when leaving. If unset, no door zone is created at that point. |
| `Config.Locations.inside` | `vector4(-77.46, -833.77, 243.38, 67.5)` | Inside door zone ("Go outside") and the arrival point when entering. |
| `Config.Locations.vehicle.coords` | `vector4(-552.24, -925.61, 23.86, 242.5)` | Garage zone, blip, vehicle spawn point and heading, and the 5.0 unit proximity check. |
| `Config.Locations.vehicle.vehicles` | one `rumpo` | Van list, see below. |
| `Config.Locations.heli.coords` | `vector4(-583.08, -930.55, 36.83, 89.26)` | Helicopter zone and spawn point. |
| `Config.Locations.heli.vehicles` | one `conada` | Helicopter list. |
| `Config.Locations.shop` | `vector4(-595.4, -929.9, 23.86, 90.0)` | Equipment counter zone. |
| `Config.VehicleItems` | camera, mic, boom mic | Items placed in the trunk of garage vans. |

## Vehicle entries

Each entry in `vehicles` is a table:

| Field | Meaning |
| --- | --- |
| `name` | Vehicle model name spawned by the server. |
| `label` | Name shown in the garage app. |
| `modLivery` | Livery index applied after spawn. If the vehicle reports a negative livery count, `modLivery - 1` is used. |

```lua
vehicles = {
    { name = 'rumpo', label = 'Rumpo', modLivery = 2 },
},
```

The list index is what the client sends, so entries should stay a plain list.

## Vehicle items

Each entry in `Config.VehicleItems` has `name`, `amount` and `info`. They are added to the stash `trunk-<plate>` in list order, using the list position as the slot.

```lua
Config.VehicleItems = {
    { name = 'newscam', amount = 1, info = {} },
}
```

Only vehicles spawned from `Config.Locations.vehicle` trigger the item request on the client (not helicopters).

## Other hard-coded values

- Zone sizes: garage and helicopter zones are 4x4x4, the counter 2x2x2, the door zones 1.5x1.5x1.5.
- Plates are `WZNW` plus four random digits.
- Spawned vehicles are filled with 100.0 fuel.
- Job name is always `news`.
- Camera overlay text ("WEAZEL NEWS", "NEWS CAM 01") and the counter labels are not localised.

## Locales

`locales/` has `en`, `de`, `es`, `fr`, `nl` and `pt-br`. The keys used by the code are `text.enter`, `text.go_outside`, `text.vehicle`, `text.vehicles`, `text.heli` and `text.helicopters`.
