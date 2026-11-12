---
title: "Installation"
sidebar_position: 2
---


# Installation

Kora Scoreboard is a small kora_lib AppShell app: a population/population-cap readout plus a table of police-gated activities (store, bank, jewellery robberies and the two bank heists) showing whether enough police are on duty. It has no database table and nothing to configure beyond kora_lib's config editor.

## Install Kora Scoreboard

1. **Add the folder** — Place `kora_scoreboard` in your resources directory (on the Kora recipe it is `resources/[kora]/kora_scoreboard`).

2. **Have the dependencies running** — The manifest declares `dependency 'kora_lib'` and `dependency 'kora_core'`. `Kora.nui` (the AppShell) comes from kora_lib; the player list, job/duty state and the opt-in flag come from kora_core.

3. **Start it** — Order only matters relative to its two dependencies.

   ```bash title="server.cfg"
   ensure kora_lib
   ensure kora_core
   ensure kora_scoreboard
   ```

4. **Nothing else to set up** — There is no table to create and no item to register. This resource registers no exports of its own.

## Manifest reference

```lua title="fxmanifest.lua"
dependency 'kora_lib'
dependency 'kora_core'

shared_script {
    '@kora_lib/init.lua',
    'shared/config.lua'
}
client_script 'client/**.lua'
server_script 'server/**.lua'
```

Besides these, the real manifest also lists `client_script 'fft_hooks.lua'` (optional dev hooks, inert unless the convar `fft_kora_hooks` is `true`) and `qa_feature 'tests/*.feature'` (kora_qa scenarios). The optional FFT hooks do export `fftVersion` and `fftAction` when enabled; see [How to use](./how-to-use.md#optional-fft-hooks).

## Requirements

Declared with `dependency` in `fxmanifest.lua`:

| Resource | Used for |
| --- | --- |
| [kora_lib](https://github.com/KoraFiveM/kora_lib) | `@kora_lib/init.lua`, `Kora.nui` app shell, `Kora.config`, `Kora.callback` |
| [kora_core](https://github.com/KoraFiveM/kora_core) | `createCallback`, `getAllPlayers` and `isOptin` exports |

There is no database use, no items and no locale files. Text in the UI is hardcoded in English in `client/client.lua`.

## Robbery script integration

Call `qb-scoreboard:server:SetActivityBusy` from the server side of your robbery scripts, using the ids from [Configuration](./configuration.md). See [Events and callbacks](./events.md).

## Tests

- `bash test/run.sh` runs `lua test/settings.lua`, an offline configuration check.
- `tests/checklist-character-and-ui.feature` contains Gherkin scenarios for `kora_qa` (declared with `qa_feature` in the manifest): open key, `/scoreboard`, stats, activity table, cooldown status, nearby IDs and hold mode.

## Licence

GPL-3.0-or-later, see `LICENSE`.
