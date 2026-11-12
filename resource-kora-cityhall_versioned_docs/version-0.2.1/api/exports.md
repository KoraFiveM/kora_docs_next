---
title: "Exports"
sidebar_position: 2
---


# Exports

One server export. It is the QBCore-compatible way to make another job applicable at a City Hall.

Namespace: `exports` · Source: `server/server.lua, fxmanifest.lua`

## How it works

The export writes into the server's copy of `Config.AvailableJobs`. The client has its own copy of `Config` (loaded from the shared script), which this export does not change, so the new job does not appear in the menu of already-running clients. The server accepts the job in `ApplyJob`, so a custom UI can send it. kora_multijob must also accept the job when `addJob` runs.

## Functions

The only export registered by this resource.

### `exports.kora_cityhall:AddCityJob(jobName, toCH)`

Server export (also reachable as `exports['qb-cityhall']:AddCityJob` through the manifest `provide 'qb-cityhall'` line). Adds a job to `Config.AvailableJobs` at runtime so that `qb-cityhall:server:ApplyJob` accepts it.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `jobName` | string | Required. The job name. A non-string value is rejected. |
| `toCH?` | table | Optional. If it is a table, `{ label = toCH.label, isManaged = toCH.isManaged }` is stored as the entry value; anything else is treated as an empty table, so the entry becomes `{ label = nil, isManaged = nil }`. Both fields are only stored; nothing in this resource reads them. |

**Returns**

- **`true, 'success'` when the entry was added.**
- **`false, 'already added'` when `jobName` is not a string or `Config.AvailableJobs[jobName]` is already set. (The text is the same for both cases.)**

**Example**

```lua
local ok, reason = exports['qb-cityhall']:AddCityJob('mechanic', { label = 'Mechanic', isManaged = false })
if not ok then print('cityhall:', reason) end
```

**Representative console output**

```text
After success the server accepts `ApplyJob` for `mechanic`. The change is server-side and in memory only: it is not written to `shared/config.lua` and is lost when the resource restarts.
```

## Limits and related APIs

In-memory, server-side only. Adding entries for the menu requires editing `Config.AvailableJobs` in `shared/config.lua` instead. No other export (server or client) is registered.

## Calling it from another resource

The export can be called with either resource name:

```lua
local ok, message = exports.kora_cityhall:AddCityJob(jobName, options)
-- or
local ok, message = exports['qb-cityhall']:AddCityJob(jobName, options)
```

`jobName` must exist in `kora_core` with a grade `1`, otherwise `kora_multijob` rejects the application. If players should see the job in the Job Center, add it to `Config.AvailableJobs` in `shared/config.lua`; a job added with this export can only be applied for by triggering `qb-cityhall:server:ApplyJob` from your own client code.

## Related guides

- [Configuration](./configuration.md)
- [Events](../events.md)
- [Compatibility](../compatibility.md)
