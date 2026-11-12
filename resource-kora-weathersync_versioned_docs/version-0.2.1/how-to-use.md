---
title: "How to use"
sidebar_position: 3
---


# How to use

The server owns one state table (weather, hour, minute, time-frozen flag, dynamic-weather flag, blackout flag and a revision counter) and republishes it to `GlobalState.kora_weathersync` on every change. Clients apply it with natives; nothing about the simulated world is decided client-side.

## How state reaches the client

- On load, the client polls `GlobalState.kora_weathersync` once a second until a state table is present (covers a client that connects before the first `AddStateBagChangeHandler` fires).
- After that, `AddStateBagChangeHandler('kora_weathersync', nil, ...)` applies every further publish automatically — no event round-trip needed.
- The server also replies directly to a client event, `kora_weathersync:server:requestStateSync` (and the legacy `qb-weathersync:server:RequestStateSync`), which `TriggerClientEvent`s the current state back to just that player, throttled to once per 2 seconds per player.
- A background client thread re-applies `NetworkOverrideClockTime` once a second, because `NetworkOverrideClockTime` is a one-shot override rather than a running clock — this keeps a client aligned even if it briefly lost scope of the state bag. The environmental levels (rain, snow, gravity, trails, blackout) are applied whenever a state is applied, not on that timer.

## Weather changes blend, they do not snap

When the weather type changes (not on the very first state received), the client calls `SetWeatherTypeOverTime(weather, Config.weatherTransitionSeconds)` instead of setting it immediately, then — after that many seconds — persists the new type with `SetWeatherTypePersist` / `SetWeatherTypeNow` / `SetWeatherTypeNowPersist`, but only if the weather has not changed again in the meantime. The very first state a client ever receives is applied immediately with no blend.

## Suspending sync for interiors or cutscenes

A resource that needs to take over the local weather/clock temporarily (an interior, a cutscene) can suspend and resume sync without touching the server state.

- `TriggerClientEvent('qb-weathersync:client:DisableSync', target)` stops the client from applying further publishes, forces rain off, forces `CLEAR` weather and overrides the clock to 18:00.
- `TriggerClientEvent('qb-weathersync:client:EnableSync', target)` resumes applying publishes, re-applies the last known state immediately, and asks the server to resend the authoritative state (`qb-weathersync:server:RequestStateSync`).
- `TriggerClientEvent('qb-weathersync:client:SyncTime', target, base, offset)` and `TriggerClientEvent('qb-weathersync:client:SyncWeather', target, weatherType, blackout?)` change only the local client's view (clock to `base + offset` minutes-of-day: hour is `floor(((base + offset) / 60) % 24)`, minute is `floor((base + offset) % 60)`; or weather to a known type with an optional blackout flag) until the next server publish overwrites it. These are accepted at any time, sync-suspended or not, and the freeze flag is ignored by `SyncTime`.

## Reading the weather catalogue from another resource

The client exports `getWeatherTypes()`, returning `Config.weatherTypes` (the list of valid weather strings). kora_admin reads this at menu-open time so its weather selector stays in sync with this resource's config without declaring a start-order dependency on it.

```lua
local weatherTypes = exports.kora_weathersync:getWeatherTypes()
```

## Configuration

`Config.startingWeather` — GTA weather type applied when the resource starts (default `'EXTRASUNNY'`); must be one of `Config.weatherTypes`.
`Config.startingTime` — `{ hour, minute }` simulated clock at start (default noon).
`Config.realSecondsPerGameMinute` — real seconds between simulated clock minutes (default `8`). Must be greater than zero.
`Config.freezeTime` — whether the simulated clock starts paused (default `false`).
`Config.dynamicWeather` — whether weather advances automatically through `Config.weatherTransitions` (default `true`). Effectively forced off if `Config.weatherChangeEveryMinutes` is `0`.
`Config.weatherChangeEveryMinutes` — real minutes between automatic weather transitions; `0` disables the timer (default `10`).
`Config.blackout` — initial artificial-lights blackout state (default `false`).
`Config.blackoutAffectsVehicles` — whether blackout also turns off vehicle lights, applied client-side (default `false`).
`Config.weatherTransitionSeconds` — client-side blend duration (seconds) used by `SetWeatherTypeOverTime` when the weather changes (default `15.0`).
`Config.weatherTypes` — the full list of valid weather type strings; everything else in this resource (commands, exports, `SyncWeather`, `getWeatherTypes`) validates against this list.
`Config.weatherTransitions` — table of `weatherType -> { possible next types }` used by `nextWeatherStage`; a type missing from this table falls back to `CLEAR`.
`Config.weatherEffects` — table of `weatherType -> { rainLevel, snowLevel, gravityLevel, snowTrails }` applied by the client every second. Unlisted weather types get all-zero / no-trail effects. `gravityLevel` is `0` normal, `1` low, `2` very low, `3` zero gravity; values are clamped into range and floored. `BLIZZARD` ships with `gravityLevel = 1` as a deliberate event twist.
`Config.command` — `{ permission, levels, permissionPrefix }` passed to `Kora.permissions.hasLevel` for every chat command (default `permission = 'admin'`, levels `god/admin/mod/user`, prefix `'kora_core'`).
`Config.timePresets` — table of `presetName -> { hour, minute }`; each key becomes both a `/time <preset>` shortcut and its own standalone `/<preset>` command (ships with `morning`, `noon`, `evening`, `night`).

## kora_lib config registration

If `Kora.config.adopt` is available, `config.lua` registers `Config.startingWeather` as an enum option (so it can be edited through Kora Lib's config UI/exports) restricted to the values in `Config.weatherTypes`, then adopts the whole `Config` table. This does not change any default value or runtime behavior described above.

## Configuration reference

The options above are described in full, with the weather catalogue, transitions, effects ranges and shipped defaults, on [Configuration](./configuration.md).
