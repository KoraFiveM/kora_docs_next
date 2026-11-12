---
title: Exports
sidebar_position: 4
---

# Exports

`kora_cityhall` has one server export and no client exports. The resource `provide`s `qb-cityhall`, so you can call the export with either resource name.

## Server

### AddCityJob

```lua
local ok, message = exports.kora_cityhall:AddCityJob(jobName, options)
-- or
local ok, message = exports['qb-cityhall']:AddCityJob(jobName, options)
```

Adds a job to `Config.AvailableJobs` on the server at runtime. After that, the server accepts `qb-cityhall:server:ApplyJob` requests for it.

| Parameter | Type | Description |
| --- | --- | --- |
| `jobName` | string | Shared job name. It must exist in `kora_core` with a grade `1`, otherwise `kora_multijob` rejects the application. |
| `options` | table or nil | Optional `{ label = string, isManaged = boolean }`. The values are stored, but nothing in `kora_cityhall` reads them. |

| Return | Description |
| --- | --- |
| `true, 'success'` | The job was added. |
| `false, 'already added'` | `jobName` is not a string, or the job is already available. |

```lua
-- server script of another resource
local ok, msg = exports.kora_cityhall:AddCityJob('mechanic')
if not ok then print('AddCityJob:', msg) end
```

:::note
The change only affects the server's `Config` table. The client builds the Job Center list from its own copy of `Config.AvailableJobs`, so a job added with this export does **not** appear in the City Hall panel. It can only be applied for by triggering `qb-cityhall:server:ApplyJob` from your own client code. If players should see the job in the Job Center, add it to `Config.AvailableJobs` in `shared/config.lua`.
:::
