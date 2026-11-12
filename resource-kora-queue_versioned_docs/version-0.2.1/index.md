---
title: kora_queue
sidebar_position: 1
---

# kora_queue

`kora_queue` is a connection queue for Kora servers, a fork of ConnectQueue. When the server is full, connecting players are held in a deferral and see a queue card (or plain text) with their position, queue size and wait time. They are admitted automatically when a slot frees up. Identifiers can be given priority so they are placed ahead of other players. Other resources can hook the join process and manage priority through a small API.

Current version: see `version` in `fxmanifest.lua`.

## Features

- **Queue with priority** - players are ordered by arrival, with priority identifiers placed ahead of lower or no priority. See [Priority](./priority.md).
- **Temporary priority (grace)** - optionally gives a player short-lived priority when they start loading in or disconnect (`Config.EnableGrace`).
- **Adaptive card** - the queue message is an Adaptive Card with title, description, facts, status, footer and optional image, with a text fallback. See [Configuration](./configuration.md#connection-card).
- **Startup join delay** - after the resource starts, players can queue but are not admitted for `Config.JoinDelay` milliseconds.
- **Timeouts** - queued players with no response and connecting players that never finish loading are removed. See [Configuration](./configuration.md#timeouts).
- **Optional restrictions** - require Steam (`Config.RequireSteam`) or priority-only mode (`Config.PriorityOnly`).
- **Join hooks** - other resources can accept or reject a join. See [API](./api.md).
- **Queue count in server name** - optionally prefixes `sv_hostname` with the queue size.
- **Console commands** - debugging commands under `queue`. See [Commands](./commands.md).
- **Hardcap disabling** - stops the `hardcap` resource by default (`Config.DisableHardCap`).

## Documentation map

- [Installation](./installation.md) - setup, manifest reference, convars, the consuming-resource facade and using the API from another resource
- [How to use](./how-to-use.md) - the connection flow, the connecting card, priority and whitelist, hardcap removal and integration examples
- [Commands](./commands.md) - the `queue` rcon commands with examples, a summary table and notes
- [API](./api.md) - the `Queue` helper and the `GetQueueExports` export
- [Configuration](./configuration.md) - every `Config` option and convar
- [Priority](./priority.md) - priority identifiers, power, temporary priority and the grace system
- [Events](./events.md) - the net event and game events the resource uses
- [Troubleshooting](./troubleshooting.md) - known caveats and common problems

## Testing

- `lua test/smoke/join_delay.lua` (from the repository root) checks startup admission timing with a controlled clock and deferrals.
- `lua test/smoke/queue_facade.lua` checks consumer readiness, callbacks and exports across queue restarts.
- `tests/checklist-core-and-libraries.feature` holds manual QA scenarios for `kora_qa`, registered with `qa_feature` in `fxmanifest.lua`.

Neither smoke test starts FiveM. The resource has no database tables, items, locales, NUI or client UI beyond the connection card, and defines no ACE permissions.
