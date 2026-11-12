---
title: Database
sidebar_position: 6
---

# Database

`kora_cityhall` has no SQL files and runs no SQL queries, so there is nothing to import.

It changes saved data only through other resources:

| Data | Owner | How it is used |
| --- | --- | --- |
| Player metadata `starterItems` | `kora_core` | A table that maps item names to `true` while the item is pending, or `false` once it is claimed. `kora_cityhall` reads it with `getMetaData`, updates it with `setMetaData`, and saves with `savePlayer`. See [Items and starter items](./items.md). |
| Cash | `kora_core` | `removeMoney(src, 'cash', price, 'cityhall id')`, and on refund `addMoney(src, 'cash', price, 'cityhall id refund')`. |
| Inventory items | `kora_inventory` (through `qb-inventory`) | `AddItem` with reasons `qb-cityhall:purchaseID` and `qb-cityhall:giveStarterItems`. |
| Job roster | `kora_multijob` | `addJob(src, job, 1)` when a player applies for a job. |
