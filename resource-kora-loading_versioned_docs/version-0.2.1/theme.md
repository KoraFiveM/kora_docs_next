---
title: Theme
sidebar_position: 8
---

# Theme

The screen has no colour settings of its own. Colours and fonts come from `kora_theme`. A loadscreen runs before other resources are mounted, so the page uses its own copies in `html/kora_theme/` (`theme.js`, `theme.json` and `fonts/`) and then loads the live `https://cfx-nui-kora_theme/theme.js` to re-apply everything once it is reachable.

## Refreshing the copies

After changing `kora_theme/theme.json` or updating `kora_theme`, run:

```bash
node tools/sync-theme.mjs            # copy from kora_theme
node tools/sync-theme.mjs --check    # exit 1 if the copies are stale
node tools/sync-theme.mjs path/to/kora_theme
```

Without a path the tool looks for `kora_theme` next to this resource, then in a sibling `[standalone]` folder, then one level further up. It exits with code 2 if none is found. The copy also removes files in `html/kora_theme/fonts/` that no longer exist in `kora_theme`. Do not edit `html/kora_theme/` by hand.

## Fonts

The heading, body and mono fonts follow `kora_theme`'s font settings. `Config.theme.fonts = false` makes this screen use the plain built-in font stack.

## Player accent colour

The player's own accent colour is stored by `kora_theme`, which only the client script can read. To show it on the next loading screen:

1. The hidden in-game page `html/sync.html` (set as `ui_page`) asks the client for the colour once with the `loadingscreen:syncTheme` callback, and listens for `kora_loading:playerTheme` messages.
2. It saves a `#RRGGBB` value to `localStorage` under `kora_loading:playerTheme`, or removes it when the player has no custom colour.
3. The next loading screen reads that value on its first paint.

`client.lua` forwards `kora_theme:playerThemeChanged` as the `kora_loading:playerTheme` message. See [Events](./api/nui.md).

## Cache busting

`html/index.html` loads `style.css?v=` and `app.js?v=`. Bump the number when you edit either file so FiveM's cached copy is not reused.
