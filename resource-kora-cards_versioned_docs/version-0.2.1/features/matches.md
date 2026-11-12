---
title: Matches and game rules
sidebar_position: 3
---

# Matches and game rules

City Legends matches are run by the server. The engine is `shared/match.lua` (`KoraCardsMatch`, which has no FiveM dependencies), and the server wrapper is `server/matches.lua`. The client only receives a snapshot from its own player's view: the opponent's hand is hidden and discard piles are sent as counts. Each snapshot lists the legal actions with server-issued action IDs, and the client can only pick from that list.

## Challenging

From the Play tab, pick a legal deck and click **Casual** or **Ranked**. The challenge goes to the **nearest player within 5 m**.

Both players must:

- be inside the duel zone (`Config.studio.duelZone`, radius 18 m around the Lifeinvader duel floor)
- be within `duelZone.challengeDistance` (5 m) of each other and in the same routing bucket
- be alive and not in a vehicle
- not be dead, in last stand or handcuffed (kora_core metadata)
- not have dealt or taken weapon damage in the last `Config.match.recentCombatSeconds` (15 s)
- not already be in a match

The challenge expires after **30 seconds**. The challenged player sees it on the Play tab and accepts by choosing one of their own legal decks, or declines. When a challenge is declined, the challenger's Play tab opens.

Ranked challenges also need an active season, must not fall within a season-rollover preview window, and the two characters must not have played a ranked match against each other on the same UTC day. See [Ranked and seasons](./ranked.md).

## During a match

- Both players are frozen, made invincible and can't fire or use combat controls.
- Weapon damage dealt by or to a player in a match is cancelled.
- The AppShell closes and the match board overlay opens.
- Each second the server checks whether both players are still eligible. A player who leaves the zone, dies, gets in a vehicle, is restrained, changes routing bucket or enters combat **forfeits** (`left_venue`). If the players drift more than `challengeDistance` apart, whoever moved further from their starting position forfeits.

## Setup

1. Each deck is shuffled and seven cards are drawn. A hand with no Basic Unit is a mulligan: it is shuffled back and redrawn, up to 128 times.
2. The first Basic Unit in the hand becomes **Active**. Other Basic Units in the hand go to the **bench** automatically, up to 5.
3. Six cards are set aside as **prizes**.
4. Each player draws extra cards equal to the number of mulligans the opponent took.
5. A random player goes first.

## Turn structure

At the start of each turn the player draws one card. A player who can't draw **loses** (`deck_out`). A turn lasts `Config.match.turnSeconds` (90 s).

Actions available in the main phase:

| Action | Limit |
| --- | --- |
| Play a Basic Unit to the bench | Bench holds at most 5 |
| Evolve a Unit | Not on the first turn of the match. The target can't have entered play or evolved this turn. The card must be exactly one stage higher, and its predecessor must be the target's design. Evolving clears conditions. |
| Attach a Resource to your Active or a benched Unit | One per turn |
| Play an Item | No limit. Goes to the discard pile after resolving. |
| Play a Tactic | One per turn, not on the first turn of the match |
| Play Gear on a Unit | One Gear per Unit |
| Play a Venue | One Venue is shared on the field. A new Venue sends the old one to its owner's discard pile. |
| Retreat (swap Active with a benched Unit) | One per turn. Discard resources equal to the retreat cost. Not allowed while Asleep or Paralyzed. Clears conditions. |
| Attack | Not on the first turn of the match. Not allowed while Asleep or Paralyzed. The Unit's attached resources must pay the cost. **Ends the turn.** |
| End turn | |
| Concede | Always available. Gives the win to the opponent (`forfeit`). |

### Damage

```text
damage = base damage + attack modifiers + this-attack bonus
damage = damage x 2 if the defender is weak to the attacker's element
damage = damage - 30 if the defender resists the attacker's element
damage = damage + defender's received-damage modifiers   (never below 0)
```

### Special conditions

