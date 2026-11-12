---
title: "Commands"
sidebar_position: 4
---


# Commands

Kora Cards adds three chat commands, registered through kora_core's command system (`Kora.commands.add`) except `/cards`, which is a plain FiveM `RegisterCommand`.

## Built-in commands

### `/cards`

Opens the City Legends AppShell app at the Binder view (`openCards('binder')`). Chat-suggested as 'Open your City Legends binder'.

| Field | Details |
| --- | --- |
| Context | In-game · client command |
| Arguments | None. |
| Access | Any player. All further authorization happens server-side per action. |

**Example**

```text
/cards
```

**Result**

The shared kora_lib AppShell interface opens showing Binder, Decks, Play, Shop, Studio (if on-duty staff) and Ranked.

### `/kora_cards_reload`

Validates and atomically reloads the card catalog from `kora_cards_designs` (`KoraCards.Catalog.reload()`). Useful after editing the database directly.

| Field | Details |
| --- | --- |
| Context | In-game · server command (kora_core) |
| Arguments | None. |
| Access | Config.adminPermission (default `admin`), passed as `{ permission = Config.adminPermission }` to `Kora.commands.add`. |

**Example**

```text
/kora_cards_reload
```

**Result**

Notification: 'Catalog reloaded.' on success, or the specific validation error (duplicate identity, invalid rules, dangling predecessor, locked-hash mismatch, bad media path) on failure. A failed reload keeps serving the previous in-memory catalog.

### `/kora_cards_season <preview|close>`

Two-step, confirmation-gated season rollover. `preview` refuses while any ranked match for the season is still in progress, then snapshots the top 3 eligible standings (citizen ID, rating; requires the season's `placementMinimumMatches`, default 5) for 60 seconds. `close` (within that window, and only if the standings and in-progress-match count have not changed) pays the 3 placement rewards as pending bank rewards, marks the season `closed` and starts the next one.

| Field | Details |
| --- | --- |
| Context | In-game · server command (kora_core) |
| Arguments | preview\|close — required. Anything else is treated as an unrecognized action and answered the same as a stale/missing preview. |
| Access | Config.adminPermission (default `admin`). |

**Example**

```text
/kora_cards_season preview
/kora_cards_season close
```

**Result**

Preview: 'Season rollover preview' with ranked standings and a reminder to close within 60 seconds, or 'Wait for active ranked matches to finish before previewing rollover.' Close: 'Season closed; rewards are pending and the next season is active.' or 'Ranked state changed. Run a fresh rollover preview.' if anything moved since the preview.

## Command names

The literal command strings for the two server commands come from `Config.commands.reload` and `Config.commands.season` (defaults `kora_cards_reload`, `kora_cards_season`). Change them in `config.lua` if they collide with another resource. `/cards` is registered with a hard-coded name (`client/main.lua:743`), so `Config.commands.cards` has no effect.

## Command details from the code

### `/kora_cards_reload`

Reloads every row of `kora_cards_designs` into a staging cache and validates the whole catalog: identities, rules, evolution links, content-hash locks and artwork files. The live catalog is replaced only if every check passes. See [Catalog authoring](./features/catalog.md).

### `/kora_cards_season`

- `preview` lists the top three eligible players (at least `Config.season.placementMinimumMatches` ranked matches, sorted by rating, then wins, then citizen ID). A successful preview pauses new ranked matches for 60 seconds.
- `close`, run by the same admin within 60 seconds, is refused if a ranked match started or the top-three standings changed since the preview. On success, in one transaction it creates a pending bank reward for each placement from `Config.season.rewards`, marks the season `closed` and creates the next active season, named `Season <n>`.

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
