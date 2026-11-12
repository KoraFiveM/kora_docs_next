---
title: Compatibility
sidebar_position: 7
---

# Compatibility

`fxmanifest.lua` declares `provide 'qb-cityhall'`, so resources that depend on `qb-cityhall`, or call `exports['qb-cityhall']`, resolve to `kora_cityhall`.

## qb-cityhall aliases

| Stock API | Kora behaviour |
| --- | --- |
| `qb-cityhall:server:requestId(item, hall)` | Calls the same purchase handler as `qb-cityhall:server:purchaseID(hall, item)`. |
| `qb-cityhall:server:ApplyJob(job, coords)` | Finds the City Hall from the player's server-side position, using the first one within `Config.PurchaseDistance`. The client `coords` are ignored. If the player is not near any City Hall, nothing happens. |
| `exports['qb-cityhall']:AddCityJob(job, { label, isManaged })` | Adds a job the server accepts applications for. See [Exports](./exports.md) for the client-side limitation. |
| `qb-cityhall:client:openCityhallMenu`, `openIdentityMenu`, `openJobMenu` | All open the panel for the nearest City Hall. |
| `qb-cityhall:client:getIds` | Claims pending starter items. |

## Differences from stock qb-cityhall

- Interaction uses `kora_target` on the clerk ped and a `kora_lib` NUI panel. It does not use PolyZone or DrawText.
- There are no driving schools, driving lessons or instructor e-mails. The stock `drivinglicense` metadata and its flow are not provided.
- Licences can be bought without a prior grant from a driving instructor or the police. Any item in a City Hall's `licenses` table can be bought for cash.
- Jobs are added to the player's `kora_multijob` roster at grade 1. They do not replace the player's current job.
- Starter items such as the ID card, driver licence and phone are granted after first-character creation. See [Items and starter items](./items.md).
