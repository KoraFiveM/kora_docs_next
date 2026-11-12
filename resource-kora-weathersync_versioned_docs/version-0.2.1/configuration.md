---
title: Configuration
sidebar_position: 6
---

# Configuration

All options live in `shared/config.lua`. The file is loaded on server and client. At the end it registers the config with `kora_lib` (`Kora.config.adopt`) and exposes `Config.startingWeather` as an enum option limited to `Config.weatherTypes`.

## World state

| Option | Default | Description |
| --- | --- | --- |
| `Config.startingWeather` | `'EXTRASUNNY'` | Weather at resource start. Must be in `Config.weatherTypes` or the server asserts on start. |
| `Config.startingTime` | `{ hour = 12, minute = 0 }` | Clock at start. Hour must be an integer 0-23 and minute 0-59, otherwise the server asserts. |
| `Config.realSecondsPerGameMinute` | `8` | Real seconds per simulated minute. Must be greater than zero. |
| `Config.freezeTime` | `false` | Start with the clock paused. |
| `Config.dynamicWeather` | `true` | Start with dynamic weather on. It is forced off at start when the interval is `0`. |
| `Config.weatherChangeEveryMinutes` | `10` | Real minutes between automatic weather changes. `0` disables the scheduler. |
| `Config.blackout` | `false` | Start with the blackout active. |
| `Config.blackoutAffectsVehicles` | `false` | When the blackout is active, also turn off vehicle lights. Published in the state snapshot. |
| `Config.weatherTransitionSeconds` | `15.0` | Client-side blend time between weather types. |

## Weather catalogue

`Config.weatherTypes` lists the valid weather names (case-insensitive when set through commands or exports; stored upper-case): `EXTRASUNNY`, `CLEAR`, `NEUTRAL`, `SMOG`, `FOGGY`, `OVERCAST`, `CLOUDS`, `CLEARING`, `RAIN`, `THUNDER`, `SNOW`, `BLIZZARD`, `SNOWLIGHT`, `XMAS`, `HALLOWEEN`. The `/weather` command offers these as argument values.

## Dynamic weather transitions

`Config.weatherTransitions` maps a weather type to the list of types that may follow it. The next type is chosen randomly from that list. A weather type with no entry falls back to `CLEAR`.

## Weather effects

`Config.weatherEffects` maps a weather type to client-side effects applied while that weather is active. Weather types without an entry use no rain, no snow, normal gravity and no trails.

| Key | Range | Description |
| --- | --- | --- |
| `rainLevel` | 0.0-1.0 | Rain intensity. |
| `snowLevel` | 0.0-1.0 | Snow intensity. |
| `gravityLevel` | 0-3 | 0 normal, 1 low, 2 very low, 3 zero gravity. Fractions are floored. |
| `snowTrails` | boolean | Forces vehicle trails and ped footstep tracks. |

Values are validated once when the client loads. A value that is not a finite number prints a console warning and falls back to the default; valid numbers are clamped to the range. Shipped defaults: `RAIN` rain 0.35; `THUNDER` rain 0.70; `SNOW` snow 0.45 with trails; `SNOWLIGHT` snow 0.25 with trails; `BLIZZARD` snow 1.00, gravity 1 and trails; `XMAS` snow 0.70 with trails. `BLIZZARD` ships with low gravity as an event-style effect; set its `gravityLevel` to `0` for ordinary snow.

## Commands and permissions

| Option | Default | Description |
| --- | --- | --- |
| `Config.command.permission` | `'admin'` | Level required for every command. |
| `Config.command.levels` | `god, admin, mod, user` | Ranked levels understood by the permission check. |
| `Config.command.permissionPrefix` | `'kora_core'` | ACE prefix, giving `kora_core.admin` by default. |
| `Config.timePresets` | morning 09:00, noon 12:00, evening 18:00, night 23:00 | Each key becomes a command of the same name and a name accepted by `/time`. |

See [Commands](./commands.md).
