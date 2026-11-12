---
title: kora_scrapyard
sidebar_position: 1
---

# kora_scrapyard

`kora_scrapyard` is a public vehicle-scrapping activity for Kora servers. The server keeps a rotating "wanted" list of vehicle models. Players read the list from a yard attendant NPC, drive a listed vehicle they do not own into the delivery bay, dismantle it with a progress bar, and receive random scrap materials. The server decides every payout; the client never sends an amount.

Current version: see `version` in `fxmanifest.lua`. The resource still uses the legacy `qb-scrapyard:*` callback and event names.

## Features

- **Wanted list** - at resource start and then every hour the server picks up to `Config.VehicleCount` distinct models from `Config.Vehicles` (see [Configuration](./api/configuration.md)). The list is sent to all clients and re-sent to a client when its character loads.
- **Vehicle List app** - an NPC at each `list` position has a "Get Vehicle List" target option that opens a `kora_lib` NUI app. See [Using the scrapyard](./how-to-use.md).
- **Demolish Vehicle** - a box zone at each `deliver` position offers "Demolish Vehicle" while the player is in a vehicle. It uses `kora_target` when `Config.UseTargetForDemolish` is `true` and `kora_target` is started, otherwise a `Kora.interact` zone.
- **Server validation** - at the start and again at the end of the job the server checks the location, distance (5.0 m from the delivery point), listing, vehicle model, driver seat and ownership. See [Events and callbacks](./events.md).
- **Rewards** - 2 to 4 rolls of a random item from `Config.Items`, 25 to 45 each, plus a 1 in 8 chance of 10 to 20 `rubber`. See [Items](./items.md).
- **Map blip** - a "Scrap Yard" blip (sprite 380, colour 9) at each `list` position.
- **Locales** - `locales/*.lua` for en, de, es, fr, nl, pt-br and tr. See [Configuration](./api/configuration.md#locale-keys-used-by-the-code).

## Requirements

Declared as `dependency` in `fxmanifest.lua`:

| Resource | Used for |
| --- | --- |
| `kora_lib` | Callbacks, notifications, progress bar, NUI app, blips, entities, interaction zones, distance and world checks, locales |
| `kora_core` | Shared vehicle data (`Kora.shared`, `Kora.lookup`) and the `addItem` export for rewards |
| `kora_sql` | Server-side ownership lookup (`Kora.sql.scalar`) |
| `kora_target` | Aimed target options on the attendant and the delivery bay |

The items granted must exist in the inventory used by `kora_core`; see [Items](./items.md).

## Installation

See [Installation](./installation.md) for dependencies, start order, tables and items.

## Testing

- `test/run.sh` runs `test/smoke/server.lua` with `lua` (override with the `LUA` environment variable). The smoke test needs the `kora_lib` test harness checked out next to this resource (`../kora_lib/test/`). It exercises the begin, finish and cancel callbacks offline.
- `tests/checklist-activities.feature` holds manual QA scenarios for `kora_qa` (registered with `qa_feature` in `fxmanifest.lua`).

## Documentation map

- [Installation](./installation.md) - dependencies, start order, manifest, tables, items and startup behaviour
- [How to use](./how-to-use.md) - player flow, customising locations, and the Vehicle List app and dismantle details
- [API reference](./api/index.md) - module overview (this resource has no exports or commands)
- [Configuration](./api/configuration.md) - every `Config` option, location entries and the locale files
- [Events and callbacks](./events.md) - the callbacks and the net event
- [Items](./items.md) - reward items and probabilities
- [Database](./database.md) - the table read for ownership checks
- [Troubleshooting](./troubleshooting.md) - common problems and known caveats

This resource registers no commands, exports or ACE permissions.
