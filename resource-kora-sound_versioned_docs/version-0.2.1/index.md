---
title: kora_sound
sidebar_position: 1
---

# kora_sound

Sound playback for Kora servers, built on `kora_lib`. It is a rebuild of `plunkettscott/interact-sound`: other resources play bundled `.ogg` files for one player, everyone, or players near a point. Playback happens in a NUI page using Howler. Features over the original are distance falloff, per-category default volumes, looping with a stop handle, and a per-player cooldown on the legacy net events.

Current version: see `version` in `fxmanifest.lua`.

## Features

- Client and server exports to play and stop sounds. See [API reference](./api/index.md).
- Legacy `InteractSound_CL:*` and `InteractSound_SV:*` events kept for old scripts. See [Events](./events.md).
- Volume resolution: explicit volume, then category preset, then default. See [Configuration](./api/configuration.md).
- Area playback with linear falloff and a 300 unit radius cap.
- Loops tracked by id so they can be stopped later.
- 87 bundled sounds. See [Sounds](./sounds.md).

## Requirements

`kora_lib` is declared with `dependency` in `fxmanifest.lua`; it provides `@kora_lib/init.lua` (the `Kora` global) and the export alias helper `Kora.compat.provideExport`. The NUI page loads Howler 2.1.1 from `cdnjs.cloudflare.com`, so players need access to that CDN. See [Troubleshooting](./troubleshooting.md).

## Installation

See [Installation](./installation.md). In short: ensure `kora_lib`, then `kora_sound`; no SQL, items, commands or ACE permissions are involved.

## Testing

- `lua5.4 test/client.lua` (from the resource directory) checks the client exports and events with stubs.
- `node test/sounds.cjs /path/to/howler.core.js` runs the shipped NUI message handler against Howler 2.1.1 with inert audio.

## Documentation map

- [Installation](./installation.md) - install steps, manifest reference, start order, tests
- [How to use](./how-to-use.md) - volume resolution, area falloff, loops, examples and legacy compatibility
- [API reference](./api/index.md) - export names, conventions and examples
  - [Server exports](./api/server-exports.md) - `PlaySound`, `PlaySoundAll`, `PlaySoundInArea`, `StopSound` with parameters
  - [Client exports](./api/client-exports.md) - local `PlaySound` and `StopSound`
  - [Configuration](./api/configuration.md) - every `Config` key, categories and helper functions
- [Events](./events.md) - legacy net events, validation and cooldown
- [Sounds](./sounds.md) - bundled sounds, adding your own, NUI behaviour
- [Troubleshooting](./troubleshooting.md) - caveats and common problems

This resource registers no commands, items, ACE permissions or database tables, so there is no commands page.
