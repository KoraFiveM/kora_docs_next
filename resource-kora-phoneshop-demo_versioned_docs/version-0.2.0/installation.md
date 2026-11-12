---
title: Installation and dependencies
sidebar_position: 3
---

# Installation and dependencies

## Dependencies

Declared in `fxmanifest.lua`:

| Resource | Used for |
| --- | --- |
| `kora_lib` | Loaded as a shared script (`@kora_lib/init.lua`); `Kora.textui` shows and hides the on-screen hint |
| `kora_target` | `exports.kora_target:addBoxZone` and `removeZone` for the "Try the Atlas Fold" interaction |
| `kora_phoneshop` | Provides the stand model and the `phoneshop_phones` texture dictionary containing `psp_bigfold_screen` |
| `kora_phone` | Must serve `web/dist/index.html` with demo mode (`?demo=fold&embed=screen`) over `nui://` |

## Steps

1. Place the resource in your resources folder.
2. Ensure it after its dependencies:

   ```cfg
   ensure kora_lib
   ensure kora_target
   ensure kora_phoneshop
   ensure kora_phone
   ensure kora_phoneshop_demo
   ```

3. No SQL, items, locales or configuration are needed.

## Compatibility

The stand position and screen geometry are hard-coded for the `kora_phoneshop` map (see [How it works](./how-it-works.md)). If that map or the `kora_phone` build changes, the constants may need to be updated. `kora_phone` must be built so that `web/dist/index.html` exists.
