---
title: "Legacy qb-weathersync compatibility"
sidebar_position: 3
---


# Legacy qb-weathersync compatibility

Resources written against qb-weathersync keep working without changes: the same export names exist under the `qb-weathersync` export table, and the same net events are accepted under their original names in addition to the native `kora_weathersync:*` ones.

Namespace: `exports['qb-weathersync']` · Source: `server/state.lua`

## Functions

One compatibility export per native export (with the `setTime` exception below), plus the net events listed in Commands → "Legacy qb-weathersync events" and the client events covered in How To Use.

### `exports['qb-weathersync']:<name>(...)`

Legacy export names wired through `Kora.compat.provideExport` to the same underlying state functions (`setBlackout`, `setTimeFrozen` and `setDynamicWeather` are the exact same functions as the native exports, including nil-toggle behavior and GlobalState publication).

**Parameters**



**Returns**

- **Same as the matching native export above, except `setTime` (see note) and `setWeather` (returns only the boolean, the error string is dropped).**

**Example**

```lua
exports['qb-weathersync']:setBlackout(true)
local hour, minute = exports['qb-weathersync']:getTime()
```

**Representative console output**

```text
Server only. `setTime(hour, minute)` differs from the native `setTime`: it accepts numeric strings, treats `minute` as `0` when omitted, and wraps an hour of exactly `24` to `0` (matching stock qb-weathersync); any other invalid value returns `false` with no error string.
```

## Limits and related APIs

Server-triggered net events only accept a server source (console or another server resource); a client-triggered `qb-weathersync:server:*` event is ignored, unlike stock qb-weathersync which allowed it from admin clients.

## Provided exports, events and client events

The resource declares `provide 'qb-weathersync'` and registers qb-weathersync style exports and events so scripts written for `qb-weathersync` keep working. Other stock events or configuration are not covered.

### Server exports

Registered through `Kora.compat.provideExport('qb-weathersync', name, handler)`:

| Export | Behaviour |
| --- | --- |
| `nextWeatherStage` | Same as the native export. |
| `setWeather(type)` | Returns only the success boolean. |
| `setTime(hour, minute)` | Stock-style: numeric strings accepted, fractions floored, hour 24 wraps to 0, minute optional (default 0), minute 60 or more becomes 0. Negative minutes or hours outside 0-24 are rejected. |
| `setBlackout(enabled)` | Same setter as the native export, including `nil` toggle. |
| `setTimeFreeze(enabled)` | Native `setTimeFrozen`. |
| `setDynamicWeather(enabled)` | Native `setDynamicWeather`. |
| `getBlackoutState()` | Blackout boolean. |
| `getTimeFreezeState()` | Time frozen boolean. |
| `getWeatherState()` | Weather, upper-case string. |
| `getDynamicWeather()` | Dynamic weather boolean. |
| `getTime()` | `hour, minute`. |

### Server events

| Event | Behaviour |
| --- | --- |
| `qb-weathersync:server:setWeather` | Server and console only. |
| `qb-weathersync:server:setTime` | Server and console only. |
| `qb-weathersync:server:toggleBlackout` | Server and console only. |
| `qb-weathersync:server:toggleFreezeTime` | Server and console only. |
| `qb-weathersync:server:toggleDynamicWeather` | Server and console only. |
| `qb-weathersync:server:RequestStateSync` | Same handler and rate limit as `kora_weathersync:server:requestStateSync`. |

Unlike stock, client sources are ignored for the setter events, even for admins.

### Client events

| Event | Behaviour |
| --- | --- |
| `qb-weathersync:client:DisableSync` | Suspends the sync: sets local weather to `CLEAR`, rain to 0 and the clock to 18:00. Intended for interior scripts. |
| `qb-weathersync:client:EnableSync` | Resumes the sync, reapplies the last state and requests a fresh one from the server. |
| `qb-weathersync:client:SyncTime(base, offset)` | Changes the local hour and minute to `(base + offset)` minutes until the next server publish. Invalid numbers are ignored. |
| `qb-weathersync:client:SyncWeather(name, blackout)` | Changes the local weather (and blackout when given) until the next server publish. Unknown weather names are ignored. |
