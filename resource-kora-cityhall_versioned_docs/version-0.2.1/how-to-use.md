---
title: "How to use"
sidebar_position: 3
---


# How to use

Kora Cityhall gives players three things: a menu to buy identity items for cash, a menu to apply for jobs, and an automatic hand-out of the starter items a new character is owed. The menu is client-side UI; every purchase, job change and item grant is decided on the server.

## What a player sees

1. **Find the City Hall** — Each entry of `Config.Cityhalls` spawns a frozen, invincible ped (`Kora.entities.create`) at `coords` playing `scenario`, and an optional map blip when `blipData` is set. The default hall is at `vec4(-264.28, -966.29, 30.22, 210.0)`.

2. **Open the menu** — The ped is registered with `exports.kora_target:addEntity`. The target option is labelled with the `menus.city_hall` locale string. Selecting it opens the Kora NUI app `qb-cityhall:kiosk` titled "City Hall" at the right of the screen, with two pages: "ID Card" (the licenses) and "Job Center".

3. **Buy a license** — Each configured license is a card showing the item label, its image and "Price: $ &lt;price>". The Purchase button asks for confirmation ("Purchase &lt;label> for $&lt;price>?") when `Config.ConfirmActions` is true. The action sends `qb-cityhall:server:purchaseID` to the server.

4. **Apply for a job** — Each name in `Config.AvailableJobs` is a card with the job label and an Apply button (confirmation "Apply for the &lt;label> job?" when `Config.ConfirmActions` is true). The action sends `qb-cityhall:server:ApplyJob` to the server.

5. **Results** — Results arrive as notifications through `Kora.notify.send` titled "City Hall": too far, not enough cash, inventory full, license unavailable, or success for a job application. A failed `addJob` shows no notification (see Edge cases).

## Buying a license (server flow)

Both `qb-cityhall:server:purchaseID` and its alias `qb-cityhall:server:requestId` end in the same local function `purchaseID(src, key, license)` in `server/server.lua`.

1. **1. Validate the request** — Asserts that `src`, `key` and `license` are set, that `Config.Cityhalls[key]` exists, that it has a `licenses` table, and that `licenses[license]` is configured. A failed assert raises a script error in the server console with the matching `asserts.*` locale text; the player gets no notification.

2. **2. Check distance** — `Kora.distance.player(src, cityhall.coords, Config.PurchaseDistance)` uses the server-side position of the player. If too far the player sees "You are too far from the City Hall." and nothing is charged.

3. **3. Load the character** — `exports.kora_core:getPlayerData(src)`. No character: the event returns silently.

4. **4. Check price and room** — The price is `tonumber(licenses[license].price) or 0`; a price of 0 or below answers "This licence is unavailable." Then `qb-inventory:CanAddItem(src, license, 1)` must pass, and when `Config.RequireFreeWeight` is true `GetFreeWeight(src)` must not be 0 or less (a failing `GetFreeWeight` call is ignored). Otherwise "Your inventory is full."

5. **5. Charge cash** — `exports.kora_core:removeMoney(src, 'cash', price, 'cityhall id')`. If it returns false the player sees "You don't have enough money on you, you need &lt;price> cash".

6. **6. Add the item** — `exports['qb-inventory']:AddItem(src, license, 1, false, info, 'qb-cityhall:purchaseID')` with `info` built by `getLicenseInfo`. If AddItem returns a falsy value the cash is returned with `addMoney(src, 'cash', price, 'cityhall id refund')` and the player sees "Your inventory is full."

## Data stored in each license item

The `info` table passed as item metadata is built by `getLicenseInfo(Player, license)` from the character's `charinfo`. It is a snapshot taken when the item is created; later changes to the character do not update existing items.

- `id_card`: `citizenid`, `firstname`, `lastname`, `birthdate`, `gender`, `nationality`.
- `driver_license`: `firstname`, `lastname`, `birthdate`, `type = 'Class C Driver License'`.
- `weaponlicense`: `firstname`, `lastname`, `birthdate`.
- Any other license name (including `phone` from the starter list): an empty table.

> **Note:** The resource has no license database and no record of who owns a license beyond the inventory item. It does not check whether the player already owns one, so a player can buy the same license more than once (whether the inventory allows two copies depends on the item definition and kora_inventory). The README mentions birth certificates, driving lessons, driving schools and e-mail; none of that is implemented in this version of the code.

## Applying for a job

