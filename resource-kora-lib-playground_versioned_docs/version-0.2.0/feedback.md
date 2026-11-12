---
title: Feedback
sidebar_position: 7
---

# Feedback

`/fb` lets any player send a report to staff. It is intentionally server-owned: the client supplies the form text plus a small context (street, vehicle, weapon), and the server collects everything else.

## Flow

1. The player fills in an input dialog: category (bug, suggestion, player report, staff feedback, other), subject, description and optional steps.
2. The client sends `playground:feedbackSubmitted`. It is rate limited to 2 per 120 seconds.
3. The server validates and cleans the text (control characters removed, subject 3 to 120 characters, description at least 10 characters, limits from `Config.feedback`).
4. The server rejects the report if feedback is not configured (bot URL and a secret of at least 32 characters), if another report from that player is still being sent, or if the cooldown has not elapsed.
5. The server builds a report: an id such as `FB-20260101-120000-0001`, the Discord ID from the player's identifiers, `kora_core` player data, server-side coordinates, carried weapons (from `kora_inventory` and `kora_core` shared weapon definitions), the inventory, and the sanitised client context.
6. A screenshot is requested through `exports.kora_lib:requestClientScreenshot` (see `Config.feedback`). With `requireScreenshot` true (default) a failed capture aborts the report.
7. The server file `reports/ID-screenshot.EXT` is handed to the Node uploader (`feedback_uploader.js`) with a 20 second timeout.
8. The uploader stores a private report record, posts the report to the feedback bot (`POST /feedback`, Bearer secret) and reports back.
9. The player gets a `playground:feedbackProcessed` push with the outcome. Only a delivered report starts the cooldown; failures can be retried.

`fbtest playerId` from the console runs the same pipeline with a fixed test report.

## Web report

When `kora_lib_playground_feedback_public_url` is set, the uploader registers an HTTP handler with `SetHttpHandler` and stores each report as `reports/TOKEN.json` with a random 48 hex character token. The report is served read-only at:

```text
PUBLIC_URL/kora_lib-playground/report/TOKEN
PUBLIC_URL/kora_lib-playground/report/TOKEN/screenshot
```

The page is self-contained (inventory view, weapons, location, screenshot) and is sent with `no-store`, `noindex` and a strict content security policy. Anyone with the link can read it until it expires (`reportRetentionHours`); expired records are removed when a new report is created or when a link is opened. Without a public URL, Discord receives a compact embed instead of a link.

The directory `reports/` is git-ignored except for `.gitkeep`.

## Privacy

Reports include the player's name, source id, Discord ID, coordinates, inventory and a screenshot. Treat the web links and the staff forum as private.
