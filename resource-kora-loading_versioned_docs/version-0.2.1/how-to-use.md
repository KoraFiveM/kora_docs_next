---
title: "How to use"
sidebar_position: 3
---


# How to use

The loading screen is FiveM's native `loadscreen` page running in its own NUI frame — separate from `kora_lib`'s shared NUI frame, so it talks to its own page with raw natives (`RegisterNUICallback`, `SendLoadingScreenMessage` from the page side) rather than `Kora.nui.*`, which would target `kora_lib`'s frame instead.

## How the page gets its settings

While the player connects, `server.lua` hands the settings to the page through `deferrals.handover` (read as `window.nuiHandoverData.kora_loading`). As a late fallback the page also calls the NUI callback `loadingscreen:getTheme`; the client answers with the same payload (`serverName`, `tips`, `showProgressText`, `theme`, `media`, `musicPlayer`) plus `playerTheme`. Progress percentage and load-stage text come from FiveM's own loadscreen message events, not from this resource.

## Manual shutdown and handoff

The manifest sets `loadscreen_manual_shutdown 'yes'`, so the loading screen stays up until this resource explicitly dismisses it — giving the character-selection/spawn flow full control over when gameplay becomes visible.

- `client.lua` calls `ShutdownLoadingScreen()` and `ShutdownLoadingScreenNui()` (guarded by a `hasShutdown` flag so it only runs once) on two triggers: the `QBCore:Client:OnPlayerLoaded` net event, and the `kora_multichar:client:spawnComplete` event fired by Kora Multichar once character spawn finishes.
- This dual trigger is a deliberate fallback: if the cross-resource handoff from the character-selection flow is ever delayed or fails, `QBCore:Client:OnPlayerLoaded` still closes the screen so it never gets stuck covering gameplay.

## Theming

Colours always come from `kora_theme`'s `theme.json` (via the synced `html/kora_theme` copy). `Config.theme.fonts` additionally decides whether the page also adopts `kora_theme`'s font choice; with it `false` the page keeps its own built-in font stack while still using the theme's colours.

## Background and music

Background source priority is `Config.media.images` (a slideshow if more than one, each shown for `Config.media.slideSeconds`), then a `"wallpaper"` key in `kora_theme`'s `theme.json` (only if `Config.media.themeWallpaper` is true), then `Config.media.defaultWallpaper` (the animated Kora Discord banner by default). If any clip is configured in `Config.media.videos`, the clips play instead of a theme or default wallpaper (see [Media](./media.md)); the legacy single `Config.media.video` string still works when `videos` is empty. Clips draw over the images, and `Config.media.dim` darkens everything so text stays legible.

- The music player panel renders when at least one track is playable: a `Config.musicPlayer.tracks` entry, or else `Config.media.music` as a one-track playlist. With neither, nothing is drawn. With `Config.musicPlayer.enabled = false`, a `Config.media.music` track (if set) still loops silently in the background with no visible controls.
- Player-chosen volume for the music player is remembered (client-side, in the page) between loads.
