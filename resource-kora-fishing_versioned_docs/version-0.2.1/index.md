---
title: kora_fishing
sidebar_position: 1
---

# kora_fishing

`kora_fishing` adds fishing and magnet fishing to Kora servers. Players use a pole item inside a configured dock zone, wait for a level-dependent timer, play the `kora_lib` fishing minigame and receive a fish or salvage item plus fishing XP. They can buy gear from a shop NPC, sell fish to a buyer NPC for cash, and break salvage down into crafting materials at a refine spot. The server decides zones, bait, timing, rewards and prices; the client only supplies the minigame proof.

Current version: see `version` in `fxmanifest.lua`.

## Features

- **Fishing zones** - `Config.zones` are polygons with a height padding. A pole only works inside a zone whose `poles` table lists it. Entering a zone with a usable pole shows a notice, leaving it stops fishing. See [How to use](./how-to-use.md).
- **Bait and levels** - each pole has baits with a required fishing level, base time, XP and a catch list. Higher level means shorter wait. See [How to use](./how-to-use.md).
- **Magnet fishing** - `magnet_pole` with `magnet_2lb` to `magnet_20lb` pulls up rusty salvage instead of fish.
- **Fishing Shop** - a ped sells poles, baits and magnets for cash, gated by fishing level.
- **Fish Buyer** - a ped buys fish (cash only) at fixed prices.
- **Refine spot** - a box zone where salvage items are broken down into random materials.
- **Fishing Catalog** - the `/fishcatalog` command opens a panel listing poles, baits, unlock levels and possible catches. See [Commands](./commands.md).
- **Blips** - shop, buyer, refine spot and named zones get short-range map blips.

## Documentation map

- [Installation](./installation.md) - requirements, server.cfg order, setup checklist and tests
- [How to use](./how-to-use.md) - fishing zones, poles, bait, timing, shop, buyer and refining
- [Commands](./commands.md) - the `/fishcatalog` command
- [API reference](./api/index.md) - module index
- [Configuration](./api/configuration.md) - every `Config` option with defaults
- [Events](./events.md) - net events and callbacks
- [Items](./items.md) - items used and their roles
- [Database](./database.md) - database use
- [Troubleshooting](./troubleshooting.md) - caveats and common problems

This resource exposes no exports. It defines no ACE permissions.
