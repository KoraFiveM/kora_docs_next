---
title: kora_jewellery
sidebar_position: 1
---

# kora_jewellery

`kora_jewellery` lets players rob the Vangelico jewellery store in Rockford Plaza. Players target one of 20 display cases ("vitrines") with a listed weapon, smash it during a progress bar and receive a random piece of jewellery. The first smash raises a police alarm and sends a dispatch call. It is a port of `qb-jewelery` and still uses the legacy `qb-jewellery:*` event and callback names.

Current version: see `version` in `fxmanifest.lua`.

## Features

- **Map blip** - a short-range blip ("Vangelico Jewelry", sprite 617, colour 3) at `Config.JewelleryLocation`.
- **Display case targets** - every entry in `Config.Locations` becomes a `kora_target` box zone with the option "Smash the display case" followed by the case number. The option is hidden while the case is opened or busy.
- **Weapon check** - only weapons listed in `Config.WhitelistedWeapons` can smash a case. The value for each weapon is the progress bar duration in milliseconds. This check runs on the client only.
- **Police requirement** - the server refuses to start a smash, and refuses the reward, when fewer than `Config.RequiredCops` players are on duty as `leo` (checked with `kora_core`).
- **Alarm and dispatch** - the first alarm request while no alarm is active marks the store as alarmed and creates a `kora_dispatch` call ("Jewellery Store Alarm", priority 1, for `leo` job types) at the player's position.
- **Case locking** - a case can be smashed by one player at a time. A cancelled smash or a player disconnecting frees the case again.
- **Loot** - when the progress bar completes, the server rolls one reward from `Config.VitrineRewards` by probability and adds it through `qb-inventory`. If the player cannot carry it, the case is freed and they are told "You have to much in your pocket".
- **Fingerprints** - at the start of a smash, without gloves there is an 80% chance of triggering `evidence:server:CreateFingerDrop`; with gloves there is a 5% chance, plus a "You've left a fingerprint on the glass" notification.
- **Reset** - the store (all cases and the alarm) resets once `Config.Timeout` has elapsed after the alarm. See [Configuration](./api/configuration.md#reset-behaviour).
- **Shared state** - case and alarm state is published to all clients in `GlobalState.Jewellery`. See [Events](./events.md#globalstate).

## Requirements

Declared in `fxmanifest.lua`:

| Resource | Used for |
| --- | --- |
| `kora_lib` | The `Kora` API: config adoption, locales, notifications, callbacks, distance checks, blips, progress bar, streaming, global state wait |
| `kora_core` | `getDutyCountByType` (police on duty) and `isWearingGloves` |

Used but not declared as a dependency (the resource fails at runtime, not at start, if they are missing):

| Resource | Used for |
| --- | --- |
| `kora_target` | `exports.kora_target:addBoxZone` for the case targets (client) |
| `kora_dispatch` | `exports.kora_dispatch:createCall` for the alarm call (server) |
| `kora_inventory` (provides `qb-inventory`) | `exports['qb-inventory']:CanAddItem` and `AddItem` for rewards (server) |
| `kora_police` (or any resource handling the event) | Net event `evidence:server:CreateFingerDrop` for fingerprints |
| An InteractSound-compatible resource such as `kora_sound` | Net event `InteractSound_SV:PlayOnSource` for the glass sound `breaking_vitrine_glass` |

## Installation

See [Installation](./installation.md) for dependencies, load order and the manifest.

## Documentation map

- [Installation](./installation.md) - declared and undeclared dependencies, load order, manifest, setup notes and testing
- [How to use](./how-to-use.md) - the heist end to end, annotated client flow and what the police requirement gates
- [API reference](./api/index.md) - module index (this resource has only a configuration module)
  - [Configuration](./api/configuration.md) - every `Config` option, plus code-derived details on weapons, rewards, locations and locales
- [Events](./events.md) - net events, callback, global state and the flow of a robbery
- [Items](./items.md) - reward items and drop chances
- [Troubleshooting](./troubleshooting.md) - known caveats and common problems

This resource registers no commands, exposes no exports and has no NUI.
