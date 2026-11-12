---
title: How it works
sidebar_position: 2
---

# How it works

All logic is in `client.lua`. `html/keys.html` is an invisible NUI page used only to capture keyboard input.

## Screen texture

A runtime texture dictionary `kora_phoneshop_demo` is created on first use, with a DUI of 1104 x 1248 pixels (the aspect of the unfolded Fold). The DUI loads this URL:

```text
nui://kora_phone/web/dist/index.html?demo=fold&embed=screen
```

`AddReplaceTexture('phoneshop_phones', 'psp_bigfold_screen', ...)` swaps the stand's screen texture for the DUI. The texture and the stand model belong to `kora_phoneshop`.

A loop checks the distance between the player and the screen centre (every 1000 ms when idle, 500 ms when live):

- Within 25 units: the screen is live. On the first visit the DUI is created; on later visits its URL is set again so the demo starts with fresh sample data.
- Beyond 25 units: the replace texture is removed and the DUI is set to `about:blank` to stop rendering.

## Using the screen

The `kora_target` box zone is placed on the screen. Selecting "Try the Atlas Fold" (only works while the screen is live) starts a session:

1. A `Kora.textui` hint is shown (key label `Esc`) saying to tap the screen with the mouse and type with the keyboard.
2. NUI focus is taken with keyboard input only (`SetNuiFocus(true, false)` and keep-input) so the game still receives mouse and Esc.
3. A scripted camera is placed 1.15 units in front of the screen, FOV 55, with a 400 ms ease.
4. Every frame all game controls are disabled and the mouse cursor is shown. The cursor ray is intersected with the screen plane and converted to DUI pixels.

| Input | Effect |
| --- | --- |
| Mouse move over the screen | Moves the DUI pointer |
| Left click (control 24) | Mouse down/up in the DUI |
| Mouse wheel (controls 241, 242) | Scrolls the DUI by 120 units |
| Keyboard | Forwarded to the DUI page as a `demo-key` message |
| Esc (200) or Backspace (177) | Leaves the screen and restores the camera |

The relay page `html/keys.html` posts each key (except Escape) to the NUI callback `key` with `key`, `ctrl` and `shift`. The callback accepts it only while a session is active, and only when the key is a string of at most 16 characters, then sends it to the DUI with `SendDuiMessage`. The receiving side (`kora_phone` demo mode) is outside this resource.

On exit the focus, hint and camera are released, and the pause menu is suppressed until Esc is released.

## Cleanup

On `onResourceStop` the zone is removed, NUI focus is released if in use, the replace texture is removed, the DUI is destroyed and the scripted camera rendering is turned off.

## Constants

Defined at the top of `client.lua`:

| Constant | Meaning |
| --- | --- |
| `POS` | Stand origin (floor, base centre), taken from the `kora_phoneshop` map |
| `HEADING` | Stand heading in radians; the stand faces the front doors |
| `SCREEN_Z`, `SCREEN_Y` | Screen centre height and face offset in the stand's local frame |
| `SCREEN_W`, `SCREEN_H` | Screen size in world units |
| `DUI_W`, `DUI_H` | DUI resolution |
| `URL` | Page loaded in the DUI |
| `LIVE_RANGE` | Distance at which the screen becomes live (25.0) |
