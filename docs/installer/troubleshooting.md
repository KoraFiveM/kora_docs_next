---
title: Troubleshooting
sidebar_position: 8
---

# Troubleshooting

## Read the log

A failed install shows an error screen with what went wrong and what to do next. Its buttons are **Open log**, **Open folder**, **Copy path** and **Copy details** (copies the last log lines to paste into a message to support). The error is also printed in the terminal with the log location. The log is `<server folder>/.kora/install.log` (or a `kora-install-<name>.log` file in your temp folder if the server folder was not created yet).

## Resume or start over

An install that stopped keeps what it already did.

- **Resume:** run `kora install` again with the same folder. It continues where it stopped and does not repeat finished steps (for example forks already created).
- **Start over:** `kora delete <folder or name>` removes only what Kora created, then install again.

## Ports

The installer checks the game port (default `30120`) and txAdmin port (`40120`) and suggests the next free port when one is busy; it checks again just before installing. For scripts, `--auto-ports` picks the next free port for you, or choose with `--game-port` and `--txadmin-port`. See [After the install](./after-install.md#ports). If players cannot connect, open the **game port for both TCP and UDP** in your firewall and your router/hosting provider's panel (`--firewall` does this on the machine only).

## Firewall

`--firewall` supports ufw, firewalld and Windows Firewall and needs administrator/root. If no active firewall is detected nothing is changed.

## The server does not start

- **"Your licence key was rejected"**: Kora saw FXServer refuse the key. Check it at [portal.cfx.re](https://portal.cfx.re), fix it in `secrets.cfg`, then run `kora start <name>`.
- If the final screen says the server is stopped, use **Start server** there, or `kora start <name>`; the reason and the last log lines are shown.
- Check `kora status`, then the console in txAdmin.
- On Linux with `--service`, `journalctl -u kora-<name>` shows the service log.

## Not enough disk space

A full install needs about 3.3 GiB free on the target disk. Free some space or choose another `--dir`. `KORA_SKIP_SPACE_CHECK=1` skips the check, which is not recommended.

## "git is missing" or GitHub errors

`git` (and `gh`, signed in via `gh auth login`, for development mode) must be present. Run the installer as administrator/root to let it install them, or install them yourself. Your `gh` token needs the `repo` and `read:org` scopes (or a broader scope that includes them) to create forks.

## Setup code rejected

Codes are single-use, expire, and are replaced when you create a newer one. Create a new one on [koraframe.work/installer](https://koraframe.work/installer), or continue without a code.

## Windows SmartScreen and antivirus

`kora.exe` is not code-signed yet (signing is pending), so Windows SmartScreen may show "Windows protected your PC" and some antivirus tools may flag a new, unsigned program. The install script verifies the SHA-256 checksum of what it downloads. If you trust the release, choose **More info → Run anyway**. The source is public and the binaries are built from it in CI. Because Windows is still a pre-release being validated on real machines, please report anything unexpected.

## Service problems

- Linux: the server folder must be readable by the service account; a folder inside a private home directory is refused.
- Windows: Kora asks for administrator permission itself (one prompt) for `--service`, `--firewall` and installing MariaDB. If you declined the prompt, run the command again and accept it. If you used `--no-elevate`, those steps are skipped.

## The Windows window closes or the prompt did not appear

Kora reopens itself as administrator and keeps that window open until you press a key. If you used `--no-elevate` or a non-interactive shell, no prompt is shown. If Windows blocked the prompt, run `kora install` again from a normal PowerShell.

## Development mode and GitHub

- **Sign-in:** use the one-time code shown in the wizard (`C` copies it, `O` opens GitHub). `Esc` cancels; you can then type the account name yourself.
- **An entry is greyed out:** it cannot be used; the reason is shown next to it. Pick another, create an organisation or type a name.
- **A new organisation does not appear:** GitHub cannot create organisations through its API, so create it on GitHub, then press Refresh.
- Headless: `kora github owners` shows what is available.
