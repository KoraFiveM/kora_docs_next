---
title: Items and starter items
sidebar_position: 3
---

# Items and starter items

`kora_cityhall` does not define any items. Every item it sells or grants must already exist in `kora_core`'s shared items. Items are added through the `qb-inventory` exports, which [kora_inventory](https://github.com/KoraFiveM/kora_inventory) provides.

## Licence items

Each City Hall sells the items listed in its `licenses` table. See [Configuration](./configuration.md). The Identity tab shows each item's shared `label` and `image`, loaded from `nui://kora_inventory/images/`. If the item is not a shared item, the tab shows the raw key and the `default` image.

### Item metadata

When an item is purchased or granted as a starter item, the server builds its `info` metadata from the character's `charinfo`:

| Item | Metadata fields |
| --- | --- |
| `id_card` | `citizenid`, `firstname`, `lastname`, `birthdate`, `gender`, `nationality` |
| `driver_license` | `firstname`, `lastname`, `birthdate`, `type = 'Class C Driver License'` |
| `weaponlicense` | `firstname`, `lastname`, `birthdate` |
| any other item | empty table |

### Purchase flow

The server handles `qb-cityhall:server:purchaseID` in this order:

1. It asserts that the City Hall key and licence are valid and configured for that City Hall. Invalid input raises a server error and does nothing.
2. It checks that the player is within `Config.PurchaseDistance` of the City Hall. If not, it sends a "too far" notification.
3. It refuses the purchase if the price is not a positive number.
4. It checks carry room with `CanAddItem(src, item, 1)`. When `Config.RequireFreeWeight` is enabled, it also checks that `GetFreeWeight(src)` is greater than `0`.
5. It removes the price from **cash** (`removeMoney(src, 'cash', price, 'cityhall id')`). If the player does not have enough cash, they get "You don't have enough money on you, you need %s cash".
6. It adds one item with the metadata above. If `AddItem` fails, the cash is refunded (`'cityhall id refund'`) and the player is told their inventory is full.

The server does not check whether the player already owns the item, so players can buy the same item more than once.

## Starter items

New characters created by `kora_core` get a `starterItems` metadata table. It maps every item in `QBCore.Shared.StarterItems` to `true`. The default `kora_core` list is `phone`, `id_card` and `driver_license`. `kora_cityhall` hands these items out when `Config.GiveStarterItems` is enabled.

### When items are granted

- **First character**: `qb-clothing:client:CreateFirstCharacter`, fired by [kora_clothing](https://github.com/KoraFiveM/kora_clothing), turns on a flag. When the next `qb-clothing:client:onMenuClose` fires, the client sends `qb-cityhall:server:getIDs`.
- **Later spawns**: `kora_multichar:client:spawnComplete`, fired by [kora_multichar](https://github.com/KoraFiveM/kora_multichar) with `isNew ~= true`, sends `qb-cityhall:server:getIDs`. Characters that disconnected during creation receive their pending items this way.
- The compatibility client event `qb-cityhall:client:getIds` also sends `qb-cityhall:server:getIDs`.

### What the server does

For each entry in `exports.kora_core:getStarterItems()` whose item is still `true` in the player's `starterItems` metadata, the server does the following:

1. It sets the item to `false` and saves the metadata before adding the item. This stops a re-entrant or repeated event from granting it twice.
2. It adds **one** of the item with the metadata described above. The `amount` field of the starter item is not used.
3. If `AddItem` returns `false`, it sets the item back to `true` so the player can claim it later.

The server allows only one claim per player at a time. It stops if the player switches character during the claim, and saves the player once at the end if anything changed. Errors are printed as `[qb-cityhall] Starter item claim failed for <src>: <error>`. If the player has no `starterItems` table, nothing happens.
