---
title: Events
sidebar_position: 7
---

# Events

All net events keep the `qb-cityhall:` prefix for compatibility. The server checks distance and configuration on every server event. Purchases still cost the player cash, and job applications still change their job roster, so only trigger these events in response to a player action.

## Client events (net)

You can trigger these from the server with `TriggerClientEvent(name, playerId)`, or locally on the client.

| Event | Payload | Effect |
| --- | --- | --- |
| `qb-cityhall:client:openCityhallMenu` | none | Opens the City Hall panel for the configured City Hall nearest to the player, at any distance. |
| `qb-cityhall:client:openIdentityMenu` | none | Same as `openCityhallMenu`. The panel always opens on the Identity tab. |
| `qb-cityhall:client:openJobMenu` | none | Same as `openCityhallMenu`. The panel always opens on the Identity tab. |
| `qb-cityhall:client:getIds` | none | Sends `qb-cityhall:server:getIDs`, which claims any pending starter items. |

Opening the panel from far away is allowed, but the server still refuses purchases and applications when the player is outside `Config.PurchaseDistance`.

```lua
-- server: open the City Hall panel for a player
TriggerClientEvent('qb-cityhall:client:openCityhallMenu', playerId)
```

## Server events (net)

These are sent by the City Hall panel. They are documented for compatibility and debugging. Other resources should not normally trigger them.

| Event | Payload | Effect |
| --- | --- | --- |
| `qb-cityhall:server:purchaseID` | `key` (City Hall index), `license` (item name) | Buys a licence. See the purchase flow in [Items and starter items](./items.md). |
| `qb-cityhall:server:requestId` | `item`, `hall` | qb-cityhall alias for `purchaseID(hall, item)`. |
| `qb-cityhall:server:ApplyJob` | `key`, `job` (Kora shape), or `job`, `coords` (stock shape) | Adds `job` at grade 1 through `kora_multijob` and notifies "You have successfully applied for the job." The job must be in `Config.AvailableJobs`. When the first argument is a string that is not a City Hall key, it is treated as the job name. The City Hall is then chosen from the player's server-side position, and the client coordinates are ignored. |
| `qb-cityhall:server:getIDs` | none | Grants pending starter items when `Config.GiveStarterItems` is enabled. See [Items and starter items](./items.md). This is safe to repeat because each item can only be claimed once. |

If a server event gets an invalid City Hall key, licence or job, it fails an `assert` and does nothing. The error appears in the server console.

## Local client events listened to

| Event | Source | Effect |
| --- | --- | --- |
| `qb-clothing:client:CreateFirstCharacter` | [kora_clothing](https://github.com/KoraFiveM/kora_clothing) | Turns on the starter-item grant when `Config.GiveStarterItems == true`. |
| `qb-clothing:client:onMenuClose` | [kora_clothing](https://github.com/KoraFiveM/kora_clothing) | If the flag is on, turns it off and sends `qb-cityhall:server:getIDs`. |
| `kora_multichar:client:spawnComplete` | [kora_multichar](https://github.com/KoraFiveM/kora_multichar) | With `isNew ~= true` and `Config.GiveStarterItems` enabled, sends `qb-cityhall:server:getIDs`. |

## NUI app

The client registers the `kora_lib` NUI app `qb-cityhall:kiosk`. It has two tabs, `identity` and `jobs`, and opens on the right. Its card actions are `purchase:<item>` and `apply:<job>`, and they trigger the server events above. The app is internal and has no public API.
