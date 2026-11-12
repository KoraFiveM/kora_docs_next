---
title: Launcher
sidebar_position: 5
---

# Launcher

Press `HOME` (secondary `F6`) to toggle the "kora_lib Playground" app, a `kora_lib` AppShell window (1280 by 820). The key mapping is registered as `kora_menu` through `Kora.keybind.add`. Pressing it again closes the window.

Each leaf entry shows a **Run** action. Running it closes the launcher, prints `running /command` to the console, executes the matching command with `ExecuteCommand`, and shows a notice. Entries flagged `keepOpen` (the target toggle) run inside the window and refresh their label. Disabled entries show no action.

## Sections

| Section | Contents |
| --- | --- |
| Server and framework | Resource health and catalogue, `kora_core` snapshots, `kora_sql` diagnostics, admin menu, session notes |
| Player systems | HUD, inventory, clothing, banking, drugs |
| Emergency jobs | Police and ambulance workflows, medical and police item fixtures |
| World and interaction | Blips, entities, zones, targets, raycast, passive systems |
| UI and gameplay | Notifications, menus, dialogs, radial menus, minigames |
| Developer tools | Cache, networking round trips, revive, vehicle spawn, Legion teleport, temporary roles |

The launcher catalogue is built in `client.lua` from the command tables; the default view is the Server and framework section. Only commands present in that catalogue can be started from the window.

## Resource catalogue

`/testresources` and `/testresource_catalogue` use a list of Kora resources (name, purpose, command, test note). `/testresources` is read-only and shows the start state. `/testresource_catalogue` enables entries for started resources, shows the test note when one is chosen and then runs its command.
