---
title: Configuration
sidebar_position: 3
---

# Configuration

`config.lua` is a server script and is never sent to clients. At the end it calls `Kora.config.adopt(Config)` when that function exists, registering the table with `kora_lib`. `config.local.lua` is git-ignored for per-server overrides generated elsewhere.

## Convars

Set these in `server.cfg`. Names marked as configurable can be renamed through `Config.feedback`.

| Convar | Default | Purpose |
| --- | --- | --- |
| `kora_lib_playground_feedback_bot_url` | unset | URL of the feedback bot `POST /feedback` endpoint. Must match `^https?://` with no spaces. |
| `kora_lib_playground_feedback_bot_secret` | unset | Shared secret, at least 32 characters. |
| `kora_lib_playground_feedback_public_url` | unset | Public base URL of FXServer. Without it, Discord receives a compact embed instead of a hosted report page. |
| `kora_lib_playground_feedback_primary` | unset | `#RRGGBB` primary colour for the report page; when unset the page follows `kora_theme`. Read by `feedback_uploader.js`. |
| `kora_lib_playground_feedback_debug` | `0` | `1` prints timing for each feedback stage and failed connect pushes. |
| `kora_lib_playground_fixtures` | `0` | `1` registers the `playground-locker` stash in `kora_inventory`. |
| `kora_connect_bot_url` | `http://127.0.0.1:31291/fx-event` | communitybot receiver. `/test` replaces a trailing `/fx-event` with `/game-test`. |
| `kora_connect_bot_secret` | unset | Bearer secret for communitybot. If empty, live pushes are skipped and `/test` reports that the link is not configured. |
| `sv_maxclients` | `48` when unset | Sent as `max` in the `online` and `players` pushes. |

## Config.feedback

| Key | Default | Meaning |
| --- | --- | --- |
| `botUrlConvar`, `botSecretConvar`, `publicUrlConvar`, `debugConvar` | the convar names above | Which convars to read. |
| `reportRetentionHours` | `168` (7 days) | Lifetime of a hosted report. The uploader clamps it to 1 through 2160. |
| `screenshotResource` | `kora_lib` | Resource whose `requestClientScreenshot` export is called. |
| `screenshotEncoding` | `jpg` | `jpg`, `png` or `webp`. |
| `screenshotQuality` | `0.86` | Passed to the capture. |
| `screenshotMaxWidth`, `screenshotMaxHeight` | `1280`, `720` | Capture size limits. |
| `screenshotTimeout` | `15000` | Capture timeout in milliseconds. |
| `requireScreenshot` | `true` | When not `false`, a failed capture fails the whole report. |
| `screenshotIncludeNui` | `true` | Forwarded to the capture provider as `includeNui`. The config comment notes `kora_lib` cannot composite separate NUI layers. |
| `screenshotMaxBytes` | 8 MiB | Larger captures are rejected. |
| `cooldownSeconds` | `90` | Minimum gap between delivered reports per player. The code enforces at least 15. |
| `maxDescriptionLength`, `maxStepsLength` | `2400`, `1400` | Server-side truncation of the text fields. |
| `inventorySlots` | `41` | Slot count drawn in the report's inventory view (the uploader clamps to 1 through 100). |

## Config.devTools

`cooldownSeconds` per action, enforced on the server per player: `revive = 5`, `vehicle = 10`, `legion = 10`. Actions missing from the table use 5 seconds.

## Config.test

| Key | Default | Meaning |
| --- | --- | --- |
| `tpCooldownMs` | `2000` | Minimum gap between `/test` teleports. |
| `setupCooldownMs` | `3000` | Minimum gap between `/test setup` runs. |
| `feedbackMax` | `1000` | Maximum length of a failure note sent to the bot. |

## Config.logAdminGrants

Default `true`. When true, `playground_giveadmin` and `playground_removeadmin` print a `Granted group.admin` or `Removed group.admin` line. communitybot reads that line from the rcon reply, so leave it enabled when the bot is used.
