---
title: User interface
sidebar_position: 7
---

# User interface

Kora Cards has two UI layers.

## kora_lib AppShell

Most screens are built with kora_lib's shared AppShell (`Kora.nui.registerApp`, app ID `kora_cards:city-legends`). They use the standard Kora navigation, focus handling, forms and kora_theme styling. Every button sends an action ID such as `cards:buy-shop` to the client, which then calls the server action callback.

| Tab | Visible to | Contents |
| --- | --- | --- |
| Binder | everyone | Totals, starter claim, physical cards (View, Deposit), binder prints (View, Withdraw) |
| Decks | everyone | Saved decks with legality status (Edit, Delete), New deck |
| Deck Builder | while editing a deck | Selected and available prints, live card count, rarity points and Basic count, Save, Clear |
| Play | everyone | Legal decks with Casual and Ranked challenge buttons, incoming challenge to accept or decline, duel requirements |
| Shop | everyone | Shop catalog with price, prints left, View and Buy |
| Studio | `cardstudio` employees | Clock in/out, camera checkout, supplies, shared catalog with View, Edit portrait, Activate, Print one, Clone draft, Archive. Drafts are only listed while on duty. |
| Ranked | everyone | Season standing and the top 50 leaderboard |

Buttons the player can't use (wrong grade, off duty, sold out, illegal deck) are disabled in the UI. The server checks every rule again either way.

## Private NUI overlays

The resource's own page (`web/`, React + Vite, built to `web/build/`) handles only three overlays. They use kora_theme's semantic tokens:

- **Card viewer**: the full card face, serial, element, rarity, type and deck points, with Show nearby and Withdraw.
- **Portrait editor**: a live preview of the card with the editable fields and crop sliders. See [Card Studio job](./features/studio.md#portrait-editor).
- **Match board**: both sides (Active, bench, hand, deck, prize and discard counts), the venue, the turn timer, and the list of legal actions. Actions that need a target ask you to pick one first.

To develop the overlays in a browser, run `npm --prefix web run dev`. In a plain browser, `web/src/mock.ts` supplies sample data.
