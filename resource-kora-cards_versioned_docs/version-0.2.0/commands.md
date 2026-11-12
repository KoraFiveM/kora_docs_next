---
title: Commands
sidebar_position: 3
---

# Commands

## /cards

| | |
| --- | --- |
| Side | Client (`RegisterCommand`, with a chat suggestion) |
| Arguments | none |
| Permission | none |

Opens the City Legends AppShell on the **Binder** tab. If the player is in a match, it reopens the match board instead. The name is hard-coded. `Config.commands.cards` is not used.

## /kora_cards_reload

| | |
| --- | --- |
| Side | Server (`Kora.commands.add`) |
| Name | `Config.commands.reload` (default `kora_cards_reload`) |
| Arguments | none |
| Permission | `Config.adminPermission` (default `admin`) |

Reloads every row of `kora_cards_designs` into a staging cache and validates the whole catalog: identities, rules, evolution links, content-hash locks and artwork files. The live catalog is replaced only if every check passes. Otherwise the error is sent as a notification and the old catalog stays in use. See [Catalog authoring](./features/catalog.md).

## /kora_cards_season

| | |
| --- | --- |
| Side | Server (`Kora.commands.add`) |
| Name | `Config.commands.season` (default `kora_cards_season`) |
| Arguments | `preview` or `close` (required) |
| Permission | `Config.adminPermission` (default `admin`) |

Closes the current season in two steps:

1. **`preview`** lists the top three eligible players (at least `Config.season.placementMinimumMatches` ranked matches, sorted by rating, then wins, then citizen ID). It is refused while ranked matches in the active season are still running. A successful preview pauses new ranked matches for 60 seconds.
2. **`close`**, run by the same admin within 60 seconds, closes the season. It is refused, and you have to preview again, if a ranked match started or the top-three standings changed since the preview. On success, in one transaction it:
   - creates a pending bank reward for each placement from `Config.season.rewards`
   - marks the season `closed`
   - creates the next active season, named `Season <n>`

Players receive pending rewards the next time they load in. See [Ranked and seasons](./features/ranked.md).

## Keybinds and controls

The resource doesn't register key mappings. While the studio camera is in use:

| Control | Action |
| --- | --- |
| Mouse | Aim |
| Scroll up (control 14) | Zoom in (lower FOV, minimum 20) |
| Scroll down (control 15) | Zoom out (higher FOV, maximum 70) |
| `E` (control 38) | Shutter |
| Backspace or `Esc` (controls 177 and 200) | Cancel |
