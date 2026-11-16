---
title: Install on Windows
sidebar_position: 3
---

# Install on Windows

Supported: Windows 10/11 and Windows Server 2019+, x64.

:::note Windows status
The Windows build is covered by CI smoke tests (install script, production install, service, firewall and app install), and real-machine runs have started. Back up anything important and please report problems. `kora.exe` is **not code-signed**, so Windows SmartScreen or your antivirus may warn about it; see [Troubleshooting](./troubleshooting.md#windows-smartscreen-and-antivirus).
:::

## 1. Get the program

In a normal (non-administrator) PowerShell:

```powershell
irm https://github.com/KoraFiveM/kora-installer/releases/download/v0.5.0/install.ps1 | iex
```

The script downloads `kora.exe`, verifies its SHA-256 checksum and installs it to `%LOCALAPPDATA%\Kora\bin`, adding that folder to your user `PATH`. An existing `kora.exe` is only replaced when it really is an earlier Kora; the old one is kept as `kora.exe.previous`. Open a new terminal afterwards so the new `PATH` is picked up.

Then it starts [Kora Panel](./panel.md) in the background (it also starts at every sign-in), opens it in your browser and prints the sign-in link.

Settings (parameters or environment variables, all optional):

| Setting | Meaning |
| --- | --- |
| `-NoLaunch` or `$env:KORA_NO_LAUNCH=1` | Only install the program: do not start the panel or open a browser. |
| `-Version` or `KORA_VERSION` | Install this release, for example `v0.5.0`. Default: the newest published release. |
| `-InstallDir` or `KORA_INSTALL_DIR` | Install the program into this folder. |
| `-Force` | Replace an existing `kora.exe` even if it is not a Kora program. |

Already have Kora? `kora self-update` updates it.

## 2. Install a server

In the panel, choose **Install a server**. Or run `kora install` (or double-click `kora.exe`) for the terminal wizard. Both ask for your Cfx.re license key, your Cfx.re username, the server name and folder (suggested: `C:\Kora\<server-name>`), the database and the options, show a review, then install.

You do **not** need to right-click and choose "Run as administrator".

### The permission prompt

The terminal commands ask Windows for permission **once**: Kora relaunches itself as administrator (the standard "Do you want to allow this app to make changes?" prompt) so that, in the same run, it can:

- register the Windows service (`--service`),
- add the firewall rule for the game port (`--firewall`),
- install a private MariaDB (`--db install`),
- and install `git` or `gh` if they are missing.

If you choose **No**, nothing is changed. The elevated window stays open until you press a key, so you can always read the final message. Commands that only look (`kora --version`, `--help`, `status`, `--dry-run`) and non-interactive use (scripts, CI) do not ask. Pass `--no-elevate` to turn the prompt off entirely; the things that need administrator rights are then skipped or refused.

The panel runs as you. For an action that needs administrator rights, it shows the exact command to run in a terminal (see [Kora Panel](./panel.md#administrator-rights)).

### Pasting into the terminal wizard

Every text box has **Paste** and **Clear** buttons. You can also paste with `Ctrl+V` or `Shift+Insert`. This is the easiest way to enter your license key.

### Options

- `--service` creates a Windows service `kora-<name>` running under its own virtual account (`NT SERVICE\kora-<name>`, no password), granted modify rights on the server folder only.
- `--firewall` adds a Windows Firewall rule for the game port.
- `--db install` (or choosing to install it in the wizard) sets up a **private MariaDB** that Kora owns: MariaDB 11.4.13 from the official mirrors, checked against a pinned SHA-256, run as its own service listening on `127.0.0.1` only. A generated admin password is stored in a restricted-permission file. An existing MariaDB/MySQL is never modified.

Unattended example:

```powershell
$env:CFX_LICENSE_KEY = "..."
kora install --name main --dir D:\kora\main --cfx-user your-cfx-name --db install --service --firewall --start --yes
```

Without `--dir`, a command-line install uses `%USERPROFILE%\kora\<name>`. Use `--dry-run` to print the plan and change nothing.

### If something fails

The failure screen explains what went wrong and what to do next, with **Open log**, **Open folder**, **Copy path** and **Copy details** (the last lines of the log, to paste into a message to support). Running the install again with the same folder continues where it stopped. Then see [Troubleshooting](./troubleshooting.md).

## 3. Start and manage

```powershell
kora status
kora start <name>
kora stop <name>
```

Or use the panel. The installer starts the server for you when it finishes: see [After the install](./after-install.md). txAdmin is on port `40120` by default; see [txAdmin and your license key](./txadmin-and-license.md).
