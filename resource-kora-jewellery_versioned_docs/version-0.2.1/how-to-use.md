---
title: "How to use"
sidebar_position: 3
---


# How to use

There is no public API: kora_jewellery exposes no exports, no commands, and nothing another resource is meant to call. The whole feature is a closed loop of one callback and three net events (`firstAlarm`, `setVitrineState`, `vitrineReward`) between its own client and server scripts, driven entirely by player interaction with the 20 vitrine box zones (`Config.Locations`) around the shipped `Config.JewelleryLocation` blip. See [Events](./events.md) for the exact handlers and [Configuration](./api/configuration.md) for the options.

## The heist, end to end

```text title="client/client.lua (annotated)"
-- Simplified client/client.lua flow (see client/client.lua for the real thing)
-- 1. Player interacts with a kora_target box zone over a vitrine (id k)
local function smashVitrine(k)
    if not GlobalState.Jewellery.firstAlarm then
        TriggerServerEvent('qb-jewellery:server:firstAlarm', k) -- arms the alarm + dispatch, once
    end
    if not validWeapon() then
        return Kora.notify.send({ title = 'qb-jewellery', message = Kora.lang('error.wrong_weapon'), type = 'error' })
    end

    -- 2. Claim the case
    local ok, reason = Kora.callback.trigger('qb-jewellery:server:startSmash', k)
    if not ok then
        if reason then Kora.notify.send({ title = 'qb-jewellery', message = reason, type = 'error' }) end
        return
    end

    -- 3. Play the smash animation/progress bar, weapon-tier duration
    if Kora.progressbar.start({ label = Kora.lang('progressbar'), duration = Config.WhitelistedWeapons[GetSelectedPedWeapon(PlayerPedId())], disable = { move = true, combat = true, vehicle = true } }) then
        TriggerServerEvent('qb-jewellery:server:vitrineReward', k) -- 4a. completed: claim the reward
    else
        TriggerServerEvent('qb-jewellery:server:setVitrineState', k, false) -- 4b. cancelled: release the case
    end
end
```

1. **Arrive and interact** — The resource creates a blip ("Vangelico Jewelry") at `Config.JewelleryLocation` and a `kora_target` box zone at every `Config.Locations[k].coords`/`size`. A zone is only interactable (`canInteract`) while its case is neither `isOpened` nor `isBusy`.

2. **First smash arms the alarm** — The very first `smashVitrine` call on a cold store (`GlobalState.Jewellery.firstAlarm` false) fires `qb-jewellery:server:firstAlarm`. If enough police are on duty, the server sets `alarm = true`, starts the single store-wide cooldown timer, and dispatches a call to all `leo` jobs. Every smash after that is silent (no repeat dispatch) until the whole store resets.

3. **Weapon check** — The player's currently equipped weapon must be a key in `Config.WhitelistedWeapons`, checked both before the claim attempt and again in the `kora_target` `onSelect`. Its mapped value doubles as the duration (ms) of the smashing progress bar.

4. **Claim the case** — The server callback `qb-jewellery:server:startSmash` is the only way a case becomes `isBusy`. It requires the player within 5 m of the vitrine, enough on-duty police, and the case not already `isOpened`/`isBusy`. On success the client plays the `missheist_jewel`/`smash_case` animation loop and particle effects while repositioning the player to the case's `offset` every tick (so the anim lines up with the display case model), and rolls the fingerprint-evidence chance.

5. **Finish or cancel** — A completed progress bar sends `qb-jewellery:server:vitrineReward`, which rolls and grants an item (see below) and marks the case permanently `isOpened` until the next store-wide reset. A cancelled bar sends `qb-jewellery:server:setVitrineState(k, false)`, which frees the case (`isBusy = false`) for anyone to reattempt, without granting anything.

6. **Store-wide cooldown** — Whether or not the heist is finished, `Config.Timeout` (shipped 30 minutes) after the alarm first triggered, the server resets `alarm` and every location's `isOpened`/`isBusy` back to `false` in one shot. There is no per-case cooldown — the whole store resets together on one timer started by the first alarm.

## What the police requirement actually gates

- Checked independently, three times, server-side: `firstAlarm` (silently refuses to arm the alarm/dispatch below `Config.RequiredCops`), `startSmash` (refuses the claim and returns a translated reason), and `vitrineReward` (refuses to grant the reward even if the case was already claimed, in case the cop count dropped mid-smash).
- The client never enforces this on its own — `validWeapon()` is the only client-side gate before asking the server. Everything about distance, police count and case state is re-checked server-side on every event.
