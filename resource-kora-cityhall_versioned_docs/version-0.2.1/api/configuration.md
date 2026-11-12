---
title: "Configuration"
sidebar_position: 3
---


# Configuration

All settings live in one shared file. It is loaded on both client and server and wrapped with `Config = Kora.config.adopt(Config)` so kora_lib's configuration catalog knows it. Server checks use the server's copy; the client copy only drives the menu.

Namespace: `Config` · Source: `shared/config.lua`

## How it works

The file starts with `Config = Config or {}`. (There is no `Config.Jobs` table in the file; only the `asserts.job_doesnt_exist` locale text mentions that name.) Values are plain Lua and read at run time, so nothing is cached except what `Kora.config.adopt` does inside kora_lib (not covered here).

## Top-level options

Defaults as shipped. A `?` after a name means the option is optional.

| Option | Type | Description |
| --- | --- | --- |
| `Config.PurchaseDistance` | number (metres) | Default `5.0`. Maximum server-side distance between the player and the hall coordinates to accept a purchase or a job application. Too far: notification and nothing charged. |
| `Config.RequireFreeWeight` | boolean | Default `true`. Refuse a purchase when `GetFreeWeight` returns a number that is 0 or less, even though licenses weigh nothing. If `GetFreeWeight` raises or returns a non-number the check is skipped. |
| `Config.ConfirmActions` | boolean | Default `true`. Adds a confirmation prompt to the Purchase and Apply buttons. Client-side only. |
| `Config.GiveStarterItems` | boolean | Default `true`. Enables the starter-item hand-out on both client (event listeners) and server (`giveStarterItems`). |
| `Config.AvailableJobs` | table&lt;string, boolean \| table> | Default `{ trucker = true, taxi = true, tow = true, news = true, garbage = true, bus = true, hotdog = true }`. Names of jobs that can be applied for. `AddCityJob` stores a table `{ label, isManaged }` as the value; the server only tests whether the value is truthy. |
| `Config.Cityhalls` | table | List (or map) of hall definitions. The key of an entry is the `key` the client sends to the server. |

### Config.Cityhalls[key]

Fields of one hall entry.

| Option | Type | Description |
| --- | --- | --- |
| `ped?` | string | Ped model name. Falls back to `a_m_m_hasjew_01` in the client when missing. |
| `scenario?` | string | Scenario started on the ped. Falls back to `WORLD_HUMAN_STAND_MOBILE`. |
| `coords` | vec4 | Required. Ped position and heading `(x, y, z, w)`. The server also uses `x, y, z` as the center for the distance check. |
| `blipData?` | table | Optional map blip. When missing no blip is created. |
| `licenses` | table&lt;string, &#123; price: number &#125;> | Licenses sold here, keyed by item name. Without it the server asserts on any purchase at this hall. |

### blipData

Passed to `Kora.blips.create`.

| Option | Type | Description |
| --- | --- | --- |
| `sprite` | integer | Blip sprite (default hall: 487). |
| `scale` | number | Blip scale (default 0.65). |
| `color` | integer | Blip color (default 0). |
| `title` | string | Blip label (default "City Services"). Passed as `label`. |
| `display?` | integer | Present in the default config (4) but not read by the client code. |

### licenses[name]

Entry for one license.

| Option | Type | Description |
| --- | --- | --- |
| `price` | number | Cash price. `tonumber(price) or 0`; a result of 0 or less makes the license unavailable. Fractional prices pass here, but the cash removal in kora_core requires whole physical cash amounts when cash is a physical item. |

## Only three licenses have metadata

You can configure any item name under `licenses`, but `getLicenseInfo` only knows `id_card`, `driver_license` and `weaponlicense`. Anything else is sold with empty metadata.

## Prices and taxes

Cash is taken with `removeMoney(src, 'cash', price, 'cityhall id')` without the `ignoreTax` argument, so if kora_core's `Config.money.tax` is enabled the tax rules of kora_core apply to the purchase. Tax is disabled by default in kora_core.

## Limits and related APIs

The client copy of `Config` is not updated when a script calls `AddCityJob`. Changing `Config` at runtime in a server-only script has no effect on what clients show.

## Defaults and example

### Available jobs (default)

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

The Job Center shows one card for each key. The card label is the shared job `label`, or the key if the job does not exist. Applying calls `exports.kora_multijob:addJob(src, job, 1)`, so each listed job needs a grade `1` in `kora_core`'s shared jobs. Every City Hall uses the same job list. The server rejects applications for jobs that are not in this table.

### Default licence prices

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
