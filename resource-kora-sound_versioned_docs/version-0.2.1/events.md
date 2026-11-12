---
title: Events
sidebar_position: 7
---

# Events

These are the classic `interact-sound` events, kept so older scripts keep working. New code should use the [exports](./api/index.md).

## Server net events (client to server)

Each handler first applies the per-player cooldown (`Config.cooldownMs`, calls inside the window are dropped), then requires `soundFile` to match letters, digits, `_` and `-` only (max 128 characters). A volume that is not a number between 0 and 2 is dropped and replaced by the resolved default.

| Event | Arguments | Behaviour |
| --- | --- | --- |
| `InteractSound_SV:PlayOnOne` | `clientNetId`, `soundFile`, `soundVolume?` | Plays for the given player id. Ignored if the id is not a positive whole number of a connected player. |
| `InteractSound_SV:PlayOnSource` | `soundFile`, `soundVolume?` | Plays for the sender. |
| `InteractSound_SV:PlayOnAll` | `soundFile`, `soundVolume?` | Plays for every player. |
| `InteractSound_SV:PlayWithinDistance` | `maxDistance`, `soundFile`, `soundVolume?` | Plays for players within `maxDistance` of the sender's ped (default range if not a number, capped at 300.0), with falloff. |

Any client can trigger these, including playing a sound for all players; the only limits are the cooldown and the validation above.

## Client net events (server to client)

| Event | Arguments | Behaviour |
| --- | --- | --- |
| `InteractSound_CL:PlayOnOne` | `soundFile`, `volume?` | Plays once. |
| `InteractSound_CL:PlayOnAll` | `soundFile`, `volume?` | Plays once. |
| `InteractSound_CL:PlayLoop` | `soundFile`, `volume?`, `id` | Plays looping under `id`. |
| `InteractSound_CL:StopSound` | `id` | Stops the sound with that id. |

The client also listens to `QBCore:Client:OnPlayerLoaded` and `QBCore:Client:OnPlayerUnload` to track whether the player is loaded. Sounds requested while not loaded are dropped.

The resource registers no callbacks.
