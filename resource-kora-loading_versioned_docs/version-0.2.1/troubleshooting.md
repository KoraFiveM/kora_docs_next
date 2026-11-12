---
title: Troubleshooting
sidebar_position: 10
---

# Troubleshooting

## The screen never goes away

`loadscreen_manual_shutdown` is on. The screen is dismissed only by `QBCore:Client:OnPlayerLoaded` or `kora_multichar:client:spawnComplete`. Make sure your character flow fires one of them, or call `ShutdownLoadingScreen()` and `ShutdownLoadingScreenNui()` yourself.

## Default tips and wallpaper appear, not mine

The page received no handover data and no answer from `loadingscreen:getTheme`. This happens when `kora_loading` was started after the player connected. The page shows built-in defaults (no server name, no music) until the client script answers near the end of loading. Check the F8 console for `no handover data and getTheme not available yet`.

## Config change not visible

Only options marked live in [Configuration](./api/configuration.md) apply to new connections without a restart. Restart `kora_loading` for the rest. Screens already open are not refreshed.

## A video or track does not play

mp4, m4a and aac do not play in FiveM. Convert video to WebM (VP8/VP9) and audio to mp3, ogg, wav, flac or webm. The F8 console prints `clip could not be played` or `track could not be played` with the path.

## No sound

If the game blocks autoplay, the clip plays muted and the sound button shows as muted. Click anywhere to turn sound on. If `videoSoundButton` is off, there is no button, but clicking anywhere still enables sound.

## Colours or fonts are stale

Run `node tools/sync-theme.mjs --check`, then without `--check` to refresh. See [Theme](./theme.md). After editing `html/app.js` or `html/style.css`, bump the `?v=` value in `html/index.html`.

## Wallpaper missing

A wallpaper that fails to load is skipped silently apart from a console warning. A wallpaper hosted by `kora_theme` can answer a moment late during loading; a CDN URL or a file in `html/media/` shows immediately.
