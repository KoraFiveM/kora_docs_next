---
title: Feedback bot
sidebar_position: 8
---

# Feedback bot

`bot/` is a standalone Node service, separate from the FiveM resource. It owns the Discord gateway connection and creates one forum post per `/fb` report. It listens on `FEEDBACK_BIND:FEEDBACK_PORT` (default `127.0.0.1:31290`) and accepts only `POST /feedback` with a Bearer shared secret. Other paths return 404.

## Setup

1. Copy `bot/.env.example` to `bot/.env` and fill in `DISCORD_TOKEN`, `DISCORD_GUILD_ID`, `DISCORD_FORUM_CHANNEL_ID`, `DISCORD_STAFF_ROLE_ID` and `FEEDBACK_SHARED_SECRET`.
2. Use Node 22.5 or newer and run `npm ci` in `bot/`.
3. Start it with `pm2 start ecosystem.config.cjs`.
4. Give the bot View Channel, Manage Threads, Send Messages, Send Messages in Threads, Embed Links, Attach Files and Manage Channels in the forum channel.
5. Set `kora_lib_playground_feedback_bot_url` to `http://host:31290/feedback` and `kora_lib_playground_feedback_bot_secret` to the same value as `FEEDBACK_SHARED_SECRET`.

Environment variables read by the service: the five above plus `FEEDBACK_BIND`, `FEEDBACK_PORT` and `FEEDBACK_DB_PATH` (default `./data/feedback.sqlite`). Data is stored with Node's built-in `node:sqlite`. Never commit `.env`, the database or the token.

## Behaviour

Per `bot/README.md`: on startup the bot sets channel overwrites so only it can create posts and staff can view and reply, reporters get private bot receipts and status updates, and legacy reporter grants on the forum are cleared. Tests are in `bot/test/`.
