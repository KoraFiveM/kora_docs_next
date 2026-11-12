---
title: Database
sidebar_position: 6
---

# Database

The schema is defined in `server/schema.lua` (`KoraCardsSchema`) and applied at start with `Kora.sql.ensureTables`. Changes are only ever added: missing tables, columns and indexes are created, and nothing is dropped. Schema warnings are printed to the server console. All tables use `utf8mb4_unicode_ci`. You don't need to import any SQL file.

Seeds (run once):

- `kora_cards_designs`: the 27-design City Legends launch catalog (set `CLS`, collector numbers 1–27). These designs are active and for sale in the shop, and have unlimited prints (`print_limit = 0`) and no artwork.
- `kora_cards_seasons`: `Launch Season`, active.

The leaderboard also reads the `players` table owned by kora_core (`citizenid`, `name`).

## kora_cards_designs

Catalog designs, both authored and photographed.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | varchar(64) PK | Design ID. Seeds use readable IDs such as `street_runner`. Studio designs use UUIDs. |
| `slug` | varchar(64) | Must match `[a-z0-9_-]+`. Unique together with `version`. |
| `set_code` | varchar(8) | Default `CLS` |
| `collector_number` | int unsigned | Unique together with `set_code` |
| `version` | int unsigned | Default 1 |
| `name` | varchar(64) | Catalog validation allows at most 32 characters |
| `flavor_text` | varchar(255) | |
| `kind` | enum | `Unit`, `Resource`, `Item`, `Tactic`, `Gear`, `Venue` |
| `element` | enum, null | `Heat`, `Tide`, `Volt`, `Wild`, `Mind`, `Shadow`, `Neutral` |
| `archetype` | enum, null | `Striker`, `Guardian`, `Medic`, `Trickster` |
| `stage` | tinyint, null | 0 Basic, 1 Stage 1, 2 Stage 2 |
| `predecessor_id` | varchar(64), null | Design this unit evolves from |
| `move_one`, `move_two` | varchar(64), null | Cosmetic attack names |
| `rarity` | enum, null | `Common`, `Uncommon`, `Rare`, `Epic`, `Legendary` |
| `deck_points` | tinyint | Rarity points counted toward the deck limit |
| `print_limit` | int, null | Lifetime print cap. `0` or `NULL` means unlimited. |
| `printed_count` | int | Prints allocated so far |
| `prize_value` | tinyint | Default 1 |
| `rules_json` | longtext | Mechanics (see [Catalog authoring](./features/catalog.md)) |
| `crop_json` | longtext, null | Portrait crop as `x`, `y` (0–1) and `zoom` (1–3) |
| `image_key`, `image_path` | varchar, null | Opaque media key and the path under `storage/`. Set both or neither. |
| `status` | enum | `draft`, `active`, `archived` |
| `shop_enabled` | tinyint(1) | Shown in the shop |
| `shop_price` | int, null | Bank price |
| `content_hash` | varchar(64), null | Hash calculated when a studio design is activated |
| `locked_hash` | varchar(64), null | Set on the first print. Any later change to the content is rejected. |
| `created_by` | varchar(64) | Citizen ID, or `catalog` for seeds |
| `created_at`, `updated_at` | timestamp | |

## kora_cards_prints

One row per serialized card.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | char(36) PK | Print UUID (stored as `printId` in item metadata) |
| `design_id` | varchar(64) | FK to `kora_cards_designs.id` (`ON UPDATE CASCADE`) |
| `print_number` | int | Sequential number for capped prints. Random for starter prints. |
| `serial` | varchar(40), unique | `SET-NNN-PPP/LLL` (`LLL` is `999` when unlimited), or `SET-NNN-S<hex>` for starters |
| `state` | enum | `pending`, `printing`, `purchasing`, `circulating`, `depositing`, `binder`, `withdrawing`, `retired` |
| `binder_owner` | varchar(64), null | Citizen ID while the print is in a binder |
| `bound` | tinyint(1) | 1 for account-bound starter prints |
| `source` | enum | `studio`, `shop`, `starter`, `admin` |
| `operation_id` | char(36), null | Linked journal operation while a transfer is in progress |
| `created_at`, `updated_at` | timestamp | |

## kora_cards_binder

| Column | Type | Notes |
| --- | --- | --- |
| `print_id` | char(36) PK | FK to the print (`ON DELETE CASCADE`) |
| `citizenid` | varchar(64) | Owner |
| `bound` | tinyint(1) | |
| `deposited_at` | timestamp | |

## kora_cards_decks and kora_cards_deck_cards

