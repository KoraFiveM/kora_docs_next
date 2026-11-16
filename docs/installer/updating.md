---
title: Updating
sidebar_position: 5
---

# Updating

You update a server from the panel's **Updates** tab or with `kora update <server>`. Both show what would change first, save a snapshot, apply, and let you roll back. How a server updates depends on its mode (see [Production and development](./overview.md#production-and-development)).

- **Production:** each resource moves to a newer pinned release from the catalog. This is always by hand; production servers do not update themselves.
- **Development:** your forks are fast-forwarded to the Kora repository (`upstream`), by hand or on a [schedule](#automatic-updates-development).

[Paid assets](./paid-assets.md) are never touched by updates: to update one, download the newer zip and import it again.

## Update by hand

```bash
kora update my-server --preview         # show what would change, then stop
kora update my-server                   # show, ask, then apply
kora update my-server --resource kora_core --yes
```

`--all` updates every resource; `--resource <ID>` (repeatable) only those. In the panel, each resource also has its own **Check** button.

- **You get exactly what you previewed.** Applying uses the versions shown in the preview, even if something newer appeared in the meantime.
- **Snapshot first.** Before anything changes, the current version of every resource is saved in a snapshot. An update that fails is rolled back automatically.
- **Your own work is safe.** Kora never merges, rebases or overwrites your work. A resource with uncommitted changes, or with commits of its own that cannot be fast-forwarded (diverged), is skipped and reported; the others are still updated. On production servers Kora never moves a resource away from commits of your own and never downgrades it.
- **One update at a time.** Only one update (including a preview or a rollback) runs per server at a time, whether it comes from the panel, the command line or the schedule. A second one does not start: you see "Another update is running for this server. Try again when it has finished.", and a scheduled run simply skips.
- **If it stops part way,** every resource it did not reach is listed, and the server is only restarted if your restart choice allows it.
- **SQL migrations are flagged, not rolled back.** If an update contains database migrations, Kora warns you and does not undo database changes. Back up the database first.

### Restarts

`--restart` (or the choice in the panel) says what happens after the files change:

| Policy | What happens |
| --- | --- |
| `when-quiet` | Restart only when nobody is playing (default, also in the panel). Otherwise restart-needing changes wait. |
| `full` | Restart the whole server. |
| `ensure` | Apply the files without restarting; the server loads them on its next restart or an `ensure` in txAdmin. |
| `none` | Apply the files, restart nothing. |

A stopped server is updated straight away.

## Snapshots and rollback

```bash
kora update my-server --list-snapshots
kora update my-server --rollback <SNAPSHOT>
```

Manual and automatic updates both save snapshots; the newest 20 are kept. In the panel, roll back from the **Updates** tab.

Rolling back refuses to throw away changed files. If a resource has uncommitted changes of your own, the rollback stops; choose **Roll back anyway** in the panel or add `--force` to throw them away.

A version you rolled back is **held**: automatic updates do not try it again until a newer version appears. Update that resource by hand to try it again.

## Automatic updates (development)

A development server installed with `--service` gets an update schedule, **daily at 04:00** by default (a systemd timer on Linux, a scheduled task on Windows). Creating it needs administrator rights; Kora asks for them. Change it in the panel's **Schedule** tab or with [`kora schedule`](./commands.md#kora-schedule):

```bash
kora schedule show my-server
kora schedule set my-server --weekly sun 05:30
kora schedule off my-server
```

The scheduled run is `kora update --auto <server>`. You can run it yourself too. It:

- when `gh` is signed in, brings forks that are only behind up to date on GitHub first (never forced), then fast-forwards your clones;
- skips anything that needs you (uncommitted changes, diverged) and reports it;
- restarts only when nobody is playing, otherwise it waits for the next run;
- after a restart, checks the server comes up; if not, every updated resource is put back and the server restarted on the old code, and that version is held;
- saves a snapshot you can undo from the panel or with `kora update --rollback`.

Every run is appended to `update.log` in the server folder (and to the system journal on Linux). The command exits with `1` while anything needs attention, so the timer shows as failed until you resolve it. To resolve a skipped resource, fix it in the clone yourself (commit or stash, or rebase on `upstream/<branch>`) and run the update again.

### Discord notifications

Reports of automatic updates can go to a Discord channel: set a webhook in the panel's **Notifications** tab or with `kora webhook set <server> --stdin --test`. See [`kora webhook`](./commands.md#kora-webhook).

## Updating Kora itself

```bash
kora self-update            # newest release, checksum-verified
kora self-update --check    # only say whether there is one
```

Or run the install line again. In the panel, use **Settings**. Kora shows a one-line notice in the terminal when a newer version is available (at most once a day; `KORA_NO_UPDATE_CHECK=1` turns it off).
