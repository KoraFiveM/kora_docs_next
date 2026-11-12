---
title: Ranked and seasons
sidebar_position: 4
---

# Ranked and seasons

## Ranked matches

Ranked matches follow the normal [match rules](./matches.md), with these additions:

- An **active season** is required. If none exists, the challenge fails with "Ranked play is between seasons."
- **One ranked match per pair of characters per UTC day** in each season. `kora_cards_ranked_pair_days` enforces this when the match starts. If the match is later abandoned because of a server restart, that pair's row is deleted so they can play again.
- New ranked matches can't start for 60 seconds after an admin runs `/kora_cards_season preview`.

## Rating

Each player has one rating row per season, starting at **1000**. At the end of a ranked match both ratings are updated with the Elo formula, using `K = Config.match.eloK` (32). A draw counts as half a win. Wins, losses and matches played are recorded. A settlement row in `kora_cards_ranked_settlements` makes sure each match is settled only once.

## Win payouts

The winner of a ranked match receives `Config.match.rankedWinPayment` ($500) in the bank if all of these are true:

- the match lasted at least `rankedMinimumTurnsForPayout` (6) completed turns
- it lasted at least `rankedMinimumSecondsForPayout` (180) seconds
- the winner has received fewer than `rankedPaidWinsPerUtcDay` (5) paid wins today (UTC)

The payout is stored as a pending reward (key `match:<id>`) and paid out straight away if the winner is online. Otherwise it is paid the next time they load in.

## Ranked tab

The Ranked tab shows the season name, your rating, wins and losses, how many placement matches you have played (out of 5), and a **top 50** leaderboard sorted by rating and then wins. Names come from the kora_core `players` table.

## Seasons

The launch season, `Launch Season`, is seeded when the resource first starts. A database guard allows only one active season at a time.

To end a season, an admin runs:

```text
/kora_cards_season preview
/kora_cards_season close
```

`close` must follow within 60 seconds. See [Commands](../commands.md#kora_cards_season) for the safety checks. When the season closes:

- The top three players with at least `Config.season.placementMinimumMatches` (5) ranked matches receive pending bank rewards from `Config.season.rewards` (15000, 10000, 5000). Each reward has the key `season:<id>:rank:<n>`, so it can't be paid twice.
- The season is marked `closed`, and `Season <n>` (the closed season's ID + 1) becomes active. Ratings start again at 1000 in the new season.

Pending rewards are paid to the bank account when the player next loads in. The payment is recorded in the operation journal so a crash can't pay it twice. See [Database](../api/database.md#kora_cards_pending_rewards).
