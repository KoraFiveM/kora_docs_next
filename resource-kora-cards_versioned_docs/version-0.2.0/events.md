---
title: Events and callbacks
sidebar_position: 5
---

# Events and callbacks

Kora Cards has **no exports** and **no server net events**. Clients send every mutation through a single kora_lib callback, and the server pushes state to clients with net events.

## Server callback: `kora_cards:server:action`

Registered with `Kora.callback.register` and rate-limited to 45 calls per 10 seconds. It is called as `Kora.callback.trigger('kora_cards:server:action', action, payload)`. Until the schema and catalog have loaded, it returns `nil, 'Kora Cards is still loading.'`. Each handler returns a result table, or `nil` and an error message.

**Internal.** This is the resource's own UI channel. The server checks job, grade, duty, station distance, ownership and match seat on every action, but other resources should not call it. It is listed here for reference and debugging.

| Action | Payload | Effect |
| --- | --- | --- |
| `snapshot`, `refresh` | none | Returns the player's full UI snapshot: binder, physical cards, decks, starters, shop, Studio data, rating, leaderboard and active match |
| `claimStarter` | `starter` | Claims a starter deck |
| `deposit` | `slot` | Moves a physical `trading_card` into the binder |
| `withdraw` | `printId` | Moves a binder print into the inventory |
| `saveDeck` | `deckId` or `id`, `name`, `printIds` | Creates or updates a deck |
| `deleteDeck` | `deckId` or `id` | Deletes a deck |
| `buyShop` / `shopBuy` | `id` / `designId` | Buys a print from the shop |
| `viewer` | `printId` or `slot` | Returns a verified print and its design |
| `showNearby` | `printId` or `slot` | Shows the card to every player within 5 m, including the sender |
| `buySupply` | `item`, `amount` | Buys studio supplies |
| `toggleDuty` | none | Clocks in or out at the duty station |
| `checkoutCamera` | none | Issues a studio camera |
| `capture` | `slot` | Takes a photo with the camera in `slot` |
| `saveDraft` / `updateDraft` | `designId`, `fields` | Saves the draft text, element, archetype, stage, predecessor and crop |
| `activate` / `activateDesign` | `id` / `designId` | Activates a draft and rolls its rarity |
| `print` / `printDesign` | `id` / `designId` | Prints one card |
| `archive` / `archiveDesign` | `id` / `designId` | Archives a design |
| `clone` / `cloneDesign` | `id` / `designId` | Clones a design into a new draft |
| `challenge` | `target`, `deckId`, `mode` | Challenges a nearby player |
| `challengeRespond` | `challengeId`, `accept`, `deckId` | Accepts or declines a challenge |
| `matchAction` | `matchId`, `actionId`, `expectedRevision`, `cardId`, `targetId`, `resourceIds` | Applies a legal match action |

## Client net events (server to client)

These are triggered by the server. They are **internal**. Triggering them from other resources only changes what that client displays. Ownership and state stay on the server.

| Event | Payload | Effect |
| --- | --- | --- |
| `kora_cards:client:useCamera` | `slot` (number) | Starts the first-person studio camera for the camera item in that slot |
| `kora_cards:client:open` | `view` (string, for example `binder`, `decks`, `play`, `shop`, `studio`, `ranked`) | Opens the AppShell on that view. Sent to the challenger when a challenge is declined (`play`). |
| `kora_cards:client:showCard` | viewer table: `print` (`id`, `serial`, `designId`, `bound`), `design`, `withdrawable` | Opens the card viewer overlay. Used when the item is used and by Show nearby. |
| `kora_cards:client:challenge` | `id`, `fromName`, `mode`, `expiresAt`, or `false` | Shows or clears an incoming challenge and opens the Play tab |
| `kora_cards:client:matchState` | match UI snapshot, or `false` | Opens or updates the match board. `false` closes it, 5 seconds after the match ends. |
| `kora_cards:client:duelLock` | boolean | `true` freezes the ped, makes it invincible and disables combat controls for the duel. `false` restores the previous state. |

## Events this resource listens to

| Event | Side | Handling |
| --- | --- | --- |
| `kora_core:server:playerLoaded` | Server | Removes leftover cameras, re-seats the player in an unfinished match, then after 1.5 seconds recovers interrupted operations and pays pending rewards |
| `kora_core:server:playerDropped` | Server | Marks the player disconnected in their match (the disconnect grace starts) and clears their camera token |
| `QBCore:Server:SetDuty` | Server | When `onDuty` is false, removes the player's studio cameras (legacy duty event) |
| `onResourceStart` (`kora_inventory`) | Server | Registers usable items and the camera swap hook again |
| `weaponDamageEvent` | Server | Cancels weapon damage dealt by or to a player in a match. Otherwise records recent combat for both players. |
| `onClientResourceStart` (`kora_target`) | Client | Registers the studio target zones again |
| `onResourceStop` (`kora_cards`) | Client | Stops the camera, releases the duel lock, closes the UI and removes the IPL |

## NUI callbacks (private overlay)

The resource's own NUI page (`web/build`) only handles the card viewer, the portrait editor and the match board. It posts to:

| Callback | Purpose |
| --- | --- |
| `ready` | The frame has loaded. Queued overlay messages are flushed. |
| `close` | Closes the overlay. The viewer and editor return to the AppShell view they were opened from. |
| `action` | Forwards `{ action, payload }` to the server callback. Only allowed per overlay: viewer can send `showNearby` and `withdraw`, editor can send `updateDraft`, match can send `matchAction`. |

The client sends overlay messages `kora_cards:viewer`, `kora_cards:editor` and `kora_cards:match`, with `false` as the payload to close them.
