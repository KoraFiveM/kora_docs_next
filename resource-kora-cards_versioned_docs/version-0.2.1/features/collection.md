---
title: Collection and decks
sidebar_position: 2
---

# Collection and decks

## Serialized prints

Every card is one row in `kora_cards_prints`. The print UUID is the only identity the server trusts, and it is copied into the `printId` metadata of a physical `trading_card`. A print is always in one of these places:

- **Binder** (`state = 'binder'`): in a character's account binder. Only binder prints can be added to decks or used in matches.
- **Circulating** (`state = 'circulating'`): a physical `trading_card` in some inventory. It can be traded, dropped or given through kora_inventory.
- **In transfer**: `printing`, `purchasing`, `depositing` or `withdrawing`, while an operation is in progress. See [Database recovery](../api/database.md#recovery).

Prints come from three sources:

| Source | Delivered to | Bound |
| --- | --- | --- |
| Studio printing | Printer's inventory (physical) | no |
| Shop purchase | Buyer's binder | no |
| Starter claim | Claimer's binder | yes |

## Starter decks

Each character can claim **one** starter, which `kora_cards_starter_claims` enforces. The Binder tab offers **Street Circuit** and **Harbor Guard** (see [Configuration](../api/configuration.md#starters-configstarters)). A claim:

- creates 60 bound prints with serials `CLS-NNN-S<8 hex>` in the binder
- creates a starter deck named after the starter, holding those 60 prints

Bound prints can't be withdrawn and never exist as physical cards. Starter prints don't use up the print caps of their designs, but they do set `locked_hash` on each design.

## Binder

The Binder tab shows:

- totals: binder prints, physical cards, saved decks and ranked rating
- the starter buttons, if this character hasn't claimed one yet
- **Cards in your pockets**: every `trading_card` in your inventory, with View and Deposit. Cards that can't be verified are marked "Unverified" and have no actions.
- **Exact serialized prints**: every binder print, with View, and Withdraw for unbound prints

### Deposit

Removes the exact physical card from its inventory slot and adds the print to your binder. The print has to be `circulating`, not in any binder and not bound.

### Withdraw

Adds a physical `trading_card` with the print's metadata to your inventory and removes the print from your binder. This isn't possible for bound prints or for prints that are in **any saved deck**. Take the print out of those decks first.

## Shop

The Shop tab lists every **active** design with `shop_enabled = 1` and a price of 1 or more.

- You must be within `Config.studio.actionDistance` of the `publicShop` location to buy.
- The price is taken from your **bank** account.
- Each purchase allocates a new serialized print, delivered straight to your binder. Capped designs show how many prints are left and can sell out for good. Uncapped designs show "Unlimited".
- If allocation fails after payment, the money is refunded.

Any player can browse the shop. You don't need the job.

## Card viewer

View opens a full-screen card that shows the serial, element, rarity, type and deck points.

- **Show nearby** sends the card to every player within 5 m, including you.
- **Withdraw physical card** appears for unbound binder prints that you own.
- Using a `trading_card` item opens the viewer for that print.

## Decks

The deck workshop (Decks tab) and the Deck Builder view build decks from exact binder prints.

Deck rules (checked again on the server when you save and when a match starts):

- exactly **60** cards
- each print can only appear once
- every print must be in your binder, and every design must be **active**
- at most **4** copies of a design, except basic Resources (`rules.basic = true`), which have no limit
- at least **one Basic Unit**
- at most **24** rarity points in total, from each design's `deck_points`

The builder shows the card count, rarity points and number of Basic Units as you build, and only enables Save when the deck looks legal. Deck names can be up to 32 characters. Deleting a deck leaves its cards in your binder. The starter deck can be edited, but deleting it fails because the database's starter-claim row still references it (the foreign key is `ON DELETE RESTRICT`).

If a design is archived later, any deck that contains it becomes illegal and can't be used to play.
