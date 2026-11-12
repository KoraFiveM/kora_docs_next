---
title: Configuration
sidebar_position: 6
---

# Configuration

Options live in `shared/config.lua`. The table is registered with `kora_lib` through `Kora.config.adopt(Config)`, and both client and server read it.

| Option | Default | Description |
| --- | --- | --- |
| `Config.DealerCoords` | `vector3(960.78, -216.25, 76.25)` | Where the dealer NPC stands. The server also requires the player to be within 5.0 m of it when starting. |
| `Config.VehicleSpawn` | 5 vector3 entries | Possible truck spawn points. One is picked at random per robbery. |
| `Config.VehicleDropOff` | `vector3(-3107.05, 1225.22, 10.70)`, `vector3(999.75, -1556.26, 30.76)` | Possible drop-off points. One is picked at random per robbery. |
| `Config.ActivePolice` | `2` | Minimum number of on-duty `leo` players required to start. |
| `Config.NavWeap` | `WEAPON_MICROSMG` | Declared for a navigator weapon but not read by any code in this resource. It has no effect. |

## Fixed values in code

These are not configurable and need a code change:

| Value | Where | Meaning |
| --- | --- | --- |
| 600000 ms | `server/server.lua` | Robbery state reset timeout (10 minutes). |
| 10.0 m | `server/server.lua` | Maximum player distance to the drop-off when ending. |
| 10 m (squared distance 100) | `server/server.lua` | Maximum distance of a `stockade` from the drop-off. |
| 10000 ms | `client/client.lua` | "Rob Truck" progress bar duration. |
| 5 by 5 by 5 box, `debug = true` | `client/client.lua` | Drop-off zone. Debug drawing of the zone is always on. |
| `s_m_m_security_01` | `client/client.lua` | Driver and guard model. |
| `WEAPON_ASSAULTRIFLE`, 255 ammo | `client/client.lua` | Crew weapon. |

## Locales

Strings are in `locales/en.lua` (assert messages, the start notification, target labels and icons, progress bar label). The "not enough police" notification, the notification title and the "Robbery Truck" blip name are hard-coded English in `client/client.lua`.
