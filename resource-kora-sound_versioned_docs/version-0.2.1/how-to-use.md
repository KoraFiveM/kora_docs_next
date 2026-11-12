---
title: "How to use"
sidebar_position: 3
---


# How to use

There is no in-game command and no menu. Other resources call sound playback from the server (broadcasting to one, all, or an area of players) or from the client (playing only for the local player), and may stop a specific looping sound by the id it was started with.

## Volume resolution

For any play call, the effective volume is resolved by `Config.resolveVolume(soundFile, explicitVolume)`: an explicit volume argument always wins; otherwise the sound file name is looked up in `Config.soundCategory` to find a category, whose volume comes from `Config.categories`; a file with no category mapping falls back to `Config.defaultVolume`.

## Area falloff

`PlaySoundInArea` computes, for every connected player within `radius` (capped at 300.0 metres server-side regardless of the radius argument) of `coords`, a per-player volume via `Config.falloffVolume`: a linear ramp from the base volume at distance 0 down to `Config.minFalloffVolume` at the edge of the radius — the sound is never hard-cut, only floored. A missing (nil) radius uses `Config.defaultRange`; a radius of 0 or less is not replaced (0 only reaches a player at exactly `coords`, a negative radius reaches nobody).

## Looping sounds and stop targeting

Pass `options = { loop = true, id = 'some-id' }` to any play call to start a loop; the same `id` passed later to `StopSound(id, target?)` ends it. The server remembers which recipients (or "all") a given loop id was sent to (`activeLoops`), so `StopSound(id)` with no explicit target correctly reaches only the players who actually received that loop — starting a new loop under an id that is already playing silently replaces the old entry in that tracking table without first telling the previous recipients to stop.

## Server exports

```lua title="server.lua"
-- Server
exports.kora_sound:PlaySound(source, 'DoorOpen')                          -- one player, category/default volume
exports.kora_sound:PlaySoundAll('Alert', 0.8)                             -- every connected player
exports.kora_sound:PlaySoundInArea(GetEntityCoords(ped), 15.0, 'panic')   -- radius falloff
local id = 'alarm-' .. doorId
exports.kora_sound:PlaySoundInArea(coords, 20.0, 'security-alarm', nil, { loop = true, id = id })
exports.kora_sound:StopSound(id) -- stops it only for the recipients it was started for
```

## Client exports

```lua title="client.lua"
-- Client (only plays while the local player has loaded in)
exports.kora_sound:PlaySound('DoorOpen')
exports.kora_sound:PlaySound('radiostatic1', 0.5, { loop = true, id = 'radio' })
exports.kora_sound:StopSound('radio')
```

## Legacy interact-sound and InteractSound_* compatibility

- Server net events `InteractSound_SV:PlayOnOne`, `InteractSound_SV:PlayOnSource`, `InteractSound_SV:PlayOnAll`, `InteractSound_SV:PlayWithinDistance` remain registered for any resource still firing them directly, and are also how a modified client can reach this resource without going through an export.
- Client net events `InteractSound_CL:PlayOnOne`, `InteractSound_CL:PlayOnAll`, `InteractSound_CL:PlayLoop`, `InteractSound_CL:StopSound` are the client-side equivalents and remain registered.
- `exports['interact-sound']` is provided for both realms via `Kora.compat.provideExport`, with the same function names and signatures as this resource's own exports.
