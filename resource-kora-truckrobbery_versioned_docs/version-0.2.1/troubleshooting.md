---
title: Troubleshooting
sidebar_position: 9
---

# Troubleshooting

## Nothing is paid out

The resource has no reward code. Neither the server nor the client gives money or items on completion, even though the manifest description says robbers get "money and items". Add the payout in the `qb-truckrobbery:server:endRobbery` handler if you need one.

## "There are not enough police on duty."

The start callback returned `false`. Either fewer than `Config.ActivePolice` `leo` players are on duty, or another robbery is already in progress (the dealer option is normally hidden in that case).

## The dealer option is missing

It is hidden while `GlobalState.TruckRobbery.inProgress` is true. State resets when a robbery ends or 10 minutes after a start. Also check that `kora_target` is started.

## Rob Truck does not finish the robbery

The server requires the player within 10.0 m of the drop-off and a `stockade` within 10 m of it, and prints an assert error otherwise. The truck is a client-local entity created through `kora_lib`'s `Kora.entities.create`, which spawns non-networked vehicles. A server-side vehicle search is not expected to see such an entity, so this check may fail even when the truck is at the drop-off. If the robbery never completes, it resets by the 10 minute timeout.

## Taking keys does nothing useful

The keys are given through `qb-vehiclekeys:client:AddKeys`. Without a resource handling it you only get the waypoint and the blip removal.

## Early reset of a second robbery

The 10 minute reset timer is not cancelled when a robbery ends. A new robbery started less than 10 minutes after the previous start is cleared when the old timer fires.

## Other notes

- The drop-off zone always draws debug markers (`debug = true`).
- `Config.NavWeap` is unused.
- Only the player who started the robbery gets the spawned truck and crew, since they are local entities. Other players do not see them.
