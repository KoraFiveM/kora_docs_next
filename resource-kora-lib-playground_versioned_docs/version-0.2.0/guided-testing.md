---
title: Guided testing
sidebar_position: 6
---

# Guided testing

`/test` (key `F3`, mapping `kora_test`) is a client for the communitybot's test list. The bot decides who may test (the code comments name the Early Tester and Mod roles), which test to offer, and records the result. This resource relays requests and enforces limits. The relay needs `kora_connect_bot_secret` and a `kora_connect_bot_url` ending in `/fx-event`; see [Installation](./installation.md).

## Identity and trust

- The player's Discord ID is read on the server from their `discord:` identifier. If none is linked the player gets a "no Discord account" message.
- Results (`works`, `fail`, `skip`, `release`, `setspot`, `acceptspots`) are only accepted for the test the bot last offered that player.
- Teleports and setup only use the spots and setup that the bot sent for the offered test.
- The `playground:test` event is rate limited to 30 per minute, `playground:testTp` to 10 per 30 seconds and `playground:testSetup` to 6 per 30 seconds.

## Subcommands

| Command | Action |
| --- | --- |
| `/test` | Open the panel (fetches or resumes a test first). |
| `/test next` | Ask for the next test. |
| `/test works` (aliases `ok`, `pass`) | Report the test as working. |
| `/test fail text` (alias `bad`) | Opens a text box (prefilled with the rest of the line) and reports a failure. The server adds position, ping, vehicle, resource and its `version` metadata. |
| `/test skip later`, `cant` or `na` | Skip with a reason (anything else means later). |
| `/test go` (alias `start`) | Teleport to the test spot. |
| `/test tp N` | Teleport to spot number N of the offered test. |
| `/test setup` | Run the test's setup. |
| `/test back` | Return to where you were before the teleport. |
| `/test clear` | Drop the current test (`release`). |
| `/test list`, `/test resources` | Show resources. |
| `/test pick` | Choose a test. |
| `/test setspot label`, `/test acceptspots` | Save or accept teleport spots for the test. |
| `/test all` | Stop focusing on one resource. |
| `/test hud` | Toggle the steps overlay. |
| `/test autogo` | Toggle automatic teleport and setup when a new test arrives. |
| `/test help` | Show a summary. |
| `/test resourcename` | Focus tests on that resource (letters, digits, `_`, `.`, `-`, up to 64 characters). |

## Setup

For a setup the bot can request items, revive, a vehicle and slash commands. Items are only given if the player has `command.playground`; otherwise the setup reports "items need the admin role". Item names must match `^[%w_.%-]+$` and counts are capped at 100. Revive runs `/testrevive`, vehicles use the playground vehicle spawner, and slash commands run on the tester's client under their own permissions.

Tuning values are in `Config.test` ([Configuration](./configuration.md)).
