---
title: Install on Linux
sidebar_position: 2
---

# Install on Linux

Supported: x86_64 Linux. The automatic MariaDB installation supports Debian and Ubuntu (via `apt`); on other distributions install MariaDB yourself first and point the installer at it.

## 1. Get the program

Use the download command shown on [koraframe.work/installer](https://koraframe.work/installer). It runs `install.sh`, which downloads `kora`, verifies its SHA-256 checksum and puts it in `/usr/local/bin` (as root) or `~/.local/bin`. It never replaces a file that is not a Kora program, and keeps the previous version as `kora.previous`. If `~/.local/bin` is not on your `PATH`, the script tells you what to add.

## 2. Have your license key ready

Get a Cfx.re license key from [portal.cfx.re](https://portal.cfx.re) (see [txAdmin and your license key](./txadmin-and-license.md)).

## 3. Run the installer

For a normal interactive install, run it in a terminal:

```bash
kora install --code KORA-7F3K-92QX   # or just: kora install
```

A step-by-step screen asks for the license key, the server folder (default `~/kora/<server-name>`), the database and the options below, shows a review screen, then installs with live progress.

Run it with `sudo` if you want it to do system-level things:

- `--service` registers a systemd service `kora-<name>` that runs the server under a dedicated unprivileged account `kora-<name>` (created for you, no login shell) and starts it on boot.
- `--firewall` opens the game port in the active firewall (ufw or firewalld). If no firewall is active, nothing is changed.
- Installing MariaDB, `git` or `gh` when missing.

Without administrator rights the installer still installs the server; it lists what it skipped. The server folder must be reachable by the service account, so for `--service` do not put it inside a private home directory (the installer refuses up front if it cannot be).

### Unattended install

```bash
export CFX_LICENSE_KEY=...            # keep the key out of your shell history
export KORA_DB_ADMIN_PASSWORD=...     # only if your database admin needs a password
sudo -E kora install --code KORA-7F3K-92QX \
  --dir /srv/kora/main --db-admin-user root --service --firewall --yes
```

With a setup code, the install runs without questions once the license key, folder, database login (or `--db skip`) and, for development mode, `--github-owner` are all given. See the [command reference](./commands.md).

Preview first with `--dry-run`: it prints the plan and changes nothing.

## 4. First start

When the install finishes it prints the connect address and the txAdmin address. With `--service`, start it with `kora start <name>`; otherwise run FXServer from the server folder. Open txAdmin on the printed address (port `40120` by default) and sign in. See [txAdmin and your license key](./txadmin-and-license.md).

Check state any time with `kora status`.

## Disk space

A full install needs about 3.3 GiB free (FXServer, the resources and working room). The installer checks before creating anything and stops with a clear message if there is not enough.
