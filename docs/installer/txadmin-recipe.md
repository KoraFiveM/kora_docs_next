---
title: txAdmin recipe or installer
sidebar_position: 2.5
---

# txAdmin recipe or installer

There are two ways to set up a Kora server. Choose by how you run your server.

| | Kora installer | txAdmin recipe |
| --- | --- | --- |
| Needs | The `kora` program on the machine | A txAdmin you already run; no account needed |
| Production or development | You choose | No choice: always pinned releases |
| Result | A guided, resumable install that also sets up database, service and firewall, then [Kora Panel](./panel.md) to manage and update the server | txAdmin downloads the resources and writes your `server.cfg` |

If you are not sure, the installer is the guided way. The recipe is for people who already run txAdmin. For the plain recipe with every default resource, see [Installation](../installation.md).

## Getting the installer

Linux:

```sh
curl -fsSL https://github.com/KoraFiveM/kora-installer/releases/download/v0.5.0/install.sh | sh
```

Windows (PowerShell):

```powershell
irm https://github.com/KoraFiveM/kora-installer/releases/download/v0.5.0/install.ps1 | iex
```

The scripts check the download's SHA-256, keep the previous version as `kora.previous` (`kora.exe.previous` on Windows) and then open Kora Panel. Each [release](https://github.com/KoraFiveM/kora-installer/releases) has its own scripts; use an explicit version number. Details in [Install on Linux](./install-linux.md) and [Install on Windows](./install-windows.md).

Setup codes from the website no longer exist (removed in installer v0.4.0).

## Getting the recipe

On [koraframe.work/installer](https://koraframe.work/installer), pick your resources (compat, bridges and creator resources are never selected by default, see [Resources and folders](./resources.md)). Then use any of:

- **Remote URL.** Copy the link and paste it into txAdmin's **Deploy server**, **Remote URL**. The link carries your selection, so it works without an account.
- **Download.** Download `recipe.yaml` and use it in txAdmin.
- **Paste import.** Paste a Kora `recipe.yaml` into the **Import a recipe.yaml** box to load its selection back into the picker. Only downloads of resources in the catalog are accepted; anything else rejects the paste, and the YAML is only read, never run.

The recipe writes the same [folder layout](./resources.md#folder-layout-of-a-new-server) as the installer, with one `ensure [folder]` line per folder in `server.cfg`.

## Pauses between downloads

The recipe waits 5 seconds (`waste_time`) after every download. This keeps txAdmin from hitting GitHub's rate limits, so a deployment with many resources takes a few minutes.
