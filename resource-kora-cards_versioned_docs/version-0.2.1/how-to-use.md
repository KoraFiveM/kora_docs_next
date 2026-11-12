---
title: "How to use"
sidebar_position: 3
---


# How to use

Everything funnels through one kora_lib AppShell app (`kora_cards:city-legends`) with Binder, Decks, Play, Shop, Studio (only shown to on-duty Card Studio staff) and Ranked views, plus a private overlay frame for the full card viewer, portrait editor and live duel.

## Player walkthrough

1. **Open the app** — `/cards` (chat-suggested) opens the Binder view. `kora_target` zones placed by `client/main.lua` also open specific views: Clock In/Out, Card Studio Locker, Buy Studio Supplies, Open Card Editor, Use Card Printer, Browse City Legends (shop) and Open Duel Table, all positioned from `Config.studio.locations` and `Config.studio.duelZone`.

2. **Claim a starter deck** — A character with no claimed starter sees a one-time choice between the two `Config.starters` decks (Street Circuit, an aggressive Heat deck; Harbor Guard, a defensive Tide deck), each an exact 60-card, account-bound deck added straight to the binder (`claimStarter`). Only one starter per character, enforced by the `kora_cards_starter_claims` primary key on `citizenid`.

3. **Binder** — Lists every exact serialized print the character's citizen ID owns (`kora_cards_binder`/`kora_cards_prints`), plus any `trading_card` items physically in the inventory. A physical card can be Deposited into the binder; an unbound binder card can be Withdrawn back into the inventory as a physical item (bound starter cards cannot be withdrawn, and a print used in a saved deck must be removed from every deck first).

4. **Shop** — Lists active, shop-enabled designs with a shop price. Buying debits the bank account and delivers a new serialized print directly into the binder (never through the inventory).

5. **Decks** — Build or edit a deck from binder prints. A deck must contain exactly 60 cards, at least one Basic Unit, no more than four copies of the same design (unlimited for basic Resource cards), and at most 24 total rarity points. Only decks that satisfy this are legal to play.

6. **Play** — Pick a legal deck and challenge the nearest player within 5 metres as Casual or Ranked. The target sees the challenge for 30 seconds and can accept with one of their own legal decks or decline. Both players must be within the configured duel zone, alive, unrestrained, outside a vehicle and out of recent weapon combat (15-second cooldown after any hit).

7. **Duel** — Once accepted, both clients are frozen and invincible (`kora_cards:client:duelLock`) and the private overlay frame takes over with the live match state (hand, active unit, bench, venue, legal actions, turn timer). Leaving the duel zone, dying, entering a vehicle or being restrained forfeits the match for that player. A 90-second per-turn clock and a 120-second disconnect grace period apply; a draw or three-prizes-taken / all-prizes-taken / no-replacement condition ends the match.

8. **Studio (job)** — Card Studio staff (`cardstudio` job) clock in near the duty point, check out a studio camera (one at a time, tied to a one-time issue token so only the checking-out player can use it), and spend one `card_film` to take a portrait with the in-game camera (zoom 20-70mm). A successful capture consumes the film, saves a WebP under the 2.5 MiB limit, and creates a new draft card design owned by that staff member.

9. **Studio (editing and activation)** — A draft's editor (own drafts at grade 1+, any draft at grade 3 Editor+) sets name, flavor text, element, archetype, evolution stage/predecessor and crop, then an Editor-or-above (grade 2+) activates it: this rolls a permanent rarity, locks in deck points and a lifetime print cap, generates the attack/effect template from stage+rarity+archetype, and moves the photo from temporary to permanent storage. Only a Studio Manager (grade 4) can archive a design (blocked while an active card still evolves from it).

10. **Printing** — Grade 2+ staff near the printer station consume one `blank_card` and one `card_ink` to print one physical `trading_card` of an active design, up to its lifetime print cap. Every print gets a unique serial `SET-###-###/limit`.

