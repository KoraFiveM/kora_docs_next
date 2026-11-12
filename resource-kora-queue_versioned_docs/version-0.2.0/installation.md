---
title: Installation
sidebar_position: 2
---

# Installation

1. Place the resource in your resources folder under the name `kora_queue`. The resource name matters: the helper script calls `exports.kora_queue`, so renaming it breaks consumers.
2. Start it early in `server.cfg`, before resources that use the queue API:

   ```cfg
   ensure kora_queue
   ```

3. Optionally set convars (see below) and edit `server/sv_queue_config.lua`. See [Configuration](./configuration.md).

There is nothing to import into a database and the resource declares no dependencies in `fxmanifest.lua`.

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

```lua
server_script '@kora_queue/connectqueue.lua'
dependency 'kora_queue'
```

Then call the `Queue` functions described in [API](./api.md) after `Queue.OnReady`. The helper script does nothing when loaded inside a resource named `kora_queue` or `connectqueue`.
