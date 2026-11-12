---
title: kora_phoneshop_demo
sidebar_position: 1
---

# kora_phoneshop_demo

`kora_phoneshop_demo` puts a live, touchable phone on the giant Atlas Fold display stand in the Kora phone shop (`kora_phoneshop`). The stand's screen texture is replaced by a DUI that runs the `kora_phone` web app in demo mode, and players can use it with the mouse and keyboard. It is client-only: no server script, database, items, commands, exports or events.

Current version: see `version` in `fxmanifest.lua`.

## Pages

- [How it works](./how-it-works.md) - screen replacement, interaction, controls and cleanup
- [Installation and dependencies](./installation.md) - required resources, load order and compatibility
- [Troubleshooting](./troubleshooting.md) - common problems and how to adjust the hard-coded constants

## Features

- **Live screen** - when the player is within 25 units of the stand, the texture `psp_bigfold_screen` (in the `phoneshop_phones` texture dictionary) is replaced by a DUI showing `kora_phone`. Further away the DUI is parked on `about:blank` so nothing renders.
- **Try the Atlas Fold** - a `kora_target` box zone over the screen with a "Try the Atlas Fold" option (distance 2.0).
- **Mouse and keyboard** - the camera moves in front of the screen, the mouse cursor is mapped onto the screen, and clicks, scrolling and typed keys are forwarded to the demo phone.
- **Isolated** - the demo uses mock data (`demo=fold` mode in `kora_phone`). The resource itself sends nothing to the server.

## Not provided

There is no `config.lua`; all values are constants at the top of `client.lua`. There are no commands, exports, events, ACE permissions, locales, SQL or items.
