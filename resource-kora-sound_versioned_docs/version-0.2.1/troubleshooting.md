---
title: Troubleshooting
sidebar_position: 8
---

# Troubleshooting

- **Nothing plays right after joining**: the client ignores play requests until the player is loaded (`LocalPlayer.state.isLoggedIn` or `QBCore:Client:OnPlayerLoaded`).
- **Silence for everyone**: the NUI page loads Howler from `cdnjs.cloudflare.com`. If the CDN is blocked or offline no sound plays.
- **Unknown sound name**: names are case sensitive and the file must exist in `client/html/sounds/`. The server does not check that the file exists.
- **Legacy event ignored**: it was dropped by the cooldown (`Config.cooldownMs`), or the sound name or volume failed validation. See [Events](./events.md).
- **Late joiners miss a loop**: area and per-player plays are snapshots. Call the export again if needed.
- **Loop will not stop**: a loop needs an `id` and you must stop it with the same `id`. Calling `StopSound(id)` without `target` stops everyone who received it.
- **Two sounds cut each other off**: sounds without an `id` replace each other; give them ids to overlap them.
- **`exports['interact-sound']` not found**: the aliases come from `Kora.compat.provideExport`; make sure `kora_lib` is started before this resource.