The server accepts only names present in `Config.AvailableJobs`, requires the player to be within `Config.PurchaseDistance` of the hall, then calls `exports.kora_multijob:addJob(src, job, 1)`. Grade 1 is hard-coded. On a truthy result the player sees "You have successfully applied for the job." The job roster, limits and persistence are owned by kora_multijob (for example its `Config.maxJobs` and `jobRecord` validation); if `addJob` returns `false, reason` this resource ignores the reason and shows nothing. There is no cooldown, whitelist, requirement or fee check in this resource.

## Starter items for new characters

kora_core stamps a new character with `metadata.starterItems`, a table of `item = true` flags built from `QBCore.Shared.StarterItems` (`phone`, `id_card`, `driver_license` in kora_core's compat table) at creation time only. kora_cityhall consumes those flags.

1. **Client triggers** — On `qb-clothing:client:CreateFirstCharacter` the client arms a flag (only if `Config.GiveStarterItems == true`). When `qb-clothing:client:onMenuClose` fires with the flag armed, it disarms it and sends `qb-cityhall:server:getIDs`. Separately, on `kora_multichar:client:spawnComplete` with `isNew ~= true`, it sends `qb-cityhall:server:getIDs` (so characters who disconnected before finishing creation get their items on the next spawn).

2. **Server claim** — `giveStarterItems` returns if `Config.GiveStarterItems` is false, if a claim for that source is in progress (`starterClaims[src]`), if there is no player, or if `getMetaData(src, 'starterItems')` is not a table.

3. **Per item** — For each entry of `exports.kora_core:getStarterItems()` whose flag in the metadata is `true`: it sets the flag to `false` first with `setMetaData` (an error is raised if that fails), then `AddItem(src, item, 1, false, info, 'qb-cityhall:giveStarterItems')`. If AddItem returns exactly `false`, the flag is set back to `true` so a later claim retries. The character is re-checked between steps so a character switch aborts the claim.

4. **Save** — If anything changed and the same character is still active, `exports.kora_core:savePlayer(src)` is called. Failures are printed as `[qb-cityhall] Starter item claim failed for <src>: <error>`.

> **Note:** The item amount is always 1: the `amount` field of the starter list is not used. Starter items are granted free of charge and without the distance, weight or cash checks used by purchases.

## Architecture

- Client (`client/client.lua`): registers the NUI app, builds the page content from `Config` and kora_core shared data, spawns peds/blips/targets, forwards NUI actions to the server as net events, and listens for the clothing/multichar events.
- Server (`server/server.lua`): the only place that charges money, adds items, checks distance and assigns jobs. It registers the net events and one export.
- Shared (`shared/config.lua`): the `Config` table, wrapped with `Kora.config.adopt(Config)` so it is available to kora_lib's configuration tooling on both sides.
- NUI: no HTML/JS files in this resource. The UI is the generic Kora NUI app host in kora_lib, driven by the `navigation` table built in `buildNavigation`. The app uses `layout = 'compact'`, `placement = 'right'`, `defaultView = 'identity'` and the icon `Landmark`.
- Tests: `tests/compat_test.lua`, `tests/starter_items_test.lua` and `tests/run.sh` are developer tests, not loaded by the manifest.

## A complete hall entry

Adding a second hall is a second entry in `Config.Cityhalls`. Prices are read only on the server at purchase time; the client reads the same table only to display them.

```lua title="shared/config.lua"
Config.Cityhalls = {
    {
        ped = 'a_m_m_hasjew_01',
        scenario = 'WORLD_HUMAN_STAND_MOBILE',
        coords = vec4(-264.28, -966.29, 30.22, 210.0),
        blipData = { sprite = 487, display = 4, scale = 0.65, color = 0, title = 'City Services' },
        licenses = {
            id_card        = { price = 50 },
            driver_license = { price = 100 },
            weaponlicense  = { price = 200 },
        },
    },
}
```

## Features at a glance

- **City Hall locations**: each entry in `Config.Cityhalls` spawns a frozen, invincible clerk ped running a scenario, with an optional map blip. Any number of locations can be configured.
- **Server-side validation**: the server checks the distance from the City Hall, whether the licence and job are configured, whether the player can carry the item and whether they have enough cash. If the item cannot be added after payment, the cash is refunded.
- **Runtime job registration**: the server export `AddCityJob` adds another job players can apply for. See [Exports](./api/exports.md).
- **qb-cityhall compatibility**: stock event names and argument shapes are accepted. See [Compatibility](./compatibility.md).
- **Further reading**: [Items and starter items](./items.md), [Events](./events.md), [Troubleshooting](./troubleshooting.md).
