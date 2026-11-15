---
title: Resources and folders
sidebar_position: 1.7
---

# Resources and folders

:::caution Pre-release
This is the behaviour of installer v0.3.0, which is still a pre-release. v0.3.0 reads the new resource catalog format (schema v3); older installers do not. Update with `kora self-update` or the install command on [koraframe.work/installer](https://koraframe.work/installer).
:::

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

A resource can depend on others (`dependsOn`), across types. Choosing a resource selects everything it needs, and those dependencies stay selected for as long as something needs them. On the website, a dependency that something selected still needs cannot be unticked, and the page tells you which selected item needs it. On the command line, dependencies are added for you too (see [`--resources`](./commands.md#kora-install) and [Add resources](./add-resources.md)).

### Select all

On the website's resource picker, the compat and bridge sections and each creator have a **Select all** that ticks everything in that section or for that creator. Dependencies come along with it.

### Pinned, never forked

Bridge and creator resources are installed at an exact commit, never as a fork, even in [development mode](./dev-mode.md), so they cannot change under you. A release without a tag is pinned by its commit.

## Folder layout of a new server

A server installed with v0.3.0 has these folders under `resources/`:

| Folder | Holds |
| --- | --- |
| `[cfx-default]` | The default Cfx.re resources. |
| `[compat]` | Compatibility resources you chose. |
| `[kora]` | The Kora resources. |
| `[bridges]` | Bridge resources you chose. |
| `[creators]/[<creator>]` | Creator resources, one folder per creator. |
| `[addons]` | Empty, for your own scripts. |
| `[streamedassets]/[cars]`, `[maps]`, `[props]`, `[peds]` | Empty, for your own streamed assets. |

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

Put your own scripts in `resources/[addons]`, and your own streamed assets (vehicles, maps, props, peds) in the matching folder under `resources/[streamedassets]`. Because `server.cfg` already ensures those two folders, anything you put there starts with the server and you do not need to edit `server.cfg`. Keep your own work out of `[kora]`, `[compat]`, `[bridges]` and `[creators]`, which belong to the installer.

### Existing servers

Servers installed by an older version are **not rearranged**. Their folders and `server.cfg` stay as they are. When you [add resources](./add-resources.md) to such a server, nothing already installed is moved, renamed or removed; only the `ensure` lines that the new resources need are appended.
