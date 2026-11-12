---
title: Card Studio job
sidebar_position: 1
---

# Card Studio job

The Card Studio (`cardstudio`) is a photography job in the Lifeinvader lobby (IPL `facelobby`). Employees photograph players and scenery, turn the photos into card designs, and print serialized cards.

## Stations

Each station is a kora_target sphere zone (radius `Config.studio.targetRadius`). The server also checks that the player is within `Config.studio.actionDistance` (2.25 m) of the right station for each action.

| Station | Target label | Opens or does |
| --- | --- | --- |
| `duty` | Clock In / Out | Toggles duty directly. Requires the `cardstudio` job. |
| `locker` | Card Studio Locker | Studio tab, for camera checkout |
| `supply` | Buy Studio Supplies | Studio tab, for supplies |
| `editor` | Open Card Editor | Studio tab, for editing, activating, cloning and archiving |
| `printer` | Use Card Printer | Studio tab, for printing |
| `publicShop` | Browse City Legends | Shop tab (open to everyone) |
| duel zone | Open Duel Table | Play tab (open to everyone) |

Clocking out, whether at the duty point or through the Studio tab, removes all studio cameras.

## Grade permissions

The minimum grades are hard-coded on the server. `Config.permissions` lists the same values but isn't read.

| Action | Minimum grade | Station |
| --- | --- | --- |
| Check out camera | 1 Assistant | locker |
| Use camera / capture | 1 | none (camera item) |
| Buy supplies | 1 | supply |
| Edit your own Basic draft | 1 | editor |
| Edit another photographer's draft | 3 Editor | editor |
| Set Stage 1 or Stage 2 and link a predecessor | 3 | editor |
| Activate a Basic draft | 2 Photographer | editor |
| Activate an evolved draft | 3 | editor |
| Print | 2 | printer |
| Clone a design into a draft | 3 | editor |
| Archive a design | 4 Studio Manager | editor |

All studio actions need the player to be **on duty**.

## Supplies

Buy 1–20 `card_film`, `blank_card` or `card_ink` at a time with cash, at the prices in `Config.supplies`. The money is refunded if the items can't be added to the inventory.

## Photography

1. Check out a `card_camera` at the locker. It is bound to you through a session token. See [Items](../items.md#card_camera).
2. Use the camera from your inventory. A first-person camera attached to your head starts. Aim with the mouse, scroll to zoom (FOV 20–70), press `E` to take the photo, and press Backspace or `Esc` to cancel.
3. The server needs `screenshot-basic` to be started and at least one `card_film`. It asks the client for a WebP screenshot, which is saved as `storage/tmp/capture-<uuid>.webp`.
4. The file must be a valid WebP (`RIFF`/`WEBP` header) of at most `Config.capture.maxBytes`, and must arrive within `Config.capture.sessionSeconds`. Only then is one film removed.
5. A new **draft** design is created with these defaults: name "Untitled Legend", `Unit`, `Neutral`, `Striker`, Basic, moves "City Jab" / "Late Shift", the next free collector number in set `CLS`. The portrait editor opens.

If any step fails, the temporary file is deleted and no film is used. If the database insert fails after the film was removed, the film is refunded.

## Portrait editor

You can edit the following in the editor overlay (it opens after a capture, or from Studio > Edit portrait):

- name (32 characters) and flavor text (120 characters)
- element and archetype
- the two cosmetic move names (24 characters each)
- stage, and the predecessor for Stage 1 or Stage 2
- crop: horizontal and vertical focus, and zoom from 100 to 180 % (the server accepts up to 300 %)

Mechanics are never taken from the text. Only drafts that have never been printed can be edited.

Evolution rules for drafts:

- A Stage 1 must evolve from an active Basic, and a Stage 2 from an active Stage 1.
- The predecessor must have the same element.
- A design can't evolve from itself, and links can't form a cycle.

## Activation

Activation turns a draft into an active design:

1. The server **rolls the rarity** (out of 10000):

   | Rarity | Chance | Lifetime print cap | Deck points |
   | --- | --- | --- | --- |
   | Common | 55 % | 100 | 0 |
   | Uncommon | 25 % | 50 | 1 |
   | Rare | 13 % | 20 | 2 |
   | Epic | 6 % | 5 | 4 |
   | Legendary | 1 % | 1 | 7 |

2. The mechanics are built by `Rules.unitTemplate` from stage, rarity, archetype and element: HP, retreat cost, weakness, resistance (Guardians only), prize value, and two attacks with effects based on the archetype. See [Matches](./matches.md#unit-templates).
3. The photo moves from `storage/tmp/` to `storage/cards/`, the content hash is stored, and the catalog reloads.

The rarity is permanent. To make a different version, clone the design.

## Printing

Printing needs grade 2 or higher, the printer station, an **active** design under its print cap, one `blank_card`, one `card_ink`, and a free slot for `trading_card`.

1. A `print` operation is written to the journal.
2. The blank card and ink are removed.
3. A print is allocated: `printed_count` goes up by one, and on the first print `locked_hash` is set.
4. A `trading_card` with the print metadata is added to your inventory.

If any step fails, the supplies are refunded and the allocation is rolled back. Serial format: `CLS-<collector>-<print number>/<cap>` (the cap shows as `999` when unlimited).

## Clone and archive

- **Clone** (grade 3 or higher) copies any design into a new draft. The draft gets a new collector number, `version + 1`, the slug `<slug>_v<version>`, and a copy of the image. Its rarity is reset to Common until it is activated.
- **Archive** (grade 4) sets the design to `archived` and removes it from the shop. Prints that already exist stay valid, but archived designs can't be added to decks or printed. You can't archive a design while an active design still evolves from it.

## Draft cleanup

Drafts that have never been printed and are older than `Config.capture.cleanupHours` are deleted with their image. Cleanup runs when the resource starts and every hour after that.
