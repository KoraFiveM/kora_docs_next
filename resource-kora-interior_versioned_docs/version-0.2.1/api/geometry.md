---
title: "Shell geometry"
sidebar_position: 2
---


# Shell geometry

Low-level primitives behind every named shell factory: stream a model, spawn it frozen at a position, and track it for automatic cleanup. `createGeometry` is for callers (for example shared housing scenes) that want bare geometry without the stock entry fade or any extra points of interest; `createShell` (see the Shell factories module) builds on the same streaming path and adds the fade plus model release.

Namespace: `exports.kora_interior` · Source: `client/main.lua`

## How it works

Ownership of every entity is recorded against `GetInvokingResource() or GetCurrentResourceName()` in a `Kora.resources.registry`. When the owning resource stops, every entity it is still tracking is deleted automatically — callers do not need their own `onClientResourceStop` handler for cleanup. A separate `stopped[owner]` generation counter guards against the model finishing its stream after the calling resource has already stopped: the pending callback checks its captured generation and does nothing if it no longer matches.

## Terms used on this page

| Term | Meaning |
| --- | --- |
| Owner | `GetInvokingResource()` at call time, falling back to the current resource name if there is no invoker (e.g. called from a command). Determines who `removeGeometry` will allow to delete the entity, and whose stop event triggers automatic cleanup. |
| placement | `'legacy'` uses `CreateObject` (the same native every named shell factory uses, which applies the model's built-in offset). `'centered'` uses `CreateObjectNoOffset`. Only `createGeometry` exposes this choice. |

## Functions

Two exports: one to create tracked geometry, one to explicitly remove it early.

### `exports.kora_interior:createGeometry(spawn, exit, model, placement?)`

Streams a model and spawns it as a frozen, untextured piece of geometry at `spawn`, with no entry fade and no legacy point-of-interest fields beyond `exit`. Tracks the resulting entity against the calling resource so it is cleaned up automatically. Not registered under the legacy `qb-interior` name.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `spawn` | vector3 \| table | Required world position, `{ x, y, z }` (a `vector3` works). Every axis must be a finite number or the call fails before anything streams. |
| `exit` | vector4 \| table \| any | Not validated or used to move anything in this function — it is only copied verbatim into the returned `poi.exit`. Conventionally a `vector4` with a heading (`w` or `h`). |
| `model` | string \| number | Model name or hash. Passed straight to `Kora.stream.loadModel`. |
| `placement?` | string | Either `'legacy'` (use `CreateObject`, with its model offset — the same native the named shell factories use) or `'centered'` (use `CreateObjectNoOffset`). Any other non-nil value is rejected. When omitted, `Config.DefaultGeometryPlacement` is used (`'legacy'` by default in `config.lua`); if `Config` itself is missing, `'centered'` is used instead. |

**Returns**

- **On success** — `{ { entity }, { exit = exit } }`: a two-element list where the first element is a one-item list containing the new entity handle, and the second is a table with only an `exit` field (the `exit` argument, unchanged).
- **On failure** — `false, errorString`. Causes: missing `spawn` (`'Invalid shell origin.'`), a non-finite x/y/z (`'Invalid shell origin.'`), an invalid `placement` value (`'Invalid shell placement mode.'`), the model failing to stream (the error from `Kora.stream.loadModel`, or `'Shell geometry could not be created.'` if none), or the native create call returning no/invalid entity (`'Shell geometry could not be created.'`).

**Example**

```lua
-- Shared housing scenes: ask kora_interior for bare geometry, no entry fade, no legacy POIs.
local objects, poi = exports.kora_interior:createGeometry(
    vector3(120.5, -800.2, 30.0),
    vector4(1.5, -2.0, 0.0, 180.0)
)
if not objects then
    return print('shell geometry failed:', poi) -- poi is the error string here
end
print('spawned entity', objects[1])
```

**Representative console output**

```text
Internally calls `Kora.stream.loadModel(model, callback)` and creates the entity inside that callback. If the invoking resource is stopped (or restarted) before the model finishes streaming, a generation counter (`stopped[owner]`) makes the callback a no-op instead of spawning an orphaned entity. The entity is frozen with `FreezeEntityPosition` and registered with `Kora.resources.registry`, which deletes it automatically if the owning resource stops.
```

### `exports.kora_interior:removeGeometry(objects)`

Deletes entities previously returned by `createGeometry`, but only if the calling resource is the one that created them.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `objects` | table (array of entity handles) | Required list of entity handles, e.g. the first element of what `createGeometry` returned. |

**Returns**

- **On success** — `true`.
- **On failure** — `false, errorString`. Causes: `objects` is not a table (`'Shell objects are required.'`), or any entity in the list is not owned by the calling resource (`'Shell geometry belongs to another resource.'`) — in that case nothing is deleted, the check runs over the whole list before any deletion happens.

**Example**

```lua
local ok, err = exports.kora_interior:removeGeometry(objects)
if not ok then print('could not remove geometry:', err) end
```

**Representative console output**

```text
Ownership is resolved through the same `Kora.resources.registry` used by `createGeometry` (`geometry.owner(entity)`), compared against `GetInvokingResource() or GetCurrentResourceName()`. Entities that exist in the world are deleted with `DeleteEntity`; entities that no longer exist are simply untracked.
```

## Additional details from the code

- `createGeometry` also validates the model before streaming: a model that is neither a non-empty string nor an integer hash returns `false, 'A shell model is required.'`, and a model for which `IsModelValid` is false returns `false, 'Unknown shell model.'`. This returns a reason instead of the assertion error `Kora.stream.loadModel` raises for an unusable model.
- The entity is created non-networked and `kora_interior` does not fade or move the player.
- If the owner stops while the model is loading, the shell is not created and the call returns `false, 'Shell geometry could not be created.'`.
- When `kora_interior` itself stops, it deletes all geometry it still owns. Geometry owned by another resource is deleted by the `kora_lib` ownership registry when that resource stops (`onClientResourceStop` handler in `client/main.lua`).
- For the full list of failure messages see [Troubleshooting](../troubleshooting.md). Static asset evidence for the bundled models is in [Bundled shell geometry evidence](../shell-geometry.md).

## Limits and related APIs

Client-only; there is no server-side equivalent. `createGeometry` does not play the entry fade or set any point-of-interest fields beyond `exit` — callers that want those must add them themselves or use `createShell` instead.

## Related guides

- [Shell factories (createShell and the named Create* exports)](./shells.md)
- [Configuration](./configuration.md)
