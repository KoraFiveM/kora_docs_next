---
title: API
sidebar_position: 5
---

# API

The queue exposes one export and a helper script that wraps it.

## Helper script

Load `@kora_queue/connectqueue.lua` as a server script in the consuming resource (see [Installation](./installation.md#using-the-api-from-another-resource)). It defines a global `Queue` table and loads the export as soon as `kora_queue` is started, and again after a restart of `kora_queue`.

| Function | Description |
| --- | --- |
| `Queue.OnReady(cb)` | Calls `cb` once the queue export is available (immediately if already ready). Call every other function after this. |
| `Queue.IsReady()` | Returns `true` when the export is loaded. Becomes `false` while `kora_queue` is stopped. |
| `Queue.OnJoin(cb)` | Registers a join hook `cb(source, allow)`. Call `allow()` with no argument to let the player through, or `allow("message")` to refuse them with that message. `allow` must always be called, or the player hangs on connecting. Hooks run in order and the first refusal stops the rest. Hooks are removed when the registering resource stops. |
| `Queue.AddPriority(id, power, temp)` | Adds priority. `id` is an identifier string, or a table of identifier to power. `power` defaults to `10`. If `temp` is given, the priority is temporary and lasts that many seconds. Does nothing when not ready. |
| `Queue.RemovePriority(id)` | Removes permanent priority for an identifier. Does nothing when not ready. |

```lua
Queue.OnReady(function()
    Queue.AddPriority("steam:110000103fd1bb1", 50)
    Queue.OnJoin(function(source, allow)
        allow() -- or allow("You are not allowed to join")
    end)
end)
```

`Queue.OnJoin` does not check readiness; call it inside `Queue.OnReady`. See the identifier caveat for table calls in [Priority](./priority.md#caveats).

## Export `GetQueueExports`

```lua
local queue = exports.kora_queue:GetQueueExports()
```

Returns the internal `Queue` object. Its methods use colon syntax (`queue:GetSize()`); the helper script exposes it as `Queue.Exports`.

| Method | Returns |
| --- | --- |
| `GetIds(src)` | Identifiers of a player (ip identifiers removed unless on the priority list), or `false`. |
| `GetSize()` | Number of players waiting in the queue. |
| `ConnectingSize()` | Number of admitted players still loading in. |
| `GetPlayerCount()` | Number of players that have activated their session. |
| `GetQueueList()`, `GetConnectingList()`, `GetPlayerList()`, `GetPriorityList()`, `GetTempPriorityList()` | The underlying tables. |
| `IsInQueue(ids, rtnTbl, bySource, connecting)` | Whether the identifiers (or source) are in the queue, or connecting list when `connecting` is true. With `rtnTbl` returns the index and entry. |
| `IsInConnecting(ids, bySource, refresh)` | Whether in the connecting list; `refresh` resets its timeout. |
| `IsPriority(ids)` | Highest priority power for the identifiers, or `false`. |
| `HasTempPriority(ids)` | Temporary power, end time and matching id, or `false`. |
| `AddPriority(id, power, temp)`, `RemovePriority(id)` | As in the helper script. |
| `SetPos(ids, newPos)` | Moves a queued player to position `newPos`. |
| `AddToQueue`, `RemoveFromQueue`, `AddToConnecting`, `RemoveFromConnecting`, `UpdatePosData`, `NotFull`, `TempSize`, `IsSteamRunning`, `HexIdToSteamId`, `CanJoin`, `OnJoin`, `DebugPrint` | Internal queue management; calling them directly can corrupt the queue state. |

The export is available on the server only.
