---
title: Install on Linux
sidebar_position: 2
---

# Install on Linux

Supported: Debian 12+ and Ubuntu 22.04+ on x86-64. The automatic MariaDB installation uses `apt`; on other distributions install MariaDB yourself first and point the installer at it.

## 1. Get the program

```sh
curl -fsSL https://github.com/KoraFiveM/kora-installer/releases/download/v0.5.0/install.sh | sh
```

The script downloads `kora`, verifies its SHA-256 checksum and puts it in `~/.local/bin` (or `/usr/local/bin` when run as root). It needs no root, never replaces a file that is not a Kora program, and keeps the previous version as `kora.previous`. If `~/.local/bin` is not on your `PATH`, the script tells you what to add.

Then it starts [Kora Panel](./panel.md) as a background service (a systemd user service that also starts after a restart), opens it in your browser and prints the sign-in link. On a server with no screen it prints an `ssh -L` command to run on your own computer instead.

Settings for the script (all optional):

| Variable | Meaning |
| --- | --- |
| `KORA_NO_LAUNCH=1` | Only install the program: do not start the panel or open a browser. Use `curl ... \| KORA_NO_LAUNCH=1 sh`. |
| `KORA_VERSION=vX.Y.Z` | Install this release. Default: the newest published release. |
| `KORA_INSTALL_DIR` | Install the program into this folder. |
| `KORA_FORCE=1` | Replace an existing file at the target even if it is not a Kora program. |

Already have Kora? `kora self-update` updates it.

## 2. Have your license key ready

Get a Cfx.re license key from [portal.cfx.re](https://portal.cfx.re) (see [txAdmin and your license key](./txadmin-and-license.md)). Also have your Cfx.re username ready (the name on forum.cfx.re) if you want to sign in to txAdmin with your Cfx.re account.

## 3. Install a server

In the panel, choose **Install a server**. In a terminal, `kora install` opens the same steps as a terminal wizard. Both ask for the server name and folder, ports, resources, the database, the options below, your license key and your Cfx.re username, show a review, then install with live progress.

Run Kora as your normal user. It asks for `sudo` **only when your choices need it** and says why:

- `--service` registers a systemd service `kora-<name>` that runs the server under a dedicated unprivileged account `kora-<name>` (created for you, no login shell) and starts it on boot.
- `--firewall` opens the game port in the active firewall (ufw or firewalld). If no firewall is active, nothing is changed.
- Installing MariaDB, `git` or `gh` when missing.

If you decline (or `sudo` is not available) the installer still installs the server and lists what it skipped. Pass `--no-elevate` to never ask.

### The server folder

The suggested folder is `~/kora/<name>` in **your** home folder, also when Kora asks for `sudo`. Your server list and saved answers stay in your own account too.

Logged in as root (common on rented servers), Kora suggests `/home/kora/<name>` and creates a normal `kora` account that owns it.

The background service runs as its own account, which cannot enter a private home folder. If your folder is inside one, the wizard offers two ways out: let the service pass through exactly those folders (`chmod o+x`), or use `/home/kora/<name>`. On the command line pass `--fix-permissions` for the first, or choose another folder with `--dir`.

### Unattended install

```bash
export CFX_LICENSE_KEY=...            # keep the key out of your shell history
export KORA_DB_ADMIN_PASSWORD=...     # only if your database admin needs a password
kora install --name main --cfx-user your-cfx-name \
  --db-admin-user root --service --firewall --start --yes
```

Any option makes the install run without questions. Development installs also need `--mode dev --github-owner <owner>`. See the [command reference](./commands.md#kora-install).

Preview first with `--dry-run`: it prints the plan and changes nothing.

## 4. First start

The installer starts your server when it finishes and shows the connect address and the txAdmin address; see [After the install](./after-install.md). Control it later from the panel or with `kora start|stop|restart <name>` and `kora status`. Sign in to txAdmin on port `40120` (default); see [txAdmin and your license key](./txadmin-and-license.md).

## Disk space

An install needs about 3 GiB free for FXServer and working room, plus about 24 MiB per resource (so 4 to 5 GiB for a large selection). The installer works out what your choices need, checks before creating anything and stops with a clear message if there is not enough.
