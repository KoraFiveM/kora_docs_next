---
title: "Configuration"
sidebar_position: 2
---


# Configuration

`shared/config.lua` is loaded as a shared script (both realms read the same table) before the client/server scripts, and is registered with kora_lib's config module at the bottom of the file (`Config = Kora.config.adopt(Config)`), which is what lets `Config.ResetTime` be supplied or changed through a `config.local.lua` override without editing this file.

Namespace: `Config` · Source: `shared/config.lua`

## How it works

Most options are read live at the point they matter (police count on every event, weapon table on every smash attempt, reward table on every `vitrineReward`), so an edit followed by a resource restart takes effect immediately for the next attempt — there is no cached snapshot taken at boot beyond `Config.Locations[i].isOpened/isBusy`, which are explicitly reset to `false` once when the server script loads.

## Options

Every key the shipped `shared/config.lua` declares. A `?` after a name means the option is optional.

| Option | Type | Description |
| --- | --- | --- |
| `Config.Timeout` | integer (ms) | Default `(60 * 1000) * 30` = 1,800,000 ms (30 minutes). How long after the first alarm the entire store (alarm + every case's `isOpened`/`isBusy`) resets. Read by `reset()` only when `Config.ResetTime` is `nil`. |
| `Config.ResetTime?` | integer \| false \| 0 \| nil | Not present in the shipped file (so `nil`). When a resource-local override file (`config.local.lua`, adopted through `Kora.config.adopt` from kora_lib) sets it, `reset()` uses that value instead of `Config.Timeout` on every alarm, including an explicit `false` or `0`. Unclear: the exact override/live-reload mechanics belong to kora_lib's config-adoption module, not to this resource's own source; `test/smoke/reset_timeout.lua` confirms the fallback behavior described here but does not exercise kora_lib internals beyond that. |
| `Config.RequiredCops` | integer | Default `2`. Minimum players on duty for the `leo` job (`exports.kora_core:getDutyCountByType('leo')`) required to arm the alarm, claim a case, or collect a reward. Checked independently at all three points. |
| `Config.JewelleryLocation` | vector3 | Default `vector3(-630.5, -237.13, 38.08)`. Only used for the client blip ("Vangelico Jewelry", sprite 617) — purely cosmetic/navigational, not a distance check. |
| `Config.WhitelistedWeapons` | table&lt;weapon hash, integer> | Map of weapon model hashes (rifles, shotguns, SMGs and pistols in the shipped config) to a smash duration in ms (all `10000` by default). A weapon not in this table fails `validWeapon()` client-side ("Your weapon is not strong enough.."); the mapped value is also the duration passed to the smashing progress bar. |
| `Config.VitrineRewards` | array of &#123; item, amount = &#123; min, max &#125;, probability &#125; | Default four entries: `rolex` (0.4), `diamond_ring` (0.3), `goldchain` (0.2), `tenkgoldchain` (0.1), each with `amount.min = 1` and `amount.max = 4`. Rolled by cumulative probability in `getRewardBasedOnProbability`; if the random roll exceeds the cumulative sum of all entries (probabilities do not have to add to 1), it falls back to `math.random(#table)` and picks any entry uniformly instead. |
| `Config.Locations` | array of &#123; coords, offset, size &#125; | 20 shipped vitrines. `coords`/`size` (a vector4 whose `w` is the box-zone rotation) define the `kora_target` interaction zone; `offset` (a vector4: x, y, z, heading) is where and which way the player is teleported for the smash animation to line up with the case model. Index into this array is the `locationId`/`k` used by every event above. |

## Functions

All options live directly on `Config` — there is no nested options table in this resource.

## Limits and related APIs

Shared script: both client and server load the same values, but only the server enforces `RequiredCops`; the client's own `validWeapon()`/weapon-duration lookups and `kora_target` zone geometry are purely local conveniences that the server re-validates independently where it matters (distance, police count, case state).

## Additional notes from the code


### Reset behaviour

`Config.ResetTime` is not declared in the shipped config. If it is set at runtime (not nil), the server uses it instead of `Config.Timeout` for the reset delay; it is a legacy fallback that is not exposed through `kora_lib` overrides.

The reset timer is only started by the first alarm. Cases opened without an alarm are not reset until an alarm is raised and its timeout elapses.

### Whitelisted weapons (details)

```lua
Config.WhitelistedWeapons = {
    [`weapon_pistol`] = 10000,
}
```

The key is the weapon hash and the value is the progress bar duration in milliseconds. The shipped list (all `10000`): assault rifle, carbine rifle, pump shotgun, sawn-off shotgun, compact rifle, micro SMG, auto shotgun, pistol, pistol MK2, combat pistol, AP pistol and pistol .50. If the value is missing the client falls back to 15000 ms, but only listed weapons can start a smash.

### Vitrine rewards (details)

```lua
Config.VitrineRewards = {
    { item = 'rolex', amount = { min = 1, max = 4 }, probability = 0.4 },
}
```

Each entry has the item name, an `amount` range (random integer) and a `probability`. The server adds the probabilities in order and picks the first entry whose running total is at or above a random number between 0 and 1. If the probabilities sum to less than 1 and the roll exceeds the total, a random entry is chosen. Defaults are in [Items](../items.md).

### Locations (keys and runtime state)

`Config.Locations` is a list of display cases. Each entry has:

| Key | Description |
| --- | --- |
| `coords` | `vector3` centre of the target box zone. Server distance checks (5.0 m) use this position. |
| `offset` | `vector4` (x, y, heading in w) where the player is placed while smashing. The Z used is `coords.z - 1`. |
| `size` | `vector4` of box size x, y, z and heading (w). The client passes `size.w` as the zone rotation. |

The server adds `isOpened` and `isBusy` to every entry at start and keeps them current. The list index is the case id used in events, and is shown in the target label.

### Locales

Strings come from `locales/*.lua` (`ar`, `cs`, `da`, `de`, `en`, `es`, `nl`, `pt-br`, `tr`) via `Kora.lang`. See [Troubleshooting](../troubleshooting.md#some-messages-are-not-translated) for incomplete translations. The blip name and description are hardcoded in English in `client/client.lua`.
