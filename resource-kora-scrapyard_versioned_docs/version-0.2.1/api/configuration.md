---
title: "Configuration"
sidebar_position: 2
---


# Configuration

Options live in the global `Config` table, loaded on both client and server, and passed through `Kora.config.adopt(Config)` on the last line. Restart the resource after editing.

Namespace: `Config` · Source: `shared/config.lua`

## Config options (shared/config.lua)

| Option | Type | Default | Meaning |
| --- | --- | --- | --- |
| Config.Locations | list of `{ deliver, list }` | one entry at `vector3(2351.5, 3132.96, 48.2)` (exact named area unconfirmed — unclear) | Scrapyards. `deliver.coords` (vector3) and `deliver.size` (vector4: x, y, z size and w rotation) define the bay. `list.coords` (vector3) places the blip; the attendant ped spawns at the same x/y but 1 metre lower on z. `list.size.w` is the ped heading. |
| Config.Items | string[] | metalscrap, plastic, copper, iron, aluminum, steel, glass | Pool for the 2 to 4 random rewards. Names must exist in your item registry. |
| Config.VehicleCount | integer | 40 | Target size of the wanted list; capped at `#Config.Vehicles`. |
| Config.UseTargetForDemolish | boolean | true | Use a Kora Target zone for the bay instead of the Kora Lib interaction zone. |
| Config.Debug | boolean | false | Print client diagnostics for failed list actions to the F8 console. |
| Config.CurrentVehicles | string[] | &#123;&#125; | Runtime list; do not set it in config. The server overwrites it each rebuild. |
| Config.vehicleList.showSpawnCode | boolean | false | Show `Spawn code: <model>` under each name in the list. |
| Config.vehicleList.imageFit | string | 'contain' | `'contain'`, `'cover'`, `'fill'`, `'none'` or `'scale-down'`. Any other value falls back to `'contain'`. |
| Config.vehicleList.imageAspect | string | 'wide' | `'square'` or `'wide'`. Any other value falls back to `'wide'`. |
| Config.Vehicles | string[] | 69 spawn names, no duplicates | Pool the wanted list is drawn from. |

## How it works

The server reads `Config.Locations`, `Config.Items`, `Config.Vehicles`, `Config.VehicleCount` and writes `Config.CurrentVehicles`. The client reads `Config.Locations`, `Config.UseTargetForDemolish`, `Config.Debug`, `Config.vehicleList` and keeps its own copy of `Config.CurrentVehicles`.

## Not configurable

Reward counts and amounts (2 to 4 items, 25 to 45 each, 1 in 8 chance of 10 to 20 `rubber`), the 60 minute list rotation, the 60 second job expiry, the 5.0 distance check, the 28 to 37 second progress bar, blip sprite 380 and the attendant model are constants in the source.

## Locales

Text comes from `locales/*.lua` (en, es, de, fr, nl, pt-br, tr) through `Kora.lang`. Many server messages and the success toast are hard-coded English strings and are not localized. `locales/en.lua` also defines `error.demolish_vehicle`, `text.disassemble_vehicle_target` and an `email` table (sender/subject/message); none of these are read anywhere in `client/` or `server/` in this version.

## Limits and related APIs

`Config.Vehicles` entries must be valid spawn names whose model resolves in `Kora.lookup.get('vehicle', hash)` on the client, or the player gets `This Vehicle Cannot Be Scrapped.`. Do not use a model that the vehicle-ownership system treats as player-owned.

## Location entries

Each entry of `Config.Locations` is addressed by its numeric index, which the client sends to the server.

```lua title="shared/config.lua"
{
    deliver = { coords = vector3(2351.5, 3132.96, 48.2), size = vector4(6.0, 4.0, 3.0, 270.0) },
    list    = { coords = vector3(2403.51, 3127.95, 48.15), size = vector4(6.0, 4.0, 3.0, 270.0) },
}
```

- `deliver.coords` / `deliver.size` - the delivery bay box zone. `size` is x, y, z extents plus heading in `w`. A `rotation` or `heading` field on `deliver` overrides `size.w`. The server requires the player to be within 5.0 m of `deliver.coords`.
- `list.coords` - where the attendant ped and the map blip are created.
- `list.size` - only the heading (`w`) is used, for the ped.

## Extra notes on options

- `Config.UseTargetForDemolish`: when `false`, or when `kora_target` is not started, a `Kora.interact` box zone is used instead.
- `Config.vehicleList.imageAspect`: `'wide'` is 16:9. It requires a `kora_lib` build that supports list `imageAspect`; older builds reject the app (see [Troubleshooting](../troubleshooting.md)).

## Locale keys used by the code

`text.scrapyard`, `text.demolish_vehicle`, `text.vehicle_list`, `text.vehicle_list_description`, `text.vehicle_list_footer`, `text.vehicle_item_description`, `text.vehicle_details`, `text.vehicle_not_listed`, `text.no_vehicles`, `text.email_list_target`, `error.smash_own`, `error.cannot_scrap`, `error.not_driver`, `error.no_vehicle`, `error.busy`, `error.canceled`. Where the client reads a key with a fallback, the English fallback text is used if the key is missing. `text.vehicle_list_target` is also defined in `locales/en.lua` but not read by any script. Several notifications are hard-coded English; see [Troubleshooting](../troubleshooting.md).
