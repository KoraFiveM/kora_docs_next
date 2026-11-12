---
title: "Commands"
sidebar_position: 4
---


# Commands

Every command is registered through `Kora.commands.add` and gated by `Kora.permissions.hasLevel(source, Config.command.permission, Config.command.levels, { prefix = Config.command.permissionPrefix })` — by default the `admin` level on the `kora_core.*` ACE ladder (`god`/`admin`/`mod`/`user`). The server console always passes. A failing check sends the `no_permission` reply ("You do not have permission for this command."); a passing command replies with a chat notification (the server triggers `kora_weathersync:client:notify`, which calls `Kora.notify.send` on the client), or a console `print` prefixed `[kora_weathersync]` when run from source 0.

## Built-in commands

### `/weather <type>`

Sets the synchronized weather to one of `Config.weatherTypes` and republishes state.

| Field | Details |
| --- | --- |
| Context | In-game or console · server command |
| Arguments | type — required, one of the configured weather values (autocompletes from `Config.weatherTypes`). |
| Access | Config.command.permission (default admin) on the kora_core.* ladder. |

**Example**

```text
/weather RAIN
```

**Result**

"Weather set to RAIN." or an error naming the unknown type.

### `/freezeweather [true|false]`

Toggles or explicitly sets whether the scheduled weather-transition timer runs (`WeatherSync.setDynamicWeather`). Omitting the argument flips the current value.

| Field | Details |
| --- | --- |
| Context | In-game or console · server command |
| Arguments | true\|false — optional. Accepts `true`/`false`, `1`/`0`, `on`/`off` (case-insensitive); anything else is rejected. |
| Access | Same as above. |

**Example**

```text
/freezeweather false
```

**Result**

"Dynamic weather disabled." or "Dynamic weather enabled."

### `/time <hour> [minute]`

Sets the synchronized clock. The first argument may instead be a preset name (`morning`, `noon`, `evening`, `night`, or any other key added to `Config.timePresets`), in which case the preset's hour/minute are used and a second argument is ignored.

| Field | Details |
| --- | --- |
| Context | In-game or console · server command |
| Arguments | hour — required: 0–23, or a preset name. minute? — optional: 0–59, defaults to 0 when omitted (ignored when a preset name is used). |
| Access | Same as above. |

**Example**

```text
/time 14 30
/time evening
```

**Result**

"Time set to 14:30." or a range error.

### `/freezetime [true|false]`

Toggles or sets whether the simulated clock advances (`WeatherSync.setTimeFrozen`). Omitting the argument flips the current value.

| Field | Details |
| --- | --- |
| Context | In-game or console · server command |
| Arguments | true\|false — optional, same accepted forms as /freezeweather. |
| Access | Same as above. |

**Example**

```text
/freezetime true
```

**Result**

"Time frozen." or "Time running."

### `/blackout [true|false]`

Toggles or sets the artificial-lights blackout (`WeatherSync.setBlackout`). Whether it also kills vehicle lights is controlled by `Config.blackoutAffectsVehicles`, not by this command. Omitting the argument flips the current value.

| Field | Details |
| --- | --- |
| Context | In-game or console · server command |
| Arguments | true\|false — optional, same accepted forms as /freezeweather. |
| Access | Same as above. |

**Example**

```text
/blackout true
```

**Result**

"Blackout enabled." or "Blackout disabled."

### `/morning, /noon, /evening, /night`

One command per entry in `Config.timePresets`, each setting the clock straight to that preset's hour/minute. The default config ships exactly these four (morning 09:00, noon 12:00, evening 18:00, night 23:00); adding a key to `Config.timePresets` adds a matching command automatically.

| Field | Details |
| --- | --- |
| Context | In-game or console · server command |
| Arguments | No arguments. |
| Access | Same as above. |

**Example**

```text
/evening
```

**Result**

"Time set to 18:00."

## Legacy qb-weathersync events

For code written against qb-weathersync, server-only net events exist for the same actions: `qb-weathersync:server:setWeather`, `setTime`, `toggleBlackout`, `toggleFreezeTime`, `toggleDynamicWeather`. They are accepted only when triggered from another server resource or the console (`source` of 0 or less) — a client-triggered call is silently ignored, which is stricter than stock qb-weathersync (which allowed admin clients).

## Argument parsing

Boolean arguments accept `true`, `1`, `on`, `false`, `0` and `off` (case-insensitive). Anything else gives the `expected_boolean` message. Texts come from `locales/en.lua`.

## `/freezeweather` semantics


The argument sets the **dynamic weather** flag, not a freeze flag: `/freezeweather true` turns dynamic weather **on**, and `/freezeweather false` turns it off (weather stops cycling). Running it without an argument toggles the flag. This is the opposite of what the command name suggests and of the wording in `tests/checklist-core-and-libraries.feature`; the docs follow the code.

## Permissions

Without permission the player sees "You do not have permission for this command." Grant the ACE, for example `add_ace group.admin kora_core.admin allow`, according to how your `kora_lib` permission setup resolves levels.
