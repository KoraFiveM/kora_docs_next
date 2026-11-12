---
title: "Server exports"
sidebar_position: 2
---


# Server exports

Four exports for broadcasting sound to one player, all players, or an area, plus stopping a tracked loop. Each is also registered under the legacy `interact-sound` provider name with the same signature.

Namespace: `exports.kora_sound` · Source: `server/main.lua, fxmanifest.lua`

## How it works

The legacy net-event entry points (`InteractSound_SV:*`) that take `soundFile`/`soundVolume` straight from a client are input-validated before being forwarded to these same functions: `soundFile` must match `^[%w_%-]+$` and be at most 128 characters (the client builds `./sounds/<file>.ogg`, so this also prevents a crafted value walking the NUI's path); `soundVolume` must be a finite number between 0 and 2 or it is dropped (passed as `nil`, which falls through to category/default resolution); and each caller source is subject to a 150ms (`Config.cooldownMs`) per-player cooldown. Direct export calls from other server resources are NOT subject to this validation or cooldown — only the legacy net events are.

## Terms used on this page

| Term | Meaning |
| --- | --- |
| Loop id | An arbitrary string chosen by the caller. The server's `activeLoops` table maps it to the set of recipients (or `all = true`) a loop was started for, so `StopSound` can target the right players without the caller having to remember them. |
| Legacy net events | `InteractSound_SV:PlayOnOne` (arbitrary target by net id), `PlayOnSource` (caller only), `PlayOnAll`, `PlayWithinDistance` (radius around the caller). All four are validated and cooldown-gated before calling the corresponding export function. |

## PlayOnOne lets any player target any other player (by design)

`InteractSound_SV:PlayOnOne` takes a `clientNetId` straight from the firing client and only checks that it is a positive whole number and that a player with that id exists (`GetPlayerName(target) ~= nil`) — it does not require the target to be the caller, nor does it check any relationship between the two. Any connected player can therefore make a sound play for any other online player by firing this event with their net id. This is unchanged legacy `interact-sound` behavior, not a bug introduced here, and is documented as a known characteristic of the API: do not expose a raw proxy for this event to untrusted input, and prefer `PlaySound` called from your own trusted server code when you need to target a specific player.

## Functions

Four exports, each also reachable as `exports['interact-sound']:...` with the same name and signature.

### `exports.kora_sound:PlaySound(src, soundFile, volume?, options?)`

Plays a sound for a single connected player.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `src` | number | Required. Target player's server id. |
| `soundFile` | string | Required. File name without extension, served from `client/html/sounds/<soundFile>.ogg`. |
| `volume?` | number | Optional. Overrides `Config.resolveVolume`'s category/default lookup. |
| `options?` | table | Optional `{ loop?: boolean, id?: string }`. `id` is required to stop the sound later or to loop it; without a loop, a sound with no id cannot be targeted by `StopSound` on the server (the client NUI still tracks it internally as the single untracked "last one-shot"). |

**Returns**

- **No return value.**

**Example**

```lua
exports.kora_sound:PlaySound(source, 'DoorOpen')
```

**Representative console output**

```text
Sent as `TriggerClientEvent('InteractSound_CL:PlayOnOne', src, soundFile, finalVolume)`, or `PlayLoop` with the id when looping.
```

### `exports.kora_sound:PlaySoundAll(soundFile, volume?, options?)`

Plays a sound for every connected player.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `soundFile` | string | Required. |
| `volume?` | number | Optional explicit volume. |
| `options?` | table | Optional `{ loop?, id? }`; a looping call records `{ all = true }` so `StopSound(id)` later reaches everyone. |

**Returns**

- **No return value.**

**Example**

```lua
exports.kora_sound:PlaySoundAll('Alert', 0.8)
```

**Representative console output**

```text
Broadcasts with `TriggerClientEvent(..., -1, ...)`.
```

### `exports.kora_sound:PlaySoundInArea(coords, radius, soundFile, volume?, options?)`

Plays a sound for every connected player within `radius` metres of `coords`, with linear volume falloff by distance.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `coords` | vector3 | Required. World position. |
| `radius` | number | Metres. Falls back to `Config.defaultRange` if missing (nil); a value of 0 or less is used as given (never replaced by the default); always capped at 300.0 metres regardless of the value passed. |
| `soundFile` | string | Required. |
| `volume?` | number | Optional explicit base volume (before falloff). |
| `options?` | table | Optional `{ loop?, id? }`; a looping call records only the recipients actually in range at the moment it was started — a player who walks into range afterwards is not added. |

**Returns**

- **No return value.**

**Example**

```lua
exports.kora_sound:PlaySoundInArea(GetEntityCoords(ped), 15.0, 'panic')
```

**Representative console output**

```text
Distance is computed against every value of `GetPlayers()`; each in-range player gets their own falloff-adjusted volume via `TriggerClientEvent('InteractSound_CL:PlayOnOne', ...)` (or `PlayLoop`).
```

### `exports.kora_sound:StopSound(id, target?)`

Stops a previously started (normally looping) sound by its id.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `id` | string | Required; a call with no id is a no-op. |
| `target?` | number | Optional server id. When given, the stop is sent only to that player regardless of who the loop was actually started for. When omitted, the stop is sent to every recipient recorded for that id by `PlaySound`/`PlaySoundAll`/`PlaySoundInArea` (or to everyone if the id is not tracked at all). |

**Returns**

- **No return value.**

**Example**

```lua
exports.kora_sound:StopSound('alarm-1')
```

**Representative console output**

```text
Clears the id from the internal `activeLoops` tracking table after sending the stop.
```

## Limits and related APIs

Server only. No permission system of any kind — every export and legacy event is open to any caller that can reach it; access control is the caller's responsibility.

## Related guides

- [Client exports](./client-exports.md)
