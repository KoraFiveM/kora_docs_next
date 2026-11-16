---
title: Add resources
sidebar_position: 4.5
---

# Add resources to a server

You can add catalog resources to a server you have already installed, without installing again. Anything a resource depends on is added with it, and resources that are already installed are skipped. Existing servers are not rearranged: nothing is moved, renamed or removed, and only the missing `ensure` lines are appended to `server.cfg`. See [Resources and folders](./resources.md).

For assets you bought on the Cfx.re Portal, see [Paid assets](./paid-assets.md) instead.

## In the panel

Open the server's **Resources** tab. It lists the installed resources and the catalog of ones you can add (compatibility, bridges, creators). Dependencies are added for you.

## In the terminal manager

Open `kora manager`, select the server and press `g` (**Add resources**) to browse compatibility resources, bridges and creator resources.

## With resource ids

```bash
kora add-resources my-server --resource some_resource --resource another_one
```

`--resource` can be repeated. Without it the command stops with exit code `2` and points you to the manager and the panel. Setup codes (`--code`) were removed in v0.4.0.

| Option | Meaning |
| --- | --- |
| `--resource <ID>` | A catalog resource id (repeatable). |
| `--dry-run` | Show what would be added, change nothing. |
| `-y`, `--yes` | Do not ask for confirmation. |

## What happens

Kora lists what it will add, marked `(needed by another)` for dependencies, with the folder each goes to and whether it is pinned, a branch head or your fork, then asks you to confirm. On a development server, Kora's own resources are cloned from your fork, and Kora offers to sign you in to GitHub first if needed. Forks you already have are reused, as in [Development mode](./dev-mode.md#forks-you-already-have). Bridge and creator resources are always pinned, never forked. When it is done, restart the server to load the new resources.
