---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Queue is a connection queue and lightweight whitelist/priority layer: it intercepts `playerConnecting`, holds arriving players in an ordered queue until a slot is free, and shows them an Adaptive Card (or plain text) while they wait. It has no dependency on any other kora resource and no database.

## Install Kora Queue

1. **Add the folder** — Place `kora_queue` in your resources directory (on the Kora recipe it is `resources/[standalone]/kora_queue`). It is standalone: no `dependency` is declared.

2. **Start it early** — Add `ensure kora_queue` near the top of `server.cfg`, before any resource that itself wants to gate connections. `shared/sh_queue.lua` (loaded as a server script) registers its `playerConnecting` handler as soon as the resource starts; a resource that also hooks that event and starts after kora_queue runs after it.

3. **Edit the config** — Everything configurable lives in `server/sv_queue_config.lua`'s global `Config` table: the priority list, whitelist mode, timeouts, grace period and the connecting Adaptive Card. There is no separate install step beyond editing this file.

4. **Convars read at runtime** — `sv_maxclients`, `sv_debugqueue` and `sv_displayqueue` are read every second from the live convars (not just at boot), while `sv_hostname` is read once at resource start (and re-read each second only while it is still the default `default FXServer`) and then rewritten with the queue count; changing `sv_maxclients` in `server.cfg` or via `rcon` takes effect without restarting the resource.

   ```bash title="server.cfg"
   set sv_maxclients 48
   set sv_debugqueue "false"
   set sv_displayqueue "true"
   ```

## Manifest reference

`fx_version 'bodacious'` and `game 'common'` — this resource targets the server VM only (it is not GTA-specific) except for the tiny client-side activation thread in `shared/sh_queue.lua`.

```lua title="fxmanifest.lua"
fx_version 'bodacious'
game 'common'

server_script "server/sv_queue_config.lua"
server_script "connectqueue.lua"

server_script "shared/sh_queue.lua"
client_script "shared/sh_queue.lua"
```

- The real queue implementation (the `playerConnecting` handler, the `Queue` object, the `queue` rcon commands and the `GetQueueExports` export) lives in `shared/sh_queue.lua`; `connectqueue.lua` is only the consumer helper script described below. `shared/sh_queue.lua` is loaded as BOTH a server script and a client script. The top of the file checks `IsDuplicityVersion()`: on the client it only waits for `NetworkIsSessionStarted()` and fires `Queue:playerActivated` once, then returns — none of the `Queue` table or its functions exist on the client.

## Consuming resource guard

`connectqueue.lua` begins with `if Queue.CurResource == "kora_queue" or Queue.CurResource == "connectqueue" then return end`. Any OTHER resource that loads this file (as `server_script '@kora_queue/connectqueue.lua'`, see below) gets a facade: `Queue.OnReady`, `Queue.OnJoin`, `Queue.AddPriority`, `Queue.RemovePriority`, backed by `exports.kora_queue:GetQueueExports()` once kora_queue has started. kora_queue itself and the legacy `connectqueue` name are excluded so the real implementation does not wrap itself.

- The facade becomes ready (after a `kora_queue` start) one tick after `kora_queue` reports `started` (`Citizen.Wait(1)` then `Queue.LoadExports()`), and is torn down (`Queue.Ready = false`, `Queue.Exports = nil`) on kora_queue's `onResourceStop`.
- `Queue.OnReady(cb)` calls `cb()` immediately if already ready (such a late callback is not retained); otherwise it is queued, and queued callbacks run when the facade becomes ready and run again after every later `kora_queue` restart (the list is never cleared). `Queue.OnReady` and `Queue.OnJoin` registered with a falsy `cb` are no-ops. `Queue.IsReady()` returns the ready flag.
- The facade also calls `Queue.LoadExports()` from `SetTimeout(1, ...)` when the consuming resource loads, so it becomes ready even if `kora_queue` was already running.
- `Queue.OnJoin` does not check readiness (`Queue.Exports` is `nil` before ready): call it inside `Queue.OnReady`.

## Manifest notes

The manifest block above omits two lines that the real `fxmanifest.lua` also contains: `version '0.2.0'` (the release version) and `qa_feature 'tests/*.feature'` (manual QA scenarios for `kora_qa`).

## Convars

```cfg
set sv_debugqueue true
set sv_displayqueue true
```

| Convar | Default | Effect |
| --- | --- | --- |
| `sv_debugqueue` | `true` | Prints `QUEUE:` debug messages to the console. Set to `false` to silence them. |
| `sv_displayqueue` | `true` | While players are queued, prefixes `sv_hostname` with `[count] `. Only active when `sv_hostname` is set (not the default `default FXServer`). |
| `sv_maxclients` | `30` if unset | Player limit used by the queue. Re-read every second. |

`sv_debugqueue` and `sv_displayqueue` are re-read every second, so they can be changed at runtime. Both default to enabled when unset.

## Using the API from another resource

Add the helper script as a server script in the other resource's `fxmanifest.lua`, and optionally depend on the queue:

```lua title="fxmanifest.lua"
server_script '@kora_queue/connectqueue.lua'
dependency 'kora_queue'
```

Then call the `Queue` functions described in [API](./api.md) after `Queue.OnReady`. The helper script does nothing when loaded inside a resource named `kora_queue` or `connectqueue`. The resource name matters: the helper script calls `exports.kora_queue`, so renaming `kora_queue` breaks consumers. There is nothing to import into a database.
