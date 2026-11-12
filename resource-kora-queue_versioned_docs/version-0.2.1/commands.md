---
title: "Commands"
sidebar_position: 4
---


# Commands

Kora Queue has no in-game chat command. It exposes a debugging surface through server rcon only, gated by the `rconCommand` event.

## Rcon commands

### `queue addq`

Adds a fake `debug` entry to the queue for testing, with an incrementing fake Steam id.

| Field | Details |
| --- | --- |
| Context | Server console / rcon |
| Arguments | none |
| Access | rcon only. |

**Example**

```text
queue addq
```

**Result**

Prints the addition to console when `sv_debugqueue` is on (there is no `Config.Debug` option).

### `queue removeq <index>`

Removes the queue entry at that 1-based index.

| Field | Details |
| --- | --- |
| Context | Server console / rcon |
| Arguments | index — required, position in the queue list. |
| Access | rcon only. |

**Example**

```text
queue removeq 2
```

**Result**

Removes and prints the removed player's name.

### `queue printq`

Prints every queued player: position, source, identifier, priority, last message time, timeout counter and queue time.

| Field | Details |
| --- | --- |
| Context | Server console / rcon |
| Arguments | none |
| Access | rcon only. |

**Example**

```text
queue printq
```

**Result**

One console line per queued player.

### `queue addc / queue removec <index> / queue printc`

Same operations as above, for the "connecting" (loading-screen) list instead of the wait queue.

| Field | Details |
| --- | --- |
| Context | Server console / rcon |
| Arguments | index for removec. |
| Access | rcon only. |

**Example**

```text
queue printc
```

### `queue printl / queue printcount`

`printl` prints the activated-player list (source -> true); `printcount` prints the current connected player count.

| Field | Details |
| --- | --- |
| Context | Server console / rcon |
| Arguments | none |
| Access | rcon only. |

**Example**

```text
queue printcount
```

### `queue printp / queue printtp / queue removetp <id>`

Prints the permanent priority list, the temporary priority list (with expiry), or removes one temporary priority entry by identifier.

| Field | Details |
| --- | --- |
| Context | Server console / rcon |
| Arguments | id for removetp. |
| Access | rcon only. |

**Example**

```text
queue printtp
```

### `queue setpos <index> <newPos>`

Moves the queue entry at `index` to `newPos`.

| Field | Details |
| --- | --- |
| Context | Server console / rcon |
| Arguments | index, newPos — both required numbers. |
| Access | rcon only. |

**Example**

```text
queue setpos 3 1
```

### `queue setdata <index> <field> <value>`

Overwrites a field of the queue entry at `index`. The special field `queuetime` rewrites the entry's effective connect time instead of overwriting the field directly.

| Field | Details |
| --- | --- |
| Context | Server console / rcon |
| Arguments | index, field, value. |
| Access | rcon only. |

**Example**

```text
queue setdata 1 queuetime 30
```

### `queue commands`

Lists every registered subcommand name.

| Field | Details |
| --- | --- |
| Context | Server console / rcon |
| Arguments | none |
| Access | rcon only. |

**Example**

```text
queue commands
```

## Debug logging

All of the above (and the resource's own connection-flow logging) only print when `Queue:DebugPrint` is active, which follows the `sv_debugqueue` convar (default `true`).

## Command summary

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
| `queue setdata index field value` | Sets a field on a queue entry; `queuetime` sets the entry's wait time to that many seconds. |

## Notes

- The commands are not registered with `RegisterCommand`, so players cannot run them in-game and no ACE permission is involved.
- `removetp` matches the key exactly as stored, and stored keys are lower case, so the id must be written in lower case.
- `setpos` and `setdata` fail with a script error when `index` is not in the queue.
- Fake entries created by `addq` and `addc` use the source `debug`.
- `setpos` does nothing when the new position is below 1 or beyond the queue size.
