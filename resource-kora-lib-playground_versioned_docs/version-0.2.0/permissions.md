---
title: Permissions
sidebar_position: 11
---

# Permissions

The only ACE this resource checks is `command.playground`, via `IsPlayerAceAllowed`. Grant it to testers who may use the developer tools:

```cfg
add_ace group.admin command.playground allow
```

## What needs it

- `playground:giveItem` and all item fixture commands, `/testgiveitem`
- `playground:sqlStats` (`/testsql_stats`)
- Self revive, vehicle spawn and keys, Legion teleport
- Granting and revoking temporary roles (only `moderator` and `admin` can be granted)
- Items in a `/test setup` (the rest of `/test` is open to anyone the bot accepts)

Cooldowns for revive, vehicle and Legion are enforced server-side (see `Config.devTools`) and each use is printed to the console.

## What does not

`/fb`, `/kora_menu`, the read-only checks and most commands for other resources have no server permission check; they only open UI or call the other resource, which applies its own permissions.

Console commands (`fbtest`, `playground_*`, `kora_connect_sync`) ignore in-game callers and are registered as restricted.

`playground_giveadmin` grants `group.admin` to a Discord identifier through `add_principal` until the next restart, so only expose rcon to a trusted bot.
