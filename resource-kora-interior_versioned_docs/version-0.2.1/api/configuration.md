---
title: "Configuration"
sidebar_position: 4
---


# Configuration

A single setting in `config.lua`, read only by `createGeometry`.

Namespace: `Config` · Source: `config.lua`

## How it works

`Config.DefaultGeometryPlacement` picks the native used to place the entity when a caller of `createGeometry` passes no `placement` argument at all. It has no effect on `createShell` or any named `Create*` factory, which always use the legacy/offset native regardless of this setting.

## Options

This resource has a single option, set in `config.lua`; there is no per-call options table.

| Option | Type | Description |
| --- | --- | --- |
| `Config.DefaultGeometryPlacement` | string: 'legacy' \| 'centered' | Default is `'legacy'` in the shipped `config.lua`. `'legacy'` makes `createGeometry` use `CreateObject` (the model's built-in offset, same as every named shell factory). `'centered'` makes it use `CreateObjectNoOffset` instead. If `Config` itself is absent at runtime, `createGeometry` falls back to `'centered'`, not to this value. |

## Additional details from the code

`config.lua` is loaded as a shared script and defines only this one option. `client/main.lua` reads it only when no placement argument is given. Any value other than `'legacy'` makes `createGeometry` use `CreateObjectNoOffset`, so keep it to one of the two documented values.

Shell models, exit offsets and the factory list are not configurable; they are hard-coded in `client/main.lua` and `client/optional.lua` (see [Shell catalog](../shell-catalog.md)).

## Limits and related APIs

Only consumed by `createGeometry`. An explicit `placement` argument to `createGeometry` always overrides this default; an invalid explicit value (anything other than `nil`, `'legacy'` or `'centered'`) is rejected with `false, 'Invalid shell placement mode.'` regardless of this config value.

## Related guides

- [Shell geometry (createGeometry / removeGeometry)](./geometry.md)
