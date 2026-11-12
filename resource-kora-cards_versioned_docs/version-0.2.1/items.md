---
title: Items
sidebar_position: 6
---

# Items

Each item is defined in `Config.items` and registered at start with `Kora.shared.register('items', ...)`, unless an item with that name already exists. The icons are SVG files in `assets/`. Each item has an `imageUrl` of the form `https://cfx-nui-kora_cards/assets/<file>.svg`.

| Item | Label | Weight | Unique | Usable | Purpose |
| --- | --- | --- | --- | --- | --- |
| `card_camera` | Studio Camera | 2000 | yes | yes | Checked-out studio camera used to take portraits |
| `card_film` | Card Film | 50 | no | no | One exposure. Used up by a successful capture. |
| `blank_card` | Blank Trading Card | 10 | no | no | Card stock. One is used per print. |
| `card_ink` | Card Ink | 25 | no | no | One is used per print |
| `trading_card` | City Legends Card | 5 | yes | yes | A physical serialized print |

## card_camera

- Issued at the **locker** station to on-duty `cardstudio` employees (grade 1 or higher). Checking out a camera first removes any camera already in the player's inventory.
- The item metadata stores `citizenid` and `issueToken`. Using the camera only works if both match the token the server issued to that player in the current session, and the player is on duty.
- A kora_inventory `swapItems` hook stops the camera from being moved into a different inventory, so it can't be handed over or stashed.
- All cameras are removed when the player clocks out (through the Studio tab, the duty target, or a `QBCore:Server:SetDuty` event with off duty) and when the player loads in.
- Using the camera opens the first-person studio camera. See [Card Studio job](./features/studio.md#photography).

## card_film, blank_card, card_ink

Bought at the **supply** station with cash (see `Config.supplies`). Film is only used after a capture has been validated and saved. Printing removes one blank card and one ink.

## trading_card

The metadata of a physical card:

| Field | Description |
| --- | --- |
| `printId` | UUID of the row in `kora_cards_prints`. This is the trusted identity. |
| `serial` | Display serial, for example `CLS-001-004/100` |
| `displayName` | Design name |
| `rarity` | Design rarity |

- **Using** the item opens the full card viewer for that exact print, after the server has verified the print.
- The player can **deposit** the card from the Binder tab (moves the print into the binder) and **withdraw** a print back into inventory.
- A `trading_card` without a valid `printId`, or one that doesn't match a circulating print, is listed as "Unverified Card" and can't be deposited.
- Starter cards (bound) never exist as physical items.

See [Collection and decks](./features/collection.md).
