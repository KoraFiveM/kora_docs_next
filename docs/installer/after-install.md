---
title: After the install
sidebar_position: 3.5
---

# After the install

## The installer starts your server

The last step of the install is **Start your server**. Kora starts FXServer for you, either through the service (if you chose `--service`) or as a background process, and waits until txAdmin answers. It reports plainly if the server does not come up.

In the panel the server then shows as running in **Your servers**. In the terminal wizard the final screen says **Your server is running** and offers:

| Button | What it does |
| --- | --- |
| **Open txAdmin** | Opens txAdmin in your browser. |
| **Copy connect address** | Copies the address players use. |
| **Copy password** | Copies the generated txAdmin admin password (only when no Cfx.re account was given). |
| **Open folder** | Opens the server folder. |
| **Stop server** | Stops the server. It becomes **Start server** while it is stopped. |

If you gave your Cfx.re username, sign in to txAdmin with the **Cfx.re** button. Otherwise the generated txAdmin password is in `secrets/txadmin-admin.txt` in the server folder; it is not printed in the install notes or the log. See [txAdmin and your license key](./txadmin-and-license.md#txadmin).

On the command line, starting is **off** by default: pass `--start` to start the server and wait for txAdmin, or `--no-start` to be explicit.

## If the server does not start

Kora tells you why in plain words, with the last lines of the server log:

- **Rejected licence key:** "Your licence key was rejected. Check it at portal.cfx.re, then run kora start". Fix the key in `secrets.cfg` (see [txAdmin and your license key](./txadmin-and-license.md)) and run `kora start <name>`.
- **Port clash:** another program holds the game or txAdmin port. See [Ports](#ports).
- **Crash or timeout:** read the log lines shown, and see [Troubleshooting](./troubleshooting.md).

## Start, stop and status

```bash
kora status
kora start <name>
kora stop <name>
kora restart <name>
```

These work with or without a service, and the panel has the same buttons. Without a service, Kora runs FXServer itself in the background and remembers it, so `kora stop` stops it. `kora status` shows whether each server is running and the state of its ports.

## Ports

The wizards and the command line check your game and txAdmin ports. If a port is busy, they say so and **suggest the next free port**. Ports are re-checked just before the install begins.

For an unattended install, pass `--auto-ports` and Kora silently uses the next free port and tells you what changed. Without it, a busy port stops the install with the exact `--game-port` and `--txadmin-port` values to use.

To change the ports later, stop the server and use the panel's **Ports** tab (or `m` in `kora manager`). Firewall rules are not changed: open the new ports and close the old ones yourself.

Remember to open the **game port for both TCP and UDP** in your firewall and your router or hosting panel.

## What next

- [Add resources](./add-resources.md) from the catalog.
- Install [paid assets](./paid-assets.md) you bought on the Cfx.re Portal.
- Keep the server [up to date](./updating.md).
