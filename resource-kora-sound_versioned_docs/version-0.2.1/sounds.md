---
title: Sounds
sidebar_position: 6
---

# Sounds

## Bundled files

`client/html/sounds/` holds 87 `.ogg` files, all listed in the manifest `files` block. Use the name without the extension:

`airwrench`, `Alert`, `alreadyusing`, `BellStartEnd`, `beltalarm`, `breaking_vitrine_glass`, `carbuckle`, `carunbuckle`, `catclosing`, `cellcall`, `Clothes1`, `coffee_machine`, `consume`, `Cuff`, `deepfried`, `demo`, `dice`, `doorbell`, `DoorClose`, `doorknock`, `DoorOpen`, `handcuff`, `heartmonbeat`, `heartmondead`, `hobbs1`, `hobbs2`, `hobbs3`, `hobbs4`, `hobbs6`, `hobbs7`, `hobbs9`, `houses_door_close`, `houses_door_lock`, `houses_door_open`, `houses_door_unlock`, `impactdrill`, `jaildoor`, `jail`, `jumpland`, `keydoors`, `keys`, `knock_door`, `LockerOpen`, `lock`, `lockpick`, `lord2`, `lord`, `metaldetected`, `metaldetector`, `monkeyopening`, `nv`, `pager`, `panic`, `payphoneend`, `payphoneringing`, `payphonestart`, `photo`, `purge`, `radioclick`, `radiostatic1`, `radiostatic2`, `radiostatic3`, `rapell`, `ringing`, `robberydraw`, `robberyglass`, `RumbleStart`, `seatbeltoff`, `seatbelt`, `security-alarm`, `shiftyclick`, `Shop`, `SodaMachine`, `speedcamera`, `Stash`, `StashOpen`, `tooshort`, `towtruck2`, `towtruck`, `Uncuff`, `unlock`, `vending_machine`, `ventilator`, `warehousealert2`, `warehousealert`, `watermachine`, `ziptie`

Names are case sensitive.

## Adding sounds

1. Put the `.ogg` file in `client/html/sounds/` (the manifest already includes `sounds/*.ogg`).
2. Use a name of letters, digits, `_` and `-` only; the legacy server events reject anything else.
3. Optionally map it to a category in `Config.soundCategory`.

## NUI behaviour

The page (`client/html/index.html`) receives `playSound` and `stopSound` messages and plays `./sounds/<name>.ogg` with Howler.

- A sound started with an `id` is tracked; starting the same `id` again replaces the old one. `stopSound` with that `id` unloads it.
- Sounds without an `id` are tracked as one "last one-shot": a new one-shot unloads the previous one, so only one untracked sound plays at a time.
- Non-looping sounds unload when they end.
