---
title: kora_lib-playground
sidebar_position: 1
---

# kora_lib-playground

`kora_lib-playground` is the in-game integration test menu for the Kora test server. It is a development resource, not a gameplay one. It gives testers a launcher (`/kora_menu`, default keys `HOME` or `F6`) with one-click checks for `kora_lib` modules and many other Kora resources, a guided testing flow (`/test`) backed by the community Discord bot, and an in-game feedback form (`/fb`) that delivers reports to Discord.

Current version: see `version` in `fxmanifest.lua`.

## Features

- **Launcher** - a `kora_lib` AppShell window listing every check, grouped into six areas. See [Launcher](./launcher.md).
- **Test commands** - about 90 `/test...` client commands that exercise blips, entities, zones, NUI dialogs and menus, minigames, `kora_target`, `kora_inventory`, `kora_clothing`, `kora_core`, `kora_sql`, `kora_admin` and many other resources. See [Commands](./commands.md).
- **Developer tools** - give items, self revive, spawn a vehicle with keys and fuel, teleport to Legion Square, and grant or revoke temporary moderator/admin roles. These are server-authorised and cooldown limited. See [Permissions](./permissions.md).
- **Guided testing** - `/test` relays to the communitybot, which hands out tests and records results. See [Guided testing](./guided-testing.md).
- **Feedback** - `/fb` collects a report, a screenshot and server-side context and sends it to Discord, optionally as a private web report. See [Feedback](./feedback.md).
- **communitybot integration** - player snapshot, restart signal, live status push and rcon commands. See [communitybot integration](./communitybot.md).
- **Feedback bot** - the Node service in `bot/` that creates one Discord forum post per report. See [Feedback bot](./feedback-bot.md).

## Pages

- [Installation](./installation.md) - dependencies, `server.cfg` and convars
- [Configuration](./configuration.md) - `Config` options and convars
- [Commands](./commands.md) - every chat, console and rcon command
- [Launcher](./launcher.md) - the `/kora_menu` window and its catalogue
- [Guided testing](./guided-testing.md) - the `/test` flow
- [Feedback](./feedback.md) - the `/fb` report pipeline and the web report page
- [Feedback bot](./feedback-bot.md) - the standalone Discord workflow service
- [communitybot integration](./communitybot.md) - files, HTTP pushes and rcon hooks
- [Events and callbacks](./events.md) - network events, callbacks and local events
- [Permissions](./permissions.md) - the `command.playground` ACE and what each action checks
- [Troubleshooting](./troubleshooting.md) - common problems

## Not provided

This resource creates no database tables and exposes no exports. It registers no items. It reads and writes files in its own folder (`reports/`, `players.json`, `restart.json`).
