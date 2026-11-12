---
title: "Shell factories"
sidebar_position: 3
---


# Shell factories

The bulk of this resource: one low-level `createShell` export plus 127 named one-line wrappers around it, each pinned to one bundled interior model and one authored exit coordinate. Two factories (`CreateApartmentFurnished`, `CreateHouseRobbery`) are hand-written instead of table-driven so they can add extra points of interest or new-character handling.

Namespace: `exports.kora_interior / exports['qb-interior']` · Source: `client/main.lua, client/optional.lua`

## How it works

All named factories (table-driven and hand-written) call `createShell`, which streams the model, places it with `CreateObject` (always the legacy/offset placement — `createGeometry`'s `placement` choice does not apply here), freezes it, releases the streamed model, and plays `Kora.visuals.fade` at `spawn + exit` with the exit heading. Every factory is registered twice: once as a normal `kora_interior` export, and once under the legacy `qb-interior` resource name via `Kora.compat.provideExport`, so old code written for `qb-interior`/`kora_interior` keeps working unmodified.

## Terms used on this page

| Term | Meaning |
| --- | --- |
| poi (point of interest) | The second element of every factory's success return. Always has `exit`; `CreateApartmentFurnished` additionally adds `clothes`, `stash` and `logout`. |
| Legacy export | An export also registered under the `qb-interior` resource name through `Kora.compat.provideExport`, so `exports['qb-interior']:Name(...)` and `exports.kora_interior:Name(...)` both reach the same handler. |

## Functions

One shared primitive (`createShell`), two hand-written factories, and 125 table-generated named factories with identical signatures.

### `exports.kora_interior:createShell(spawn, exit, model)`

Streams a model, spawns it frozen at `spawn`, releases the streamed model, and plays the stock entry fade at the `exit` offset from `spawn`. This is the function every named `Create*` export (in both `client/main.lua` and `client/optional.lua`) calls internally.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `spawn` | vector3 \| table | Required world position, `{ x, y, z }`. |
| `exit` | vector4 \| table | Offset added to `spawn` for the entry fade position; also copied verbatim into the returned `poi.exit`. Needs `x`, `y`, `z`, and a heading in `w` (or `h` as a fallback — `exit.w or exit.h or 0`). |
| `model` | string \| number | Model name or hash, passed to `Kora.stream.loadModel` (a string is also separately hashed with `joaat` for the subsequent `CreateObject` call). |

**Returns**

- **On success** — `{ { house }, { exit = exit } }`: a two-element list, first element a one-item list containing the new entity handle, second a table with only `exit` (unchanged from the argument).
- **On failure** — `false, errorString`, matching `createGeometry`'s failure shape. Causes: the model fails to stream (`Kora.stream.loadModel`'s own error, or `'Shell model could not be streamed.'` if none), or `CreateObject` returns no/invalid handle (`'Shell geometry could not be created.'`).

**Example**

```lua
-- A resource that wants the stock entry fade and a frozen shell object.
local shell, err = exports.kora_interior:createShell(
    vector3(120.5, -800.2, 30.0),
    vector4(1.5, -2.0, 0.0, 180.0),
    'shell_v16low'
)
if not shell then
    return print('shell failed:', err)
end
local objects, poi = shell[1], shell[2]
print('house object', objects[1], 'exit heading', poi.exit.w)
```

**Representative console output**

```text
Unlike `createGeometry`, `createShell` always uses `CreateObject` (the legacy/offset placement) and ignores `Config.DefaultGeometryPlacement` — there is no `placement` parameter. It does not track the entity in `Kora.resources.registry` and does not participate in the automatic stop-cleanup that `createGeometry` entities get; the named factories that call it only ever run as part of this resource itself, so cleanup there is the caller's responsibility via `DespawnInterior` or its own logic.
```

### `exports['qb-interior']:CreateApartmentFurnished(spawn)`

Spawns the `furnitured_midapart` shell with a fixed exit, and adds `clothes`, `stash` and `logout` points of interest on top of `exit`. If the current session is flagged as a new character (via the `qb-interior:client:SetNewState` net event), it also fires `qb-clothes:client:CreateFirstCharacter` 750ms later.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `spawn` | vector3 \| table | Required world position. |

**Returns**

- **On success** — `{ { house }, poi }` where `poi` has `exit`, `clothes`, `stash` and `logout` (each a `vector4`).
- **Unclear: `createShell` can itself fail and return `false, err`, but this wrapper does not check that return before indexing `shell[2]` (`local poi = shell[2]`)** — if `createShell` fails, `shell` is `false` and `shell[2]` would error. Not guarded in source; verify before relying on a clean failure path here.

**Example**

```lua
local shell = exports['qb-interior']:CreateApartmentFurnished(vector3(120.5, -800.2, 30.0))
local objects, poi = shell[1], shell[2]
print(poi.clothes, poi.stash, poi.logout)
```

**Representative console output**

```text
Fixed exit `vector4(1.5, -10.0, 0.0, 358.50)`. The new-character check reads a module-local `IsNew` flag set only by the `qb-interior:client:SetNewState` net event.
```

