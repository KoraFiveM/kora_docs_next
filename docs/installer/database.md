---
title: Database
sidebar_position: 6
---

# Database

Kora needs a MariaDB (or MySQL-compatible) database. The installer never touches anything that already exists in your database server.

## What it does

1. **Detects** MariaDB/MySQL services already on the machine (read-only).
2. Uses the one it finds, or, if you chose `--db install` and none exists, installs one (see below).
3. Logs in once with an **admin login** to create, for this server only:
   - a new database named `kora_<random>` (`utf8mb4`), and
   - a new user with a generated password who has privileges on **that database only**.
4. Writes the connection string (`mysql_connection_string`) into the server's [`secrets.cfg`](./txadmin-and-license.md#secretscfg). The admin login is not stored.

Each server gets its own database and user, so several servers can share one MariaDB. Existing databases and users are never altered, and `kora delete` drops only the database and user Kora created (use `--keep-db` to keep them).

## The admin login

The installer needs an account that is allowed to create databases and users, used only during the install.

- **Linux:** by default `root` over the local socket (works when you run the installer with `sudo`). If your root account uses a password, or the database is elsewhere, pass `--db-admin-user`, `--db-admin-host`, `--db-admin-port` and set `KORA_DB_ADMIN_PASSWORD`.
- **Windows:** for a MariaDB that Kora installed, the generated admin password is used automatically. For an existing server, use the same flags and variable as above.
- The install wizards (panel and terminal) ask for the login if they need it, and test it before the install starts. The password is used once and never stored.

`--db skip` creates no database. You then have to set `mysql_connection_string` in `secrets.cfg` yourself before starting the server.

## Installing MariaDB

Only with `--db install` (or by choosing it in the wizard), and only when no MariaDB/MySQL service is found:

- **Debian / Ubuntu:** `apt-get install mariadb-server`, then enabled and started (needs root).
- **Windows:** a **private** MariaDB owned by Kora: MariaDB 11.4.13 is downloaded from the official mirrors (falling back to archive.mariadb.org), checked against a pinned SHA-256, and run as a separate service (`KoraMariaDB_xxxx`) on `127.0.0.1` only, on a free port (needs Administrator; Kora asks for it). A download that does not match the checksum is deleted and never installed.
- **Other Linux distributions:** not automated; install MariaDB with your package manager and use `--db existing`.
