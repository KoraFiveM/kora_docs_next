---
title: Configuration
sidebar_position: 3
---

# Configuration

All options are in `server/sv_queue_config.lua` (a server script, loaded before the queue). Restart the resource after editing. For convars see [Installation](./installation.md#convars).

## General options

| Option | Default | Description |
| --- | --- | --- |
| `Config.Priority` | three placeholder entries | Table of identifier to priority power. Placeholders (`STEAM_0:1:0000####`, `steam:110000######`, `ip:127.0.0.0`) should be replaced or removed. See [Priority](./priority.md). |
| `Config.RequireSteam` | `false` | Reject players with no identifier starting with `steam` (message `Config.Language.steam`). |
| `Config.PriorityOnly` | `false` | Only players with priority (permanent or temporary) may join; others get `Config.Language.wlonly`. |
| `Config.DisableHardCap` | `true` | Stops the `hardcap` resource and cancels its start. Keep `true` so the built-in player cap does not interfere. |
| `Config.JoinDelay` | `30000` | Milliseconds after resource start during which players can queue but are not admitted. |
| `Config.AntiSpam` | `false` | Hold each connecting player on a countdown before they enter the queue. |
| `Config.AntiSpamTimer` | `30` | Countdown length in seconds. |
| `Config.PleaseWait` | `Please wait %f seconds...` | Countdown text. Must contain one numeric format specifier. |

## Timeouts

| Option | Default | Description |
| --- | --- | --- |
| `Config.QueueTimeOut` | `90` | Seconds without a reachable connection before a queued player is removed ("Removed due to timeout"). |
| `Config.ConnectTimeOut` | `600` | Seconds a player may stay in the connecting list (admitted but not yet activated). A connecting player with no endpoint is already removed after 300 seconds. |

Players leave the connecting list when the client triggers `Queue:playerActivated` once its session has started (see [Events](./events.md)).

## Grace priority

| Option | Default | Description |
| --- | --- | --- |
| `Config.EnableGrace` | `false` | Give temporary priority to a player's first identifier when they are admitted to load in and when they disconnect. |
| `Config.GracePower` | `5` | Power of the temporary priority. |
| `Config.GraceTime` | `480` | Duration in seconds. |

## Connection card

`Config.Card` controls the Adaptive Card shown to queued players. When `Config.Card.enabled` is `false` the text messages from `Config.Language` are used instead.

| Option | Default | Description |
| --- | --- | --- |
| `enabled` | `true` | Use the card. |
| `fallbackToText` | `true` | If presenting the card fails, send the text position message. |
| `image.enabled`, `image.url`, `image.size`, `image.horizontalAlignment` | `false`, `""`, `Large`, `Center` | Optional image at the top. Shown only when enabled and `url` is not empty. |
| `title` | `Kora` | Heading. |
| `description` | welcome text | Sub-heading. |
| `show.playerName`, `show.position`, `show.queueSize`, `show.queueTime`, `show.priority`, `show.serverName`, `show.maxPlayers` | all `true` except `maxPlayers` | Which facts are listed (Player, Position, Queue, Queue Time, Priority, Server, Slots). |
| `status.enabled` | `true` | Show the status line. |
| `status.label` | `Status` | Prefix of the status line. |
| `status.waiting`, `status.joining`, `status.connecting` | text | Status text for each stage. |
| `footer` | `Join our community to play.` | Small text at the bottom. |
| `extraText` | empty | List of extra centered text lines. |

Text fields (`title`, `description`, `footer`, `extraText` entries, `image.url`) support these variables: `${playerName}`, `${position}`, `${queueSize}`, `${queueTime}`, `${priority}`, `${serverName}`, `${maxPlayers}`, `${status}`. Unknown variables become empty text.

The `serverName` fact shows `sv_hostname` as read when the resource started, or `FiveM Server` when it is the default.

## Language

`Config.Language` holds plain-text messages: `joining`, `connecting`, `idrr` (no identifiers), `err`, `pos` (position format, takes position, queue size and time), `connectingerr`, `timedout`, `wlonly`, `steam`. These are used for errors and when the card is disabled or falls back to text.

## Options with no effect

- `Config.ShowTemp` - not read anywhere in the code.
- `Config.Language.timedout` - not read anywhere in the code (the timeout messages are hard-coded as `[Queue] Removed due to timeout`).
