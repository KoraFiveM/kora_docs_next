---
title: "State (server exports)"
sidebar_position: 2
---


# State (server exports)

The authoritative weather/clock/blackout state and the setters/getters other resources call. Every setter that changes something republishes the full state to `GlobalState.kora_weathersync` with an incremented `revision`, which is how every connected client (and the Lua `AddStateBagChangeHandler` on the client) learns about the change.

Namespace: `exports.kora_weathersync` · Source: `server/state.lua`

## How it works

State is rebuilt as a brand-new table on every publish (`copyState()`), never mutated in place, because `GlobalState` only serializes changes it can see at the point of assignment — mutating a nested table would not reliably reach clients or late joiners.

## Functions

Twelve server exports: one setter/getter pair for weather, time, time-frozen, dynamic-weather and blackout, plus `nextWeatherStage` and `getState`.

### `exports.kora_weathersync:setWeather(weatherType)`

Sets the authoritative weather to one of `Config.weatherTypes` (case-insensitive; stored upper-case) and republishes `GlobalState.kora_weathersync` with an incremented revision. Also resets the dynamic-weather timer (`nextWeatherAt`).

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `weatherType` | string | A weather type name, for example `'RAIN'`. Matched case-insensitively against `Config.weatherTypes`. |

**Returns**

- **ok** — `true` on success, `false` when the type is not in `Config.weatherTypes`.
- **err** — `nil` on success, otherwise `'unknown_weather_type'` (a locale key).

**Example**

```lua
local ok, err = exports.kora_weathersync:setWeather('THUNDER')
if not ok then print(err) end
```

**Representative console output**

```text
Server only.
```

### `exports.kora_weathersync:getWeather()`

Returns the current weather type.

**Parameters**



**Returns**

- **weatherType** — string, upper-case (for example `'CLEAR'`).

**Example**

```lua
local weather = exports.kora_weathersync:getWeather()
```

**Representative console output**

```text
Server only.
```

### `exports.kora_weathersync:setTime(hour, minute)`

Sets the synchronized clock and republishes state.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `hour` | integer | Required, 0–23. |
| `minute` | integer | Required, 0–59. |

**Returns**

- **ok** — `true` on success, `false` when either value is out of range or not an integer.
- **err** — `nil` on success, otherwise `'invalid_time'` (a locale key).

**Example**

```lua
local ok, err = exports.kora_weathersync:setTime(14, 30)
```

**Representative console output**

```text
Server only. Unlike the legacy `qb-weathersync` export, this one does not accept a 24-wraps-to-0 hour or a nil minute — see `setTime` under Compatibility for that behavior.
```

### `exports.kora_weathersync:getTime()`

Returns the current simulated hour and minute.

**Parameters**



**Returns**

- **hour** — integer, 0–23.
- **minute** — integer, 0–59.

**Example**

```lua
local hour, minute = exports.kora_weathersync:getTime()
```

**Representative console output**

```text
Server only.
```

### `exports.kora_weathersync:setTimeFrozen(enabled?)`

Sets whether the simulated clock advances, or toggles it when called with no argument.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `enabled?` | boolean | Omit to flip the current value; pass `true`/`false` to set it explicitly. |

**Returns**

- **frozen** — the resulting boolean state (always returned, this call cannot fail).

**Example**

```lua
local frozen = exports.kora_weathersync:setTimeFrozen()
```

**Representative console output**

```text
Server only. Republishes state.
```

### `exports.kora_weathersync:getTimeFrozen()`

Returns whether the clock is currently frozen.

**Parameters**



**Returns**

- **frozen** — boolean.

**Example**

```lua
local frozen = exports.kora_weathersync:getTimeFrozen()
```

**Representative console output**

```text
Server only.
```

### `exports.kora_weathersync:setDynamicWeather(enabled?)`

Sets whether the scheduled weather-transition timer runs, or toggles it when called with no argument. Also resets the timer countdown.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `enabled?` | boolean | Omit to flip the current value; pass `true`/`false` to set it explicitly. |

**Returns**

- **active** — the resulting boolean state.

**Example**

```lua
local active = exports.kora_weathersync:setDynamicWeather(false)
```

**Representative console output**

```text
Server only. Republishes state.
```

### `exports.kora_weathersync:getDynamicWeather()`

Returns whether scheduled weather transitions are currently active.

**Parameters**



**Returns**

- **active** — boolean.

**Example**

```lua
local active = exports.kora_weathersync:getDynamicWeather()
```

**Representative console output**

```text
Server only.
```

### `exports.kora_weathersync:setBlackout(enabled?)`

Sets the artificial-lights blackout, or toggles it when called with no argument. Whether blackout also affects vehicle lights is read from `Config.blackoutAffectsVehicles` by the client, not passed here.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `enabled?` | boolean | Omit to flip the current value; pass `true`/`false` to set it explicitly. |

**Returns**

- **blackout** — the resulting boolean state.

**Example**

```lua
local blackout = exports.kora_weathersync:setBlackout(true)
```

**Representative console output**

```text
Server only. Republishes state.
```

### `exports.kora_weathersync:getBlackout()`

Returns whether blackout is currently active.

**Parameters**



**Returns**

- **blackout** — boolean.

**Example**

```lua
local blackout = exports.kora_weathersync:getBlackout()
```

**Representative console output**

```text
Server only.
```

### `exports.kora_weathersync:nextWeatherStage()`

Advances the weather to a random entry from `Config.weatherTransitions[currentWeather]` (or `CLEAR` if the current weather has no configured transitions). This is what the scheduled dynamic-weather timer calls internally; call it directly to force an immediate scripted transition.

**Parameters**



**Returns**

- **ok** — `true` (the chosen next weather is always a configured type, so this never fails in practice).
- **err** — `nil` under normal operation.

**Example**

```lua
exports.kora_weathersync:nextWeatherStage()
```

**Representative console output**

```text
Server only. Republishes state.
```

### `exports.kora_weathersync:getState()`

Returns a fresh copy of the full state table.

**Parameters**



**Returns**

- **state** — table `{ weather, hour, minute, timeFrozen, dynamicWeather, blackout, blackoutAffectsVehicles, revision }`.

**Example**

```lua
local state = exports.kora_weathersync:getState()
print(state.weather, state.hour, state.minute)
```

**Representative console output**

```text
Server only. Same shape as the `GlobalState.kora_weathersync` table clients read.
```

## Limits and related APIs

Server only for the exports above — the only client export is `getWeatherTypes()` (below). `setTime` is strict (integers only, no wraparound); see the Compatibility module for the legacy export that is lenient.

## Related guides

- [Legacy qb-weathersync compatibility](./compat.md)

## Client export

| Export | Returns | Description |
| --- | --- | --- |
| `getWeatherTypes()` | table | The `Config.weatherTypes` list. Client side; see [How to use](../how-to-use.md). |

## State snapshot

`getState()`, `GlobalState.kora_weathersync` and the `kora_weathersync:client:state` event carry a table with these fields:

| Field | Type | Description |
| --- | --- | --- |
| `weather` | string | Current weather type. |
| `hour`, `minute` | integer | Simulated clock. |
| `timeFrozen` | boolean | Clock paused. |
| `dynamicWeather` | boolean | Automatic weather changes on. |
| `blackout` | boolean | Blackout active. |
| `blackoutAffectsVehicles` | boolean | From `Config.blackoutAffectsVehicles`. |
| `revision` | integer | Incremented on every publish. |

The snapshot is republished on every setter call and every simulated clock minute while the clock is running. It is cleared (`nil`) when the resource stops. For events see [Events](../events.md).
