---
title: kora_diving
sidebar_position: 1
---

# kora_diving

`kora_diving` lets players dive for coral and sell it. Players use a diving gear item to put on a mask and tank, fill the tank with an oxygen refill item, swim to coral on the seabed, pick it up through `kora_target`, and sell it to a buyer ped for cash. It is a port of `qb-diving` and still uses the legacy `qb-diving:*` event names.

Current version: see `version` in `fxmanifest.lua`.

## Features

- **Diving gear**: using `diving_gear` on land plays a 5 second progress bar, attaches a scuba mask and tank prop and enables scuba breathing. Using it again takes the gear off (another 5 second bar).
- **Oxygen**: a client-side counter starts at `Config.OxygenLevel` after using `diving_fill` and drops by 1 every second while the player is swimming underwater. It is shown as a text UI number while diving. Breathing sounds play every 10 units at 90 or below. At 0 the scuba effect ends and, if `Config.RemoveDivingGear` is true, the props are deleted.
- **Coral**: configured seabed locations spawn a frozen coral prop with a "Pick coral" target option. A pick gives a random coral item, removes the prop for everyone and respawns it after 5 minutes.
- **Selling**: a frozen buyer ped has a "Sell Coral" target option. The server removes all coral items the player holds and pays cash.

## Documentation map

- [Installation](./installation.md): dependencies, item registration, server.cfg order, config summary, locales and tests.
- [How to use](./how-to-use.md): gear, oxygen, coral pickup and selling flow in detail.
- [Configuration](./configuration.md): every `Config` option with defaults, coral types and fixed values.
- [Items](./items.md): the four item names the inventory must define.
- [Events and callbacks](./events.md): server and client events, the fill callback, usable items and global state.
- [Troubleshooting](./troubleshooting.md): common problems and their causes.

## What this resource does not have

No commands, no exports, no database tables, no ACE permissions and no NUI of its own.
