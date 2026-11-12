---
title: Database
sidebar_position: 8
---

# Database

`kora_fishing` does not query or create any database tables. Fishing XP is stored by `kora_skills`, money and items by `kora_core` and `kora_inventory`. Active fishing state and the 2 second cooldown are held in server memory and cleared when the player drops, unloads, or the resource restarts.
