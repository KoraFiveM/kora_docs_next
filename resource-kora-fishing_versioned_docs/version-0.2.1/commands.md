---
title: "Commands"
sidebar_position: 4
---


# Commands

Kora Fishing adds one client-side command.

## Built-in commands

### `/fishcatalog`

Opens the read-only Fishing Catalog NUI app, which lists every configured pole, its baits (grouped and sorted by required level) and the fish/items each bait can catch. Locked baits are shown with a destructive tone and an "unlocked at level N" note; unlocked ones are shown in green.

| Field | Details |
| --- | --- |
| Context | In-game · client command |
| Arguments | No arguments. |
| Access | Any player. |

**Example**

```text
/fishcatalog
```

**Result**

Opens the catalog app (id `qb-fishing:catalog`). Automatically closes on `QBCore:Client:OnPlayerUnload`.

## Catalog contents


| Command | Who | Description |
| --- | --- | --- |
| `/fishcatalog` | Any player (registered with restricted `false`, no ACE needed) | Opens the Fishing Catalog panel |

The catalog has one tab per pole in `Config.poles` (sorted by item name). Each tab shows the player's fishing level and `Config.fishing.maxLevel`, then each bait with "Unlocked at level N" or "Locked - requires level N" and the fish or salvage it can produce. It is built on the client from `Config.poles` and the player's `fishing` level, and is not zone dependent. Running the command while the panel is open does nothing; the panel also closes when the character unloads.

The resource registers no other commands.
