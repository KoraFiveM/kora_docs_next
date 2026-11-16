---
title: Paid assets
sidebar_position: 4.7
---

# Paid assets from the Cfx.re Portal

Assets you buy from creators are delivered through the [Cfx.re Portal](https://portal.cfx.re) (formerly Keymaster). They are protected (escrowed): they only run on a server whose licence key belongs to the Cfx.re account that bought them, and only if their folder name and hidden `.fxap` file are exactly as the creator made them. Kora installs them from the `.zip` you download, so nothing gets renamed or lost. There is no official API for this, so Kora never signs in to the Portal for you: you download, then hand the zip to Kora.

## 1. Download the zip

1. Sign in at [portal.cfx.re](https://portal.cfx.re) with **the same Cfx.re account that owns your server's licence key** (see [txAdmin and your license key](./txadmin-and-license.md)).
2. Open **Assets → Granted Assets** ([portal.cfx.re/assets/granted-assets](https://portal.cfx.re/assets/granted-assets)) and download the asset.
3. Keep the `.zip` as it is. Do not unpack it and zip it again: that easily drops the hidden `.fxap` file.

## 2. Install it

### In the panel

Open the server in [Kora Panel](./panel.md), then the **Paid assets** tab. Drop the zip on the page or choose it, or pick it from **Recent zips in your Downloads folder** (zips from the last 24 hours, on the computer the panel runs on; not offered over remote access). Choose **Check this zip** to see what Kora found, then import.

### On the command line

```bash
kora add-asset my-server ~/Downloads/some-asset.zip --dry-run   # check only
kora add-asset my-server ~/Downloads/some-asset.zip another.zip
```

You can pass several zips. Kora shows what it found in each and asks before importing (`-y`/`--yes` skips the question). The command exits with `1` if any zip could not be imported.

## What Kora does

- **Checks the zip first**, without unpacking it: that each resource has an `fxmanifest.lua` and, if it is escrowed, its `.fxap` file; no unsafe paths (links and special entries are skipped, never created); not encrypted; not oversized (at most 2 GiB unpacked) and not a zip bomb; and that no other resource on the server already has the same name.
- **Installs each resource into `resources/[paid]/<name>`**, keeping the folder name exactly as it is in the zip. Zips that hold several resources, or a folder inside a folder, are handled. A zip with no folder around the resource is named after the zip, and Kora warns you: rename the zip to the asset's real name first if it differs.
- **Adds `ensure <name>`** to `server.cfg`.
- **Keeps a backup when you replace an asset** with a newer zip: the old copy is moved to `.kora/asset-backups/` in the server folder (the newest 3 per asset are kept). If anything fails, the old copy is put back.

Restart the server to load the new files.

Removing an asset in the panel moves its folder to the backups and takes its `ensure` line out of `server.cfg`.

## Updates

[Updates](./updating.md) leave paid assets alone. To update one, download the newer zip from the Portal and import it again; the old copy is kept as a backup.

## Licence errors

When a paid asset cannot load, FXServer prints an error in the server console. The **Paid assets** tab spots these and explains them:

| Console message | What it means and what to do |
| --- | --- |
| "You lack the required entitlement" | Your licence key belongs to a different Cfx.re account than the one that bought the asset. On the Portal, under **Assets → Granted Assets**, transfer the asset to the key's account, or use a licence key from the buying account. |
| "Failed to verify protected resource" | Usually the folder was renamed or the hidden `.fxap` file is missing, or the licence key belongs to another account. Download the asset again and import the zip with Kora, without renaming anything. |
| "Resource could not be downloaded" | The server could not fetch the asset from Cfx.re. Check that it can reach the internet and that its licence key belongs to the buying account, then restart the server. |

Kora refuses a zip when another resource with the same name already exists elsewhere in `resources/`: two resources with the same name cannot both load. Remove or move that one first, then import again.