### `exports['qb-interior']:CreateHouseRobbery(spawn)`

Spawns the same `furnitured_midapart` shell as `CreateApartmentFurnished` but with only the base `exit` point of interest (no clothes/stash/logout), and no new-character handling.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `spawn` | vector3 \| table | Required world position. |

**Returns**

- **Same shape as `createShell`: `{ { house }, { exit = exit } }` on success, `false, errorString` on failure (same caveat as above** — not separately guarded here either).

**Example**

```lua
exports['qb-interior']:CreateHouseRobbery(vector3(200.0, -900.0, 30.0))
```

**Representative console output**

```text
Fixed exit `vector4(1.46, -10.33, 1.06, 0.39)`.
```

### `exports['qb-interior']:Create<Name>(spawn)`

Every other entry in the `SHELLS` tables — 16 in `client/main.lua` (e.g. `CreateApartmentShell`, `CreateTier1House`, `CreateTrevorsShell`, `CreateGarageMed`) and 109 more in `client/optional.lua` (e.g. `CreateFurnishedHouse`, `CreateMansion`, `CreateK4Basement`, `CreateV2Default1`) — is generated by iterating the table and registering `function(spawn) return createShell(spawn, def.exit, def.model) end` under both the plain export name and the legacy `qb-interior` name. `client/optional.lua`'s version calls back into the resource's own `createShell` export rather than the local function.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `spawn` | vector3 \| table | Required world position; the model and exit offset are fixed per factory name (see the `SHELLS` tables in source for the full model/exit list). |

**Returns**

- **On success** — `{ { house }, { exit = exit } }`, identical shape to `createShell`.
- **On failure** — these thin wrappers return whatever `createShell` returns, i.e. `false, errorString` (no extra handling, no crash risk here since nothing indexes into the result inside the wrapper itself).

**Example**

```lua
exports['qb-interior']:CreateFurnishedHouse(vector3(300.0, -200.0, 50.0))
exports.kora_interior:CreateGarageMed(vector3(50.0, 60.0, 70.0))
```

**Representative console output**

```text
Two pairs of entries in `client/optional.lua` reuse an identical authored exit vector across sibling models (for example `CreateK4LuxuryHouse1`..`4` and `CreateK4Garage2`/`CreateK4Garage3`, `CreateK4House1`/`CreateK4House2`) — flagged with inline `-- verify if intentional` comments in source. Unclear whether this is deliberate reuse of one doorway or a copy-paste gap; treat per-model exits as authoritative only where they differ.
```

### `exports['qb-interior']:DespawnInterior(objects, cb?)`

Deletes every entity in `objects` that still exists, then calls `cb` if one was given. Registered through `legacyExport`, so it is available as both `exports.kora_interior:DespawnInterior` and `exports['qb-interior']:DespawnInterior`.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `objects` | table (array of entity handles) \| nil | List of entity handles to delete, typically the first element of a `createShell`/factory result. `nil` is tolerated (iterates an empty table). |
| `cb?` | function | Optional callback, called with no arguments once every entity has been checked/deleted. Omitting it no longer crashes — this was the fixed no-callback bug. |

**Returns**

- **Returns nothing (no value). The only observable effect is entity deletion and, if provided, invoking `cb()`.**

**Example**

```lua
exports['qb-interior']:DespawnInterior(objects) -- no callback: fine
exports['qb-interior']:DespawnInterior(objects, function()
    print('cleaned up')
end)
```

**Representative console output**

```text
Iterates with `pairs(objects or {})`, checks `DoesEntityExist(obj)` before each `DeleteEntity(obj)`, then runs `if cb then cb() end`. Does not deregister entities from `Kora.resources.registry` — this function is the counterpart to the hand-written `createShell`/named factories, which never register with that tracker in the first place (only `createGeometry` entities are tracked).
```

## Additional details from the code

- `createShell` is exported under `kora_interior` only (not `qb-interior`); the named factories and `DespawnInterior` are exported under both names.
- The model offsets and exits of every factory are listed in the [Shell catalog](../shell-catalog.md), which also lists which factories belong to the bundled assets and which to optional packs.
- Optional factories from `client/optional.lua` are not backed by models in this resource's `stream/` folder. See [Troubleshooting](../troubleshooting.md) for what happens when the pack is missing.
- `CreateApartmentFurnished` triggers the local event `qb-clothes:client:CreateFirstCharacter`; see [Events](../events.md).

## Limits and related APIs

Client-only. The named factories take only `spawn` — there is no way to override a factory's model or exit coordinate from the call site; pick the factory whose fixed shell you want, or call `createShell` directly with your own model/exit. `createShell` has no `placement` option (always legacy/offset). `CreateApartmentFurnished` and `CreateHouseRobbery` do not check `createShell`'s return before indexing into it — see the Unclear note on `CreateApartmentFurnished` above.

## Related guides

- [Shell geometry (createGeometry / removeGeometry)](./geometry.md)
- [Configuration](./configuration.md)
