---
title: Events
sidebar_position: 6
---

# Events, callbacks and state

All names keep the legacy `qb-jewellery` prefix. Every server handler validates the case index and the player's distance (5.0 m) to the case `coords` with `Kora.distance.player`.

## Server callback

| Name | Arguments | Returns |
| --- | --- | --- |
| `qb-jewellery:server:startSmash` | `k` (case index) | `true`, or `false` plus an optional reason shown to the player. |

It fails when the case does not exist or the player is too far (no reason), when fewer than `Config.RequiredCops` are on duty, or when the case is already opened or busy. On success the case is marked busy for the caller.

## Net events (client to server)

| Event | Arguments | Behaviour |
| --- | --- | --- |
| `qb-jewellery:server:firstAlarm` | `id` | Ignored if an alarm is already active, the player is too far, or too few police are on duty. Otherwise sets `firstAlarm`, starts the reset timer and creates a dispatch call. |
| `qb-jewellery:server:setVitrineState` | `k`, `bool` | `true` marks the case busy for the caller (same police and availability checks). `false` frees it only if the caller owns the lock. Non-boolean values are ignored. |
| `qb-jewellery:server:vitrineReward` | `id` | Requires the case to be busy and owned by the caller. If police dropped below the requirement the case is freed and the player notified. Otherwise rolls the reward, checks `CanAddItem`, marks the case opened and calls `AddItem`. A per-case lock blocks duplicate claims. |

## Events and exports used from other resources

- `exports.kora_dispatch:createCall({ jobTypes = { 'leo' }, coords, description, priority = 1 })` (server).
- `exports.kora_core:getDutyCountByType('leo')` (server) and `exports.kora_core:isWearingGloves()` (client).
- `exports['qb-inventory']:CanAddItem` and `AddItem` (server).
- `exports.kora_target:addBoxZone` (client).
- `evidence:server:CreateFingerDrop` with the player position, and `InteractSound_SV:PlayOnSource` with `breaking_vitrine_glass` and volume 0.25 (net events triggered from the client).

## GlobalState

`GlobalState.Jewellery` is a table `{ firstAlarm = boolean, locations = Config.Locations }`, republished by the server whenever state changes. The client waits up to 30 seconds for it before creating the target zones, and hides the target option for cases with `isOpened` or `isBusy`.

## Robbery flow

1. The player targets a case with a whitelisted weapon. The client sends `firstAlarm` if no alarm is active in `GlobalState`.
2. The client calls `startSmash`. On success it rolls fingerprints, moves the player to the case `offset`, plays the animation and particles, and runs the progress bar.
3. On completion the client sends `vitrineReward`; on cancel it notifies the player and sends `setVitrineState` with `false`.
4. After `Config.Timeout` since the alarm, the server clears every case and the alarm.
5. If a player disconnects mid-smash, their busy cases are freed.
