---
title: Troubleshooting
sidebar_position: 9
---

# Troubleshooting

## The list is empty

The list is generated at resource start and clients fetch it on character load and about one second after the client script starts. Restart the resource after changing `Config.Vehicles`, and check that `Config.VehicleCount` is above zero. An empty list shows "There are no vehicles on the list right now."

## The Vehicle List app does not open or is rejected

An old `kora_lib` build rejects the app when `imageAspect` is not supported. Update `kora_lib`, or see [Configuration](./api/configuration.md).

## "Demolish Vehicle" does not appear

- You must be inside a vehicle and inside the bay box zone.
- With `Config.UseTargetForDemolish = true`, `kora_target` must be started; otherwise the resource falls back to an interaction prompt.

## Dismantle is refused

Messages come from the server: not close enough to the bay, vehicle not on the list, not the driver, another worker already dismantling that model, the vehicle is owned, or another job is active. A job also expires 60 seconds after it starts, so a progress bar longer than that cannot finish.

## Rewards missing

If no reward can be added, the listing is restored and nothing is paid. Make inventory space and check that all item names in [Items](./items.md) exist.

## Known caveats

- The vehicle is deleted by the client after payout; the server does not delete it.
- Several messages are hard-coded English (job errors from the server, "Vehicle scrapped...", "Unable to load the current vehicle list.", the blip description).
- Some locale keys are not read by any script (`error.demolish_vehicle`, `text.vehicle_list_target`, `text.disassemble_vehicle_target`, the `email` block). The `es`, `fr`, `nl`, `pt-br` and `tr` files also carry extra keys (`disassemble_vehicle`, `email_list`) that `en` does not have. All non-English files lack `no_vehicle`, `busy` and `vehicle_not_listed`, so English fallback text is used for those.
