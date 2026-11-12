---
title: Catalog authoring
sidebar_position: 5
---

# Catalog authoring

Card designs are stored in `kora_cards_designs`. Official cards are written by hand in the database. Studio cards are created through photography. Either way, they all go through the same validator, in `server/catalog.lua` and `shared/rules.lua`.

## Loading and reloading

The catalog is loaded when the resource starts and reloaded after each studio change, print and shop purchase. Admins can also reload it with `/kora_cards_reload`. Each reload builds a staging cache and only replaces the live catalog if **every** check passes:

- no duplicate `id`, and no duplicate `slug` + `version`
- `slug` matches `[a-z0-9_-]+`, and `name` is 1–32 characters
- active designs pass `Rules.validateDesign` (see below)
- if `locked_hash` is set, it equals the hash of the design's current content
- `predecessor_id`, when set, points to an existing design
- `image_key` and `image_path` are both set or both empty. When set, the file must be a valid WebP no larger than `Config.capture.maxBytes`.
- the evolution graph passes: Basic Units have no predecessor, a Stage 1 evolves from an active Basic and a Stage 2 from an active Stage 1, with the same element and no cycles

If the catalog is rejected when the server starts, the resource stays not ready. The console shows `catalog rejected`, and every callback returns "still loading".

A design can be looked up by `id`, or by `slug` (which returns the highest version).

## Adding an official card

1. Optional: put the artwork at a safe generated name under `storage/catalog/`, for example `storage/catalog/cls-028-art.webp`. It must be a WebP file of at most 2.5 MiB. Names must match `[a-z0-9-]+.webp`.
2. Insert a complete `kora_cards_designs` row. Set `status = 'active'`, a unique `slug`/`version` and `set_code`/`collector_number`, plus `rarity`, `deck_points`, `print_limit` (0 means unlimited), `prize_value`, `rules_json`, `shop_enabled` and `shop_price`. If you have artwork, set `image_key` (for example `cls-028-art`) and `image_path` (`storage/catalog/cls-028-art.webp`).
3. Run `/kora_cards_reload` and check the notification.

Once a tradable print of the design succeeds, its content hash is **locked**. After that, changing any content field (name, flavor, kind, element, archetype, stage, predecessor, moves, rarity, deck points, print limit, prize value, rules, crop or image key) makes every reload fail. To revise a card, insert a new design or version.

## Rules vocabulary

Allowed values:

| Field | Values |
| --- | --- |
| `kind` | `Unit`, `Resource`, `Item`, `Tactic`, `Gear`, `Venue` |
| `element` | `Heat`, `Tide`, `Volt`, `Wild`, `Mind`, `Shadow`, `Neutral` |
| `archetype` | `Striker`, `Guardian`, `Medic`, `Trickster` |
| `stage` | 0 (Basic), 1 (Stage 1), 2 (Stage 2) |
| `rarity` | `Common`, `Uncommon`, `Rare`, `Epic`, `Legendary` |

Units need an element, an archetype and a stage, and two move names of 1–24 characters. The name may be up to 32 characters and the flavor text up to 120 characters.

### Unit rules

```json
{
  "hp": 90,
  "retreatCost": 2,
  "weakness": "Volt",
  "resistance": { "element": "Heat", "amount": 30 },
  "prizeValue": 1,
  "attacks": [
    { "cost": { "any": 1 }, "damage": 10, "effects": [] },
    { "cost": { "any": 2 }, "damage": 30, "effects": [] }
  ]
}
```

| Key | Constraint |
| --- | --- |
| `hp` | Multiple of 10, from 10 to 400 |
| `retreatCost` | Integer, 0–5 |
| `weakness` | Optional element |
| `resistance` | Optional. `element` must be a valid element and `amount` must be exactly 30. |
| `prizeValue` | Integer, 1–3 |
| `attacks` | One or two attacks |
| `attacks[].cost` | Object whose keys are `any` or an element and whose values are 0–5. The total must be 1–5. |
| `attacks[].damage` | Integer, 0–300 |
| `attacks[].effects` | Up to 8 effects |

### Resource rules

```json
{ "basic": true, "provides": "Heat" }
```

Basic resources (`basic: true`) have no copy limit in decks.

### Item, Tactic, Gear and Venue rules

```json
{ "effects": [ { "op": "draw", "target": "self", "amount": 2 } ] }
```

Any field not listed below is rejected.

| `op` | Fields | Constraint |
| --- | --- | --- |
| `draw` | `target`, `amount` | amount 1–5 |
| `search` | `target`, `amount`, `kind`, `element`, `stage`, `destination` | amount 1–4. `destination` is `hand` or `discard`. |
| `damage` / `heal` | `target`, `amount` | amount 0–200 |
| `attach_resource` / `discard_resource` | `target`, `amount`, `element` | amount 1–3 |
| `switch` | `target` | `self` or `opponent` |
| `apply_status` | `target`, `status` | `Poisoned`, `Burned`, `Asleep`, `Paralyzed`, `Confused` |
| `modifier` | `target`, `stat`, `amount`, `duration` | `stat` is `damage`, `received_damage`, `retreat_cost` or `attack_cost`. `amount` is -50 to 50. `duration` is `this_attack`, `until_end_turn`, `until_next_turn`, `attached` or `venue`. |

Valid targets: `self`, `opponent`, `self_active`, `opponent_active`, `chosen_friendly`, `chosen_opponent`, `attached`, `all_friendly`, `all_opposing`.

Gear modifiers with `duration = 'attached'` last while the gear is attached. Venue modifiers with `duration = 'venue'` apply while that venue is in play.

## Media storage and HTTP handler

| Directory | Contents | Committed |
| --- | --- | --- |
| `storage/tmp/` | Draft captures and clone copies | no (git-ignored) |
| `storage/cards/` | Activated studio artwork | no (git-ignored). **Back this up with the database.** |
| `storage/catalog/` | Artwork for hand-written catalog cards | yes, and listed in `fxmanifest.lua` `files` |

The resource registers a GET-only HTTP handler that serves registered media keys:

```text
http://<server endpoint>/kora_cards/media/<image_key>.webp
```

Only keys the server has registered (from the catalog, captures and clones) are served. Any other key returns 404, and any method other than GET returns 405. Artwork in `cards/` and `catalog/` is sent with an immutable one-year cache header, and drafts with a private 60-second cache. When clients reach the server through a reverse proxy, set `Config.capture.publicBaseUrl` to the public base URL.
