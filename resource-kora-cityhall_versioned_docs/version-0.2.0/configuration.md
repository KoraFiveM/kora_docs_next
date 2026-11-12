---
title: Configuration
sidebar_position: 2
---

# Configuration

All options are in [`shared/config.lua`](https://github.com/KoraFiveM/kora_cityhall/blob/dev/shared/config.lua). The file is loaded on both client and server. At the end, the table is registered with `Kora.config.adopt(Config)` from `kora_lib`, so Kora's config system knows about the values and can apply its overrides.

## General

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `Config.PurchaseDistance` | number | `5.0` | Maximum distance in metres between the player and the City Hall `coords`. The server checks this before a licence purchase or job application. If the player is too far away, they get "You are too far from the City Hall." and are not charged. |
| `Config.RequireFreeWeight` | boolean | `true` | Refuses a licence purchase when the player's free inventory weight (`GetFreeWeight`) is `0` or less, even if the licence weighs nothing. `CanAddItem` is always checked, whatever this setting is. |
| `Config.ConfirmActions` | boolean | `true` | Shows a confirmation dialog before a purchase ("Purchase %s for $%s?") or job application ("Apply for the %s job?"). |
| `Config.GiveStarterItems` | boolean | `true` | Grants pending starter items after the first-character outfit is confirmed, and on spawn for characters that still have pending items. See [Items and starter items](./items.md). |
| `Config.AvailableJobs` | table | see below | Set of jobs players can apply for at any City Hall. The key is a `kora_core` shared job name, and the value is `true`. |
| `Config.Cityhalls` | array | one entry (Legion Square) | City Hall locations. See below. |

## Available jobs

```lua
Config.AvailableJobs = {
    trucker = true,
    taxi = true,
    tow = true,
    news = true,
    garbage = true,
    bus = true,
    hotdog = true,
}
```

The Job Center shows one card for each key. The card label is the shared job `label`, or the key if the job does not exist. Applying calls `exports.kora_multijob:addJob(src, job, 1)`, so each listed job needs a grade `1` in `kora_core`'s shared jobs. Every City Hall uses the same job list.

The server rejects applications for jobs that are not in this table.

## City Hall locations

`Config.Cityhalls` is a Lua array. The client sends each entry's index as the City Hall key, and the server looks up the location with that key.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `ped` | string | `'a_m_m_hasjew_01'` | Clerk ped model. If omitted, `a_m_m_hasjew_01` is used. |
| `scenario` | string | `'WORLD_HUMAN_STAND_MOBILE'` | Scenario the clerk plays. If omitted, `WORLD_HUMAN_STAND_MOBILE` is used. |
| `coords` | vector4 | `vec4(-264.28, -966.29, 30.22, 210.0)` | Clerk position and heading. The server also uses this position for distance checks. |
| `blipData` | table or nil | see below | Map blip. Set it to `nil` or leave it out to show no blip. |
| `blipData.sprite` | number | `487` | Blip sprite. |
| `blipData.display` | number | `4` | Present in the default config, but not passed to `Kora.blips.create`, so it has no effect. |
| `blipData.scale` | number | `0.65` | Blip scale. |
| `blipData.color` | number | `0` | Blip colour. |
| `blipData.title` | string | `'City Services'` | Blip label. |
| `licenses` | table | see below | Items sold at this City Hall. The key is the item name, and the value is `{ price = number }`. |
| `licenses.<item>.price` | number | `50` / `100` / `200` | Cash price. If the price is `0`, negative or not a number, the server refuses the purchase with "This licence is unavailable." |

Default licences:

| Item | Price |
| --- | --- |
| `id_card` | `50` |
| `driver_license` | `100` |
| `weaponlicense` | `200` |

### Example: a second location

```lua
Config.Cityhalls = {
    {
        ped = 'a_m_m_hasjew_01',
        scenario = 'WORLD_HUMAN_STAND_MOBILE',
        coords = vec4(-264.28, -966.29, 30.22, 210.0),
        blipData = { sprite = 487, display = 4, scale = 0.65, color = 0, title = 'City Services' },
        licenses = {
            id_card = { price = 50 },
            driver_license = { price = 100 },
            weaponlicense = { price = 200 },
        },
    },
    {
        coords = vec4(1702.0, 3780.0, 34.7, 120.0), -- example position
        licenses = {
            id_card = { price = 75 },
        },
        -- no blipData: no map blip
    },
}
```

Each location only sells the items listed in its own `licenses` table. Item metadata is built only for `id_card`, `driver_license` and `weaponlicense`. Other items get empty metadata. See [Items and starter items](./items.md).

## Locales

Strings are in `locales/*.lua`, which are listed as `files` in the manifest, and are read through `Kora.lang`. Useful keys in `locales/en.lua`:

| Key | English text |
| --- | --- |
| `menus.city_hall` | `City Hall` (target label, panel title, notification title) |
| `menus.city_hall_icon` | `fas fa-city` (target icon) |
| `menus.id_card` / `menus.id_card_desc` | Identity tab title and description |
| `menus.job_center` / `menus.job_center_desc` | Job Center tab title and description |
| `menus.license_cost` | `Price: $ %s` |
| `menus.confirm_purchase` / `menus.confirm_apply` | Confirmation texts |
| `notify.no_cash` / `notify.too_far` / `notify.inventory_full` | Error notifications |

Two notifications are hard-coded in English in `server/server.lua`: "This licence is unavailable." and "You have successfully applied for the job."
