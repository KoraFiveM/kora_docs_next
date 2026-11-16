---
title: Uninstall
sidebar_position: 9
---

# Uninstall

Kora keeps a record in each server's `.kora` folder of exactly what it created, and only those things are ever removed.

## Remove one server

```bash
kora delete <server>
```

This removes the server folder (only if Kora created it), its database and database user, its service, update timer, firewall rules and service account, and its entry in `kora status`. It asks you to type the server name first. Use `--keep-files` and/or `--keep-db` to keep data. GitHub forks created in development mode are never deleted.

## Remove the system changes

```bash
kora uninstall --dry-run     # preview
kora uninstall               # asks before each item
```

`kora uninstall` removes services, update timers, firewall rules, service accounts, the shared program copy (once no server uses it) and the server list entry, **asking before each item**. Server folders and databases are kept by default (add `--delete-files` / `--delete-databases` to remove them). Kept files are given back to their previous owner before a service account is removed. Run it as administrator/root so system items can be removed.

In [Kora Panel](./panel.md), **Settings → Uninstall Kora** does the same: it shows exactly what would be removed and asks you to type `uninstall`.

## Remove the panel and the program

- `kora panel --remove-service` stops and removes the background panel.
- `kora uninstall --app` (or `kora app uninstall`) removes the Kora app: shortcuts, `PATH` entry and the installed copy. Servers and databases are never touched.
- To remove the `kora` program the install script placed, delete it (`~/.local/bin/kora` or `/usr/local/bin/kora` on Linux, `%LOCALAPPDATA%\Kora\bin\kora.exe` on Windows) and the `.previous` copy beside it.
