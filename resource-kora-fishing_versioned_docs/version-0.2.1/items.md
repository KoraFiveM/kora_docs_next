---
title: Items
sidebar_position: 7
---

# Items

The resource does not define items itself. They must exist in the `kora_core` shared items list (the repository `readme.md` holds ready-made definitions, all with weight 100, non-unique and non-usable). The two poles are made usable by the server script through `createUseable`.

| Group | Items |
| --- | --- |
| Poles | `fishing_pole`, `magnet_pole` (uses the `fishing_pole.png` image) |
| Baits | `worm`, `plug_bait`, `soft_plastic_bait`, `spinner_bait` |
| Magnets | `magnet_2lb`, `magnet_5lb`, `magnet_10lb`, `magnet_20lb` |
| Fish | `flounder`, `reddrum`, `tuna`, `steelhead`, `blue_fish`, `halibut`, `catfish`, `white_bass`, `salmon`, `trout`, `bass` |
| Salvage | `rusty_usb`, `rusty_motherboard`, `rusty_scanner`, `rusty_antenna`, `copper_pipe`, `rusty_scrap_metal`, `rusty_pistol`, `rusty_sign`, `rusty_chain`, `rusty_tire`, `rusty_box`, `rusty_shotgun`, `rusty_ak`, `rusty_bike`, `rusty_wheelchair`, `closed_safe` |
| Refine rewards (not defined in the readme) | `rubber`, `metalscrap`, `plastic`, `iron`, `copper`, `glass`, `steel` |

Fish sell prices (cash): flounder, reddrum, tuna 15; steelhead, blue_fish, halibut 30; catfish, white_bass, salmon 50; trout, bass 60.

Shop prices and level gates are in the `Config.Shop.items` table, see [Configuration](./api/configuration.md).

Images for all items except the refine rewards are in `images/`.
