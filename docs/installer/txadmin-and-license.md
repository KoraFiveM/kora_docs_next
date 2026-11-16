---
title: txAdmin and your license key
sidebar_position: 7
---

# txAdmin and your license key

## Your Cfx.re license key

Every FiveM server needs a license key. Create one for free at [portal.cfx.re](https://portal.cfx.re) (sign in, open **Keys**, **Register a new server**). The installer asks for it, or reads it from `--license-key` / the `CFX_LICENSE_KEY` environment variable. It is never shown in dry-run output or logs, and the panel never sends it back to the browser.

Create the key with the Cfx.re account you buy assets with: [paid assets](./paid-assets.md) only run on a server whose key belongs to the account that bought them.

## secrets.cfg

The key and the database connection string are written to `secrets.cfg` in the server folder, which `server.cfg` executes. The file is created with restricted permissions (owner-only on Linux; limited to the server's account and administrators on Windows) and is git-ignored. Never share it or post it in support channels.

The installer also writes `server.cfg`, `permissions.cfg` and the txAdmin profile.

## txAdmin

The installer configures txAdmin so it starts the server automatically and already has an admin.

### Your Cfx.re account as the admin

After the license key, the install wizard (in the panel or the terminal) asks for your **Cfx.re username**, the name you see on forum.cfx.re. Kora looks the account up on forum.cfx.re (only the username is sent) and makes it the txAdmin admin, with admin rights in `permissions.cfg`. Sign in to txAdmin with the **Cfx.re** button.

On the command line use `--cfx-user <NAME>`, or `--cfx-identifier fivem:123456` if you already know the account id.

### The local admin

If you leave the username empty, a local admin `kora-admin` is created with a random password stored in `secrets/txadmin-admin.txt` (restricted permissions) and shown at the end of the install. Change it after your first login.

Servers installed before v0.4.1 have only this local admin. To add your Cfx.re account, sign in with the local admin and add yourself under **Admin Manager** in txAdmin.

### The txAdmin port

txAdmin listens on port `40120` by default (`--txadmin-port`). By default the installer does not open that port in the firewall; use `--txadmin-public` only if you really need it reachable from the internet, and prefer a VPN or SSH tunnel. Note that txAdmin itself listens on all interfaces, so on a machine without a firewall it is reachable: the installer warns you about this.