Conditions affect the Active Unit and are resolved between turns:

| Condition | Effect |
| --- | --- |
| Poisoned | +10 damage between turns |
| Burned | +20 damage between turns, then a coin flip removes it |
| Asleep | Can't attack or retreat. A coin flip between turns may wake it. |
| Paralyzed | Can't attack or retreat. Removed at the end of its owner's next turn. |
| Confused | When it attacks, a coin flip decides: on failure it takes 30 damage and the turn ends |

Switching, retreating, promoting or evolving a Unit clears its conditions.

### Knockouts and prizes

A Unit is knocked out when its damage reaches its HP. Its whole stack, resources and gear go to the discard pile, and the opponent takes prize cards equal to its prize value. If an Active Unit is knocked out and the bench isn't empty, the match enters a **promotion** phase, and the owner picks a benched Unit to become Active within the turn timer.

## How a match ends

| `win_reason` | Meaning |
| --- | --- |
| `all_prizes` | A player took their last prize |
| `no_replacement` | The opponent has no Active Unit and an empty bench |
| `simultaneous_win` | Both players met a win condition at once (**draw**) |
| `deck_out` | The player couldn't draw at the start of their turn |
| `forfeit` | A player conceded |
| `left_venue` | A player stopped meeting the duel requirements |
| `turn_timeouts` | A player ran out of time on two turns or promotions in total |
| `turn_timeout` | Timed out in a state where nothing could be done automatically |
| `disconnect_timeout` | A player stayed disconnected for longer than the grace period |
| `disconnect_both` | Both players stayed disconnected for longer than the grace period (**draw**) |
| `server_restart` | The match couldn't be restored after a restart |

On the **first** timeout the server acts for the player: it ends the turn, or promotes the first benched Unit. The **second** timeout forfeits the match.

## Disconnects and restarts

- When a player drops, the match **pauses**: the turn timer stops. The player has `Config.match.disconnectGraceSeconds` (120 s) to come back. On reconnect the timer is extended by the time spent paused, and the player is seated again.
- Match state is saved to `kora_cards_matches.state_json` after every change. When the server starts, unfinished matches are restored, and players who are online are seated again.
- Five seconds after the result is shown, the board closes and the duel lock is lifted.

## Unit templates

Studio-activated Units get their mechanics from `Rules.unitTemplate(stage, rarity, archetype, element)`. Below, `s` is the stage (0, 1 or 2) and `r` is the rarity rank (Common 1 to Legendary 5).

| Stat | Formula |
| --- | --- |
| HP | `60 + 30s + 10(r - 1)`, +20 for Guardians, -10 for Strikers, kept between 40 and 180 |
| Retreat cost | Guardian 2, Trickster 0, others 1 |
| Attack 1 | Costs 1 resource of any element. Deals `10 + 10s + 5(r - 1)`, +10 for Strikers. |
| Attack 2 | Costs `min(4, 2 + s)` resources of any element. Deals `30 + 20s + 10(r - 1)`, +10 for Strikers. |
| Prize value | 2 for an Epic or Legendary Stage 2, otherwise 1 |

Extra effects depend on the archetype:

| Archetype | Attack 1 | Attack 2 |
| --- | --- | --- |
| Striker | none | +`10 + 5r` damage on this attack |
| Guardian | -10 damage taken until next turn | -20 damage taken until next turn |
| Medic | Heals the Active Unit by `min(40, 5 + 5r)` | Heals the Active Unit by `min(40, 2(5 + 5r))` |
| Trickster | none | Applies a condition by rarity: Confused, Poisoned, Burned, Asleep, Paralyzed |

Element relationships:

| Element | Weak to | Guardians resist (30) |
| --- | --- | --- |
| Heat | Tide | Wild |
| Tide | Volt | Heat |
| Volt | Wild | Tide |
| Wild | Heat | Volt |
| Mind | Shadow | Neutral |
| Shadow | Mind | Neutral |
| Neutral | Heat | Mind |
