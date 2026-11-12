---
title: "How to use"
sidebar_position: 3
---


# How to use

Players use two points per location: the list attendant and the delivery bay. Everything is driven by `Config`; there is no API to call from other resources.

## Player flow

1. **Read the list** — At each `Config.Locations[n].list.coords` (1 metre lower on the z axis, heading from `list.size.w`) a ped (`a_m_m_skater_01`) is spawned with the target option `Get Vehicle List` (locale `text.email_list_target`, distance 2.0). Selecting it opens the `Vehicle List` NUI app. If the list is empty it shows `There are no vehicles on the list right now.` instead. Clicking an entry only shows a notification; it starts nothing.

2. **Bring a listed vehicle** — The player must be the driver of a vehicle whose model is on the current list and whose plate is not in `player_vehicles`.

3. **Demolish** — In the delivery bay the option `Demolish Vehicle` appears (Kora Target zone when `Config.UseTargetForDemolish` is true and `kora_target` is started, otherwise a Kora Lib interaction zone). It asks the server to begin, runs a 28 to 37 second cancelable progress bar, then asks the server to finish.

4. **Reward** — On success the server grants 2 to 4 random items from `Config.Items` (25 to 45 each), with a 1 in 8 chance of an extra 10 to 20 `rubber`. The client then deletes the vehicle with `Kora.vehicle.delete`.

## Customize

Edit `shared/config.lua` and restart the resource. Example: a second location and a smaller list.

```lua title="shared/config.lua"
Config.Locations = {
    {
        deliver = { coords = vector3(2351.5, 3132.96, 48.2), size = vector4(6.0, 4.0, 3.0, 270.0) },
        list    = { coords = vector3(2403.51, 3127.95, 48.15), size = vector4(6.0, 4.0, 3.0, 270.0) },
    },
    {
        deliver = { coords = vector3(-430.0, -1700.0, 19.0), size = vector4(6.0, 4.0, 3.0, 90.0) },
        list    = { coords = vector3(-440.0, -1710.0, 19.0), size = vector4(6.0, 4.0, 3.0, 90.0) },
    },
}
Config.VehicleCount = 20
```

> **Note:** The location index (1, 2, ...) is what the client sends to the server, so do not leave holes or non-numeric keys in `Config.Locations`.

## In-game details

## Reading the vehicle list (details)

1. Go to a `list` position (default: Sandy Shores, near 2403, 3127). Aim at the attendant ped.
2. Choose the "Get Vehicle List" target option. If the list is empty, a "There are no vehicles on the list right now." notification is shown instead.
3. The Vehicle List app (`kora_scrapyard:vehicleList`, compact, 500 by 560, right side) shows each wanted model with a thumbnail loaded from `https://docs-backend.fivem.net/vehicles/<model>.webp`. Entries are sorted alphabetically by label. The label is the `kora_core` shared vehicle brand and name, falling back to the game display name, then the spawn code.
4. Clicking an entry shows a toast: "(vehicle name) is on the wanted list. Bring it to the scrapyard to dismantle it." If the vehicle has meanwhile left the list, a warning is shown and the list refreshes.
5. Press Escape to close.

The list is replaced on every rotation (hourly) and after each completed dismantle; clients receive the update automatically.

## Dismantling a vehicle (details)

1. Drive a listed vehicle into the `deliver` bay. The vehicle must not be in `player_vehicles` (see [Database](./database.md)).
2. Aim at the bay and choose "Demolish Vehicle" (or use the interaction prompt when `Config.UseTargetForDemolish` is off). The option is only offered while you are in a vehicle and not already dismantling.
3. The client asks the server to begin. The server rejects the job if you are not the driver, the vehicle is not on the list, it is owned, you are too far from the bay, you already have a job, or another player is dismantling that same listed model.
4. A progress bar of 28 to 37 seconds runs with a mechanic animation. Movement, combat and vehicle controls are disabled; it can be cancelled, which shows "Canceled" and releases the claim.
5. On completion the server validates again, removes the model from the wanted list and grants rewards (see [Items](./items.md)). The client then deletes the vehicle and shows "Vehicle scrapped. Materials were added to your inventory."

A started job expires on the server after 60 seconds. If no reward item can be added (for example a full inventory), the listing is restored and the player is told to make inventory space; if only some items fail, the rest are kept and each failure is notified.
