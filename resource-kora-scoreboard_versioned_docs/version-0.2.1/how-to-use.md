---
title: "How to use"
sidebar_position: 3
---


# How to use

Press (or hold) a key to see how many players are online against the configured capacity, how many police are on duty, and which police-gated activities are currently ready. Nearby players can optionally show a floating server ID above their head while the panel is open.

## Opening the panel

- The key is bound with `RegisterKeyMapping('+scoreboard', ...)` to `Config.OpenKey` (default `HOME`); players can rebind it in FiveM's own key bindings settings.
- `Config.Toggle = true` (default): press once to open, press again (or Escape) to close. The panel stays open after the key is released.
- `Config.Toggle = false`: the panel only shows while the key is held down, and closes as soon as it is released (or immediately if the player releases it before the server answered).
- Opening triggers the kora_core callback `qb-scoreboard:server:GetScoreboardData`, which returns the live total player count, the on-duty `police` count, and an opt-in flag per online player (`exports.kora_core:isOptin(source)`). The panel is built from that snapshot and does not auto-refresh while open except for the activity table.

## Overview page

- A stats row: `Players online` as `current / Config.MaxPlayers`, and `Police on duty`.
- A table, `Police-gated activities`, one row per `Config.IllegalActions` entry, sorted alphabetically by label: the activity name, the police required, and a status badge — `On cooldown` (warning) while the server has marked it busy, `Ready` (success) if on-duty police meet the requirement, otherwise `Needs more police` (destructive).
- The activity badges update live without reopening the panel whenever the server broadcasts a cooldown change (see Activity cooldowns below), and whenever a live-reloadable config value changes.

## Nearby player IDs

- While the panel is open, two client threads scan players within 10.0 units every 500 ms and draw a floating `[id]` label above each one whose criteria are met (a tight render loop runs with no wait while anyone qualifies, otherwise it falls back to the scan interval).
- `Config.ShowIDforALL = true` (default false) shows every nearby player's ID regardless of their own preference. When false, only players who have opted in (via kora_core) are shown.
- The scan and render threads stop automatically once the panel closes (`Kora.nui.isAppOpen` becomes false).

## Activity cooldowns are trusted-server-only

Whether an activity shows `Ready` or `On cooldown` is driven entirely by other server resources, never by the client or by config.

- A robbery resource (for example kora_robberies or kora_truckrobbery) calls `TriggerEvent('qb-scoreboard:server:SetActivityBusy', activityId, true/false)` locally on the server. This is an `AddEventHandler`, not a net event, so a client can never trigger it directly.
- The handler validates `activityId` is a string key of `Config.IllegalActions` and `bool` is a real boolean before broadcasting `qb-scoreboard:client:SetActivityBusy` to every client, which flips that row to `On cooldown` or back and rebuilds the panel if it is open.
- The actual minimum-police requirement for each activity is enforced by the robbery resource itself; `Config.IllegalActions[id].minimumPolice` here is purely a display value that you should keep matching.

## Overview panel details

The app is registered as `qb-scoreboard:app` (title "Scoreboard", compact layout, 580 by 620, placed on the right). It has one navigation entry, "Overview", titled "Server status", with two blocks:

- **Stats** - "Players online" shown as `online / capacity` and "Police on duty".
- **Table** - "Police-gated activities" with the columns Activity, Required police and Status. If no activities are configured the table shows "No police-gated activities are configured."

## Counts

Numbers come from the server callback `qb-scoreboard:server:GetScoreboardData` (see [Events and callbacks](./events.md)):

- Players online is the number of players returned by `kora_core` `getAllPlayers`.
- Police on duty counts players whose job name is exactly `police` and who are on duty. The job name is hardcoded.
- The capacity (`Config.MaxPlayers`) is display only. It defaults to the `sv_maxclients` convar (48 if unset).

The player and police figures are fetched once each time the scoreboard is opened and are not refreshed while the panel stays open.

## Activity status

For each entry in `Config.IllegalActions` the status badge is chosen in this order:

1. **On cooldown** (warning) - the activity has been flagged busy through `qb-scoreboard:server:SetActivityBusy`.
2. **Ready** (success) - police on duty is greater than or equal to the activity's `minimumPolice`.
3. **Needs more police** (destructive) - otherwise.

This is informational only. The scoreboard never blocks or starts a robbery; the robbery resource enforces its own rules.

## Nearby ID labels

Labels are drawn in white as `[serverId]` about one metre above the player's head. The opt-in flag is read from the server when the scoreboard opens. Labels stop when the panel closes.

## Live configuration

Options are registered with `Kora.config`, so owners can edit them in the Kora config UI. Options marked live apply without a restart; see [Configuration](./configuration.md).

## Optional FFT hooks

`fft_hooks.lua` is a development hook for the `fft` test runner. It does nothing unless the convar `fft_kora_hooks` is `true`. When enabled it exports `fftVersion` and `fftAction` (only callable by the `fft` resource with an authorised session) and offers a read-only `view` action that summarises the last data sent to the app. It does not alter scoreboard behaviour.
