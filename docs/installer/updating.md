---
title: Updating
sidebar_position: 5
---

# Updating

How a server updates depends on its mode (see [Overview](./overview.md#production-and-development)).

## Production servers

A production server uses pinned releases of each resource. Kora does **not** update it automatically, and `kora update` refuses production servers. Moving to a newer release is a manual step that the installer does not yet automate: for now follow the version notes of the release you are moving to. Always back up the database and server folder first.

## Development servers: automatic updates

When a development server is installed with `--service` and run with administrator/root rights, the installer also creates a **daily update job** (a systemd timer `kora-update-<name>.timer` on Linux, a scheduled task on Windows) that runs at 04:00 local time. You can also run it yourself at any time:

```bash
kora update --auto <server>
```

For each resource the job fetches `upstream` (the Kora repository) and decides what to do:

- **Fast-forward only.** A resource is only updated when your clone can be fast-forwarded to `upstream`. Kora never merges, rebases or overwrites your work.
- **Skipped if it needs you.** A clone with uncommitted changes, or one that has commits not in upstream (diverged), is left completely untouched and reported as needing attention.
- **Snapshot first.** Before changing anything the previous commit of every resource is recorded in a snapshot.
- **Restart only when empty.** Updates that need a full server restart wait until the server reports **zero players online**; otherwise they are deferred to the next run. There is no configurable quiet window yet: the daily time is the window. A stopped server is updated straight away.
- **Health check and automatic rollback.** After the restart Kora waits for the game port to come up. If it does not, every updated resource is reset to its recorded commit and the server is restarted on the old code.
- **SQL migrations are flagged, not rolled back.** If an update contains database migrations, Kora warns you and does not undo database changes.

Every run is appended to `update.log` in the server folder (and to the system journal on Linux). The command exits with `1` while anything needs attention, so the timer shows as failed until you resolve it; the report in `update.log` says what and why.

To resolve a skipped resource, fix it in the clone yourself (commit or stash, or rebase on `upstream/<branch>`) and run the update again.

## Not available yet

These are planned but **do not exist in the installer yet**:

- Interactive/manual update with a preview, snapshot and rollback command. (`kora update` without `--auto` currently runs the same safe fast-forward-only update.)
- A configurable quiet window or player threshold.
- Discord webhook notifications for update results. The report is generated in a Discord-friendly format internally, but nothing is sent.
- The `kora manager` screen.
- Updating the `kora` program itself: re-run the install script to get a newer version. Existing services keep running the copy that registered them.
