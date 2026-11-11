# kora_weathersync

Server-authoritative weather, time, blackout, and client environmental effects
for the kora_lib test server. It follows the state-sync approach from
[QBCore-Remastered/qb-weathersync](https://github.com/QBCore-Remastered/qb-weathersync/),
but uses a single `GlobalState.kora_weathersync` snapshot so late joiners and
resource restarts receive the active world immediately.

## Commands

All commands require the configured `kora_core.admin` tier (console is allowed).

- `/weather <type>`
- `/freezeweather [true|false]` — controls dynamic weather
- `/time <hour> [minute]`
- `/freezetime [true|false]`
- `/blackout [true|false]`
- `/morning`, `/noon`, `/evening`, `/night`

## Exports

`setWeather`, `getWeather`, `setTime`, `getTime`, `setTimeFrozen`,
`getTimeFrozen`, `setDynamicWeather`, `getDynamicWeather`, `setBlackout`,
`getBlackout`, `nextWeatherStage`, and `getState` are server exports.

`Config.weatherEffects` maps a weather type to `rainLevel`, `snowLevel`,
`gravityLevel`, and `snowTrails`. `BLIZZARD` ships with low gravity as a
deliberate event-style effect; set its `gravityLevel` to `0` for ordinary snow.
Levels are validated once when the client loads; a value that is not a finite
number falls back to the default with a console warning. Dynamic weather
advances on a single timer, `Config.weatherChangeEveryMinutes` after the last
weather change (`0` disables it).

The legacy server export `qb-weathersync:setBlackout(enabled)` resolves to the same authoritative setter as the native export, including nil-toggle behavior and GlobalState publication. The provided identity covers this tested export only; other stock events/configuration are separate compatibility contracts.

## QBCore compatibility

- Server exports under `qb-weathersync`: `nextWeatherStage`, `setWeather`, `setTime`, `setBlackout`, `setTimeFreeze`, `setDynamicWeather`, `getBlackoutState`, `getTimeFreezeState`, `getWeatherState` (upper-case string), `getDynamicWeather`, `getTime`. `setTime` follows stock (numeric strings, hour 24 wraps to 0, minute optional).
- `qb-weathersync:server:RequestStateSync` replies to the calling client only, at most once per 2 seconds per player. A server-side trigger rebroadcasts to everyone.
- Client `qb-weathersync:client:DisableSync` / `EnableSync` suspend and resume the local weather and clock override (for interior scripts). `SyncTime(base, offset)` and `SyncWeather(name, blackout)` change the local view only until the next server publish; the freeze flag is ignored.
- `qb-weathersync:server:setWeather`, `setTime`, `toggleBlackout`, `toggleFreezeTime`, `toggleDynamicWeather` are accepted from server resources and the console only. Client sources are ignored, unlike stock, which allows admins.
