---
title: Events and callbacks
sidebar_position: 7
---

# Events and callbacks

The resource has no exports (apart from the optional FFT hooks, see [How to use](./how-to-use.md#optional-fft-hooks)).

## Server callback: `qb-scoreboard:server:GetScoreboardData`

Registered with `exports.kora_core:createCallback` and called by the client with `Kora.callback.trigger`. Returns three values:

1. Total number of players.
2. Number of on-duty players with job `police`.
3. A table keyed by server id, each value `{ optin = <result of kora_core isOptin> }`.

The callback does no permission checks, so any client can call it.

## Server event: `qb-scoreboard:server:SetActivityBusy`

```lua
TriggerEvent('qb-scoreboard:server:SetActivityBusy', 'bankrobbery', true)  -- cooldown starts
TriggerEvent('qb-scoreboard:server:SetActivityBusy', 'bankrobbery', false) -- cooldown ends
```

Arguments: `activity` (string, a key of `Config.IllegalActions`) and `bool` (boolean). Invalid arguments or unknown activities are ignored.

It is registered with `AddEventHandler`, not `RegisterNetEvent`, so it can only be triggered by server-side scripts; clients cannot set busy state. The server does not store the state; it relays it to every connected client with the client event below.

## Client event: `qb-scoreboard:client:SetActivityBusy`

Registered with `RegisterNetEvent` and sent by the server to all clients (`-1`) with `(activity, busy)`. It stores the flag locally and refreshes the open panel. Unknown activities are ignored. Because it is a net event, a client could in principle trigger it on itself, which only changes that client's own display.
