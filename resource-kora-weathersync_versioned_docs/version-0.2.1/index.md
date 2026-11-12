---
title: kora_weathersync
sidebar_position: 1
---

# kora_weathersync

`kora_weathersync` is a server-authoritative weather, clock, blackout and environmental-effects sync resource for Kora servers. The server keeps one world state and publishes it as a single `GlobalState.kora_weathersync` snapshot, so late joiners and resource restarts receive the active world immediately. Clients apply the weather, clock, blackout and extra effects (rain, snow, snow trails, low gravity) locally. It also provides `qb-weathersync` (`provide 'qb-weathersync'`) and exposes qb-weathersync compatible exports and events.

Current version: see `version` in `fxmanifest.lua`.

## Documentation map

- [Installation](./installation.md) - install steps, manifest walkthrough, requirements and file layout.
- [How to use](./how-to-use.md) - how state reaches clients, weather blending, suspending sync, config summary.
- [Commands](./commands.md) - admin chat/console commands, argument parsing and permission handling.
- [API reference](./api/index.md) - module index for the exports.
  - [State (server exports)](./api/state.md) - server exports, the client export and the state snapshot.
  - [Legacy qb-weathersync compatibility](./api/compat.md) - the `qb-weathersync` exports and events that are provided.
- [Configuration](./configuration.md) - every `Config` option and its effect.
- [Events](./events.md) - net events, state bag, rate limits and trust rules.
- [Troubleshooting](./troubleshooting.md) - common problems and known quirks.

## Features

- Weather: any type in `Config.weatherTypes`, blended on clients over `Config.weatherTransitionSeconds`.
- Dynamic weather: a single server timer picks the next weather from `Config.weatherTransitions` every `Config.weatherChangeEveryMinutes` minutes.
- Clock: a simulated clock that advances one minute every `Config.realSecondsPerGameMinute` real seconds, can be frozen, set, or set from presets.
- Blackout: artificial lights off, optionally including vehicle lights.
- Effects: per-weather rain level, snow level, gravity level and snow trails from `Config.weatherEffects`.
- No database: all state is in memory and resets to config values when the resource starts.

See [Installation](./installation.md) for requirements, install steps and the file layout.
