---
title: Kora Panel
sidebar_position: 3.2
---

# Kora Panel

Kora Panel is a page in your browser where you install, manage and update your servers. It is a program on your own computer, not a website: by default only the computer it runs on can reach it, and nothing you do in it is sent to Kora or anyone else.

## Starting it

The [Linux](./install-linux.md) and [Windows](./install-windows.md) install scripts start the panel for you. It runs in the background (a systemd user service on Linux, a sign-in entry on Windows), so it keeps watching your servers and comes back after a restart. When there is a screen it opens in your browser; the sign-in link is always printed too.

Later:

```bash
kora panel                # open it again (shows the link of the one already running)
kora panel --print-link   # print the sign-in link of the background panel
kora panel --remove-service   # stop and remove the background panel
```

If the panel could not start (for example under `sudo` without a user session), the install still finishes and tells you to run `kora panel` yourself. To install only the program, set `KORA_NO_LAUNCH=1` (Windows: `-NoLaunch`).

The panel listens on `127.0.0.1`, port `47120`, or the next free port up to `47140` when something else uses it (`--port` chooses one).

### On a server with no screen (SSH)

Nothing opens. Kora prints the sign-in link and an `ssh -L` command filled in with the server's address, for example:

```text
Sign in with: http://127.0.0.1:47120/#token=...
On a server with no screen, open a tunnel from your own computer first:  ssh -L 47120:127.0.0.1:47120 you@203.0.113.7
```

On your own computer, run the `ssh -L` line in a terminal and leave it open, then paste the full link, including `#token=...`, into your browser. Nothing is exposed to the network.

If you run `kora panel` over SSH and the background panel is not set up, Kora asks "Keep it running in the background instead? [Y/n]". Press Enter. `kora panel --foreground` runs it in the current window only, and it stops when the window closes.

## Signing in

The link contains a one-time secret. The panel swaps it for a session cookie and removes it from the address bar. **Do not share the link**: it is the password. If you see "Session expired, or not signed in", run `kora panel` again and open the link it prints.

## What you can do

- **Your servers:** every server Kora knows, with its state and update badge, and start, stop and restart. Add a server folder that already exists on disk.
- **Install a server:** the same steps as `kora install`: mode, name and folder, ports, build, resources, database, options, licence key, your Cfx.re username, GitHub (development mode only), then a review and the install with live progress. If an install fails, your answers are kept (never the licence key or database password).
- **A server's tabs:** Overview, Console, Logs, Updates, Resources, [Paid assets](./paid-assets.md), Schedule (development servers), Notifications (Discord webhook), Ports, GitHub (development servers), Monitoring and Danger zone (delete).
- **Settings:** update Kora itself, the Kora app, your GitHub account and uninstalling Kora.

## Administrator rights

The panel runs as you, not as an administrator. For the few actions that need more (services, firewall rules, update timers, installing MariaDB, the Kora app) it shows the exact command to run in a terminal. On Linux you can instead install the helper once with `sudo kora helper install`, so the panel can run those actions without a prompt each time.

## Remote access

Keep the panel local and use the SSH tunnel above when you can. Remote access over a private network (Tailscale or WireGuard) is possible with `kora panel --bind <ip> --remote` and named users (`kora panel user add|list|remove`, roles viewer, operator and admin). The page is plain HTTP, so never expose it to the internet. See the [panel guide in the installer repository](https://github.com/KoraFiveM/kora-installer/blob/main/docs/panel.md) for details.
