---
title: "Configuration"
sidebar_position: 4
---


# Configuration

A single shared `Config` table plus two pure helper functions (`Config.resolveVolume`, `Config.falloffVolume`) used by both realms.

Namespace: `Config` · Source: `config.lua`

## All options

Every key of `Config` in `config.lua`.

| Key | Type | Default | Effect | Notes |
| --- | --- | --- | --- | --- |
| defaultVolume | number | 0.3 | Volume used when a sound file has no category mapping and no explicit volume is given. | Restart. |
| defaultRange | number | 30.0 | Radius used by `PlaySoundInArea` when no radius (nil) is passed; a radius of 0 or less is used as given. | Restart. |
| minFalloffVolume | number | 0.05 | Volume floor at the edge of an area sound's radius (not a hard cutoff — audio is still audible there, just quiet). | Restart. |
| cooldownMs | number (ms) | 150 | Per-player anti-spam cooldown applied only to the legacy `InteractSound_SV:*` net events, not to direct export calls. | Restart. |
| categories | table&lt;string, number> | ui 0.25, interaction 0.3, alarm 0.6, ambient 0.4 | Named volume presets a sound file maps into via `soundCategory`. | Restart. |
| soundCategory | table&lt;string, string> | see config.lua | Maps a specific sound file name (without extension) to one of the `categories` keys. A file not listed here uses `defaultVolume`. | Restart. |

## How it works

Precedence for volume: an explicit volume argument always wins; otherwise the sound's category preset; otherwise `Config.defaultVolume`. `Config.falloffVolume(volume, distance, radius)` returns `volume` unchanged if `radius` is missing or non-positive, otherwise linearly ramps from `volume` at `distance = 0` down to `Config.minFalloffVolume` at `distance = radius` (clamped, never below the floor).

## Options

Pass an options table as the final argument to a play function. Omit the table or any field to use its default.

| Option | Type | Description |
| --- | --- | --- |
| `defaultVolume` | number | Default 0.3. Volume used when a sound file has no category mapping and no explicit volume is given. Restart. |
| `defaultRange` | number | Default 30.0. Radius used by `PlaySoundInArea` when no radius (nil) is passed; a radius of 0 or less is used as given. Restart. |
| `minFalloffVolume` | number | Default 0.05. Volume floor at the edge of an area sound's radius (not a hard cutoff — audio is still audible there, just quiet). Restart. |
| `cooldownMs` | number (ms) | Default 150. Per-player anti-spam cooldown applied only to the legacy `InteractSound_SV:*` net events, not to direct export calls. Restart. |
| `categories` | table&lt;string, number> | Default ui 0.25, interaction 0.3, alarm 0.6, ambient 0.4. Named volume presets a sound file maps into via `soundCategory`. Restart. |
| `soundCategory` | table&lt;string, string> | Default see config.lua. Maps a specific sound file name (without extension) to one of the `categories` keys. A file not listed here uses `defaultVolume`. Restart. |

## Functions

No functions are exported from this module; it is plain config consumed by both client and server code.

## Limits and related APIs

This file is a shared script (loaded on both client and server), so editing it requires a full resource restart (`ensure kora_sound`) to take effect on both.

## Categories

Default category volumes:

| Category | Volume |
| --- | --- |
| `ui` | `0.25` |
| `interaction` | `0.3` |
| `alarm` | `0.6` |
| `ambient` | `0.4` |

No default sound is mapped to `ui`. Sounds mapped by default:

- `interaction`: `Cuff`, `Uncuff`, `handcuff`, `ziptie`, `DoorOpen`, `DoorClose`, `lockpick`, `unlock`, `lock`, `keys`, `keydoors`
- `alarm`: `Alert`, `security-alarm`, `warehousealert`, `warehousealert2`, `panic`, `beltalarm`, `RumbleStart`
- `ambient`: `radiostatic1`, `radiostatic2`, `radiostatic3`, `ventilator`, `coffee_machine`, `vending_machine`

Sounds not listed use `Config.defaultVolume`.

## Helper functions

- `Config.resolveVolume(soundFile, explicitVolume)` returns the explicit volume if given, otherwise the category volume, otherwise `Config.defaultVolume`. The server resolves the volume before sending, and the client resolves again (a value already resolved is passed through unchanged).
- `Config.falloffVolume(volume, distance, radius)` scales `volume` by `1 - distance / radius` and never goes below `Config.minFalloffVolume`.

`Config.defaultRange` is also used by the legacy `InteractSound_SV:PlayWithinDistance` event when the client does not send a numeric distance, see [Events](../events.md).
