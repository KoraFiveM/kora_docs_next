---
title: Install on Windows
sidebar_position: 3
---

# Install on Windows

:::caution Pre-release
The Windows installer is tested in CI (build, tests and scripted smoke runs) and **is being validated on real machines**. Some parts, in particular the Windows service, the private MariaDB installation and the folder permissions, have not yet had wide real-world use. Back up anything important and report problems.
:::

## 1. Get the program

Run the PowerShell command shown on [koraframe.work/installer](https://koraframe.work/installer) (a normal, non-administrator PowerShell). It runs `install.ps1`, which downloads `kora.exe`, verifies its SHA-256 checksum and installs it to `%LOCALAPPDATA%\Kora\bin`, adding that folder to your user `PATH`. Open a new terminal afterwards so the new `PATH` is picked up.

`kora.exe` is **not code-signed yet** (signing through SignPath Foundation is pending), so Windows SmartScreen or your antivirus may warn about it. See [Troubleshooting](./troubleshooting.md#windows-smartscreen-and-antivirus).

## 2. Run the installer

Double-click `kora.exe`, or run `kora install` (or just `kora`) in a normal PowerShell. You do **not** need to right-click and choose "Run as administrator".

### The permission prompt

Windows asks for permission **once**. Kora relaunches itself as administrator (the standard Windows "Do you want to allow this app to make changes?" prompt) so that, in the same run, it can:

- register the Windows service (`--service`),
- add the firewall rule for the game port (`--firewall`),
- install a private MariaDB (`--db install`),
- and install `git` or `gh` if they are missing.

If you choose **No**, nothing is changed. The elevated window stays open until you press a key, so you can always read the final message. Commands that only look (`kora --version`, `--help`, `status`, `--dry-run`) and non-interactive use (scripts, CI) do not ask. Pass `--no-elevate` to turn the prompt off entirely (for developers and CI); the things that need administrator rights are then skipped or refused.

```powershell
kora install --code KORA-7F3K-92QX
```

The guided screens ask for your Cfx.re license key, the server folder (default `%USERPROFILE%\kora\<server-name>`), the database and the options.

### Pasting into the wizard

Every text box has **Paste** and **Clear** buttons. You can also paste with `Ctrl+V` or `Shift+Insert`. This is the easiest way to enter your license key.

### Options

- `--service` creates a Windows service `kora-<name>` running under its own virtual account (`NT SERVICE\kora-<name>`, no password), granted modify rights on the server folder only.
- `--firewall` adds a Windows Firewall rule for the game port.
- `--db install` (or choosing to install it in the guided screens) sets up a **private MariaDB** that Kora owns: the official zip from archive.mariadb.org is downloaded, its SHA-256 checked against MariaDB's published list, and run as its own service listening on `127.0.0.1` only. A generated admin password is stored in a restricted-permission file. An existing MariaDB/MySQL is never modified.

Unattended example:

```powershell
$env:CFX_LICENSE_KEY = "..."
kora install --code KORA-7F3K-92QX --dir D:\kora\main --db install --service --firewall --start --yes
```

Use `--dry-run` to print the plan and change nothing.

### If something fails

The failure screen explains what went wrong and what to do next, with buttons:

- **Open log** opens `install.log`.
- **Open folder** opens the server folder.
- **Copy path** copies the folder path.
- **Copy details** copies the last lines of the log so you can paste them into a message to support.

Then see [Troubleshooting](./troubleshooting.md).

## 3. Start and manage

```powershell
kora status
kora start <name>
kora stop <name>
```

The installer starts the server for you when it finishes: see [After the install](./after-install.md). txAdmin is on port `40120` by default; see [txAdmin and your license key](./txadmin-and-license.md).

## Not done yet on Windows

- Real-machine validation of service, firewall, MariaDB installation and uninstall.
- Code signing of `kora.exe`.
- Only x64 Windows is supported.
