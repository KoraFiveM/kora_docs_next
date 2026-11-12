---
title: communitybot integration
sidebar_position: 9
---

# communitybot integration

The resource doubles as the link between the FiveM server and the community Discord bot (communitybot), which runs on the same machine. Nothing here is needed unless that bot is used. All of it is implemented in `server.lua` and `gametest_server.lua`.

## Files written to the resource folder

| File | Written when | Content |
| --- | --- | --- |
| `players.json` | player join/drop and at least every 30 seconds while changed or stale | `updated` (Unix time) and `players`: id, name and Discord ID only (no licence, IP or Steam IDs) |
| `restart.json` | resource start | `startedAt` (Unix time). Treated as the server restart time because this resource only starts with the server. |

`players.json` is git-ignored. `restart.json` is not (see [Troubleshooting](./troubleshooting.md)).

## Live pushes

If `kora_connect_bot_secret` is set, the server POSTs JSON with `Authorization: Bearer secret` to `kora_connect_bot_url` (default `http://127.0.0.1:31291/fx-event`):

| Event | Sent when |
| --- | --- |
| `online` with players and `max` | resource start; `kora_connect_sync` |
| `players` with players and `max` | player join or drop, batched after 1.5 seconds |
| `offline` | resource stop; txAdmin `serverShuttingDown` |

A hard crash cannot announce itself. A failed push is only logged when `kora_lib_playground_feedback_debug` is 1.

## rcon commands

`playground_giveadmin`, `playground_removeadmin`, `playground_testnotify` and `kora_connect_sync` are described in [Commands](./commands.md). With `Config.logAdminGrants` true the give and remove commands print the line the bot parses.

## Guided testing

`/test` posts to the bot's `/game-test` endpoint derived from `kora_connect_bot_url`. See [Guided testing](./guided-testing.md).
