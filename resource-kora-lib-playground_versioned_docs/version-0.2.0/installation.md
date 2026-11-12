---
title: Installation
sidebar_position: 2
---

# Installation

## Dependencies

Declared in `fxmanifest.lua` (`dependency`): `kora_lib`, `kora_core`, `kora_inventory`, `kora_target`, `kora_clothing`, `kora_admin`. The manifest also loads `@kora_lib/init.lua` as a shared script, which provides the `Kora` global.

Used by code but not declared in the manifest (the related commands check `GetResourceState` or `requireResource` and report that the resource is not started, except where noted in [Troubleshooting](./troubleshooting.md)):

| Resource | Used for |
| --- | --- |
| `kora_sql` | `playground:sqlStats` calls `exports.kora_sql:stats()`; `/testsql_ping`, `/testsql_queue`, `/testsql_slow` run the `kora_sql` command |
| `kora_vehiclekeys` | `playground:giveVehicleKeys` calls `exports.kora_vehiclekeys:giveKeys` |
| `kora_fuel` | `/testvehicle` fills the tank; `/testfuel_status` |
| `kora_chat`, `kora_phone`, `kora_emotemenu`, `kora_voice`, `kora_utils`, `kora_banking`, `kora_hud`, `kora_police`, `kora_ambulance` and others | the per-resource check commands (see [Commands](./commands.md)) |
| `kora_theme` | colours for the hosted feedback report page (falls back to a default green if absent) |

## server.cfg

```cfg
ensure kora_lib
ensure kora_core
ensure kora_inventory
ensure kora_target
ensure kora_clothing
ensure kora_admin
ensure kora_lib-playground

# Allow testers to use the developer tools and /test setup (see Permissions)
add_ace group.admin command.playground allow

# Feedback delivery (/fb). Both are required; the secret must be at least 32 characters.
set kora_lib_playground_feedback_bot_url "http://127.0.0.1:31290/feedback"
set kora_lib_playground_feedback_bot_secret "change-me-to-a-long-random-secret"
# Optional: public root of this FXServer so reports are hosted as a web page
set kora_lib_playground_feedback_public_url "https://play.example.com"

# Optional: communitybot link (live status, /test)
set kora_connect_bot_url "http://127.0.0.1:31291/fx-event"
set kora_connect_bot_secret "same value as FIVEM_EVENT_SECRET in communitybot"

# Optional: register the shared inventory stash used by /testinventory
set kora_lib_playground_fixtures 1
```

## Notes

- No SQL import is needed.
- `feedback_uploader.js` is a server script that uses Node built-ins only; there is no `package.json` at the resource root.
- If the Node uploader is not running, `/fb` fails with a message to run `refresh` and restart the resource. See [Troubleshooting](./troubleshooting.md).
- Never put the bot secret in a client script or committed config file. All convars above are read on the server only.
