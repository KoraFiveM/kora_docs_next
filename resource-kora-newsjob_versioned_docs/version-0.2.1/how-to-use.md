---
title: "How to use"
sidebar_position: 3
---


# How to use

Every permission check in this resource is the same shape: `exports.kora_core:getPlayerData(src, { 'job', 'name' }) == 'news'` (or the equivalent full-player-object read, `Player.job.name == 'news'`), re-run server-side regardless of what the client UI shows. There is no duty or grade check anywhere — any grade of the `news` job passes every gate below.

## Garage: spawning a vehicle or helicopter

- The garage is a `Kora.nui` app (`qb-newsjob:garage`, opened from the `news_garage`/`news_heli` interaction zones registered in `client/main.lua`, or by calling the global client function `menuGarage(location)`, which is not an export). Picking a vehicle fires `qb-newsjob:spawn-vehicle` on the app, which calls `spawnReporterVehicle(args)` in `client/spawner.lua`.
- `spawnReporterVehicle` re-checks the caller's job client-side (`== 'news'`), then calls the server callback `Kora.callback.trigger('qb-newsjob:server:spawnVehicle', location, index)`. The server is the only source of the model and spawn coordinates: `Config.Locations[location].vehicles[index]` supplies the model, and `garage.coords` supplies the spawn point — neither is taken from the client's request. The server also re-checks the job, the location is one of `vehicle`/`heli`, and `Kora.distance.player(src, garage.coords, 5.0)` so a player cannot request a spawn from across the map.
- The server records every vehicle it spawns in an in-memory table, `spawnedVehicles[netId] = { entity, owner = src, itemsGranted = false }`, and deletes it on `onResourceStop` so a restart never leaves an orphaned vehicle behind. The client then waits for the networked entity (`Kora.loops.controlled(...)`, 5s/25-attempt poll), requests entity control, sets a randomized `WZNW####` plate, sets the vehicle owner via `vehiclekeys:client:SetOwner`, fuels it to 100 (`exports.kora_fuel:SetFuel`), and applies `modLivery` from config if the vehicle entry sets one.

## Security fix: trunk-item grant is ownership-gated and one-time-only (current behavior)

- `qb-newsjob:server:addVehicleItems` (the handler that stocks a spawned car's trunk with `newscam`/`newsmic`/`newsbmic`) is only ever fired for the `vehicle` garage, never `heli` — `client/spawner.lua` guards the trigger with `if Config.VehicleItems and args.location == 'vehicle' then TriggerServerEvent('qb-newsjob:server:addVehicleItems', netId, plate) end`.
- On the server, the handler now requires the caller to be the server-tracked **owner** of a vehicle **this resource actually spawned**, and grants trunk items **at most once per vehicle**, enforced with a one-time-grant flag on that same server-side record:
- ```lua
  RegisterNetEvent('qb-newsjob:server:addVehicleItems', function(netId, plate)
      local src = source
      local Player = exports.kora_core:getPlayerData(src)
      if not Player or Player.job.name ~= 'news' then return end
  
      local veh = spawnedVehicles[netId]
      if not veh or veh.owner ~= src or veh.itemsGranted then return end
      if NetworkGetEntityFromNetworkId(netId) ~= veh.entity or not DoesEntityExist(veh.entity) then return end
      if not exports['qb-vehiclekeys']:HasKeys(src, plate) then return end
  
      veh.itemsGranted = true
      exports['qb-inventory']:CreateInventory('trunk-' .. plate)
      for slot, item in pairs(Config.VehicleItems) do
          exports['qb-inventory']:AddItem('trunk-' .. plate, item.name, item.amount, slot, item.info, 'qb-newsjob:vehicleItems')
      end
  end)
  ```
- Reading this top to bottom, the handler performs five checks before it grants anything: (1) `Player.job.name == 'news'`; (2) `veh = spawnedVehicles[netId]` must exist — `netId` has to be a vehicle this resource itself spawned via `spawnVehicle`, not an arbitrary network id; (3) **ownership** — `veh.owner ~= src` returns early, so only the player the server recorded as the spawner of that exact `netId` can claim its items; (4) **one-time grant** — `veh.itemsGranted` returns early if already set, so a client repeat-firing the event against the same `netId` after a successful grant gets nothing on the second and every subsequent call, and the flag (`veh.itemsGranted = true`) is set *before* the inventory calls, not after, so there is no re-entrant window; (5) the entity is re-resolved from the network id and checked with `DoesEntityExist`, and `exports['qb-vehiclekeys']:HasKeys(src, plate)` confirms the caller actually holds keys for the plate they supplied. Only after all five pass does it create `trunk-<plate>` and add each `Config.VehicleItems` entry.
- Net effect: a client can send `addVehicleItems` as many times as it wants, with any `netId`/`plate` pair, and it is only ever honored once — for the one vehicle the server itself spawned and handed to that specific player.

## Equipment shop

- The equipment shop is a `Kora.interact` box zone (`news_equipment_shop`, at `Config.Locations.shop`) with three options, each firing `TriggerServerEvent('qb-newsjob:server:requestedEquipment', item)` for `newscam`, `newsmic` or `newsbmic`.
- The server handler checks `Player.job.name == 'news'` and that `item` is one of the three known equipment names (`local equipment = { newscam = true, newsmic = true, newsbmic = true }`) before calling `exports['qb-inventory']:AddItem(source, item, 1, nil, nil, 'qb-newsjob:equipment-shop')`. There is no cooldown or stock limit here — a news employee standing at the shop can request the same item repeatedly and receive one copy each time; this is an unlimited take-one-at-a-time shop by design, not a bug, since the items themselves are not stackable currency.

## Useable items and the camera overlay

- Each of the three items is also registered as a server useable via `exports.kora_core:createUseable(item, handler)` (`createNewsUseable` in `server/main.lua`): using `newscam`, `newsmic` or `newsbmic` from the inventory re-checks the holder's job and then fires a client event (`Cam:ToggleCam`, `Mic:ToggleMic`, `Mic:ToggleBMic`).
- On the client (`client/camera.lua`), `useEquipment(itemName)` toggles a held prop: it loads the item's model and animation dictionary (`Kora.stream.loadModel`/`loadAnimDict`), attaches the prop to a bone, plays the item's animation, and — for `newscam` only — opens `Kora.camera.open({ mode = 'recording', title = 'WEAZEL NEWS', ... })`, a recording-style camera overlay. A background thread (`startEquipmentMonitor`) removes the prop automatically if the holder stops being a `news` employee, dies, or (for the camera) closes the camera overlay by other means. Using the same item again while already holding it removes it instead of re-equipping.
- `Config.UseableItems` (default `true`) is read by nothing else in this resource's current source — `createNewsUseable` is called unconditionally for all three items regardless of its value. Unclear: the comment next to it (`Set to false if you want to use commands instead of usable items`) describes a command-based alternative that does not exist anywhere in `client/`, `server/` or `config.lua` as currently written; treat the flag as inert/dead configuration unless a fork adds that gate back in.

## Entering/exiting the studio

Two `kora_target` zones at `Config.Locations.outside` and `Config.Locations.inside` each offer a single "Enter" (outside) / "Go outside" (inside) option (job-gated the same way) that fades the screen and teleports the player with `Kora.visuals.fade(teleCoords, 500)` between the two coordinates. There is no server round-trip for this — it is a client-only teleport, since it moves the player between two points on the same map with no items or state involved.
