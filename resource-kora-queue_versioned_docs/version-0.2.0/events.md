---
title: Events
sidebar_position: 7
---

# Events

## Net events

| Event | Direction | Description |
| --- | --- | --- |
| `Queue:playerActivated` | client to server | Triggered by `shared/sh_queue.lua` on the client as soon as `NetworkIsSessionStarted()` is true. The server counts the player as in game and removes them from the queue and connecting lists. Only the first trigger per source counts. |

## Game events handled

| Event | Behaviour |
| --- | --- |
| `playerConnecting` | Runs the queue: identifier checks, join hooks, priority-only/Steam checks, queueing, and admission. |
| `playerDropped` | If the player was active, decrements the player count, removes them from lists, and grants grace priority when `Config.EnableGrace` is on. |
| `onResourceStop` | Restores `sv_hostname` when this resource stops and removes join hooks registered by the stopped resource. |
| `onResourceStarting` | Cancels the start of `hardcap` when `Config.DisableHardCap` is on. |
| `rconCommand` | Handles `queue` commands (see [Commands](./commands.md)). |

The resource registers no local events for other resources to listen to, and no callbacks. Integration is through [API](./api.md).
