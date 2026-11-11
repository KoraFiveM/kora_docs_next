# Kora Cards

Kora Cards is the first-party **City Legends** photography job, serialized card
collection, shop, deck builder, and server-officiated casual/ranked TCG.

## Interface architecture

Binder, Decks, Play, Shop, Studio, and Ranked run inside kora_lib's shared
AppShell, so they inherit the standard Kora navigation, focus lifecycle, forms,
and kora_theme presentation. The resource-owned NUI is intentionally limited to
the full card viewer, live portrait editor, and real-time match board; those
overlays consume kora_theme's semantic tokens rather than defining a second
palette.

## Start order

Start `kora_theme`, `kora_sql`, `kora_lib`, `kora_core`, `kora_target`, `kora_inventory`, and
`kora_bossmenu` first. `server.cfg` already starts `kora_cards` in that position.

For live photography, install `screenshot-basic` and start it before `kora_cards`.
It is runtime-optional on purpose: when it is absent or capture storage fails,
the shutter fails without consuming film while binders, shops, and matches stay
available.

## Operator workflow

- `/cards` opens the binder and game.
- `/kora_cards_reload` validates the complete catalog in a staging cache and swaps
  it only when every row, rule, evolution link, content lock, and artwork file
  is valid. It requires the Kora admin permission.
- `/kora_cards_season preview` shows the eligible top three. Run
  `/kora_cards_season close` within 60 seconds to settle rewards and open the next
  season.

To author an official database card, place a WebP file (maximum 2.5 MiB) at a
safe generated name under `storage/catalog/`, insert a complete
`kora_cards_designs` row using only the effect vocabulary in `shared/rules.lua`,
then run `/kora_cards_reload`. Once any tradable print succeeds, the row's content
hash is locked. Revisions must be inserted as a new design/version.

The media handler is GET-only and serves opaque keys. Set
`Config.capture.publicBaseUrl` when media is routed through a reverse proxy.

Back up the SQL database and the complete `kora_cards/storage` directory together.

## Tests

Run:

```sh
./tests/run.sh
npm --prefix web run build
```

The plain-Lua suites cover catalog/rule schemas, exact starter composition,
rarity boundaries, deck legality, hidden information, every battle action,
conditions, knockouts, simultaneous wins, timers, disconnect grace, and durable
match restoration.

## Quick in-game acceptance

1. Start the dependencies and `kora_cards`, join with a fresh character, and run
   `/cards`. Confirm the shared AppShell opens on Binder and lets you claim one
   starter deck.
2. Assign the `cardstudio` job, clock in at Lifeinvader, buy film, check out the
   camera, take a photo, edit the portrait, activate it, and print one card.
3. Open `/cards`, deposit the physical print, build and save a legal 60-card
   deck, then withdraw a non-deck print and give it through the native
   inventory.
4. With a second player within five metres in the duel zone, send a Casual
   challenge and complete a few turns. Repeat in Ranked to verify the venue
   lock, timer, result, rating, and eligible bank payout.
