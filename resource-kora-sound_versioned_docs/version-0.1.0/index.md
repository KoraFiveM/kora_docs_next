# interact-sound

Basic custom-sound playback, built on kora_lib, with area sync, distance
falloff, sound categories, loop/stop, and per-player anti-spam.

## Client export
```lua
exports['interact-sound']:PlaySound(soundFile, volume?, options?)
-- options = { loop = true, id = 'someHandle' }  -- id required to loop or stop later
exports['interact-sound']:StopSound(id)
```

## Server exports
```lua
exports['interact-sound']:PlaySound(src, soundFile, volume?, options?)
exports['interact-sound']:PlaySoundAll(soundFile, volume?, options?)
exports['interact-sound']:PlaySoundInArea(coords, radius, soundFile, volume?, options?)
exports['interact-sound']:StopSound(id, target?)  -- target: a src, or omit to stop everyone who got it
```
`options = { loop = true, id = 'someHandle' }` on any of the play exports.

- **Volume**: pass one explicitly, or omit it to use the sound's category
  preset (`Config.soundCategory` / `Config.categories`), or the global
  default if it's in neither.
- **Falloff**: `PlaySoundInArea` scales volume down with distance from
  `coords`, down to `Config.minFalloffVolume` at the edge of `radius`. It's a
  snapshot at call time -- players who walk into range afterward won't pick
  up an already-started loop; call it again if you need that.
- **Cooldown**: `Config.cooldownMs` (default 150ms) anti-spam applies to the
  legacy `InteractSound_SV:*` net events, since those are the ones a
  player's own client can trigger directly. The exports above aren't gated —
  they're for trusted server-side code; a resource forwarding raw client
  input into them should add its own check.

## Examples
```lua
-- One-shot, category-resolved volume
exports['interact-sound']:PlaySoundInArea(coords, 15.0, 'DoorOpen')

-- Looping alarm for everyone, stoppable later
exports['interact-sound']:PlaySoundAll('security-alarm', nil, { loop = true, id = 'bank_alarm' })
-- ... later:
exports['interact-sound']:StopSound('bank_alarm')
```

The classic `InteractSound_CL:*` / `InteractSound_SV:*` events from the
original resource still work, for anything else on your server already
calling them directly.

Sound files go in `client/html/sounds/` as `.ogg`; reference them by name
without the extension.

## Credits
Based on [plunkettscott/interact-sound](https://github.com/plunkettscott/interact-sound).
This version rebuilds it on kora_lib and adds area falloff, sound categories,
loop/stop, and per-player cooldown on top of the original's event API.

