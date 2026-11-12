---
title: Troubleshooting
sidebar_position: 8
---

# Troubleshooting

## Console is full of `QUEUE:` messages

`sv_debugqueue` defaults to `true`. Set `set sv_debugqueue false` in `server.cfg`.

## Players cannot join right after a restart

This is the startup join delay (`Config.JoinDelay`, 30 seconds by default). Players are queued and admitted after it ends.

## `exports.kora_queue` errors in another resource

The resource must be named `kora_queue` and be started. The helper script must be loaded as `@kora_queue/connectqueue.lua`. Older ConnectQueue instructions use `@connectqueue/...`, which does not apply here. Call `Queue.OnJoin` only inside `Queue.OnReady`.

## A player hangs on "Connecting"

A join hook registered with `Queue.OnJoin` never called `allow`. Every code path must call it.

## Priority from a table never applies

Keys passed in a table to `Queue.AddPriority` are not lower-cased. Use lower-case identifiers. See [Priority](./priority.md#caveats).

## The server name shows a count

`sv_displayqueue` is enabled by default and prefixes `sv_hostname` with the queue size while players are waiting. Set `set sv_displayqueue false` to disable.

## A player is dropped from the queue

A queued player with no reachable connection for `Config.QueueTimeOut` seconds is removed. A connecting player is removed after `Config.ConnectTimeOut` seconds (or 300 seconds without an endpoint). See [Configuration](./configuration.md#timeouts).
