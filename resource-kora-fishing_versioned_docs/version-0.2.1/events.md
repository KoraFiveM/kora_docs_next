---
title: Events
sidebar_position: 6
---

# Events

All events use the `kora_fishing:` prefix. There are no exports.

Server handlers use `assert` for validation, so invalid or out-of-range requests raise a script error in the server console instead of a notification.

## Server callbacks (`Kora.callback`)

| Name | Arguments | Returns | Description |
| --- | --- | --- | --- |
| `kora_fishing:server:beginCatch` | none | `{ duration, authorization }` or `false, message` | Validates fishing state, zone, pole and bait and starts a pending catch. Rate limited to 2 calls per second |
| `kora_fishing:server:canOpenBuyerMenu` | buyer location key | `true` | Asserts the player is within 5 units of the buyer |
| `kora_fishing:server:openRefineMenu` | breakdown location key | `true` | Asserts the player is within 5 units of the refine spot |
| `kora_fishing:client:confirmOpenShop` | shop location key | `true` | Registered on the server despite its `client` name; asserts the player is within 5.0 of the shop |

## Net events, client to server

| Event | Arguments | Description |
| --- | --- | --- |
| `kora_fishing:server:catchFish` | zone index, minigame proof or `nil`, authorization | Completes the pending catch. `nil` proof cancels it. See [How to use](./how-to-use.md) |
| `kora_fishing:server:stopFishing` | none | Clears the player's fishing state and tells the client to stop |
| `kora_fishing:server:sellItem` | buyer location key, buyer item index, amount | Sells to the buyer. Amount must be a positive integer |
| `kora_fishing:server:purchaseItem` | shop location key, shop item index, amount | Buys from the shop. Amount must be a positive integer within the item's `amount` |
| `kora_fishing:server:refineItem` | breakdown location key, breakdown item index | Refines one salvage item |

## Net events, server to client

| Event | Arguments | Description |
| --- | --- | --- |
| `kora_fishing:client:goFish` | pole item name | Starts the client fishing loop. Ignored unless it comes from the server |
| `kora_fishing:client:stopFishing` | none | Stops the animation and deletes a nearby rod prop |

## Other events used

- `QBCore:Notify` (server to client) for pole-use messages.
- `QBCore:Server:OnPlayerUnload` and `playerDropped` clear fishing state and cooldown.
- `QBCore:Client:OnPlayerUnload` closes the catalog app.
