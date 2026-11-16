---
title: Overview
sidebar_position: 1
---

# Kora installer

`kora` is a single program that installs and runs a complete Kora server for you on **Linux** or **Windows**: it downloads FXServer, fetches the Kora resources, creates a database, configures txAdmin and writes your server files. It comes with **Kora Panel**, a page in your browser where you install, manage and update your servers. It is an alternative to the [txAdmin recipe](../installation.md) (see [txAdmin recipe or installer](./txadmin-recipe.md)), with the same end result and a guided, resumable process.

These pages describe Kora Installer **v0.5.0**.

:::note Status
Linux is tested end to end. Windows is covered by CI smoke tests, and real-machine runs have started, so please report problems. The Windows `kora.exe` is not code-signed, so Windows SmartScreen may warn about it (see [Troubleshooting](./troubleshooting.md#windows-smartscreen-and-antivirus)).
:::

## Quick start

Linux (Debian 12+ / Ubuntu 22.04+, x86-64):

```sh
curl -fsSL https://github.com/KoraFiveM/kora-installer/releases/download/v0.5.0/install.sh | sh
```

Windows 10/11 or Server 2019+ (PowerShell):

```powershell
irm https://github.com/KoraFiveM/kora-installer/releases/download/v0.5.0/install.ps1 | iex
```

When the script finishes, Kora Panel starts by itself and opens in your browser. Choose **Install a server** and follow the steps. See [Kora Panel](./panel.md). Already have Kora? Run `kora self-update`.

Prefer the terminal? `kora install` is the terminal wizard and `kora manager` the terminal server screen. They do the same things as the panel.

## What it does

1. Checks free disk space and that your chosen ports are free.
2. Downloads the official FXServer build from Cfx.re.
3. Clones the Kora resources you chose into the [folder layout](./resources.md) (see [Production and development](#production-and-development)).
4. Creates a database and a database user for this server only (see [Database](./database.md)).
5. Writes `server.cfg`, `permissions.cfg`, `secrets.cfg` and a txAdmin profile, with your Cfx.re account as the txAdmin admin if you give your Cfx.re username (see [txAdmin and your license key](./txadmin-and-license.md)).
6. Optionally registers a background service and opens the game port in the firewall.
7. Starts your server and waits for txAdmin (see [After the install](./after-install.md)).

Everything it creates is recorded in a `.kora` folder inside the server folder, so `kora delete` and `kora uninstall` remove only what Kora made.

Afterwards you can [add resources](./add-resources.md), install [paid assets](./paid-assets.md) you bought on the Cfx.re Portal, and [update](./updating.md) the server, from the panel or the command line.

## Production and development

You choose the mode when you install.

| | Production | Development |
| --- | --- | --- |
| Resources come from | The pinned release of each resource, cloned from the Kora repositories | Forks of the resources on **your own GitHub account or organisation**, cloned from there |
| Updates | You update by hand to newer releases (preview, snapshot, rollback) | By hand, and on a schedule you choose (daily at 04:00 by default) |
| Needs | `git` | `git` and the GitHub CLI (`gh`), signed in with your GitHub account |
| Use it for | Running a server for players | Changing Kora resources and sending changes back |

Production is the right choice unless you intend to modify the resources. In development mode your forks have `origin` pointing at your fork and `upstream` at the Kora repository. Forks you already have are reused. Kora never pushes to the Kora repositories and never deletes your forks. See [Development mode](./dev-mode.md) and [Updating](./updating.md).

If `git` (or `gh` for development mode) is missing, the installer can install it. Kora asks for administrator permission itself when it needs it (a Windows permission prompt, or `sudo`), so you never have to start it "as administrator" by hand.

## Setup codes no longer exist

Earlier versions used single-use setup codes from the website (`kora install --code`). They were removed in v0.4.0. `--code` now stops at once with exit code `2` and a message. Use the panel, or the [command-line options](./commands.md#kora-install) instead.

## Next steps

- [Install on Linux](./install-linux.md) or [Install on Windows](./install-windows.md)
- [Kora Panel](./panel.md)
- [After the install](./after-install.md)
- [Resources and folders](./resources.md) and [Add resources](./add-resources.md)
- [Paid assets](./paid-assets.md)
- [Updating](./updating.md)
- [Development mode](./dev-mode.md)
- [Report an issue and open a pull request](./report-and-pr.md)
- [Command reference](./commands.md)
