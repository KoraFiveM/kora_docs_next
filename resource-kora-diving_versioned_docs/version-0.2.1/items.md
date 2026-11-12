---
title: Items
sidebar_position: 5
---

# Items

The resource does not define items. Create these in `kora_inventory` with exactly these names.

| Item | Role |
| --- | --- |
| `diving_gear` | Usable. Toggles wearing the diving gear (see [events](./events.md)). |
| `diving_fill` | Usable. Consumed to fill the oxygen tank to `Config.OxygenLevel`. Only works when oxygen is 0. |
| `dendrogyra_coral` | Coral reward from picking. Sold to the buyer ped. |
| `antipatharia_coral` | Coral reward from picking. Sold to the buyer ped. |

If you change `Config.CoralTypes`, every `item` named there must exist in the inventory.

Gear is not consumed. Only `diving_fill` is removed (one per refill).
