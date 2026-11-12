---
title: Troubleshooting
sidebar_position: 8
---

# Troubleshooting

## The target option does not appear

- The case is opened or busy (`GlobalState.Jewellery`), or the store has not reset yet.
- `kora_target` is not running, or `GlobalState.Jewellery` was not set within 30 seconds (the client prints `[kora_jewellery] timed out waiting for GlobalState.Jewellery`).

## "Your weapon is not strong enough.."

The equipped weapon is not a key of `Config.WhitelistedWeapons`. Fists and melee weapons are not listed by default.

## "Minimum of N police needed"

Fewer than `Config.RequiredCops` players are on duty as `leo`. The message also shows the current count.

## The store never resets

The reset timer only starts from the first alarm. If the alarm was never raised (for example the `firstAlarm` event was not sent or was refused for lack of police), opened cases stay opened until an alarm is raised and `Config.Timeout` passes, or the resource restarts. State is in memory only.

## No dispatch call, no loot or no sound

Check that `kora_dispatch`, `kora_inventory` (providing `qb-inventory`) and an InteractSound-compatible resource are running. They are not declared in `fxmanifest.lua`.

## Some messages are not translated

Only `locales/en.lua` contains `error.police_on_duty`, `error.case_unavailable`, `error.smash_cancelled` and `general.title`. The other locale files lack them. The `asserts` strings in every locale are not used by the code.
