---
title: "How to use"
sidebar_position: 3
---


# How to use

Kora Interior spawns a streamed model as a frozen world object and hands back `{ objects, poi }`, where `objects` is a list of entity handles and `poi` (point of interest) always carries the authored `exit` coordinate, plus any extra points of interest the specific factory adds. Every factory is a thin wrapper over one of two low-level exports, `createGeometry` and `createShell`.

## Bare geometry: createGeometry

Use `createGeometry` when you only need a streamed object placed in the world — no entry fade, no ownership assumptions beyond cleanup. It is the one export in this resource that is not registered under the legacy `qb-interior` name.

```lua title="client/my_script.lua"
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

- The entity is tracked against the calling resource (`GetInvokingResource()`), and is deleted automatically when that resource stops (see Behavior in the Shell geometry module).
- On failure both returned values are `false` and an error string — check the first value before indexing the second.

## A full shell: createShell

`createShell` additionally streams in the model with `Kora.stream.loadModel`, releases it once created (`SetModelAsNoLongerNeeded`), and plays the stock entry fade (`Kora.visuals.fade`) at the exit position. This is what every named `Create*` factory in `client/main.lua` and `client/optional.lua` calls.

```lua title="client/my_script.lua"
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

## Using the 127 named shell factories (legacy exports)

Every entry in the `SHELLS` tables in `client/main.lua` and `client/optional.lua` (for example `CreateApartmentShell`, `CreateTier1House`, `CreateFurnishedHouse`) is registered both as a normal export on `kora_interior` and, via `Kora.compat.provideExport`, under the legacy `qb-interior` resource name. Two factories, `CreateApartmentFurnished` and `CreateHouseRobbery`, are hand-written instead of table-driven and add extra points of interest.

```lua title="client/my_script.lua"
-- Legacy qb-interior-style call: still works, still returns { objects, poi }.
local shell = exports['qb-interior']:CreateApartmentFurnished(vector3(120.5, -800.2, 30.0))
local objects, poi = shell[1], shell[2]

-- ... later, tear it down:
exports['qb-interior']:DespawnInterior(objects, function()
    print('interior despawned')
end)
```

- Each factory takes only `spawn` (a vector3/vector-like table with `x`, `y`, `z`); the exit coordinate and model are fixed per factory.
- The return shape is always `{ objects, poi }` on success. These factories do not use the `false, err` failure shape documented for `createShell` directly — see Behavior in the Shell factories module for what happens if the underlying `createShell` call fails.

## Tearing an interior down

Use `DespawnInterior` (legacy name) to delete every object you were handed and then run an optional callback.

- The callback argument is optional; omitting it no longer crashes (this was fixed — see Behavior in the Shell factories module).
- `removeGeometry` is the equivalent for objects created with `createGeometry`, and additionally enforces that only the resource that created an entity may remove it.
