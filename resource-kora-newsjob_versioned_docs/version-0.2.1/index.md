---
title: kora_newsjob
sidebar_position: 1
---

# kora_newsjob

`kora_newsjob` is the Weazel News job for Kora servers (a port of `qb-newsjob`, and it still uses the legacy `qb-newsjob:*` event names). Players with the `news` job get a garage for a news van and a helicopter, a trunk stocked with reporting gear, an equipment counter, a teleporting door pair into the news building, a map blip, and usable camera and microphone items with attached props and animations.

Current version: see `version` in `fxmanifest.lua`.

## Features

- **Garage** - a `kora_target` zone at `Config.Locations.vehicle.coords` opens the "Weazel News Garage" `kora_lib` NUI app with a Vehicles tab. A second zone at `Config.Locations.heli.coords` opens it on the Helicopters tab. Only `news` employees see the options. See [Garage](./garage.md).
- **Vehicle trunk items** - a van spawned from the garage gets the items in `Config.VehicleItems` placed in its trunk.
- **Equipment counter** - a zone at `Config.Locations.shop` lets news employees take a camera, boom mic or hand mic. See [Equipment](./equipment.md).
- **Usable items** - `newscam`, `newsmic` and `newsbmic` attach a prop and play an animation; the camera also opens the `kora_lib` camera overlay.
- **Building entrance** - "Enter" at `Config.Locations.outside` and "Go outside" at `Config.Locations.inside` fade the screen and move the player.
- **Blip** - news employees get a "Weazel News Vehicles" blip at the garage.

## Installation

See [Installation](./installation.md) for dependencies, required items and job, start order and tests.

## Documentation map

- [Installation](./installation.md) - dependencies, required job and items, start order, manifest, tests
- [How to use](./how-to-use.md) - job gating, garage spawning, one-time trunk grant, equipment shop, usable items, door teleport
- [Configuration](./configuration.md) - all `Config` options
- [Garage](./garage.md) - the garage app, vehicle spawning, trunk items and blip
- [Equipment](./equipment.md) - counter, usable items, props and removal rules
- [Events](./events.md) - net events and callbacks
- [Troubleshooting](./troubleshooting.md) - caveats and common problems

This resource registers no commands, exposes no exports, defines no ACE permissions and uses no database tables, so there is no commands or API reference page.
