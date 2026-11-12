---
title: Configuration
sidebar_position: 6
---

# Configuration

Defaults live in `shared/config.lua`. Each value is registered through `Kora.config` (from `kora_lib`), which lets server owners override it in the Kora configuration UI. The README refers to this as `/config`; that command belongs to `kora_lib`/`kora_core`, not to this resource.

## Options

| Option | Default | Live | Description |
| --- | --- | --- | --- |
| `Config.Toggle` | `true` | no | When true, the key opens and closes the scoreboard. When false, the scoreboard is shown only while the key is held. |
| `Config.OpenKey` | `HOME` | no (advanced) | Default key used for the key mapping of new players. 1 to 32 characters, such as `HOME` or `F10`. Restart the resource after changing it. |
| `Config.ShowIDforALL` | `false` | yes | Draw an ID above every nearby player while open. When false, only opted-in players get a label. |
| `Config.MaxPlayers` | `GetConvarInt('sv_maxclients', 48)` | yes | Capacity shown after the online count. Display only (1 to 2048). |
| `Config.IllegalActions` | see below | per field | Table of police-gated activities. |

"Live" means the option is flagged `live` in `Kora.config`; the client rebuilds the panel when values change.

Existing players keep their own FiveM key binding; `OpenKey` is only the default for a binding that does not exist yet. Players can rebind "Open Scoreboard" in FiveM key settings.

## Activities

Each key of `Config.IllegalActions` is an activity id. The id is what robbery scripts pass to `qb-scoreboard:server:SetActivityBusy`. Each entry has:

| Field | Live | Description |
| --- | --- | --- |
| `minimumPolice` | yes | On-duty police needed for the row to read "Ready" (0 to 2048). |
| `label` | yes | Display name (1 to 80 characters). |

Defaults:

| Id | Label | Minimum police |
| --- | --- | --- |
| `storerobbery` | Store Robbery | 1 |
| `bankrobbery` | Bank Robbery | 3 |
| `jewellery` | Jewelery | 2 |
| `pacific` | Pacific Bank | 5 |
| `paleto` | Paleto Bay Bank | 4 |

Only the fields `minimumPolice` and `label` of the default activities are exposed through `Kora.config`; adding a new activity id means editing `shared/config.lua`.

## Footer text

The panel footer is set when the app is registered: "Press KEY or Escape to close" in toggle mode, or "Hold KEY to view" in hold mode, where KEY is `Config.OpenKey`. It is not updated when a player rebinds the key or when `Toggle` changes at runtime.
