---
title: Priority
sidebar_position: 7
---

# Priority

A player's priority is a number; higher numbers are placed ahead. A player with no priority goes to the end of the queue.

## Sources

1. **Config** - `Config.Priority` in `server/sv_queue_config.lua`. Keys are lower-cased when loaded.
2. **API** - `Queue.AddPriority` at runtime (see [API](./api.md)).
3. **Temporary priority** - added with the `temp` argument of `Queue.AddPriority` (a duration in seconds), or by the grace system (`Config.EnableGrace`, see [Configuration](./configuration.md#grace-priority)). Expired entries are removed every second.

When a player has both permanent and temporary priority, the higher value is used.

## Identifiers

Any identifier returned by FiveM can be used, such as `steam:...`, `license:...` or `ip:...`. Matching is case-insensitive. A `steam:` hex identifier is also matched against the legacy form `steam_0:A:B`, so either form works in the config. `ip:` identifiers are only kept in a player's identifier list when they are on the priority list.

## Placement

A new player with priority is placed before the first queued player that has no priority or lower priority; equal priority keeps arrival order. Players without priority are appended.

## Caveats

- `Queue.AddPriority` with a table does not lower-case the keys, while lookups do. Keys must therefore be written in lower case, for example `steam:110000103fd1bb1` and `steam_0:1:33459672`, or they will never match. Single-identifier calls are lower-cased correctly. The table form also ignores the `temp` argument.
- `Queue.RemovePriority` only removes permanent priority, not temporary priority. Use the `queue removetp` command (see [Commands](./commands.md)) for temporary entries.
