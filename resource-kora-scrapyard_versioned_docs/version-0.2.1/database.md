---
title: Database
sidebar_position: 8
---

# Database

The resource creates no tables and writes nothing. It runs one read query through `Kora.sql.scalar` to find out whether a vehicle is player-owned:

```sql
SELECT 1 FROM `player_vehicles` WHERE `plate` = ? AND `deleted_at` IS NULL LIMIT 1
```

The plate is read from the vehicle entity and trimmed of surrounding spaces. If a row is found, the vehicle is refused with `error.smash_own`. If the query returns an error, the job is refused with "The scrapyard could not verify this vehicle." and the error is printed to the server console with the `[qb-scrapyard]` prefix.

The table needs `plate` and `deleted_at` columns.
