---
title: Command reference
sidebar_position: 4
---

# Command reference

```text
kora [OPTIONS] [COMMAND]
```

This page follows `kora --help` of v0.5.0; run `kora <command> --help` to see what your version supports. Running `kora` with no command opens `kora manager` when you have servers and the install wizard otherwise. `<SERVER>` is a name shown by `kora status` or, for most commands, the server folder.

| Command | What it does |
| --- | --- |
| [`install`](#kora-install) | Install a new server (terminal wizard, or unattended with options). |
| [`panel`](#kora-panel) | Open Kora Panel in your browser. |
| [`manager`](#kora-manager) | Open the terminal screen for all your servers. |
| [`status`](#kora-status) | Show registered servers. |
| [`start`, `stop`, `restart`](#kora-startstoprestart-server) | Start, stop or restart a server. |
| [`update`](#kora-update-server) | Update a server: preview, snapshot, apply and roll back. |
| [`schedule`](#kora-schedule) | Show or change when a development server updates itself. |
| [`webhook`](#kora-webhook) | Discord notifications for update reports. |
| [`add-resources`](#kora-add-resources-server) | Add catalog resources to an installed server. |
| [`add-asset`](#kora-add-asset-server-zip) | Install paid (Cfx.re escrowed) assets from their downloaded zip. |
| [`self-update`](#kora-self-update) | Update the `kora` program itself. |
| [`delete`](#kora-delete-server) | Delete one server and what Kora created for it. |
| [`uninstall`](#kora-uninstall-server) | Remove the system changes Kora made. |
| [`app`](#kora-app) | The Kora app: the `kora` command and Start Menu shortcut. |
| [`github`](#kora-github-owners) | GitHub helpers for development mode. |
| [`helper`](#kora-helper) | The optional privileged helper for the panel (Linux). |
| [`service-host`](#other-commands) | Used by the service itself; you do not run it by hand. |

## Global options

| Option | Meaning |
| --- | --- |
| `--no-elevate` | Do not ask Windows or `sudo` for administrator permission (for developers and CI). By default Kora asks itself when a step needs it: on Windows the interactive commands reopen themselves as administrator after one permission prompt; on Linux `sudo` is requested only when needed. `--version`, `--help`, `status`, dry runs and non-interactive use never ask. Accepted by every command. |
| `-h`, `--help` | Print help. |
| `-V`, `--version` | Print the version. |

## `kora install`

Installs a new server. With no options in a terminal it opens the terminal wizard. Any option makes it run unattended, without asking anything (`--yes` is implied). In a non-interactive shell you must pass options.

| Option | Meaning |
| --- | --- |
| `--name <NAME>` | Server name (display and registry name). |
| `--dir <DIR>` | Server folder. Default: `~/kora/<name>` in your home folder, also with `sudo`; `/home/kora/<name>` when logged in as root. Windows: `%USERPROFILE%\kora\<name>`. |
| `--mode prod\|dev` | `prod` (pinned release clones, default) or `dev` (forks on your GitHub account). |
| `--license-key <KEY>` | Cfx.re license key. Prefer the `CFX_LICENSE_KEY` environment variable so the key is not left in shell history or process lists. |
| `--game-port <N>` | Game port (TCP and UDP). Default `30120`. |
| `--txadmin-port <N>` | txAdmin port. Default `40120`. |
| `--txadmin-public` | Also open the txAdmin port in the firewall. By default txAdmin stays private. |
| `--cfx-user <NAME>` | Your Cfx.re username (the name on forum.cfx.re). Kora looks up your account id and makes you the txAdmin admin. |
| `--cfx-identifier <ID>` | The Cfx.re account that becomes the txAdmin master, for example `fivem:123456`. Default: a generated local admin. |
| `--artifact-url <URL>` | An official `runtime.fivem.net` FXServer build URL. Default: the recommended build. |
| `--game-build <N>` | Pin the FiveM game build (for example `3258`). Default: the build the server ships with. |
| `--hostname <HOSTNAME>` | Server name shown in the server list. Default: the server name. |
| `--resources all\|a,b,c` | `all` (every default resource, never compat, bridge or creator resources) or a comma-separated list of resource ids. Dependencies and the core resources are always included. See [Resources and folders](./resources.md). |
| `--db existing\|install\|skip` | `existing` uses the MariaDB already on the machine, `install` installs it if missing, `skip` creates no database. See [Database](./database.md). |
| `--db-admin-user <USER>` | Database admin account used once to create the new database and user (password: `KORA_DB_ADMIN_PASSWORD`). |
| `--db-admin-host <HOST>` | Database server address for the admin login. Default `127.0.0.1`. |
| `--db-admin-port <N>` | Database server port for the admin login. Default `3306`. |
| `--service` | Install and enable the OS service (needs administrator/root). |
| `--firewall` | Open the game port in the OS firewall (needs administrator/root). |
| `--fix-permissions` | Linux, with `--service`: when the server folder is inside a private folder (such as your home folder) that the service's account cannot enter, let it pass through exactly those folders (`chmod o+x`) instead of stopping. |
| `--github-owner <OWNER>` | Development mode: your GitHub user or organisation to fork into. `--github-owner list` shows the choices. See [Development mode](./dev-mode.md). |
| `--auto-ports` | If a port is in use, silently use the next free one and say what changed. |
| `--start` | Start the server when the install finishes and wait until txAdmin answers (the wizards do this by default). |
| `--no-start` | Do not start the server after installing (start it later with `kora start <name>`). |
| `--no-app` | Do not install the Kora app (the `kora` command and Start Menu shortcut). |
| `--no-desktop-shortcut` | With the Kora app: no desktop shortcut (Windows). |
| `--dry-run` | Show the full plan and change nothing. |
| `-y`, `--yes` | Do not ask anything (implied by any other option). |
| `--code <CODE>` | Removed in v0.4.0: setup codes no longer exist. Stops with exit code `2`. |

Exit codes: `0` success (also when you cancel the wizard), `1` failure, `2` usage problem (for example, running without a terminal and without options, a development install without `--github-owner`, or `--code`), `130` the wizard was interrupted.

## `kora panel`

Opens [Kora Panel](./panel.md): install, manage and monitor servers in your browser. It listens on this computer only unless remote access is set up. If the background panel is already running, `kora panel` shows its link instead of starting a second one.

| Option | Meaning |
| --- | --- |
| `--port <PORT>` | Port to listen on. Default `47120`, or the next free one up to `47140`. |
| `--bind <BIND>` | Address to listen on. Default `127.0.0.1` (this computer only). Anything else needs remote access and is plain HTTP: use it only on a private network such as Tailscale or WireGuard. |
| `--remote` | Allow remote access for this run. |
| `--no-open` | Do not open a browser; print the address and sign-in link instead (automatic over SSH or without a desktop). |
| `--foreground` | Run the panel in this window and stop it when the window closes. |
| `--setup` | Make sure the background panel is set up and running, open it and print the sign-in link. Never asks questions (the install scripts run this). |
| `--install-service` | Keep the panel running in the background (starts at sign-in; no administrator rights needed). |
| `--remove-service` | Stop and remove the background panel. |
| `--print-link` | Print the sign-in link of the background panel. |

`kora panel user add <NAME> --role viewer|operator|admin` adds a person who may sign in remotely and prints their token once. `kora panel user list` lists them, `kora panel user remove <NAME>` removes one and ends their sessions at once.

## `kora manager`

Opens the terminal screen for all your servers: list, details, start/stop, console, logs, update, schedule, webhook, ports (`m`), add resources (`g`), report an issue (`b`), open a pull request (`p`, development servers), add or adopt a server, and delete. See [Add resources](./add-resources.md) and [Report an issue and open a pull request](./report-and-pr.md).

## `kora status`

Lists registered servers: name, mode, game port, txAdmin port, state (`running`, `stopped`, or `missing` if the folder is gone), the state of the ports and the folder.

## `kora start|stop|restart <SERVER>`

Starts, stops or restarts the server. If it has a service (systemd on Linux, a Windows service on Windows) that is used; otherwise Kora starts or stops the background process it launched itself. `start` waits for txAdmin and reports a rejected licence key, a port clash or a crash plainly. Exit code `1` if it fails. See [After the install](./after-install.md).

## `kora update <SERVER>`

Updates a server: preview, snapshot, apply and roll back. Details in [Updating](./updating.md).

| Option | Meaning |
| --- | --- |
| `--preview` | Show what would change, then stop. |
| `--resource <ID>` | Update only this resource (repeatable). |
| `--all` | Update every resource. |
| `-y`, `--yes` | Do not ask for confirmation. |
| `--restart <POLICY>` | `none` (apply the files, restart nothing), `ensure` (apply without restarting; the server loads them on its next restart or an `ensure` in txAdmin), `full` (restart the whole server) or `when-quiet` (restart only when nobody is playing; default). |
| `--list-snapshots` | List saved snapshots. |
| `--rollback <SNAPSHOT>` | Put everything back the way a snapshot saved it. |
| `--force` | With `--rollback`: roll back even resources with uncommitted changes of your own (they are thrown away). |
| `--auto` | Run unattended, fast-forwarding clean forks only. This is what the schedule runs (development servers). |

## `kora schedule`

When a development server updates itself.

- `kora schedule show <SERVER>` shows the schedule in plain language.
- `kora schedule set <SERVER> --daily HH:MM` or `--weekly <DAY> <HH:MM>` (`mon`..`sun`, this computer's time; the default is daily `04:00`). Add `--as-user` (default: runs as you, so your GitHub sign-in works for private forks) or `--as-system` (runs even when nobody is logged in, but cannot fetch private forks). Needs administrator rights; Kora asks for them.
- `kora schedule off <SERVER>` turns automatic updates off.

On Windows, `--as-user` runs only while you are logged in (no password is stored); a missed run happens at your next login. On Linux it runs from the system timer as the folder's owner and catches up after downtime.

## `kora webhook`

Discord notifications for update reports.

- `kora webhook set <SERVER> [URL]` saves a webhook. Prefer `--stdin` or `$KORA_DISCORD_WEBHOOK` so the URL stays out of shell history; `--test` sends a test message after saving.
- `kora webhook test <SERVER>` sends a test message.
- `kora webhook show <SERVER>` says whether a webhook is set (the token is hidden).
- `kora webhook remove <SERVER>` deletes it.

## `kora add-resources <SERVER>`

Adds catalog resources (compatibility, bridge, creator or any other) to an installed server. Dependencies are added automatically.

| Option | Meaning |
| --- | --- |
| `--resource <ID>` | Catalog resource id to add (repeatable). |
| `--dry-run` | Show what would be added, then stop. |
| `-y`, `--yes` | Do not ask for confirmation. |
| `--code <CODE>` | Removed in v0.4.0. Stops with exit code `2`. |

Details in [Add resources](./add-resources.md).

## `kora add-asset <SERVER> <ZIP>...`

Installs paid (Cfx.re escrowed) assets from the `.zip` files you downloaded from the Cfx.re Portal, as they are (do not unpack them). Download them at [portal.cfx.re/assets/granted-assets](https://portal.cfx.re/assets/granted-assets), signed in with the same Cfx.re account that owns the server's licence key.

| Option | Meaning |
| --- | --- |
| `--dry-run` | Show what would be imported, then stop. |
| `-y`, `--yes` | Do not ask for confirmation. |

Details in [Paid assets](./paid-assets.md).

## `kora self-update`

Updates the `kora` program itself to the newest release, verifying its checksum and keeping a copy of the old one.

| Option | Meaning |
| --- | --- |
| `--check` | Only say whether a newer version exists. |
| `--version <vX.Y.Z>` | Install exactly this release (also allows going back to an older one). |
| `-y`, `--yes` | Do not ask for confirmation. |

## `kora delete <SERVER>`

Removes one server and what the installer created for it: the folder (only if Kora created it), the database and its user, the service, update timer, firewall rules, service account and the list entry. GitHub forks are never deleted. It asks you to type the server name unless `--yes`.

| Option | Meaning |
| --- | --- |
| `--keep-files` | Keep the server folder and files. |
| `--keep-db` | Keep the database and its user. |
| `-y`, `--yes` | Do not ask for confirmation. |

## `kora uninstall [SERVER]`

Removes the system changes Kora made (services, update timers, firewall rules, service accounts, server list entry), asking before each item. Server folders and databases are kept unless you say otherwise. With no `SERVER` it covers every registered server.

| Option | Meaning |
| --- | --- |
| `--dry-run` | Show everything that would be removed and change nothing. |
| `-y`, `--yes` | Do not ask: remove the system changes, keep server folders and databases. |
| `--delete-files` | Also delete the server folders (only what Kora created in them). |
| `--delete-databases` | Also drop the databases and database users Kora created. |
| `--app` | Remove only the Kora app (shortcuts, `PATH` entry, the installed copy); servers and databases are never touched. |

## `kora app`

The Kora app is the `kora` command (and on Windows the Start Menu shortcut) that the installer puts on the machine so you can reopen Kora later. Removing it never touches servers or databases.

- `kora app install` installs or updates it. Options: `--no-desktop-shortcut` (Windows), `--force` (replace a newer installed copy), `--dry-run`, `-y`/`--yes`.
- `kora app status` shows whether it is installed.
- `kora app uninstall` removes it (`--dry-run`, `-y`/`--yes`).

## `kora github owners`

Lists the GitHub accounts and organisations your forks can go into (same as `kora install --github-owner list`). Needs `gh` installed and signed in.

## `kora helper`

The optional privileged helper lets the panel do the few things that need administrator rights without asking each time (Linux).

- `sudo kora helper install` installs the helper service for your user account.
- `kora helper status` says whether it is installed and running.
- `kora helper uninstall` removes it (needs administrator rights).
- `kora helper serve` is started by its system service; you do not run it by hand.

## Other commands

- `kora service-host <NAME>` is used by the service itself to run and supervise FXServer. You do not run it by hand.

## Environment variables

| Variable | Meaning |
| --- | --- |
| `CFX_LICENSE_KEY` | Cfx.re license key (same as `--license-key`). |
| `KORA_DB_ADMIN_PASSWORD` | Password of the database admin login (there is deliberately no flag for it). |
| `KORA_DB_ADMIN_USER`, `KORA_DB_HOST`, `KORA_DB_PORT` | Defaults for the database admin login. |
| `KORA_SERVICE_USER` | Run the Linux service as this **existing** account instead of creating `kora-<name>`. Kora never creates or removes it. |
| `KORA_DISCORD_WEBHOOK` | Webhook URL for `kora webhook set`. |
| `KORA_CATALOG` | Use a different resource catalog (file or URL) instead of the public one. Mostly for testing. |
| `KORA_HOME` | Where Kora keeps its list of servers. |
| `KORA_NO_UPDATE_CHECK=1` | Do not show the "Kora vX is available" notice. |
| `KORA_SKIP_SPACE_CHECK=1` | Skip the free-disk-space check. |
| `NO_COLOR`, `KORA_ASCII=1` | Turn colour off, or use ASCII symbols and borders in the terminal screens. |

The install scripts have their own settings (`KORA_NO_LAUNCH`, `KORA_VERSION`, `KORA_INSTALL_DIR`, `KORA_FORCE`); see [Install on Linux](./install-linux.md#1-get-the-program) and [Install on Windows](./install-windows.md#1-get-the-program).
