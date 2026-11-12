---
title: Events
sidebar_position: 7
---

# Events

The resource has no server code, no callbacks and no net events it sends. It registers one client event and triggers one.

## Registered

| Event | Arguments | Description |
| --- | --- | --- |
| `qb-interior:client:SetNewState` | `bool` | Stores whether the player is a new character. Net event, so a server script may trigger it for a client. The flag is only read by `CreateApartmentFurnished`. |

## Triggered

| Event | When |
| --- | --- |
| `qb-clothes:client:CreateFirstCharacter` | Local event triggered 750 ms after `CreateApartmentFurnished` returns, only if the new-character flag was set by `qb-interior:client:SetNewState`. The flag is then reset to `false`. The handler is expected to be provided by a clothing resource. |

## Native handlers

- `onClientResourceStop` - for any resource that stops, `kora_interior` invalidates its pending `createGeometry` calls for that resource; when `kora_interior` itself stops it deletes all geometry it still owns. Geometry owned by another resource is deleted by the `kora_lib` ownership registry when that resource stops.
