---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Sound plays one-shot and looping `.ogg` sounds on a single player, every player, or everyone within a radius of a point, with per-category default volumes and a linear distance falloff. It is a thin wrapper around an NUI page running Howler.js; there is no database and one dependency.

## Install Kora Sound

1. **Add the folder** — Place `kora_sound` in your resources directory (on the Kora recipe it is `resources/[standalone]/kora_sound`).

2. **Have kora_lib running** — The manifest declares `dependency 'kora_lib'` and shared-scripts `@kora_lib/init.lua`; only `Kora.compat.provideExport` is used from it (for the legacy `interact-sound` export names).

3. **Add your own sound files** — Drop `.ogg` files into `client/html/sounds/` (87 bundled sounds already live there, see [Sounds](./sounds.md); the manifest globs `client/html/sounds/*.ogg`). The sound file name passed to any play call must match the file name without its extension; the client builds the path as `./sounds/<name>.ogg` inside the NUI page.

4. **Review config.lua** — Set `Config.defaultVolume`, `Config.defaultRange`, category volumes (`Config.categories`) and the per-file category map (`Config.soundCategory`) to match your own sound set. Unlisted files fall back to `Config.defaultVolume`.

## Manifest reference

A single NUI page (`client/html/index.html`) loads Howler.js from a CDN and handles two message types: `playSound` and `stopSound`. There is no server-side file beyond the exports and the legacy net events.

```lua title="fxmanifest.lua"
fx_version 'cerulean'
game 'gta5'
lua54 'yes'

dependency 'kora_lib'

shared_scripts {
    '@kora_lib/init.lua',
    'config.lua',
}

client_script 'client/main.lua'
server_script 'server/main.lua'

ui_page 'client/html/index.html'

files {
    'client/html/index.html',
    'client/html/sounds/*.ogg',
}
```

- `Kora.compat.provideExport('interact-sound', name, handler)` additionally makes `exports['interact-sound']:PlaySound(...)` (and the other three functions) resolve here, for resources written against the original `interact-sound` resource.

## Start order

Ensure the resource after `kora_lib`:

```cfg title="server.cfg"
ensure kora_lib
ensure kora_sound
```

The NUI page loads Howler 2.1.1 from `cdnjs.cloudflare.com`, so players need access to that CDN. No SQL, items, commands or ACE permissions are involved. See [Troubleshooting](./troubleshooting.md).

## Testing

- `lua5.4 test/client.lua` (from the resource directory) checks the client exports and events with stubs.
- `node test/sounds.cjs /path/to/howler.core.js` runs the shipped NUI message handler against Howler 2.1.1 with inert audio.
