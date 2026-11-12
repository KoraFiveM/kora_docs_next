---
title: Troubleshooting
sidebar_position: 10
---

# Troubleshooting

**No clerk ped or blip appears.**
Check that `Config.Cityhalls` contains at least one entry. If the table is empty, the client exits early and creates nothing. Also check that `kora_lib` and `kora_target` are started before `kora_cityhall`. Locations without `blipData` have no blip.

**The "City Hall" target option is missing.**
`kora_target` must be running. The option is added to the clerk ped entity, not to a zone.

**A licence card shows the raw item key and a default image.**
The item does not exist in `kora_core`'s shared items. Add it there. The purchase would also fail at `AddItem`, and the cash is refunded.

**"This licence is unavailable."**
The licence's `price` in `Config.Cityhalls[n].licenses` is missing, `0`, negative or not a number.

**"Your inventory is full." although the licence weighs nothing.**
When `Config.RequireFreeWeight` is enabled, purchases are refused when free weight is `0` or less. Set it to `false` to only use `CanAddItem`.

**"You are too far from the City Hall."**
The player is farther than `Config.PurchaseDistance` from the City Hall `coords`, measured on the server. This also happens when the panel was opened remotely with `qb-cityhall:client:openCityhallMenu`.

**Applying for a job does nothing.**
`kora_multijob` refused the job. Common reasons are that the job does not exist, it has no grade `1`, or the player's job roster is full. `kora_cityhall` shows no error notification in this case. Check the job definition in `kora_core` and the `kora_multijob` settings.

**A job added with `AddCityJob` does not appear in the Job Center.**
This is expected. The export only changes the server's list. See [Exports](./api/exports.md).

**Starter items are not given.**
Check that `Config.GiveStarterItems` is `true`, and that the character has a `starterItems` metadata table with pending (`true`) entries. Items are granted after the `kora_clothing` first-character menu closes or on a later `kora_multichar` spawn. Look in the server console for `[qb-cityhall] Starter item claim failed` messages.
