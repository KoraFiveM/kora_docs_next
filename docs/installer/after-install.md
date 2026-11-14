---
title: After the install
sidebar_position: 3.5
---

# After the install

:::caution Pre-release
This is the behaviour of installer v0.2.1, which is still a pre-release.
:::

## The installer starts your server

The last step of the install is **Start your server**. Kora starts FXServer for you, either through the service (if you chose `--service`) or as a background process, and waits until txAdmin answers. It reports plainly if the server does not come up.

When it works, the final screen says **Your server is running** and offers:

| Button | What it does |
| --- | --- |
| **Open txAdmin** | Opens the panel in your browser. |
| **Copy connect address** | Copies the address players use. |
| **Copy password** | Copies the generated txAdmin admin password. |
| **Open folder** | Opens the server folder. |
| **Stop server** | Stops the server. It becomes **Start server** while it is stopped. |

The generated txAdmin password is no longer printed in the install notes or the log. It is in `secrets/txadmin-admin.txt` in the server folder, and on this final screen.

In a script, starting is **off** by default: pass `--start` to start the server and wait for txAdmin, or `--no-start` to be explicit.

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
```

These work with or without a service. Without one, Kora runs FXServer itself in the background and remembers it, so `kora stop` stops it. `kora status` shows whether each server is running and the state of its ports.

## Ports

The wizard and the command line check your game and txAdmin ports. If a port is busy, they say so and **suggest the next free port**; the wizard shows the status of each port as you type. Ports are re-checked just before the install begins.

For a headless install, pass `--auto-ports` and Kora silently uses the next free port and tells you what changed. Without it, a busy port stops the install with the exact `--game-port` and `--txadmin-port` values to use.

Remember to open the **game port for both TCP and UDP** in your firewall and your router or hosting panel.
