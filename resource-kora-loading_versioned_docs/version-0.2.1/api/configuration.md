---
title: "Configuration reference"
sidebar_position: 3
---


# Configuration reference

All settings live in one `Config` table, shared between client and the loading page. When `kora_lib`'s `Kora.config.adopt` is available, every field is also registered as an editable in-game config option (admin config UI), with the descriptions shown there matching the ones below.

Namespace: `Config` · Source: `config.lua`

## Options

Each option is a field of the `Config` table in `config.lua`. Defaults, ranges and live options are listed under "Defaults, schema limits and live options" below.

| Option | Type | Description |
| --- | --- | --- |
| `Config.serverName` |  | Name shown on the loading screen. Exposed to `Kora.config` as a string field; takes effect for newly opened loading screens after a resource restart, not for one already open. |
| `Config.tips` |  | List of tip strings cycled while the player waits. |
| `Config.showProgressText` |  | When true, shows the load percentage and current stage text above the progress bar; the bar itself is always shown. |
| `Config.theme.fonts` |  | When true, uses `kora_theme`'s chosen font in addition to its colours. When false, keeps the built-in font stack; colours still follow the theme either way. |
| `Config.media.backdrop` |  | When true, paints a themed background (from `kora_theme` colours) under any images/video. Set false to leave the page transparent. |
| `Config.media.images` |  | List of background image paths (relative to `html/`, e.g. `media/city.jpg`) or full `https://` URLs. Still/animated png, jpg/jpeg, webp, gif, svg and avif are all supported. More than one plays as a slideshow. |
| `Config.media.defaultWallpaper` |  | Fallback wallpaper used when no image is listed and no theme wallpaper applies. Defaults to an animated Kora Discord banner URL; set to `''` to use the themed background only. |
| `Config.media.themeWallpaper` |  | When true, a `"wallpaper"` entry in `kora_theme`'s `theme.json` can set the wallpaper without editing this resource. Any image in `Config.media.images` still takes priority. |
| `Config.media.slideSeconds` |  | Seconds each background image is shown before the slideshow fades to the next (only relevant with more than one image). |
| `Config.media.video` |  | Legacy single background video, read by the page only when `Config.media.videos` is empty; it is not in the config schema. FiveM cannot play mp4, use WebM. Prefer `Config.media.videos` (see below). |
| `Config.media.music` |  | Looping background music track (mp3/ogg/wav/flac/webm; m4a, aac and mp4 do not play in FiveM). Empty string for none. |
| `Config.media.musicVolume` |  | Volume (0–1) for `Config.media.music`, independent of the music player's own volume. |
| `Config.media.dim` |  | How much the background images/video are darkened (0 none, 1 black) so text stays readable. |
| `Config.musicPlayer.enabled` |  | Shows a player UI (title/artist, play/pause, skip, volume, mute) when true and at least one track is listed. |
| `Config.musicPlayer.volume` |  | Starting volume (0–1) for the music player; the player-chosen value is then remembered. |
| `Config.musicPlayer.tracks` |  | List of `{ title, artist, url }` tracks. `url` is a path under `html/` (e.g. `media/night-drive.mp3`) or a full `https://` address (mp3, ogg, wav, flac or webm; m4a and mp4 do not play in FiveM). |

## Defaults, schema limits and live options

Settings live in `config.lua` (a shared script). When `kora_lib` provides `Kora.config.adopt`, each option is also registered with a label, description and limits so it can be edited through kora_lib's config system, and `Config` is replaced by the adopted copy.

Settings are sent to each player while they connect. Options marked **live** in the schema apply to players who connect after the change, with no restart. For the others, restart `kora_loading`; screens that are already open are not refreshed.

### General

| Option | Default | Notes |
| --- | --- | --- |
| `Config.serverName` | `'Roleplay Server Name'` | Heading text. Schema: non-empty string. |
| `Config.tips` | five example tips | One string per row. Rotate every 6 seconds. Edit them so they only mention features your server has. |
| `Config.showProgressText` | `true` | Shows the percentage and stage text. The bar is always shown. |
| `Config.theme.fonts` | `true` | `false` keeps the plain built-in fonts on this screen. Colours always follow `kora_theme`. |

### Backdrop and wallpaper (`Config.media`)

| Option | Default | Notes |
| --- | --- | --- |
| `backdrop` | `true` | Solid dark background (`#111315` per the schema text) under images and video. `false` leaves the page transparent and also stops any default wallpaper from loading. |
| `images` | `{}` | Wallpaper paths or `https://` addresses. Several images form a slideshow. |
| `defaultWallpaper` | Kora Discord banner URL | Used when no image is set and the theme has no wallpaper. `''` for none. |
| `themeWallpaper` | `true` | Allows a `wallpaper` entry in `kora_theme`'s `theme.json`. |
| `slideSeconds` | `8` | Seconds per image in a slideshow, also the default length of a silent image clip. Schema range 2 to 120. |
| `dim` | `0.45` | Darkening over wallpapers and videos, 0 to 1. |

### Background clips (`Config.media`, all **live**)

| Option | Default | Notes |
| --- | --- | --- |
| `videos` | `intro.webm` plus nine scene clips | List of rows with `video`, `image`, `audio`, `seconds`. See [Media](../media.md). |
| `videoSound` | `true` | Play each video's own soundtrack. |
| `videoVolume` | `0.5` | 0 to 1. Starting level until a player moves the slider. |
| `videoSoundButton` | `true` | Show the mute button and slider while a clip can make sound. |
| `videoOrder` | `'shuffle'` | `sequential`, `shuffle` or `random`. Any other value is treated as `sequential` by the page. |
| `videoRandomStart` | `false` | With `sequential`, start at a random clip. |
| `videoPinFirst` | `true` | First clip plays first, once; the order applies to the rest. |
| `videoOverlap` | `0` | Crossfade seconds, 0 to 10. |
| `videoFadeIn` | `0.6` | First clip fade-in seconds, 0 to 5. |
| `videoMaxSeconds` | `0` | Cut each video after this many seconds. `0` plays to the end. Range 0 to 3600. |
| `videoSpeed` | `1` | 0.25 to 2. |
| `videoFit` | `'cover'` | `cover` or `contain`. |

### Music

| Option | Default | Notes |
| --- | --- | --- |
| `Config.media.music` | `''` | Single looping track. With the player enabled and no tracks it becomes a one-track playlist. With the player disabled it plays with no panel. |
| `Config.media.musicVolume` | `0.3` | Volume for the no-panel case. |
| `Config.musicPlayer.enabled` | `true` | Shows the panel when at least one track is playable. |
| `Config.musicPlayer.volume` | `0.3` | Starting volume. A player's saved volume wins. |
| `Config.musicPlayer.tracks` | `{}` | Rows with `url`, optional `title`, `artist`. |

### Not configuration

The accent colour and fonts are chosen in `kora_theme`, not here. See [Theme](../theme.md).
