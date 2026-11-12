---
title: Items
sidebar_position: 7
---

# Items

Rewards are granted with `exports.kora_core:addItem(src, name, amount, nil, nil, 'scrapyard-reward')`. Each completed dismantle rolls:

| Reward | Amount | Chance |
| --- | --- | --- |
| 2 to 4 rolls of a random entry from `Config.Items` | 25 to 45 each | every dismantle |
| `rubber` | 10 to 20 | 1 in 8 |

Rolls are independent, so the same item can appear more than once.

Default `Config.Items`: `metalscrap`, `plastic`, `copper`, `iron`, `aluminum`, `steel`, `glass`.

`rubber` is hard-coded in `server/server.lua` and is not part of `Config.Items`. All names used here must exist as items in your inventory; the resource does not define or register items itself.