11. **Ranked and seasons** — Ranked matches use an ELO-style rating (K=32, starting 1000) and pay $500 to the winner (daily cap of 5 paid wins per UTC day) once a match reaches 6 turns and 180 seconds. One ranked match per ordered character pair per UTC day is enforced by a unique index. Admins preview then close a season with `/kora_cards_season`, which pays the top 3 placed characters (5+ matches) $15000/$10000/$5000 as pending bank rewards and opens the next season.

## Architecture

- Client (`client/main.lua`): builds the kora_lib AppShell app definition (`appDefinition`) from the latest server snapshot, decorates design image URLs and match state for display, and runs the private overlay frame (viewer, editor, match) plus the in-game camera minigame and duel-lock freeze/invincibility loop. It trusts nothing it displays without a round trip to the server.
- Server action channel (`server/main.lua`): a single kora_lib callback `kora_cards:server:action` dispatches a flat `handlers` table (`snapshot`, `claimStarter`, `deposit`, `withdraw`, `saveDeck`, `deleteDeck`, `buyShop`, `viewer`, `showNearby`, `buySupply`, `toggleDuty`, `checkoutCamera`, `capture`, `saveDraft`/`updateDraft`, `activate`/`activateDesign`, `print`/`printDesign`, `archive`/`archiveDesign`, `clone`/`cloneDesign`, `challenge`, `challengeRespond`, `matchAction`), rate-limited to 45 calls per 10 seconds per player.
- Catalog (`server/catalog.lua`): the authoritative, validated in-memory card catalog (`KoraCards.Catalog`), reloaded from `kora_cards_designs` after every mutation. Rejects duplicate slugs/ids, invalid rules, dangling evolution predecessors, and content that no longer matches a design's `locked_hash` (set the moment it is first printed, so a printed card's mechanics can never silently change).
- Cards (`server/cards.lua`): binder/print lifecycle — print allocation, deposit, withdraw, deck save/delete/validate, starter claim, shop purchase, card viewer, nearby card reveal, and the full player snapshot sent to the client.
- Studio (`server/studio.lua`): job/duty/camera checkout, photo capture, draft editing, activation (rarity roll + template generation via `shared/rules.lua`), printing (delegates to Cards), archive and clone.
- Matches (`server/matches.lua`) + engine (`shared/match.lua`): challenge/respond, the authoritative turn-based match engine (deck validation, legal-action generation, attacks, effects, knockouts, promotion, ranked ELO settlement, disconnect/reconnect, crash recovery by replaying persisted `state_json`).
- Storage (`server/storage.lua`): safe relative-path helpers for draft/card WebP images, a built-in `SetHttpHandler` that serves `/media/<key>.webp` and `/kora_cards/media/<key>.webp` for registered image keys only, and byte/size/RIFF-header validation (max 2.5 MiB by default).
- Every money- or inventory-affecting flow (print, deposit, withdraw, shop purchase, season reward payout) first inserts a row into `kora_cards_operations`, performs the external side effect (inventory add/remove, bank debit/credit), then finalizes the database state in one transaction; `server/database.lua`'s `Database.recoverPlayer` replays unfinished operations on login so an interrupted print, deposit, withdrawal or purchase is refunded or completed instead of duplicated or lost.

## Open the UI or a card from another resource

Kora Cards exposes no `exports`. The only integration points are the client net events it listens for; they are not validated against the caller, so trigger them only from trusted server code.

```lua title="server.lua"
-- Server: open a player's City Legends binder from another resource
TriggerClientEvent('kora_cards:client:open', src, 'binder')
```

- `TriggerClientEvent('kora_cards:client:open', target, view)` opens the AppShell app at a given view id (`binder`, `decks`, `play`, `shop`, `studio`, `ranked`); if the player is in an active match it opens the match overlay instead regardless of the requested view.
- `TriggerClientEvent('kora_cards:client:showCard', target, view)` pops the private viewer overlay for a specific print/design, used for the 5-metre 'show nearby players' feature.
