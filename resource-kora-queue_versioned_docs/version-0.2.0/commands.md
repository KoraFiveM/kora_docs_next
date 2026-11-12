---
title: Commands
sidebar_position: 6
---

# Commands

The resource handles the `rconCommand` event, so these commands are typed in the server console (or over rcon) as `queue <command> [args]`. They are not registered with `RegisterCommand`, so players cannot run them in-game and no ACE permission is involved. Output is printed through the debug printer, so it only appears while `sv_debugqueue` is `true`.

| Command | Description |
| --- | --- |
| `queue commands` | Lists the available commands. |
| `queue addq` | Adds a fake test player to the queue. |
| `queue removeq index` | Removes the queue entry at that position. |
| `queue printq` | Prints the queue list. |
| `queue addc` | Adds a fake entry to the connecting list. |
| `queue removec index` | Removes the connecting entry at that position. |
| `queue printc` | Prints the connecting list. |
| `queue printl` | Prints the active player list (by source). |
| `queue printp` | Prints the permanent priority list. |
| `queue printtp` | Prints temporary priority entries. |
| `queue removetp id` | Removes a temporary priority entry. The id must be lower case. |
| `queue printcount` | Prints the active player count. |
| `queue setpos index position` | Moves the queue entry at `index` to `position`. |
| `queue setdata index field value` | Sets a field on a queue entry; `queuetime` shifts the entry's wait time. |

`setpos` and `setdata` fail with a script error when `index` is not in the queue. These commands are for testing; fake entries created by `addq` and `addc` use the source `debug`.
