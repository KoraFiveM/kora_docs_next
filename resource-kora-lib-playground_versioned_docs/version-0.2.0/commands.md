---
title: Commands
sidebar_position: 4
---

# Commands

All chat commands are registered on the client without an ACE restriction (`restricted = false`). Where an action changes server state, the server checks the `command.playground` ACE itself (see [Permissions](./permissions.md)). Commands for other resources first check that the resource is started and otherwise show a "not started" notification.

Every `/test...` command below also appears in the [Launcher](./launcher.md) unless marked otherwise.

## Player commands

| Command | Description |
| --- | --- |
| `/kora_menu` | Opens the launcher. This is a key mapping (`HOME`, secondary `F6`), not a chat command; rebind it in game settings. |
| `/fb` | Opens the feedback form. See [Feedback](./feedback.md). |
| `/test` | Guided testing panel (key `F3`, mapping `kora_test`). Subcommands in [Guided testing](./guided-testing.md). |

## kora_lib module checks

| Command | Description |
| --- | --- |
| `/testblip`, `/testblip_remove` | Create or remove a route blip at your position (one at a time). |
| `/testentity`, `/testentity_remove` | Spawn or remove a parasol prop at your feet. |
| `/testzone`, `/testzone_sphere`, `/testzone_poly`, `/testzone_point` | Create a box, sphere, polygon or point zone. |
| `/testzone_remove`, `/testzone_clear`, `/testzone_inside` | Remove the last zone, clear all, or list the zones you are inside. |
| `/testzone_create` | Zone creator: asks for a type, runs `Kora.zones.startCreator` and prints a code snippet. |
| `/testcache` | Read and watch `Kora.cache` values. |
| `/testnotify` | Send a notification. |
| `/testprogressbar`, `/testprogressbar_cancel` | Start or cancel a progress bar. |
| `/testmenu`, `/testnested`, `/testinput`, `/testalert`, `/testalert_ack` | Menu, nested menu, input dialog and alert dialogs. |
| `/testradial`, `/testradial_nested`, `/testradial_paged` | Radial menus. |
| `/testinteract`, `/testinteract_zone`, `/testinteract_clear` | Interaction prompts. |
| `/testclipboard` | Copy a sample string to the clipboard. |
| `/testraycast` | Raycast from the camera. |
| `/testminigame_lockpick`, `/testminigame_skillbar`, `/testminigame_circuit`, `/testminigame_mash` | Server-validated minigames. |
| `/testcallback` | Round trip to the `playground:ping` callback. |
| `/testevent` | Send `playground:event` and wait for the acknowledgement push. |

## Other resources

| Command | Resource | Description |
| --- | --- | --- |
| `/testtarget_entity`, `/testtarget_entity_remove`, `/testtarget_zone`, `/testtarget_zone_remove`, `/testtarget_state`, `/testtarget_toggle` | `kora_target` | Entity and box-zone targets, state and enable toggle. |
| `/testinventory_self`, `/testinventory` | `kora_inventory` | Open your inventory, or the `playground-locker` stash (needs fixtures convar). |
| `/testgiveitem` | `kora_inventory` | Input dialog, then `playground:giveItem`. Controllers only. |
| `/testclothing_wardrobe`, `/testclothing_shop` | `kora_clothing` | Open the wardrobe or a clothing room. |
| `/testresources`, `/testresource_catalogue` | all | Resource health list; the catalogue also shows a test note and runs the matching command when chosen. |
| `/testsession_info` | `kora_multichar` etc. | Read-only notes about connect-time flows. |
| `/testcore_player`, `/testcore_registries` | `kora_core` | Player data snapshot and registry counts. |
| `/testsql_stats`, `/testsql_ping`, `/testsql_queue`, `/testsql_slow` | `kora_sql` | Live stats (server callback, controllers only) or the matching `kora_sql` command. |
| `/testadmin_open` | `kora_admin` | Runs `/admin`. |
| `/testtemporary_access`, `/testtemporary_access_revoke` | `kora_admin` | Grant or revoke a temporary moderator/admin role. Controllers only. |
| `/testchat_message`, `/testdoorlocks`, `/testphone_open`, `/testemotes_open`, `/testmultijob_open`, `/testbossmenu_open`, `/testbusiness_open`, `/testrobberies_open`, `/testmdt_open`, `/testcards_open` | chat, doorlock, phone, emotemenu, multijob, bossmenu, businesses, robberies, mdt, cards | Open or exercise that resource. |
| `/testvoice_status`, `/testfuel_status` | `kora_voice`, `kora_fuel` | Show talking mode and radio channel, or fuel level. |
| `/testmechanic_guide`, `/testweather_guide`, `/testdispatch_guide`, `/testdealership_guide`, `/testgarage_guide` | respective resource | Show a text checklist; no gameplay is triggered. |
| `/testscrapyard_route`, `/testbank_waypoint` | `kora_scrapyard`, `kora_banking` | Set a waypoint. |
| `/testbank_atm` | `kora_banking` | Triggers `qb-banking:client:useCard`. |
| `/testhud_state`, `/testhud_seatbelt` | `kora_hud` | Show HUD data sources; toggle seatbelt. |
| `/testambulance_status`, `/testambulance_waypoint`, `/testambulance_911` | `kora_ambulance` | Check status, route to Pillbox, send a `911e` message. |
| `/testpolice_waypoint`, `/testpolice_duty`, `/testpolice_backup`, `/testpolice_spikes`, `/testpolice_armory`, `/testpolice_state` | `kora_police` | Route, toggle duty, backup, spike strip, patrol armory, state. |
| `/testdrugs_route` | `qb-drugs` | Pick a drug route waypoint. |
| `/testsmallresources` | `kora_utils` | Read-only checklist for passive behaviours. |

## Item fixture commands

Each calls `playground:giveItem` for one unit (controllers only): `/testmedical_bandage`, `/testmedical_ifak`, `/testmedical_painkillers`, `/testpolice_cuffs`, `/testpolice_armor`, `/testdrugs_weed`, `/testdrugs_seed`, `/testdrugs_meth`, `/testdrugs_precursor`. They give the items `bandage`, `ifak`, `painkillers`, `handcuffs`, `armor`, `weed_baggie`, `weed_seed`, `meth_bag`, `meth_precursor`.

## Developer tools

| Command | Description |
| --- | --- |
| `/testrevive` | Self revive. Server clears `isdead` and `inlaststand` metadata through `kora_core` and triggers `kora_admin:client:revive`. |
| `/testvehicle` | Asks for a model name, spawns it, fuels it (if `kora_fuel` is started) and requests keys. Replaces the previous playground vehicle. |
| `/testlegion` | Teleports you and your vehicle to Legion Square. |

## Console and rcon commands

These only run from the server console (source 0); in game they do nothing. They are `restricted` commands.

| Command | Description |
| --- | --- |
| `fbtest playerId` | Submits a test feedback report on behalf of that player. |
| `playground_giveadmin discordUserId` | Runs `add_principal identifier.discord:ID group.admin` (17 to 20 digits). Not persisted, ends at restart. |
| `playground_removeadmin discordUserId` | Removes that principal again. |
| `playground_testnotify discordUserId message` | Pushes a notice to the player with that Discord ID (used by communitybot retests). |
| `kora_connect_sync` | Re-sends the `online` state to communitybot. |
