---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Loading is a `kora_theme`-styled loading screen (`loadscreen 'html/index.html'`) that mirrors `kora_theme`'s colours and fonts, shows configurable tips and a background slideshow/video, and includes an optional music player. It has a small server script (`server.lua`, which hands the settings to the page while the player connects), no database dependency and no exports for general use.

## Install Kora Loading

1. **Add the folder** — Place `kora_loading` in your resources directory.

2. **Dependencies** — Declares `dependency 'kora_theme'` and `dependency 'kora_lib'`. Start `kora_theme` first so its colours/fonts are available; `kora_lib`'s `init.lua` is loaded as a shared script purely to reach `Kora.config.*` for the in-game config UI (see kora_lib's own notes on why a consumer pulls in the Kora proxy this way).

   ```lua title="fxmanifest.lua"
   dependency 'kora_theme'
   dependency 'kora_lib'

   loadscreen 'html/index.html'
   loadscreen_manual_shutdown 'yes'
   loadscreen_cursor 'yes'

   shared_script '@kora_lib/init.lua'
   shared_scripts { 'config.lua' }
   client_scripts { 'client.lua' }
   ```

3. **Theme sync** — The `html/kora_theme/**` files bundled in this resource (theme.js, theme.json, fonts/) are synced copies of `kora_theme`'s own files, refreshed by `tools/sync-theme.mjs` — never edit them by hand. They exist so colours/fonts apply immediately, before the `cfx-nui-kora_theme` NUI origin would otherwise answer.

4. **Media files** — Put any custom background images/video/music under `html/media/` and reference them by a relative path (e.g. `media/city.jpg`) in `config.lua`, or use a full `https://` URL for either.

5. **Start it** — Add to `server.cfg` after `kora_theme`. As a loadscreen resource it must be started before the game attempts to connect, so keep it near the top of your resource start order.

   ```bash title="server.cfg"
   ensure kora_theme
   ensure kora_loading
   ```

   > `kora_lib` is also a declared dependency, so start it before `kora_loading` as well (see "Start order" below). The manifest excerpt in step 2 is abridged: the real `fxmanifest.lua` also lists `payload.lua` in `shared_scripts`, `server.lua` as a `server_script`, `fft_hooks.lua` in `client_scripts`, `ui_page 'html/sync.html'` and the `files` list.

## Dependencies in detail

`fxmanifest.lua` declares `dependency 'kora_theme'` and `dependency 'kora_lib'`.

- `kora_theme` supplies the colour tokens, fonts and the `getPlayerTheme` export used to keep the player's own accent colour.
- `kora_lib` is pulled in through `shared_script '@kora_lib/init.lua'`. `config.lua` only registers its config schema if `Kora.config.adopt` exists, so the screen also reads plain `config.lua` values when that API is missing.

### Start order

```cfg
ensure kora_theme
ensure kora_lib
ensure kora_loading
```

### Manifest settings

| Setting | Purpose |
| --- | --- |
| `loadscreen 'html/index.html'` | The loading page. |
| `loadscreen_manual_shutdown 'yes'` | The screen stays until `ShutdownLoadingScreen` and `ShutdownLoadingScreenNui` are called. See [Events](./api/nui.md). |
| `loadscreen_cursor 'yes'` | Shows a mouse cursor so the music player and sound controls can be clicked. A loadscreen gets no keyboard focus. |
| `ui_page 'html/sync.html'` | A hidden in-game page that keeps the cached player colour current. See [Theme](./theme.md). |

All of `html/` (including `html/media/*` and `html/kora_theme/**`) is streamed to the player as resource files.

### Optional

`kora_multichar` is not required. If it is installed, its `kora_multichar:client:spawnComplete` event dismisses the screen. See [Events](./api/nui.md).
