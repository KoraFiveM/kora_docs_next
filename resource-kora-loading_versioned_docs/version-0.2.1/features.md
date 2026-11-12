---
title: Features
sidebar_position: 6
---

# Features

## Server name

The page shows `Config.serverName` in the heading font, with a small accent rail in front of it. Until settings arrive, the page keeps the placeholder text from `html/index.html` ("Roleplay Server Name").

## Tips

`Config.tips` rotate every 6 seconds with a short fade. Nothing is shown if the list is empty.

## Progress bar

The bar fills from FiveM's loadscreen events and never moves backwards. The `LOADING n%` counter shows whole numbers.

- `loadProgress` (`loadFraction`) is used first.
- Until a `loadFraction` above 0 has been seen, the init-function and map events (`startInitFunctionOrder`, `initFunctionInvoking`, `startDataFileEntries`, `performMapLoadFunction`, `endDataFileEntries`) drive the bar inside fixed ranges.

Stage text shown under the tip:

| Stage | Label |
| --- | --- |
| `INIT_CORE` | Starting game |
| `INIT_BEFORE_MAP_LOADED` | Preparing world |
| `MAP` | Loading map |
| `INIT_AFTER_MAP_LOADED` | Finishing map |
| `INIT_SESSION` | Joining session |

`Config.showProgressText = false` hides the percentage and the stage text. The bar stays.

## Backdrop, wallpaper and clips

A themed dark backdrop, an optional wallpaper or slideshow, a darkening overlay (`Config.media.dim`) and a playlist of background clips with sound controls. See [Media](./media.md).

## Music player

A small panel with title, artist, play/pause, next, mute and a volume slider. It is hidden when no tracks are playable. Volume and mute are remembered per player in the browser's `localStorage`. Controls are mouse-only. See [Media](./media.md).

## Player accent colour

If the player picked their own accent colour in kora_theme, the next loading screen uses it. See [Theme](./theme.md).

## Built-in fallback

If the page has no handover data after about 300 ms, it applies built-in defaults (the default tips, wallpaper and clip list, but no server name and no music player) and keeps asking the client script for the real settings. See [Events](./api/nui.md).

## Dismissal

The screen is dismissed when `QBCore:Client:OnPlayerLoaded` or `kora_multichar:client:spawnComplete` fires on the client. See [Events](./api/nui.md).
