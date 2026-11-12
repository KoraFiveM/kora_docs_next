---
title: "API reference"
sidebar_position: 1
---

# API reference

| Module | Namespace | Realms |
| --- | --- | --- |
| [Server exports](./server-exports.md) | `exports.kora_sound` | server |
| [Client exports](./client-exports.md) | `exports.kora_sound` | client |
| [Configuration](./configuration.md) | `Config` | shared |

## Export names and conventions

All exports are also available under the name `interact-sound` (for example `exports['interact-sound']:PlaySound(...)`). The resource registers them through `Kora.compat.provideExport('interact-sound', ...)`, so they remain callable under that name whatever the resource folder is called.

`soundFile` is the file name without extension (see [Sounds](../sounds.md)). `volume` is optional; when `nil` the volume is resolved from [Configuration](./configuration.md). `options` is `{ loop = boolean, id = string }`. A sound only loops when both `loop` and `id` are set on the server; on the client `loop` is honoured as passed, but without `id` it cannot be stopped.

## Quick reference

| Realm | Export | Description |
| --- | --- | --- |
| Client | `PlaySound(soundFile, volume?, options?)` | Plays a sound locally. Does nothing until the player is logged in (`LocalPlayer.state.isLoggedIn` or `QBCore:Client:OnPlayerLoaded`). |
| Client | `StopSound(id)` | Stops and unloads the sound started with that `id`. Ignored if `id` is nil. |
| Server | `PlaySound(src, soundFile, volume?, options?)` | Plays for one player. |
| Server | `PlaySoundAll(soundFile, volume?, options?)` | Plays for every player. |
| Server | `PlaySoundInArea(coords, radius, soundFile, volume?, options?)` | Plays for players within `radius` of `coords` (a `vector3`), capped at 300.0, with linear falloff. |
| Server | `StopSound(id, target?)` | Stops a sound for `target`, or for everyone who received the loop. |

The server exports are not rate limited and do not validate `soundFile`; they are meant for trusted server code. `PlaySoundInArea` is a snapshot: players entering range later do not get an already started loop. The legacy net events are documented in [Events](../events.md).

## Examples

```lua
-- One-shot, volume from the sound's category
exports['interact-sound']:PlaySoundInArea(coords, 15.0, 'DoorOpen')

-- Looping alarm for everyone, stopped later
exports['interact-sound']:PlaySoundAll('security-alarm', nil, { loop = true, id = 'bank_alarm' })
exports['interact-sound']:StopSound('bank_alarm')
```
