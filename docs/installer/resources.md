---
title: Resources and folders
sidebar_position: 1.7
---

# Resources and folders

## Resource types

Every resource in the catalog has a type.

| Type | What it is |
| --- | --- |
| **default** | The Kora resources themselves (including what they need to run). This is what `--resources all` and the default selection mean. |
| **compat** | Compatibility resources, for example the `ox_lib` compatibility wrapper. |
| **bridge** | Bridges between Kora and other frameworks. |
| **creator** | Resources by third-party creators, grouped by creator. |

Compat, bridge and creator resources are **never selected by default**. `--resources all` installs only the default resources. These resources are installed only when you choose them, or when something you chose needs them.

### Dependencies

A resource can depend on others (`dependsOn`), across types. Choosing a resource selects everything it needs, and those dependencies stay selected for as long as something needs them. On the command line, dependencies are added for you too (see [`--resources`](./commands.md#kora-install) and [Add resources](./add-resources.md)).

### Bridge libraries

The catalog includes these third-party bridge libraries:

- `community_bridge` ([TheOrderFivem/community_bridge](https://github.com/TheOrderFivem/community_bridge)). It needs `ox_lib` and `oxmysql`, which are selected for you.
- `loaf_lib` ([loaf-scripts/loaf_lib](https://github.com/loaf-scripts/loaf_lib)).
- `Newb_Bridge` ([MrNewb/Newb_Bridge](https://github.com/MrNewb/Newb_Bridge)). It needs `ox_lib` and `oxmysql`, which are selected for you.

Kora does not provide support for these libraries; they are included for convenience, and some of them need their own setup.

### Pinned, never forked

Bridge and creator resources are installed at an exact commit, never as a fork, even in [development mode](./dev-mode.md), so they cannot change under you. A release without a tag is pinned by its commit.

## Folder layout of a new server

A new server has these folders under `resources/`:

| Folder | Holds |
| --- | --- |
| `[cfx-default]` | The default Cfx.re resources. |
| `[compat]` | Compatibility resources you chose. |
| `[kora]` | The Kora resources. |
| `[bridges]` | Bridge resources you chose. |
| `[creators]/[<creator>]` | Creator resources, one folder per creator. |
| `[addons]` | Empty, for your own scripts. |
| `[streamedassets]/[cars]`, `[maps]`, `[props]`, `[peds]` | Empty, for your own streamed assets. |
| `[paid]` | [Paid assets](./paid-assets.md) from the Cfx.re Portal, created when you import the first one. Each gets its own `ensure <name>` line. |

`server.cfg` starts whole folders, not single resources. It contains one `ensure [folder]` line per folder, in this order:

```cfg title="server.cfg"
ensure [cfx-default]
ensure [compat]
ensure [kora]
ensure [bridges]
ensure [creators]
ensure [addons]
ensure [streamedassets]
```

A folder that holds no installed resource is left out, so for a default install you get `ensure [kora]`, `ensure [addons]` and `ensure [streamedassets]` (plus `[cfx-default]` if it holds a resource). `[addons]` and `[streamedassets]` are always ensured.

### Where your own scripts and assets go

Put your own scripts in `resources/[addons]`, and your own streamed assets (vehicles, maps, props, peds) in the matching folder under `resources/[streamedassets]`. Because `server.cfg` already ensures those two folders, anything you put there starts with the server and you do not need to edit `server.cfg`. Keep your own work out of `[kora]`, `[compat]`, `[bridges]`, `[creators]` and `[paid]`, which belong to the installer. Install paid assets with Kora rather than copying them into `[addons]` by hand (see [Paid assets](./paid-assets.md)).

### Existing servers

Servers installed by a version before v0.3.0 are **not rearranged**. Their folders and `server.cfg` stay as they are. When you [add resources](./add-resources.md) to such a server, nothing already installed is moved, renamed or removed; only the `ensure` lines that the new resources need are appended.
