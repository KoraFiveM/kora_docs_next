---
title: "How to use"
sidebar_position: 3
---


# How to use

The robbery is a single shared, server-wide mission: starting it locks every other player out of starting a second one until it ends (success, or the 10-minute safety timeout).

## Starting the robbery

- An NPC (`a_m_m_skater_01`, frozen and invincible) stands at `Config.DealerCoords` with a kora_target option "start Robbery", only interactable while `GlobalState.TruckRobbery.inProgress` is false.
- Selecting it calls the server callback `qb-truckrobbery:server:startRobbery`, which checks the player is within 5.0 units of the dealer, that `exports.kora_core:getDutyCountByType('leo')` meets `Config.ActivePolice` (shows "There are not enough police on duty." if not), and that no robbery is already running anywhere on the server.
- On success the server randomly picks one `Config.VehicleSpawn` point and one `Config.VehicleDropOff` point, publishes them through `GlobalState.TruckRobbery`, and starts a 10-minute safety timer that force-clears the mission state regardless of outcome — so a disconnect or stuck client can never leave the server permanently locked out of starting a new robbery.

## The truck and its guards

- The client spawns a `stockade` truck at the chosen spawn point plus three `s_m_m_security_01` peds: a driver and two guards in the other seats. Each is given 200 HP, 100 armor, 75 accuracy, a `WEAPON_ASSAULTRIFLE` (255 rounds), combat attributes/ability tuned up, is flagged as an enemy and as a cop, and has fleeing disabled. The driver is set to drive around randomly (`TaskVehicleDriveWander`).
- A map blip ("Robbery Truck") is attached to the truck. A kora_target option on the driver, "Take Keys", fires `qb-vehiclekeys:client:AddKeys` with the truck's plate, removes the blip, and sets a GPS waypoint to the chosen drop-off — it can be used at any time, the driver does not need to be dead first.

## Looting the truck

- A 5×5×5 zone around the drop-off point only shows a "Rob Truck" kora_target option on the truck once the player enters it. That option is only interactable once the driver and both guards are dead (`IsPedDeadOrDying` on all three).
- Selecting it runs a 10-second progress bar (animation `missheist_jewelry` / `robbery_action_a`). If the bar is cancelled or fails, nothing happens — the truck, guards and mission all remain exactly as they were, and the same option can be retried.
- If the bar completes, the client fires the server event `qb-truckrobbery:server:endRobbery` (before any client-side cleanup), then despawns the truck and all three ped entities locally.

## Ending the robbery: the drop-off fix

The server is the final authority on whether a robbery can be completed, and checks two things, not one.

```lua title="server/server.lua"
local STOCKADE_MODEL = `stockade`

local function truckAtDropOff(endCoords)
    for _, vehicle in ipairs(GetAllVehicles()) do
        if GetEntityModel(vehicle) == STOCKADE_MODEL then
            local truckCoords = GetEntityCoords(vehicle)
            local dx, dy, dz = truckCoords.x - endCoords.x, truckCoords.y - endCoords.y, truckCoords.z - endCoords.z
            if (dx * dx + dy * dy + dz * dz) <= 100.0 then return true end
        end
    end
    return false
end

RegisterNetEvent('qb-truckrobbery:server:endRobbery', function()
    assert(source, Kora.lang('asserts.no_src'))
    assert(robData.inProgress, Kora.lang('asserts.no_robbery_in_progress', source))
    assert(robData.coords, Kora.lang('asserts.robbery_coords_not_set', source))
    assert(robData.endCoords, Kora.lang('asserts.robbery_end_coords_not_set', source))
    assert(Kora.distance.player(source, robData.endCoords, 10.0), Kora.lang('asserts.too_far_from_robbery_end', source))
    assert(truckAtDropOff(robData.endCoords), Kora.lang('asserts.truck_not_at_dropoff', source))
    robData.inProgress = false
    robData.coords = nil
    robData.endCoords = nil
    saveGlobal()
end)
```

- It asserts a robbery is actually in progress with spawn/drop-off coordinates set, and that the calling player is within 10.0 units of the chosen drop-off.
- It also asserts the robbery truck itself is present: `truckAtDropOff(endCoords)` scans every vehicle on the server for one whose model is `stockade` within 10.0 units (squared distance ≤ 100.0) of the drop-off. Only if a matching vehicle is actually there does the robbery end.
- This second check exists specifically because the player-only distance check is not enough: without it, anyone who merely knew a robbery was in progress could walk to one of the two fixed `Config.VehicleDropOff` spots and end the robbery without ever fetching, driving or even seeing the truck. The check is model-based rather than tied to the specific spawned entity, so in principle an unrelated `stockade` near the drop-off would also satisfy it — but the truck must still genuinely exist and be in the right place, which is what matters for the exploit it closes.

## Rewards: there is currently none

The manifest's description and the test file's naming ("looting") both suggest the robbery should pay out money or items on completion. It does not.

- Neither `client/client.lua` nor `server/server.lua` call any money or item export (no `addMoney`, `addItem`, `AddMoney`, `AddItem`, or similar) anywhere in the robbery flow, including right after a successful `endRobbery`.
- A successful completion only clears `GlobalState.TruckRobbery` (ends the shared lock so a new robbery can start) — the player receives nothing automatically for finishing it.
- The test suite (`tests/looting.lua`) only asserts that the completion event fires once, that entities are cleaned up, and that the mission state is cleared — it does not assert any reward, which matches the current code.
- This may be an intentional "the payout belongs to another resource" design, or a genuine gap; document and treat it as a known limitation rather than assuming a reward exists.

## Additional details from the code

- **Notifications.** A successful start shows "A Truck Popped Up On Your GPS" (from `locales/en.lua`). The "not enough police" message is hard-coded English in `client/client.lua`.
- **Blip.** The "Robbery Truck" blip uses sprite 477, colour 1 (red) and scale 0.8.
- **Driving.** The driver wanders at speed 80.0 with driving style 443.
- **Dealer rule.** The dealer callback also returns `false` (same notification) when a robbery is already running, even if the option was visible.
- **Crew is client-local.** The truck and crew are created by the client of the player who started the robbery, through `Kora.entities.create`. Other players do not see them.
- **Timer.** The 10-minute reset timer is not cancelled when a robbery ends, so a robbery started within 10 minutes of the previous start can be cleared early. See [Troubleshooting](./troubleshooting.md).
- **Reference pages.** Callback, net event and state bag details are in [Events](./events.md); options and fixed values are in [Configuration](./configuration.md).
