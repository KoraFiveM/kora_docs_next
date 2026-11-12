---
title: Events
sidebar_position: 7
---

# Events

## State bag

`GlobalState.kora_weathersync` holds the snapshot described in [State snapshot](./api/state.md). Clients watch it with a state bag change handler and apply every change; weather blends over `Config.weatherTransitionSeconds` once the first state has been applied. On first load a client polls `GlobalState` once per second until the snapshot exists. The server sets it to `nil` when the resource stops.

## Server events

Registered with `RegisterNetEvent`.

| Event | Who may trigger | Description |
| --- | --- | --- |
| `kora_weathersync:server:setWeather` | Server resources and console only | Calls the `setWeather` setter with the given type. |
| `kora_weathersync:server:setTime` | Server resources and console only | Calls `setTime(hour, minute)`. |
| `kora_weathersync:server:requestStateSync` | Clients (and server) | Replies to the calling client with the current state. |

Triggers that come from a client (source greater than 0) are silently ignored for the setter events. There are no client-triggerable events that change the world. Legacy `qb-weathersync:server:*` events are listed in [Legacy qb-weathersync compatibility](./api/compat.md).

### Rate limit

`requestStateSync` replies to a client at most once per 2 seconds per player; extra requests are dropped. When it is triggered from the server side (source 0) the state is sent to every client instead. The per-player timestamp is cleared on `playerDropped`.

## Client events

| Event | Description |
| --- | --- |
| `kora_weathersync:client:state` | Receives a state snapshot from the server and applies it. |
| `kora_weathersync:client:notify` | Internal: shows a `kora_lib` notification (`type`, locale key, arguments) for command replies. Sent by the server. |

## Callbacks

None.
