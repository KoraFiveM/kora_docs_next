---
title: Overview
sidebar_position: 1
---

# Kora installer

`kora` is a single program that installs a complete Kora server for you on **Linux** or **Windows**: it downloads FXServer, fetches the Kora resources, creates a database, configures txAdmin and writes your server files. It is an alternative to the [txAdmin recipe](../installation.md) (see [txAdmin recipe or installer](./txadmin-recipe.md)), with the same end result and a guided, resumable process.

:::caution Pre-release
The installer is a pre-release. The Linux path has been run end to end on real machines. The Windows path is built and tested in CI, and is **being validated on real machines**: expect rough edges and please report them. Windows builds are not code-signed yet, so Windows SmartScreen may warn about them (see [Troubleshooting](./troubleshooting.md)).
:::

## What it does

1. Checks free disk space and that your chosen ports are free.
2. Downloads the official FXServer build from Cfx.re.
3. Clones the Kora resources you chose into the [folder layout](./resources.md) (see [Production and development](#production-and-development)).
4. Creates a database and a database user for this server only (see [Database](./database.md)).
5. Writes `server.cfg`, `permissions.cfg`, `secrets.cfg` and a txAdmin profile with an admin account (see [txAdmin and your license key](./txadmin-and-license.md)).
6. Optionally registers a background service and opens the game port in the firewall.
7. Starts your server and waits for txAdmin (see [After the install](./after-install.md)).

Everything it creates is recorded in a `.kora` folder inside the server folder, so `kora delete` and `kora uninstall` remove only what Kora made.

## Setup codes

On [koraframe.work/installer](https://koraframe.work/installer), after linking your Discord, GitHub and Cfx.re accounts, you can choose the mode, server name, ports, resources and FXServer build. The site gives you a single-use **setup code** that looks like `KORA-7F3K-92QX`. Give it to the installer:

```bash
kora install --code KORA-7F3K-92QX
```

The code only carries your choices. It never contains secrets: your Cfx.re license key, the install folder and the database login are always asked locally. A code is single-use and expires, and a newer code replaces an older one. If a code does not work you can continue without it and answer the questions yourself. Flags you pass on the command line override values from the code.

## Production and development

You choose the mode when you install.

| | Production | Development |
| --- | --- | --- |
| Resources come from | The pinned release of each resource, cloned from the Kora repositories | Forks of the resources on **your own GitHub account or organisation**, cloned from there |
| Updates | You move to newer releases yourself | A daily automatic update can fast-forward your clones (see [Updating](./updating.md)) |
| Needs | `git` | `git` and the GitHub CLI (`gh`), signed in with your GitHub account |
| Use it for | Running a server for players | Changing Kora resources and sending changes back |

Production is the right choice unless you intend to modify the resources. In development mode your forks have `origin` pointing at your fork and `upstream` at the Kora repository. Kora never pushes to the Kora repositories and never deletes your forks.

In development mode the wizard signs you in to GitHub with a one-time code and lets you choose whether your forks go into your own account or an organisation (including a guided "create a new organisation" step). See [Development mode](./dev-mode.md).

If `git` (or `gh` for development mode) is missing, the installer can install it; Kora asks for administrator permission itself when it needs it (a Windows permission prompt, or `sudo`), so you never have to start it "as administrator" by hand.

## Next steps

- [Install on Linux](./install-linux.md) or [Install on Windows](./install-windows.md)
- [txAdmin recipe or installer](./txadmin-recipe.md), including the one-line install commands
- [Resources and folders](./resources.md)
- [Add resources](./add-resources.md)
- [Report an issue and open a pull request](./report-and-pr.md)
- [Development mode](./dev-mode.md)
- [After the install](./after-install.md)
- [Command reference](./commands.md)
