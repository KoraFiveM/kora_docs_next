---
title: Troubleshooting
sidebar_position: 8
---

# Troubleshooting

- **Server asserts on start**: `Config.startingWeather`, `Config.startingTime` and `Config.realSecondsPerGameMinute` are validated; fix the value named in the assertion message.
- **Commands say you have no permission**: the check uses the level in `Config.command.permission` and the prefix in `Config.command.permissionPrefix` (`kora_core.admin` by default). Verify the ACE or level assignment.
- **`/freezeweather true` turned weather cycling on**: the argument sets the dynamic weather flag. Use `/freezeweather false` to stop cycling. See [Commands](./commands.md).
- **Dynamic weather never changes**: with `Config.weatherChangeEveryMinutes = 0` no timer is scheduled. In that case the flag can still be switched on with a command or export and then reports `true`, but weather does not change until `/weather` or `nextWeatherStage` is used.
- **Another script resets weather or time**: scripts that call `qb-weathersync:client:DisableSync` suspend the sync until `EnableSync` is triggered. Make sure they re-enable it.
- **Weather looks different after a restart of this resource**: state is memory only and starts from the config values.
- **Gravity feels low in a blizzard**: this is the default `BLIZZARD` effect; set its `gravityLevel` to `0` in `Config.weatherEffects`.
- **Console warning about `Config.weatherEffects`**: a level was not a finite number and the default was used.
