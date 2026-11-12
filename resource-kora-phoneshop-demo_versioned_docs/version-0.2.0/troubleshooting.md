---
title: Troubleshooting
sidebar_position: 4
---

# Troubleshooting

## The stand screen shows the normal static image

- Stay within 25 units of the stand; the demo only runs inside `LIVE_RANGE`.
- Check that `kora_phoneshop` is started and that it contains the `phoneshop_phones` texture dictionary with `psp_bigfold_screen`.
- Check that `kora_phone` is started and its `web/dist/index.html` was built.

## The screen is black or blank

The DUI loads `nui://kora_phone/web/dist/index.html?demo=fold&embed=screen`. If the page is missing or does not support demo mode, nothing is shown. Open the client console (F8) for errors.

## No "Try the Atlas Fold" option

Check that `kora_target` is started. The zone is created when the resource starts; restart this resource after restarting `kora_target`.

## Typing does nothing

Keys only reach the phone while a screen session is active and are limited to 16 characters per key. Make sure the phone page is focused on an input by clicking it first.

## The mouse hits the wrong place

The pointer is computed from the constants in `client.lua` (`POS`, `HEADING`, `SCREEN_*`). If the stand was moved or rotated in `kora_phoneshop`, update them to match.

## Stuck camera or focus

Press Esc or Backspace to leave. Restarting the resource also resets the camera and NUI focus.
