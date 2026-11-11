# kora_scrapyard

A config-driven public vehicle-scrapping activity built on kora_lib, kora_core, and
kora_sql.

## Requirements

- `kora_lib` — interactions, progress bar, streamed attendant model, blips,
  notifications, and token-gated callbacks.
- `kora_sql` — vehicle ownership lookup through `Kora.sql.scalar`.
- `kora_core` — the live `Kora.shared` vehicle registry and authoritative inventory
  gateway for rewards.

Start it after those resources. A player drives a listed, unowned vehicle into
the delivery bay, completes the dismantle action, and receives materials
through kora_core/kora_inventory. The current list is shown directly in kora_lib's NUI
instead of requiring qb-phone.

The server re-validates the networked vehicle model, driver, location, current
list slot, and ownership at both the start and completion of dismantling. The
client never decides a payout.

## Configuration

- `Config.vehicleList.showSpawnCode` (default `false`): show the vehicle spawn/model code under each
  name in the Vehicle List. Off by default so players only see the display name.
- `Config.vehicleList.imageFit` (default `'contain'`): how vehicle thumbnails fit their box.
  `'contain'` shows the whole vehicle; `'cover'` fills the box and crops the edges.
- `Config.vehicleList.imageAspect` (default `'wide'`): `'wide'` (16:9) or `'square'` thumbnails.
  Needs a kora_lib build with list `imageAspect` support; older builds reject the app.

# License

    QBCore Framework
    Copyright (C) 2021 Joshua Eger

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/)
