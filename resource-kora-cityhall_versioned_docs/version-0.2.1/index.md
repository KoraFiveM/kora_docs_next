---
title: kora_cityhall
sidebar_position: 1
---

# kora_cityhall

`kora_cityhall` (version `0.2.0`) is the Kora city services resource. It places one or more City Hall clerk peds on the map. Players can target a clerk to open a City Hall panel, where they can buy identity documents and licences with cash or join a job from a configured list. It also gives new characters their pending starter items after they confirm their first outfit. The resource `provide`s `qb-cityhall`, so it can replace stock qb-cityhall.

## Features

- **City Hall locations**: each entry in `Config.Cityhalls` spawns a frozen, invincible clerk ped running a scenario. It can also create a map blip. You can configure any number of locations.
- **Target interaction**: each clerk gets a `kora_target` entity option labelled "City Hall". It opens the `qb-cityhall:kiosk` NUI app on the right side of the screen.
- **Identity tab**: shows one card for each licence configured at that City Hall, with its item label, image from `kora_inventory`, and price. A purchase removes **cash** and adds the item with character metadata. See [Items and starter items](./items.md).
- **Job Center tab**: shows one card for each job in `Config.AvailableJobs`. Applying adds the job at grade 1 through `kora_multijob`.
- **Confirmation dialogs**: when `Config.ConfirmActions` is enabled, purchases and job applications ask the player to confirm first.
- **Server-side validation**: the server checks how far the player is from the City Hall, whether the licence and job are configured, whether the player can carry the item, and whether they have enough cash. If the item cannot be added after payment, the cash is refunded.
- **Starter items**: pending starter items stored in character metadata are granted after the first-character outfit menu closes. Characters that disconnected before receiving them get them on a later spawn. See [Items and starter items](./items.md).
- **Runtime job registration**: the server export `AddCityJob` adds another job that players can apply for. See [Exports](./api/exports.md).
- **qb-cityhall compatibility**: stock event names and argument shapes are accepted. See [Compatibility](./compatibility.md).
- **Locales**: UI and notification strings come from `locales/*.lua` and are read with `Kora.lang`.

## Requirements

| Resource | Used for |
| --- | --- |
| [kora_lib](https://github.com/KoraFiveM/kora_lib) | `@kora_lib/init.lua`, config, locales, NUI app, entities, blips, notifications, distance checks (declared `dependency`) |
| [kora_core](https://github.com/KoraFiveM/kora_core) | Player data, metadata, money, shared items/jobs, starter items (declared `dependency`) |
| [kora_target](https://github.com/KoraFiveM/kora_target) | Clerk ped interaction (`exports.kora_target:addEntity`) |
| [kora_inventory](https://github.com/KoraFiveM/kora_inventory) | Adds items through the `qb-inventory` exports (`AddItem`, `CanAddItem`, `GetFreeWeight`); item images come from `nui://kora_inventory/images/` |
| [kora_multijob](https://github.com/KoraFiveM/kora_multijob) | Job applications (`exports.kora_multijob:addJob`) |
| [kora_clothing](https://github.com/KoraFiveM/kora_clothing) / [kora_multichar](https://github.com/KoraFiveM/kora_multichar) | Starter-item triggers (`qb-clothing:client:CreateFirstCharacter`, `qb-clothing:client:onMenuClose`, `kora_multichar:client:spawnComplete`) |

Only `kora_lib` and `kora_core` are declared as `dependency` in `fxmanifest.lua`. The other resources are called directly and must be running.

## Documentation map

- [Installation](./installation.md): install steps, dependencies and requirements
- [How to use](./how-to-use.md): what players see, purchase and job flows, starter items, architecture
- [API reference](./api/index.md): modules overview
  - [Exports](./api/exports.md): `AddCityJob`
  - [Configuration](./api/configuration.md): every option in `shared/config.lua`, defaults, locales
- [Items and starter items](./items.md): licence items, item metadata and starter-item grants
- [Events](./events.md): client and server net events
- [Database](./database.md): character metadata used by the resource
- [Compatibility](./compatibility.md): qb-cityhall aliases and differences
- [Troubleshooting](./troubleshooting.md): common problems

The resource registers no commands or key mappings.
