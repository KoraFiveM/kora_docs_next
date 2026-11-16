---
title: Troubleshooting
sidebar_position: 8
---

# Troubleshooting

## Read the log

A failed install shows what went wrong and what to do next. In the terminal wizard the error screen has **Open log**, **Open folder**, **Copy path** and **Copy details** (copies the last log lines to paste into a message to support). The log is `<server folder>/.kora/install.log` (or a `kora-install-<name>.log` file in your temp folder if the server folder was not created yet).

## Resume or start over

An install that stopped keeps what it already did, and your answers are saved (never the licence key or database password).

- **Resume:** run the install again with the same folder (the panel offers "Continue where you left off"). It continues where it stopped and does not repeat finished steps (for example forks already created).
- **Start over:** `kora delete <folder or name>` removes only what Kora created, then install again.

## Kora Panel

- **The browser did not open:** copy the printed link into your browser. `kora panel --print-link` prints it again.
- **On a server with no screen:** run the printed `ssh -L` command on your own computer first, then open the link there. See [Kora Panel](./panel.md#on-a-server-with-no-screen-ssh).
- **"Session expired, or not signed in":** run `kora panel` again and open the new link.
- **The panel did not start after the install script** (for example under `sudo` without a user session): run `kora panel` yourself.
- **An action needs administrator rights:** the panel shows the command to run in a terminal; see [Kora Panel](./panel.md#administrator-rights).

## "Setup codes were removed"

`kora install --code` and `kora add-resources --code` stop with exit code `2`: setup codes were removed in v0.4.0. Use the panel, the install options (see the [command reference](./commands.md#kora-install)) or `kora add-resources <server> --resource <ID>`.

## Ports

The installer checks the game port (default `30120`) and txAdmin port (`40120`) and suggests the next free port when one is busy; it checks again just before installing. For scripts, `--auto-ports` picks the next free port for you, or choose with `--game-port` and `--txadmin-port`. See [After the install](./after-install.md#ports). If players cannot connect, open the **game port for both TCP and UDP** in your firewall and your router/hosting provider's panel (`--firewall` does this on the machine only).

## Firewall

`--firewall` supports ufw, firewalld and Windows Firewall and needs administrator/root. If no active firewall is detected nothing is changed.

## The server does not start

- **"Your licence key was rejected"**: Kora saw FXServer refuse the key. Check it at [portal.cfx.re](https://portal.cfx.re), fix it in `secrets.cfg`, then run `kora start <name>`.
- If the server shows as stopped, use **Start** in the panel or `kora start <name>`; the reason and the last log lines are shown.
- Check `kora status`, then the console in the panel or in txAdmin.
- On Linux with `--service`, `journalctl -u kora-<name>` shows the service log.

## A paid asset does not load

"You lack the required entitlement", "Failed to verify protected resource" or "Resource could not be downloaded" in the console mean the licence key and the asset's owner do not match, the asset was renamed or lost its `.fxap` file, or the server could not fetch it. See [Paid assets](./paid-assets.md#licence-errors).

## Updates

- **"Another update is running for this server":** only one update runs per server at a time. Wait until it has finished and try again.
- **A resource is skipped as diverged or with changes:** Kora never overwrites your work. Commit or stash, or rebase on `upstream/<branch>`, then update again.
- **A rollback refuses because of changed files:** choose **Roll back anyway** or add `--force` to throw those changes away.

See [Updating](./updating.md).

## Not enough disk space

An install needs about 3 GiB free plus about 24 MiB per resource on the target disk. Free some space or choose another `--dir`. `KORA_SKIP_SPACE_CHECK=1` skips the check, which is not recommended.

## "git is missing" or GitHub errors

`git` (and `gh`, signed in, for development mode) must be present. Kora can install them; it asks for administrator rights itself. Your `gh` token needs the `repo` and `read:org` scopes (or a broader scope that includes them) to create forks.

## Windows SmartScreen and antivirus

`kora.exe` is not code-signed, so Windows SmartScreen may show "Windows protected your PC" and some antivirus tools may flag a new, unsigned program. The install script verifies the SHA-256 checksum of what it downloads. If you trust the release, choose **More info → Run anyway**. The source is public and the binaries are built from it in CI. To check a download by hand, compare it with the `.sha256` file next to it on the [release page](https://github.com/KoraFiveM/kora-installer/releases):

```powershell
(Get-FileHash kora-windows-x86_64.exe -Algorithm SHA256).Hash.ToLower()
```

## Service problems

- **Linux:** the service runs as its own account, which cannot enter a private home folder. The wizard offers to let it pass through (`chmod o+x` on exactly those folders) or to use `/home/kora/<name>`; on the command line use `--fix-permissions` or `--dir`. See [Install on Linux](./install-linux.md#the-server-folder).
- **Windows:** Kora asks for administrator permission itself (one prompt) for `--service`, `--firewall` and installing MariaDB. If you declined the prompt, run the command again and accept it. If you used `--no-elevate`, those steps are skipped.

## The Windows window closes or the prompt did not appear

Kora reopens itself as administrator and keeps that window open until you press a key. If you used `--no-elevate` or a non-interactive shell, no prompt is shown. If Windows blocked the prompt, run `kora install` again from a normal PowerShell.

## Development mode and GitHub

- **Sign-in:** use the one-time code shown in the wizard (`C` copies it, `O` opens GitHub in the terminal). `Esc` cancels; you can then type the account name yourself.
- **An entry is greyed out:** it cannot be used; the reason is shown next to it. Pick another, create an organisation or type a name.
- **A new organisation does not appear:** GitHub cannot create organisations through its API, so create it on GitHub, then refresh.
- **Forks you already have** are reused, also when named `name-1` or renamed. A repository with the same name that is not a fork of the Kora repository is refused. See [Development mode](./dev-mode.md#forks-you-already-have).
- Unattended: `kora github owners` shows what is available.

## Report a problem

Use **Report an issue** (see [Report an issue and open a pull request](./report-and-pr.md)), or open an issue at [KoraFiveM/kora-installer](https://github.com/KoraFiveM/kora-installer/issues).
