---
title: Events
sidebar_position: 8
---

# Events

`kora_consumables` has no public API events. The net events and callback below are part of its own client-server protocol and are documented for reference. Do not trigger them from other resources. To add consumables, use the [exports](./api/server-exports.md).

## Net events

| Name | Direction | Payload | Description |
| --- | --- | --- | --- |
| `kora_consumables:sync` | client to server | none | **Internal.** Sent once when the client script starts. The server replies with `kora_consumables:register` containing all items added at runtime. It does not reply if none were added. Replies are limited to one every 5 seconds per player, and the limit is reset when the player drops. |
| `kora_consumables:register` | server to client | array of `{ class, item, data }` | **Internal.** Adds runtime consumables to the client's `Config.Consumables`. It is sent to all clients when an export adds an item, and to a single client in reply to `sync`. Invalid entries are ignored. |

## Callback

| Name | Side | Payload | Returns |
| --- | --- | --- | --- |
| `kora_consumables:progress` | client (registered with `Kora.callback.register`) | `{ class, item }` | `true` if the progress bar finished. It returns `false` if the item is unknown, the bar was cancelled or the progress bar failed. |

**Internal.** The server triggers this callback during a use. Treat the result as untrusted. The server checks it against the item's duration before it applies anything.

## Item events

If an item has an `event` field in the config, or a `replenish.event` added with `AddCustom`, the server sends that client event to the player after a completed use:

```lua
-- client, in your own resource
RegisterNetEvent('myresource:client:flaskUsed', function(item)
    print('used', item)
end)
```

The only argument is the item name.

## Events this resource listens to

| Event | Side | Purpose |
| --- | --- | --- |
| `onResourceStart` | server | When `kora_inventory` starts, all useables are registered again so this resource's handlers replace the inventory's built-in handlers. |
| `playerDropped` | server | Clears the player's `sync` rate-limit entry. |
