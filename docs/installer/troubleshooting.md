---
title: Troubleshooting
sidebar_position: 8
---

# Troubleshooting

## Read the log

A failed install prints the error and where its log is. The log is `<server folder>/.kora/install.log` (or a `kora-install-<name>.log` file in your temp folder if the server folder was not created yet).

## Resume or start over

An install that stopped keeps what it already did.

- **Resume:** run `kora install` again with the same folder. It continues where it stopped and does not repeat finished steps (for example forks already created).
- **Start over:** `kora delete <folder or name>` removes only what Kora created, then install again.

## Ports

The installer checks the game port (default `30120`) and txAdmin port (`40120`) before starting and stops if one is in use. Pick others with `--game-port` and `--txadmin-port`. If players cannot connect, open the **game port for both TCP and UDP** in your firewall and your router/hosting provider's panel (`--firewall` does this on the machine only).

## Firewall

`--firewall` supports ufw, firewalld and Windows Firewall and needs administrator/root. If no active firewall is detected nothing is changed.

## The server does not start

- Check the license key: FXServer says `Could not authenticate server license key` for a wrong key. Fix it in `secrets.cfg`.
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
- Windows: run PowerShell as Administrator for `--service`, `--firewall` and installing MariaDB.
