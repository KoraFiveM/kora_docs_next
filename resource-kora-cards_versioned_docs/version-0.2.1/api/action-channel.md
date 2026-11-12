---
title: "Server action channel"
sidebar_position: 2
---


# Server action channel

The entire authenticated client-to-server surface of this resource is one kora_lib callback, `kora_cards:server:action(action, payload)`, dispatched through a flat lookup table to the function modules below. It is rate-limited to 45 calls per 10-second window per player and refuses every action until boot finishes (`ready = true`, set after schema setup, catalog load and camera/draft cleanup).

Namespace: `kora_cards:server:action` · Source: `server/main.lua (handlers table, Kora.callback.register)`

## How it works

`action` must be a known key of the `handlers` table or the call fails with 'Unknown card action.' `payload` is coerced to `{}` if it is not a table. Several aliases exist for the private overlay's own vocabulary versus the AppShell's (`shopBuy`→`buyShop`, `activateDesign`→`activate`, `printDesign`→`print`, `archiveDesign`→`archive`, `cloneDesign`→`clone`), remapping `designId` to the underlying function's expected `id` field.

## Terms used on this page

| Term | Meaning |
| --- | --- |
| Operation | A row in `kora_cards_operations` (`print`, `deposit`, `withdrawal`, `shop`, `starter`, `reward`) written before an external side effect (inventory/bank) and finalized after, so `Database.recoverPlayer` can reconcile an interrupted flow at next login instead of duplicating or losing a card or a payment. |
| Locked hash | `kora_cards_designs.locked_hash`, set to the design's content hash the first time it is printed. `Catalog.reload()` refuses to serve a design whose content changed after that point. |

## Action payloads

The `payload` shape expected by each `action` key (aliases share a row with their canonical name).

| Option | Type | Description |
| --- | --- | --- |
| `snapshot / refresh` | no payload | Full player snapshot: binder, physical cards, decks (with legality), starter status, shop, studio info (if staff), rating, leaderboard (top 50), season name, active match state if any. |
| `claimStarter` | &#123; starter &#125; | `starter` is `street_circuit` or `harbor_guard` (the keys of `Config.starters`). Fails if a starter was already claimed by this character. |
| `deposit` | &#123; slot, printId &#125; | Moves a physical `trading_card` from the given inventory slot into the binder. Fails if the print is not `circulating`, already has a binder owner, or is bound. |
| `withdraw` | &#123; printId &#125; | Moves a binder print back into the inventory as a physical card. Fails if bound, locked into a saved deck, or inventory has no free slot. |
| `saveDeck` | &#123; deckId?, name, printIds &#125; | Creates or updates a deck. Validated against the 60-card / 4-copy / 24-point / 1-basic rules and that every print is in the caller's binder. |
| `deleteDeck` | &#123; deckId &#125; | Deletes a deck owned by the caller. Cards remain in the binder. |
| `buyShop` | &#123; id &#125; | Buys an active, shop-enabled, not-sold-out design, debiting the bank and delivering a new print to the binder. |
| `viewer` | &#123; printId &#125; or &#123; slot &#125; | Returns the design and print metadata for the full card viewer, including whether it is withdrawable. |
| `showNearby` | &#123; printId &#125; or &#123; slot &#125; | Same as viewer but broadcasts the card to every player within 5 metres and marks it non-withdrawable. |
| `buySupply` | &#123; item, amount &#125; | Studio-only (grade 1+, near the supply station). `item` is `card_film`, `blank_card` or `card_ink`; `amount` 1 to 20. Debits `Config.supplies[item].account` (cash by default). |
| `toggleDuty / checkoutCamera / capture` | studio actions | Clock in/out (near the duty point), check out the studio camera (removes any held camera first), request a capture (validates the checked-out camera token, needs `card_film` and `screenshot-basic` running). |
| `saveDraft / updateDraft` | &#123; designId, ...fields, crop? &#125; | Updates a draft's name, flavor text, element, archetype, evolution stage/predecessor, move names and crop. Only the owning photographer (or grade 3+) may edit; only grade 3+ may set a non-Basic stage. |
| `activate / activateDesign` | &#123; designId &#125; | Grade 2+. Rolls the permanent rarity, generates the rules template, archives the photo from temp to permanent storage, flips the design to `active`. |
| `print / printDesign` | &#123; designId &#125; | Grade 2+, near the printer. Consumes one `blank_card` and one `card_ink`, creates a physical `trading_card`. |
| `archive / archiveDesign` | &#123; designId &#125; | Grade 4 (Studio Manager) only. Refuses while any active design still evolves from it. |
| `clone / cloneDesign` | &#123; designId &#125; | Grade 3+ (Editor). Creates a new draft version (next collector number, version+1 slug) copying the source design's fields and photo. |
| `challenge` | &#123; target, deckId, mode &#125; | `target` server id of a nearby player (5 m); `mode` `casual` or `ranked`. Sends a 30-second challenge to the target. |
| `challengeRespond` | &#123; challengeId, accept, deckId? &#125; | Accepts (with the responder's own legal deck) or declines a pending challenge. |
| `matchAction` | &#123; matchId, expectedRevision, actionId, cardId?, targetId?, resourceIds? &#125; | Applies one turn-engine action to the caller's active match; see the Match engine module. |

## Functions

Every handler returns `result, err` (kora_lib callback convention): a truthy `result` table on success, or `nil, 'message'` on failure, which the client surfaces as a notification or an AppShell action-notice.

## Limits and related APIs

Studio actions additionally require the `cardstudio` job, being on duty, a minimum grade (1 for supplies/camera/editor access, 2 for activate/print, 3 for clone/evolution editing, 4 for archive) and, for several, proximity to the matching `Config.studio.locations` station (checked server-side, never trusted from the client).

## Related guides

- [Match engine](./match-engine.md)
- [Database tables](./database.md)
