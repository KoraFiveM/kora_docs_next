---
title: Troubleshooting
sidebar_position: 10
---

# Troubleshooting

- **No options at the garage, counter or doors** - every option requires the player's job name to be exactly `news`.
- **Resource fails to start items or spawns** - `qb-inventory`, `qb-vehiclekeys` and `kora_fuel` are called but not declared in `fxmanifest.lua`. Ensure them before this resource.
- **Trunk is empty** - items are only granted when the van was spawned by this resource for the player and `HasKeys` returns true for the generated plate. Helicopters never get items.
- **Garage does nothing** - you must be within 5.0 units of the garage coordinates, and the list index must exist in `Config.Locations.<location>.vehicles`.
- **Using an item does nothing** - the item must exist in your item list, the player needs the `news` job, and the other equipment must not already be active.
- **Camera disappears** - the prop is removed as soon as the camera overlay is closed.
- **Changing `Config.UseableItems` or `Config.Locations.main`** has no effect.
- **Counter labels and camera overlay text are English only** - they are hard-coded.
