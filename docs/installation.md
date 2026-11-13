---
title: Installation
sidebar_position: 2
---

# Installing Kora

There are two ways to install Kora. To run a server, deploy the official txAdmin recipe: txAdmin downloads everything, sets up the database and makes you an admin. To develop Kora itself, use the developer setup script.

## Install with txAdmin (recommended)

The official recipe deploys a complete Kora server from txAdmin's deployment wizard. It is an alpha release, so expect rough edges.

1. **Install FXServer and txAdmin.** Download the latest recommended FXServer artifacts for your OS from [artifacts.koraframe.work](https://artifacts.koraframe.work) and start the server once. txAdmin opens on port `40120`. Follow the [txAdmin setup guide](https://docs.fivem.net/docs/server-manual/setting-up-a-server-txadmin/) if you have not done this before.
2. **Log in with Cfx.re.** Sign in to txAdmin with the **Cfx.re** button and link your account. The first account to log in becomes the master admin, and the recipe uses it for the admin permissions (see [Admin permissions](#admin-permissions)).
3. **Choose the recipe.** In the deployment wizard choose **Popular Recipes → Remote URL Template** and paste the recipe URL:

   ```text
   https://tx.koraframe.work
   ```

4. **Enter your details.** Give the server a name and your [Cfx.re licence key](https://portal.cfx.re/), then enter your MariaDB/MySQL connection details. The recipe creates the database for you; `kora_sql` creates the tables on first start.
5. **Deploy.** Review the recipe, then run it. txAdmin downloads every Kora resource, writes `server.cfg` and `permissions.cfg` (including your admin line), and offers to start the server when it finishes. The download takes a few minutes because of the number of resources.

:::note
Every repository the recipe downloads must be public, otherwise the deployment fails part-way through.
:::

## Admin permissions

You do not need to edit `permissions.cfg` to make yourself an admin. Because you logged in to txAdmin with your Cfx.re account, txAdmin already knows your FiveM identifier. When the recipe runs, it writes a line like this at the bottom of `permissions.cfg`:

```cfg title="permissions.cfg"
add_principal identifier.fivem:1234567 group.admin #yourname
```

`group.admin` is the group `permissions.cfg` builds the Kora admin permissions on, so you are an admin in-game the first time you join. To add more admins, add the same line to `permissions.cfg` with their FiveM identifier and restart the server.

## Developer setup script

`setup-kora-dev.sh`, from the [kora_install](https://github.com/KoraFiveM/kora_install) repo, builds a complete Kora development server in one run: it creates your server folder, downloads the latest recommended FXServer artifacts for your OS, asks for your keys, copies the dev `server.cfg` and clones every resource repo into the right category folder. It needs access to the private KoraFiveM repositories, so it is for Kora developers.

You need bash (Linux, WSL or Git Bash), git, curl, tar and xz (or unzip on Windows), the GitHub CLI signed in with an account that has access to the KoraFiveM organization, MySQL/MariaDB on `127.0.0.1:3306`, about 5 GB of free disk space, and your Cfx.re licence key.

```bash
gh repo clone KoraFiveM/kora_install
cd kora_install
chmod +x setup-kora-dev.sh
./setup-kora-dev.sh
```

The script asks for a server name, ports, database name, MySQL login, your licence key and, optionally, your Cfx.re forum username to pre-create your txAdmin admin account. It starts the server when it finishes; run `./start.sh` from the `server` folder to start it again later.

Copyright © 2026 Kora Framework (new contribution guidance).
