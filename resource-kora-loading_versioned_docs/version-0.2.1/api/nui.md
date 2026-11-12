---
title: "NUI callback"
sidebar_position: 2
---


# NUI callback

The interface this resource exposes: NUI callbacks answering the page's requests, and two shutdown triggers. The only exports are the optional FFT test hooks (see [Exports](../exports.md)). `server.lua` also hands the settings to the page while the player connects.

Namespace: `client.lua` · Source: `client.lua`

## Options

The callback and the two events handled by `client.lua`.

| Option | Type | Description |
| --- | --- | --- |
| `loadingscreen:getTheme` | NUI callback | Called by the loading-screen page on load. Replies with `{ serverName, tips, showProgressText, theme, media, musicPlayer, playerTheme }`, built by `KoraLoading.payload()` from `Config` plus the player's accent colour. |
| `QBCore:Client:OnPlayerLoaded` | net event (listened to) | Shuts down the loading screen (fallback path). |
| `kora_multichar:client:spawnComplete` | event (listened to, fired by Kora Multichar) | Shuts down the loading screen (primary handoff from character spawn). |

## Limits and related APIs

Shutdown is idempotent: a `hasShutdown` flag ensures `ShutdownLoadingScreen()`/`ShutdownLoadingScreenNui()` are only called once even if both triggers fire.

## Events, NUI callbacks and game messages in detail

`kora_loading` registers no commands and no server-side net events.

### Server

| Event | Type | Description |
| --- | --- | --- |
| `playerConnecting` | local | Builds the settings and calls `deferrals.handover({ kora_loading = payload })`, so the page reads them as `window.nuiHandoverData.kora_loading`. If building fails, a warning is printed and the page uses defaults. |

The payload contains `serverName`, `tips`, `showProgressText`, `theme`, `media` and `musicPlayer`.

### Client events handled

| Event | Type | Description |
| --- | --- | --- |
| `QBCore:Client:OnPlayerLoaded` | net event | Dismisses the loading screen. |
| `kora_multichar:client:spawnComplete` | local | Dismisses the loading screen. |
| `kora_theme:playerThemeChanged` | local | Sends the NUI message `kora_loading:playerTheme` with the current colour, or `false`. |

Dismissal runs once: it calls `ShutdownLoadingScreen()` and `ShutdownLoadingScreenNui()`. With `loadscreen_manual_shutdown` on, nothing else in this resource dismisses the screen, so a server that fires neither event needs another resource to do it.

### NUI callbacks

| Callback | Called by | Response |
| --- | --- | --- |
| `loadingscreen:getTheme` | `html/app.js` | The payload above plus `playerTheme` (`#RRGGBB` or `false`). Used as a late fallback; the page retries every 1.5 seconds, up to 80 times. |
| `loadingscreen:syncTheme` | `html/sync.js` | `{ colour = ... }`, the player's accent colour or `false`. |

The client calls the `getPlayerTheme` export of `kora_theme` inside `pcall`, so a missing `kora_theme` yields `false` rather than an error.

### Game messages the page reads

`loadProgress`, `startInitFunctionOrder`, `initFunctionInvoking`, `startDataFileEntries`, `performMapLoadFunction` and `endDataFileEntries` are FiveM loadscreen messages. See [Features](../features.md).
