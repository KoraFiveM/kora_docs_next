---
title: txAdmin and your license key
sidebar_position: 7
---

# txAdmin and your license key

## Your Cfx.re license key

Every FiveM server needs a license key. Create one for free at [portal.cfx.re](https://portal.cfx.re) (sign in, open **Keys**, **Register a new server**). The installer asks for it, or reads it from `--license-key` / the `CFX_LICENSE_KEY` environment variable. It is never part of a setup code and never shown in dry-run output or logs.

## secrets.cfg

The key and the database connection string are written to `secrets.cfg` in the server folder, which `server.cfg` executes. The file is created with restricted permissions (owner-only on Linux; limited to the server's account and administrators on Windows) and is git-ignored. Never share it or post it in support channels.

The installer also writes `server.cfg`, `permissions.cfg` and the txAdmin profile.

## txAdmin

The installer configures txAdmin so it starts the server automatically and already has an admin:

- If you gave a Cfx.re account (`--cfx-identifier fivem:123456`, or chose it on the website so it arrives in the setup code), that account is the **master admin**: sign in with the **Cfx.re** button.
- Otherwise a local admin `kora-admin` is generated with a random password stored in `secrets/txadmin-admin.txt` (restricted permissions) and shown at the end of the install. Change it after your first login.

txAdmin listens on port `40120` by default (`--txadmin-port`). By default the installer does not open that port in the firewall; use `--txadmin-public` only if you really need the panel reachable from the internet, and prefer a VPN or SSH tunnel. Note that txAdmin itself listens on all interfaces, so on a machine without a firewall the panel is reachable: the installer warns you about this.
