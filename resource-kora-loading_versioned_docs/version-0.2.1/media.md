---
title: Media
sidebar_position: 7
---

# Media

Put your files in `html/media/` and reference them as `media/name.ext`, or use a full `https://` address (`nui://` addresses are also accepted by the page). Local paths may only contain letters, digits, `_`, `.`, `/`, space, `%` and `-`, and may not contain `..`. Anything else is ignored.

Players download local files while connecting, so keep them small. The resource ships its own clips (`intro.webm`, `ambulance.webm`, `atv.webm`, `bank.webm`, `burgershot.webm`, `club.webm`, `mechanic.webm`, `police.webm`, `spraypaint.webm`, `taxi.webm`) and `hub.png`. `loading.webm` is also in the folder but is not referenced by `config.lua` or the page.

## Wallpapers

Any image format the browser paints works (png, jpg, webp, gif, svg, avif), animated included. Sources, in order:

1. `Config.media.images` (one image, or several as a slideshow).
2. A `wallpaper` entry in the synced `html/kora_theme/theme.json` (URL, list of URLs, or a path inside `kora_theme`, loaded from `https://cfx-nui-kora_theme/`), unless `themeWallpaper` is `false`.
3. `Config.media.defaultWallpaper`.

If any clip is configured, or `backdrop` is `false`, no theme or default wallpaper is used. A wallpaper that fails to load is skipped with a console warning. `dim` darkens whatever is shown.

## Clip playlist

`Config.media.videos` is a list of rows. A plain string row is treated as `{ video = row }`.

```lua
videos = {
    { video = 'media/intro.webm' },
    { video = 'media/city.webm', audio = 'media/theme.ogg' },
    { image = 'media/hub.png', audio = 'media/voiceover.ogg' },
    { image = 'media/logo.png', seconds = 5 },
},
```

| Field | Meaning |
| --- | --- |
| `video` | WebM clip. FiveM's browser has no H.264 or AAC decoder, so mp4 does not play. |
| `image` | Image shown instead of a video. Ignored if `video` is set. |
| `audio` | Replaces the clip's sound. mp3, ogg, wav, flac or webm. |
| `seconds` | Clip length. Default is the video's length, the audio's length for an image with audio, or `slideSeconds` for a silent image. A shorter video loops until the time is up. |

A row with neither `video` nor `image` is skipped with a console warning. A clip that fails to load is dropped for the rest of the screen. If none load, the themed background shows. Settings are described in [Configuration](./api/configuration.md).

### Ordering

- `sequential` plays top to bottom and loops.
- `shuffle` plays every clip once per round in random order.
- `random` picks any clip each time.

Neither random mode plays the same clip twice in a row. With `videoPinFirst` and more than one clip, the first plays once first and the order applies to the rest. A list of only one clip loops it.

### Playback

Two stacked layers play back to back: one plays while the other preloads the next clip, and the next is revealed only once its first frame is painted, so a clip change does not show a black frame. `videoOverlap` above 0 crossfades picture and sound.

### Sound

If the game refuses to start sound by itself, the clip plays muted, the mute button shows as muted, and the player's first click anywhere turns sound on. Mute and volume are remembered in `localStorage` (`kora_loading:clipSoundMuted`, `kora_loading:clipVolume`). If the music player also plays, both are heard.

### Encoding tips

Encode clips with a keyframe at the start and keep a common resolution.

## Music player

```lua
Config.musicPlayer = {
    enabled = true,
    volume = 0.3,
    tracks = {
        { title = 'Night Drive', artist = 'Kora Radio', url = 'media/night-drive.mp3' },
    },
}
```

- With no tracks and no `Config.media.music`, nothing is drawn.
- `url` accepts mp3, ogg, wav, flac or webm. A track that cannot play is skipped; if all fail, the panel hides.
- A missing `title` falls back to the file name.
- Tracks play in order and loop. A single track loops in place.
- Controls are mouse-only. If the game blocks autoplay, the panel shows "Press play to start the music" until the player clicks.
- Volume (`kora_loading:volume`) and mute (`kora_loading:muted`) are saved per player.
