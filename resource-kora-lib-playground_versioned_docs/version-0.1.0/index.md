# Feedback workflow bot

This service owns the Discord Gateway connection and creates one forum post for
each `/fb` report. FiveM calls `POST /feedback` with a Bearer shared secret.

## Host setup

1. Copy `.env.example` to `.env` and fill in the Discord IDs and secrets.
2. Use Node 22.5+ and install the Discord dependency with `npm ci`.
3. Start it with `pm2 start ecosystem.config.cjs` and save the PM2 process list.
4. Configure Discord so the bot has View Channel, Manage Threads, Send Messages,
   Send Messages in Threads, Embed Links, Attach Files, and Manage Channels in
   the forum channel.

The bot applies channel overwrites on startup: `@everyone` and staff cannot
create forum posts, staff can view/reply, and only the bot can create posts.
The staff role can still be changed in Discord after startup if the policy needs
to be adjusted.

Reports stay in the staff forum. Reporters receive private bot receipts and
status updates, with testing/pass/fail controls for their own reports. Closed
DMs do not prevent delivery to staff. Startup clears the five permission fields
matching legacy reporter forum grants, including grants whose reports were
deleted, while keeping unrelated permission fields and role overwrites.

SQLite uses Node's built-in `node:sqlite`; no native database module or compiler
is required. Never commit `.env`, the SQLite database, or the Discord token.
