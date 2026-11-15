---
title: txAdmin recipe or installer
sidebar_position: 2.5
---

# txAdmin recipe or installer

[koraframe.work/installer](https://koraframe.work/installer) has three tabs: **Use installer**, **txAdmin recipe** and **Add resources** (see [Add resources](./add-resources.md)). Choose between the first two by how you run your server.

| | Use installer | txAdmin recipe |
| --- | --- | --- |
| Needs | The `kora` program on the machine; you also link Discord, GitHub and Cfx.re on the site | A txAdmin you already run; no account needed |
| Production or development | You choose | No choice: always pinned releases |
| Result | A guided, resumable install that also sets up database, service and firewall | txAdmin downloads the resources and writes your `server.cfg` |

If you are not sure, the installer is the guided way. The recipe is for people who already run txAdmin. For the plain recipe with every default resource, see [Installation](../installation.md).

## Getting the recipe

Pick your resources (compat, bridges and creator resources are never selected by default, see [Resources and folders](./resources.md)). Then use any of:

- **Remote URL.** Copy the link and paste it into txAdmin's **Deploy server**, **Remote URL**. The link carries your selection, so it works without an account.
- **Download.** Download `recipe.yaml` and use it in txAdmin.
- **Paste import.** Paste a Kora `recipe.yaml` into the **Import a recipe.yaml** box to load its selection back into the picker. Only downloads of resources in the catalog are accepted; anything else rejects the paste, and the YAML is only read, never run.

The recipe writes the same [folder layout](./resources.md#folder-layout-of-a-new-server) as the installer, with one `ensure [folder]` line per folder in `server.cfg`.

## Pauses between downloads

The recipe waits 5 seconds (`waste_time`) after every download. This keeps txAdmin from hitting GitHub's rate limits, so a deployment with many resources takes a few minutes.

## One-line install commands

After you create a setup code on the **Use installer** tab, the page shows a one-line command for Linux and one for Windows (PowerShell). Each one:

- downloads `kora` only if it is not installed yet;
- asks for your Cfx.re license key, hidden, and passes it in the `CFX_LICENSE_KEY` environment variable, never on the command line and never to the website;
- runs `kora install --code <code>` into a **new** folder (`~/kora/server-<timestamp>`, `%USERPROFILE%\kora\server-<timestamp>` on Windows) with `--db install -y`, so an existing server is never touched.

The code and the release address are checked before a command is shown. On the **Add resources** tab the command is `kora add-resources YOUR-SERVER-NAME --code <code>`, with no license key.

To install `kora` only, the scripts are in each [release](https://github.com/KoraFiveM/kora-installer/releases); use an explicit version number:

```sh
curl -fsSL https://github.com/KoraFiveM/kora-installer/releases/download/v0.3.0/install.sh | sh
```

```powershell
irm https://github.com/KoraFiveM/kora-installer/releases/download/v0.3.0/install.ps1 | iex
```

Then run `kora install`. The scripts check the download's SHA-256 and keep the previous version as `kora.previous`.
