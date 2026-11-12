---
title: kora_interior
sidebar_position: 1
---

# kora_interior

`kora_interior` is a client-side shell library for Kora housing-style resources. It bundles 16 K4MB1 shell models (streamed from `stream/`), and exports factories that spawn a shell object at a caller-supplied origin, plus a newer pair of geometry exports (`createGeometry` and `removeGeometry`) that spawn a shell without teleporting the player. It also registers 109 factories for optional shell packs that are not included. It has no server code, no commands, no database use and no UI.

The resource declares `provide 'qb-interior'`, and every factory plus `DespawnInterior` is also exported under the `qb-interior` resource name through `Kora.compat.provideExport`, so QBCore-era callers keep working. The manifest sets `this_is_a_map 'yes'`. Shell models are credited to K4MB1 (`author` in `fxmanifest.lua`).

Current version: see `version` in `fxmanifest.lua`.

## Features

- **Legacy shell factories** - `CreateApartmentShell`, `CreateTier1House`, `CreateMichael` and others create the shell with `CreateObject`, freeze it, fade the screen and teleport the player to the shell exit. See [Shell catalog](./shell-catalog.md).
- **Native geometry exports** - `createGeometry` and `removeGeometry` create and remove a frozen local shell with no fade or teleport, owned by the calling resource. See [Exports](./api/index.md).
- **Ownership cleanup** - geometry created through `createGeometry` is deleted when the owning resource stops, and when `kora_interior` itself stops.
- **Placement modes** - `legacy` (`CreateObject`) or `centered` (`CreateObjectNoOffset`), defaulting to `Config.DefaultGeometryPlacement`. See [Configuration](./api/configuration.md) and [Shell geometry](./shell-geometry.md).
- **Bundled asset report** - model-local bounds for the 16 bundled archetypes in `bundled-shell-bounds.json`.

## Documentation map

- [Installation](./installation.md) - manifest, load order, requirements (`kora_lib`) and the full manifest notes
- [How to use](./how-to-use.md) - `createGeometry`, `createShell`, the named factories and `DespawnInterior` with examples
- [API reference](./api/index.md) - module overview
  - [Shell geometry](./api/geometry.md) - `createGeometry` and `removeGeometry`: parameters, returns, ownership and cleanup
  - [Shell factories](./api/shells.md) - `createShell`, `CreateApartmentFurnished`, `CreateHouseRobbery`, the table-driven `Create*` factories and `DespawnInterior`
  - [Configuration](./api/configuration.md) - the single `Config.DefaultGeometryPlacement` option
- [Shell catalog](./shell-catalog.md) - every factory with model name and exit offset
- [Events](./events.md) - the one client event this resource listens to and the one it triggers
- [Bundled shell geometry evidence](./shell-geometry.md) - bundled asset bounds and placement limits
- [Testing](./testing.md) - offline tests and QA scenarios
- [Troubleshooting](./troubleshooting.md) - known caveats and common problems

This resource registers no commands (so there is no commands page), no server events, no items, no ACE permissions and uses no database tables.
