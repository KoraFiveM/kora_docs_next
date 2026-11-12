---
title: Troubleshooting
sidebar_position: 9
---

# Troubleshooting

## Every action says "Kora Cards is still loading."

The resource only becomes ready after the schema has been applied **and** the catalog has been accepted. Check the server console:

- `schema setup failed: ...` means kora_sql was not ready within 60 seconds, or `ensureTables` failed.
- `catalog rejected: <slug>: <reason>` means a row in `kora_cards_designs` failed validation. Fix the row, then restart or run `/kora_cards_reload`. See [Catalog authoring](./features/catalog.md#loading-and-reloading).

When it is ready, the console prints `City Legends ready with N catalog designs.`

## "printed content differs from its locked hash"

A design that has already been printed was edited. Restore the original content, or insert the change as a new design or version.

## Photography fails

- "Photography storage is unavailable": `screenshot-basic` isn't started. The Studio tab shows "Capture service: Unavailable", and camera checkout is disabled.
- "This camera is no longer checked out to you": camera tokens only last for the current session and are cleared when you clock out or reconnect. Check out a new camera.
- "capture exceeds the 2.5 MiB limit or is empty" or "is not a valid WebP image": check the `Config.capture` `encoding` and `quality` settings.
- "The capture session expired": the screenshot took longer than `Config.capture.sessionSeconds`.

No film is used when a capture fails.

## Card artwork doesn't load

Clients load artwork from `http://<server endpoint>/kora_cards/media/<key>.webp`. If players connect through a proxy or the endpoint isn't reachable over HTTP, set `Config.capture.publicBaseUrl`. Studio artwork lives in `storage/cards/`. If that directory was lost, the catalog rejects the affected designs on reload. Restore it from the backup taken alongside the database.

## A transfer was interrupted

Prints, deposits, withdrawals, shop purchases and reward payouts are recorded in `kora_cards_operations` and recovered automatically when the player next loads in. Operations left in the `needs_review` state, for example a refund that didn't fit in the inventory or a bank balance that changed unexpectedly, need an admin. Check the `error_text` and `payload_json` columns. See [Database](./database.md#recovery).

## Ranked challenge refused

- "This character pair already completed or started a ranked match today (UTC)." You can play Casual instead.
- "Ranked play is paused for season rollover." An admin ran `/kora_cards_season preview` within the last 60 seconds.
- "Ranked play is between seasons." There is no active season.

## A deck shows "Needs work"

A deck can become illegal after it was saved, for example when a design is archived or a print leaves the binder. Open it in the Deck Builder to see the reason.
