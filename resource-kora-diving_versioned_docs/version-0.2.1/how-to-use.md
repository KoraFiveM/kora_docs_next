---
title: "How to use"
sidebar_position: 3
---


# How to use

Kora Diving is entirely event-driven: there are no slash commands and no exports other resources are meant to call. The flow is scuba gear on/off, an oxygen timer, and coral pickup/sale.

## Equipping and removing the suit

Using the `diving_gear` item (server-side, via `exports.kora_core:createUseable('diving_gear', ...)`) fires the client event `qb-diving:client:UseGear`. If the player is already wearing the suit it is removed; otherwise it is equipped, but only if the player has oxygen (`OxygenLevel > 0`) and is not swimming or in a vehicle.

- Equip: a 5-second progress bar (animation `clothingshirt`/`try_shirt_positive_d`), then attaches a tank prop (`p_s_scuba_tank_s`, bone `24818`) and a mask prop (`p_d_scuba_mask_s`, bone `12844`) to the ped, calls `SetEnableScuba(ped, true)` and `SetPedMaxTimeUnderwater(ped, 2000.0)`, then starts the oxygen HUD and countdown loop.
- Remove: a 5-second progress bar, then `SetEnableScuba(ped, false)` with a 50-second max underwater time, deletes both props, and stops scuba state.
- Either progress bar can be cancelled by the player; a cancelled equip leaves `isWearingSuit` false and does not attach props, a cancelled removal leaves the suit equipped.
- On `onResourceStop` for this resource, gear is force-removed and scuba state is disabled for every tracked ped, so a restart cannot leave a player stuck in a permanent scuba state.

## Oxygen

Oxygen is a purely client-side counter; it is not persisted and resets to `0` on resource restart.

- Using `diving_fill` fires `qb-diving:client:SetOxygenLevel`. If the player already has oxygen left (`OxygenLevel ~= 0`), it refuses and notifies the current level instead of refilling. Otherwise it calls the `qb-diving:server:fillOxygen` callback, which removes one `diving_fill` item server-side; only on a truthy response does it set `OxygenLevel = Config.OxygenLevel`.
- While the suit is enabled, a loop ticks every second: if the ped is swimming underwater, `OxygenLevel` decreases by 1. A plain text UI (`Kora.textui`) shows the remaining seconds while the player is underwater and hides when they surface.
- Every 10 units (at or below 90) a breathing sound event (`InteractSound_SV:PlayOnSource`, `breathdivingsuit`) fires. At 0, gear is forcibly disabled (and deleted if `Config.RemoveDivingGear` is true) and a different sound (volume `0.25`, no clip name) plays.

## Coral pickups and selling

Coral spawn points are shared state (`GlobalState.Corals`), seeded from `Config.CoralLocations` on server start so every client sees the same picked/available state.

- On resource start, the client waits for `GlobalState.Corals` to be populated, then spawns a frozen, invincible prop (`Config.model`) at every location not yet picked up, each with a Kora Target option ("pick coral").
- Selecting it fires `qb-diving:server:PickCoral(index)`. The server asserts the index exists, is not already picked, and the player is within 10 units of its coords (`Kora.distance.player`), then marks it picked, updates `GlobalState.Corals`, tells every client to remove that entity, and grants the player a random quantity (per `Config.CoralTypes[].min`/`max`) of a random coral item via `exports.kora_inventory:AddItem`. A 5-minute `SetTimeout` then flips it back to unpicked and tells clients to respawn the entity.
- An assertion failure (bad index, already picked, too far) raises a Lua error with a localized message (`Kora.lang`) rather than returning a value — treat it as a hard reject, not a soft failure.
- Selling: the client target option at a `Config.SellLocations` ped triggers a progress bar, then `qb-diving:server:sellCoral`. The server requires the player be within 10 units of a configured sell location, then for every `Config.CoralTypes` entry removes however many the player is carrying (via `exports.kora_inventory:GetItemCount`/`RemoveItem`) and pays `count * price` (or `item.sellPrice` if present) in cash through `exports.kora_core:addMoney`.
- Note: `Config.CoralTypes[].price` is computed once at script load with `math.random(min, max)` — it does not re-roll per sale. Only an explicit `item.sellPrice` field (not present in the default config) would let the sale price differ from the price baked in at load time.
