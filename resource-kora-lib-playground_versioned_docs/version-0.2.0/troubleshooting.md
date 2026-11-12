---
title: Troubleshooting
sidebar_position: 12
---

# Troubleshooting

## /fb says feedback is not configured

Set both `kora_lib_playground_feedback_bot_url` (http or https URL) and `kora_lib_playground_feedback_bot_secret` (32 or more characters). The console prints "feedback is disabled" once.

## "uploader is unavailable"

The Node script `feedback_uploader.js` did not signal ready. Run `refresh` and `restart kora_lib-playground`.

## "The screenshot could not be captured"

`Config.feedback.screenshotResource` (`kora_lib`) must be started and provide `requestClientScreenshot`. Set `requireScreenshot = false` to deliver reports without one.

## Reports are delivered but have no link

`kora_lib_playground_feedback_public_url` is unset or invalid, so a compact Discord embed is used. The URL must be reachable from the browser and point at the FXServer HTTP endpoint.

## /test says the bot link is not configured

Set `kora_connect_bot_secret`, and make sure `kora_connect_bot_url` ends in `/fx-event`. If the URL does not, no test URL can be derived.

## Spawned vehicle has no keys, or an error in the server console

`playground:giveVehicleKeys` calls `exports.kora_vehiclekeys:giveKeys` without a state check and the resource is not in the manifest dependencies. If `kora_vehiclekeys` is not started the callback errors and the client shows "no server answer".

## /testinventory shows an empty or missing stash

Set `kora_lib_playground_fixtures 1`. The stash is registered at start and again when `kora_inventory` restarts.

## restart.json shows in git status

The file is written on every start and is tracked in the repository. Do not commit changes to it.

## Known quirks

- `bot/.env.example` refers to a `qblib_playground_feedback_bot_secret` convar; the real name is `kora_lib_playground_feedback_bot_secret`.
- `bot/.env.example` sets `FEEDBACK_DB_PATH=./feedback.db`; if the variable is unset the default is `./data/feedback.sqlite`.
