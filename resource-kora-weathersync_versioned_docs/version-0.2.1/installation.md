---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Weathersync is a server-authoritative weather, clock, blackout and environmental-effects sync. It keeps one `GlobalState.kora_weathersync` snapshot so every client, including a late joiner or a resource restart, sees the same world immediately. It depends only on Kora Lib.

## Install Kora Weathersync

1. **Add the folder** — Place `kora_weathersync` in your resources directory (on the Kora recipe it is `resources/[kora]/kora_weathersync`). Keep the folder name unchanged: commands, exports and the qb-weathersync compatibility events rely on it.

2. **Start it after Kora Lib** — The manifest declares `dependency 'kora_lib'`, so add it to `server.cfg` after Kora Lib.

   ```bash title="server.cfg"
   ensure kora_lib
   ensure kora_weathersync
   ```

3. **Review config.lua** — Starting weather, starting time, the real-seconds-per-game-minute ratio, dynamic weather and blackout all start from `shared/config.lua`. See [Configuration](./configuration.md).

## What the manifest sets up

```lua title="fxmanifest.lua"
fx_version 'cerulean'
game 'gta5'

provide 'qb-weathersync'
lua54 'yes'

name 'kora_weathersync'
author 'kora'
version '0.2.0'
description 'Server-authoritative weather, clock, blackout, and environmental-level sync'

dependency 'kora_lib'

shared_script '@kora_lib/init.lua'
shared_script 'shared/config.lua'

server_scripts {
    'server/state.lua',
    'server/commands.lua'
}

client_script 'client/main.lua'

files {
    'locales/*.lua',
}

-- kora_qa: Gherkin test scenarios (converted legacy tests), see [kora]/kora_qa/README.md
qa_feature 'tests/*.feature'
```

- `shared_script '@kora_lib/init.lua'` installs the `Kora` namespace before `shared/config.lua` and before any server or client file runs.
- `server/state.lua` builds the authoritative state, publishes it to `GlobalState.kora_weathersync`, and registers every export and net event. It loads before `server/commands.lua`, which only wires `Kora.commands.add` chat commands onto the functions `state.lua` already defined.
- `client/main.lua` is the only client file: it reads `GlobalState.kora_weathersync`, listens for state-bag changes and a few compatibility net events, and applies the result with FiveM weather/clock/effect natives.
- `files { 'locales/*.lua' }` ships the locale texts used for notifications and command replies, and `qa_feature 'tests/*.feature'` registers the kora_qa feature files.

## Requirements

Declared in `fxmanifest.lua`:

| Resource | Used for |
| --- | --- |
| `kora_lib` | Config adoption (`Kora.config`), locales, commands (`Kora.commands`), permissions (`Kora.permissions`), timers, notifications, compat exports (`Kora.compat`) |

The permission prefix `kora_core` is only an ACE prefix string (see [Commands](./commands.md)); `kora_core` is not declared as a dependency.

## Before you start

- Do not run another resource that provides `qb-weathersync` at the same time; this resource declares `provide 'qb-weathersync'`.
- Grant the admin permission (default `kora_core.admin`) to staff so they can use the [commands](./commands.md).
- There is no database: all state is in memory and resets to the config values when the resource starts.

## Layout

- `fxmanifest.lua` - manifest, `provide 'qb-weathersync'`.
- `shared/config.lua` - all configuration.
- `server/state.lua` - state, setters, exports, events, clock loop.
- `server/commands.lua` - admin commands.
- `client/main.lua` - applies the state, effects and legacy client events.
- `locales/en.lua` - notification and command texts.
- `test/` and `tests/` - offline Lua tests and kora_qa feature files.
