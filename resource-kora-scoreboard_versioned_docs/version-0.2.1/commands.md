---
title: "Commands"
sidebar_position: 4
---


# Commands

Kora Scoreboard registers one toggle command/key, built from three linked FiveM commands.

## Built-in commands

### `/scoreboard`

Opens the panel if closed, closes it if open. Works regardless of `Config.Toggle`.

| Field | Details |
| --- | --- |
| Context | In-game · client command |
| Arguments | No arguments. |
| Access | Everyone. |

**Example**

```text
/scoreboard
```

**Result**

Toggles the Scoreboard panel.

## The key binding is three commands

The key (`Config.OpenKey`, default `HOME`) is bound to `+scoreboard` (key down) and its matching `-scoreboard` (key up) is registered automatically by FiveM. Key-down toggles or opens depending on `Config.Toggle`; key-up closes the panel only in hold mode. `/scoreboard` is a separate, always-available toggle that does not depend on the key state.

## Command summary

| Command | Description |
| --- | --- |
| `/scoreboard` | Toggles the scoreboard: opens it if closed, closes it if open. Always toggles, regardless of `Config.Toggle`. |
| `+scoreboard` / `-scoreboard` | Key press and release handlers. Not meant to be typed. |

All three are registered with `RegisterCommand(..., false)`, so no ACE permission is required.

## Key mapping

`RegisterKeyMapping('+scoreboard', 'Open Scoreboard', 'keyboard', Config.OpenKey)` creates the FiveM key binding "Open Scoreboard" (default `HOME`). Players can rebind it in FiveM settings.

## Toggle and hold modes

- **Toggle** (`Config.Toggle = true`, default): pressing the key opens the scoreboard, pressing it again closes it. The panel footer also mentions Escape, which closes the app through `kora_lib`.
- **Hold** (`Config.Toggle = false`): the scoreboard opens when the key goes down and closes on release. If the key is released while the data request is still in flight, the panel does not open.

While the data is loading further open requests are ignored, and nothing happens if the app is already open.

If the app cannot be opened, the client prints `[qb-scoreboard] could not open: <error>` to its console.
