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

Open **PowerShell as Administrator** if you want the service, the firewall rule or an automatic MariaDB installation. A normal terminal works for everything else.

```powershell
kora install --code KORA-7F3K-92QX
```

The guided screens ask for your Cfx.re license key, the server folder (default `%USERPROFILE%\kora\<server-name>`), the database and the options.

With administrator rights, the options do the following:

- `--service` creates a Windows service `kora-<name>` running under its own virtual account (`NT SERVICE\kora-<name>`, no password), granted modify rights on the server folder only.
- `--firewall` adds a Windows Firewall rule for the game port.
- `--db install` (or choosing to install it in the guided screens) sets up a **private MariaDB** that Kora owns: the official zip from archive.mariadb.org is downloaded, its SHA-256 checked against MariaDB's published list, and run as its own service listening on `127.0.0.1` only. A generated admin password is stored in a restricted-permission file. An existing MariaDB/MySQL is never modified.

Unattended example:

```powershell
$env:CFX_LICENSE_KEY = "..."
kora install --code KORA-7F3K-92QX --dir D:\kora\main --db install --service --firewall --yes
```

Use `--dry-run` to print the plan and change nothing.

## 3. Start and manage

```powershell
kora status
kora start <name>
kora stop <name>
```

Open txAdmin at the address printed at the end (port `40120` by default). See [txAdmin and your license key](./txadmin-and-license.md).

## Not done yet on Windows

- Real-machine validation of service, firewall, MariaDB installation and uninstall.
- Code signing of `kora.exe`.
- Only x64 Windows is supported.
