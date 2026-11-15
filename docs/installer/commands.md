---
title: Command reference
sidebar_position: 4
---

# Command reference

```text
kora [COMMAND]
```

Running `kora` with no command is the same as `kora install`. Server names are the names shown by `kora status`.

## `kora install`

Installs a new server. With no options in a terminal it opens the guided screens. Passing any option other than `--code` (or `--code` plus a license key, folder and database login) makes it run **headless**, without asking anything. In a non-interactive shell you must pass options.

| Option | Meaning |
| --- | --- |
| `--code <CODE>` | Single-use setup code from [koraframe.work/installer](https://koraframe.work/installer). Supplies defaults for mode, name, ports, resources, FXServer build, hostname and Cfx.re owner. Explicit flags win. |
| `--name <NAME>` | Server name. Default `kora`. |
| `--dir <PATH>` | Server folder. Default `~/kora/<name>` (`%USERPROFILE%\kora\<name>` on Windows). |
| `--mode prod\|dev` | `prod` (pinned release clones, default) or `dev` (forks on your GitHub account). |
| `--license-key <KEY>` | Cfx.re license key. Prefer the `CFX_LICENSE_KEY` environment variable so the key is not left in shell history. |
| `--game-port <N>` | Game port (TCP and UDP). Default `30120`. |
| `--txadmin-port <N>` | txAdmin port. Default `40120`. |
| `--txadmin-public` | Also open the txAdmin port in the firewall. By default the panel is not exposed by the firewall rule. |
| `--cfx-identifier <ID>` | The Cfx.re account that becomes the txAdmin master, for example `fivem:123456`. Default: a generated local admin. |
| `--artifact-url <URL>` | A `runtime.fivem.net` FXServer build URL. Default: the recommended build. |
| `--resources all\|a,b,c` | `all` (default: every default resource, never compat, bridge or creator resources) or a comma-separated list of resource ids. Dependencies and the core resources are always added. See [Resources and folders](./resources.md). |
| `--db existing\|install\|skip` | `existing` uses the MariaDB already on the machine (default), `install` installs it if none is found, `skip` creates no database. |
| `--db-admin-user <USER>` | Database admin account used once to create the server's database and user. |
| `--db-admin-host <HOST>` | Address of the database server for that login. Default `127.0.0.1`. |
| `--db-admin-port <N>` | Port for that login. Default `3306`. |
| `--service` | Register and enable a background service (needs administrator/root). |
| `--firewall` | Open the game port in the OS firewall (needs administrator/root). |
| `--github-owner <OWNER>` | Dev mode: your GitHub user or organisation to fork into. Required for headless dev installs. `--github-owner list` prints the choices and exits. See [Development mode](./dev-mode.md). |
| `--auto-ports` | If a port is in use, silently use the next free one and say what changed. |
| `--start` | Start the server when the install finishes and wait for txAdmin. Off by default in headless installs (the guided installer always does it). |
| `--no-start` | Do not start the server after installing (start it later with `kora start <name>`). Cannot be combined with `--start`. |
| `--dry-run` | Print your choices and the full plan, change nothing. |
| `-y`, `--yes` | Do not ask anything. |

Exit codes: `0` success (also when you cancel the wizard), `1` failure, `2` usage problem (for example, running without a terminal and without options, or a development install without `--github-owner`), `130` the wizard was interrupted.

## Global option

| Option | Meaning |
| --- | --- |
| `--no-elevate` | Do not ask Windows or `sudo` for administrator permission (for developers and CI). By default, on Windows the interactive commands (`kora`, `install`, `delete`, `uninstall`, `start`/`stop`/`restart`, `update`) reopen themselves as administrator after one permission prompt; on Linux `sudo` is requested only when needed. `--version`, `--help`, `status`, dry runs and non-interactive use never ask. |

## `kora github owners`

Lists the GitHub accounts and organisations your forks can go into (same as `kora install --github-owner list`). Needs `gh` installed and signed in. Exit code `0`, or `1` if the list cannot be read.

## `kora status`

Lists registered servers: name, mode, game port, txAdmin port, state (`running`, `stopped`, or `missing` if the folder is gone), the state of the ports and the folder.

## `kora start|stop|restart <SERVER>`

Starts, stops or restarts the server. If it has a service (installed with `--service`: systemd on Linux, a Windows service on Windows) that is used; otherwise Kora starts or stops the background process it launched itself. `start` waits for txAdmin and reports a rejected licence key, a port clash or a crash plainly. Exit code `1` if it fails. See [After the install](./after-install.md).

## `kora update --auto <SERVER>`

Unattended update for **development** servers: fast-forward only, with an automatic rollback if the server fails its health check. `<SERVER>` is a registered name or the absolute server folder. Exit code is `1` when anything needs your attention. Details in [Updating](./updating.md).

## `kora add-resources <SERVER>`

Adds resources to an installed server: `--code <CODE>` from the website's **Add resources** tab, or `--resource <ID>` (repeatable), with `--dry-run` and `-y`/`--yes`. Dependencies are added too and existing servers are not rearranged. Details in [Add resources](./add-resources.md).

## `kora delete <SERVER>`

Removes one server and what the installer created for it: the folder (only if Kora created it), the database and its user, the service, update timer, firewall rules, service account and the list entry. GitHub forks are never deleted. It asks you to type the server name unless `--yes`.

| Option | Meaning |
| --- | --- |
| `--keep-files` | Keep the server folder. |
| `--keep-db` | Keep the database and its user. |
| `-y`, `--yes` | Do not ask. |

## `kora uninstall [SERVER]`

Removes the system changes Kora made (services, update timers, firewall rules, service accounts, shared program copy and the server list entry), asking before each item. Server folders and databases are kept unless you say otherwise. With no `SERVER` it covers every registered server.

| Option | Meaning |
| --- | --- |
| `--dry-run` | Show everything that would be removed, change nothing. |
| `-y`, `--yes` | Do not ask: remove the system changes, keep folders and databases. |
| `--delete-files` | Also delete the server folders (only what Kora created). |
| `--delete-databases` | Also drop the databases and users Kora created. |

Without `--yes` or `--dry-run` it needs a terminal.

## Other commands

- `kora service-host <SERVER>` is used by the service itself to run and supervise FXServer. You do not run it by hand.
- `kora manager` opens the multi-server screen. Its keys include `g` (add resources), `b` (report an issue) and `p` (open a pull request, development servers only); see [Add resources](./add-resources.md) and [Report an issue and open a pull request](./report-and-pr.md).

## Environment variables

| Variable | Meaning |
| --- | --- |
| `CFX_LICENSE_KEY` | Cfx.re license key (same as `--license-key`). |
| `KORA_DB_ADMIN_PASSWORD` | Password of the database admin login (there is deliberately no flag for it). |
| `KORA_DB_ADMIN_USER`, `KORA_DB_HOST`, `KORA_DB_PORT` | Defaults for the database admin login. |
| `KORA_SERVICE_USER` | Run the Linux service as this **existing** account instead of creating `kora-<name>`. Kora never creates or removes it. |
| `KORA_CATALOG` | Use a different resource catalog (file or URL) instead of the public one. Mostly for testing. |
| `KORA_SITE_URL` | Setup-code website address. Must be `https` (plain `http` only for `localhost`). |
| `KORA_HOME` | Where Kora keeps its list of servers. |
| `KORA_SKIP_SPACE_CHECK=1` | Skip the free-disk-space check. |
