---
title: "Client exports"
sidebar_position: 3
---


# Client exports

Two exports that talk directly to the local NUI page (Howler.js). They play audio only for the local player and require no server round trip.

Namespace: `exports.kora_sound` · Source: `client/main.lua, client/html/index.html`

## How it works

`hasPlayerLoaded` starts as `LocalPlayer.state.isLoggedIn == true` and is kept in sync by `QBCore:Client:OnPlayerLoaded` / `QBCore:Client:OnPlayerUnload`; while false, `PlaySound` is a no-op (stopping is still allowed). The NUI side (`client/html/index.html`) tracks at most one untracked "last one-shot" (a play call with no id) plus one Howl instance per id used for a loop or a tracked one-shot; starting a new sound under an id already in use unloads the previous instance for that id first.

## Functions

Two exports.

### `exports.kora_sound:PlaySound(soundFile, volume?, options?)`

Plays a sound for the local player only, through the NUI page.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `soundFile` | string | Required. |
| `volume?` | number | Optional explicit volume; otherwise resolved via `Config.resolveVolume`. |
| `options?` | table | Optional `{ loop?: boolean, id?: string }`. |

**Returns**

- **No return value. Silently does nothing if the local player has not loaded (`LocalPlayer.state.isLoggedIn` false and `QBCore:Client:OnPlayerLoaded` not yet fired).**

**Example**

```lua
exports.kora_sound:PlaySound('DoorOpen')
```

**Representative console output**

```text
Sends `{ transactionType = 'playSound', transactionFile, transactionVolume, transactionLoop, transactionId }` via `SendNUIMessage`; the NUI's Howler instance unloads any previous sound registered under the same id before starting the new one.
```

### `exports.kora_sound:StopSound(id)`

Stops a locally playing sound started with that id.

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `id` | string | Required; a falsy id is a no-op. |

**Returns**

- **No return value.**

**Example**

```lua
exports.kora_sound:StopSound('radio')
```

**Representative console output**

```text
Sends `{ transactionType = 'stopSound', transactionId = id }`; the NUI unloads and forgets the Howl instance for that id.
```

## Limits and related APIs

Client only, local player only. No access control: any script running in this client's Lua VM can call these.

## Related guides

- [Server exports](./server-exports.md)