| Table | Column | Notes |
| --- | --- | --- |
| `kora_cards_decks` | `id` char(36) PK, `citizenid`, `name` varchar(48), `mode` (`constructed`/`starter`), `is_starter`, `created_at`, `updated_at` | |
| `kora_cards_deck_cards` | `deck_id`, `print_id` (composite PK), `position` (unique per deck) | FK to the deck (`ON DELETE CASCADE`) and to the print (`ON DELETE RESTRICT`) |

## kora_cards_starter_claims

| Column | Type | Notes |
| --- | --- | --- |
| `citizenid` | varchar(64) PK | One claim per character |
| `starter_key` | varchar(32) | Key in `Config.starters` |
| `deck_id` | char(36), unique | FK to the starter deck (`ON DELETE RESTRICT`) |
| `claimed_at` | timestamp | |

## kora_cards_seasons

| Column | Type | Notes |
| --- | --- | --- |
| `id` | int auto increment PK | |
| `name` | varchar(64) | |
| `status` | enum | `active`, `closed` |
| `started_at`, `closed_at` | timestamp | |
| `closed_by` | varchar(64), null | Citizen ID of the admin |
| `active_unique_guard` | generated | Unique index that allows only one active season |

## kora_cards_ratings

Primary key `(season_id, citizenid)`. Columns: `rating` (default 1000), `wins`, `losses`, `matches_played`, `paid_wins_today`, `paid_wins_date`, `updated_at`. FK to the season (`ON DELETE CASCADE`).

## kora_cards_ranked_pair_days

Allows one ranked match per character pair per UTC day in each season. Primary key `(season_id, play_date, pair_low, pair_high)`. Other columns: a unique `match_id`, `created_at`, and the generated unique column `pair_day_unique_guard`.

## kora_cards_matches

| Column | Notes |
| --- | --- |
| `id` | Match UUID |
| `season_id` | Ranked season, `NULL` for casual matches |
| `mode` | `casual` or `ranked` |
| `player_one`, `player_two`, `winner`, `loser` | Citizen IDs |
| `win_reason` | Engine end reason (see [Matches](./features/matches.md#how-a-match-ends)) or `server_restart` |
| `turns_completed`, `duration_seconds` | |
| `started_at`, `completed_at` | `completed_at IS NULL` means the match is still running |
| `rating_one_before/after`, `rating_two_before/after` | Ranked only |
| `payout_amount` | Ranked win payout |
| `state_json` | Serialized engine state, used to restore the match after a restart |

## kora_cards_ranked_settlements

One row per settled ranked match (`match_id` PK). It stores the rating changes and payout so that a match is never settled twice.

## kora_cards_pending_rewards

| Column | Notes |
| --- | --- |
| `id` | bigint auto increment |
| `citizenid`, `season_id`, `amount`, `reason` | |
| `payout_key` | Unique: `season:<id>:rank:<n>` or `match:<id>` |
| `state` | `pending`, `paying`, `paid` |
| `operation_id`, `created_at`, `paid_at` | |

Pending rewards are paid to the bank when the player loads in, and straight after a ranked win that pays out.

## kora_cards_operations

The journal used for crash-safe item, card and money transfers.

| Column | Notes |
| --- | --- |
| `id` | UUID |
| `kind` | `print`, `deposit`, `withdrawal`, `shop`, `starter`, `reward` |
| `citizenid` | |
| `state` | `prepared`, `external_done`, `inventory_applied`, `database_applied`, `complete`, `reversed`, `needs_review`, `failed` |
| `payload_json` | Snapshot taken before the operation, such as supply counts or the bank balance |
| `error_text`, `attempts`, `created_at`, `updated_at` | |

### Recovery

When a player loads in, up to 25 of their operations that are not `complete`, `reversed` or `failed` are processed:

- **print**: if the physical card exists, the print is finalized. Otherwise any blank card and ink that were used are refunded and the allocated print is rolled back.
- **deposit**: if the physical card is still in the inventory, the deposit is reversed. Otherwise the print is placed in the binder.
- **withdrawal**: if the physical card exists, the binder link is removed. Otherwise the print goes back to the binder.
- **shop**: if a print was allocated, it is delivered to the binder. Otherwise the price is refunded when the bank balance shows it was charged.
- **reward**: compares the bank balance with the balance recorded before payment to decide whether to mark the reward paid or return it to pending.

If the outcome is unclear, the operation is marked `needs_review` with an `error_text` for an admin to resolve by hand. See [Troubleshooting](./troubleshooting.md).

### Server start

Unfinished matches (`completed_at IS NULL`) are restored from `state_json`. Matches that can't be restored are closed with `win_reason = 'server_restart'`, and their ranked pair-day row is deleted.
