---
title: Items
sidebar_position: 7
---

# Items

The resource does not register items. The reward items must exist in your inventory item list. Defaults from `Config.VitrineRewards`, each with an amount of 1 to 4:

| Item | Probability |
| --- | --- |
| `rolex` | 0.4 |
| `diamond_ring` | 0.3 |
| `goldchain` | 0.2 |
| `tenkgoldchain` | 0.1 |

Items are added with `exports['qb-inventory']:AddItem` after `CanAddItem` succeeds. Other Kora resources such as `kora_robberies` also reference these item names.
