---
title: "How to use"
sidebar_position: 3
---


# How to use

Kora Queue hooks `playerConnecting` directly; there is no NUI and no in-game command. Other resources integrate through the `Queue` global (via the facade in `connectqueue.lua`) or through rcon `queue` subcommands for live debugging.

## Connection flow

1. **A player connects** — `playerConnect` (the `playerConnecting` handler) defers, optionally runs the anti-spam countdown (`Config.AntiSpam`), then resolves the player's identifiers with `Queue:GetIds`.

2. **Identifier and Steam checks** — If no identifier can be found at all, the connection is rejected with `Config.Language.idrr` and `CancelEvent()`. If `Config.RequireSteam` is on and the player has no `steam:` identifier, it is rejected with `Config.Language.steam`.

3. **Join callbacks** — Every hook registered through `Queue.OnJoin` (server-side, via another resource) runs in registration order; the first one to call back with a string reason rejects the connection (and removes the player from the queue/connecting lists) and cancels the event. If every hook answers `false`/`nil`, the player proceeds.

4. **Whitelist gate** — If `Config.PriorityOnly` is true and the player has no priority (`Queue:IsPriority`), the connection is rejected with `Config.Language.wlonly` and `CancelEvent()` is called — this cancellation is what stops a later resource's own `playerConnecting` handler from overriding the rejection and letting the player in anyway.

5. **Queue placement** — The player is inserted into the ordered queue (`Queue:AddToQueue`), positioned ahead of anyone with lower or no priority. If the server has room and the resource's `Config.JoinDelay` has elapsed since start, the player is admitted immediately (this direct path also requires that nobody else is waiting ahead, `Queue:NotFull(true)`); otherwise they wait, with their Adaptive Card or text message updated every 500ms, until a slot opens (`Queue:NotFull`) and the join delay has passed.

6. **Timeouts** — A queued player is dropped after `Config.QueueTimeOut` seconds without a readable network endpoint. A player handed off to "connecting" (loading the join screen) is dropped after `Config.ConnectTimeOut` seconds if they never finish loading, or after 300 seconds if they have no network endpoint. A connecting player leaves that list when the client triggers `Queue:playerActivated` (see [Events](./events.md)).

7. **Grace priority** — With `Config.EnableGrace` on, a player who disconnects, or who is admitted to connect, is given `Config.GracePower` temporary priority for `Config.GraceTime` seconds — intended to let someone who dropped mid-session rejoin ahead of the queue they would otherwise have to re-climb.

## The connecting card

`Config.Card` (enabled by default) renders a FiveM deferral Adaptive Card instead of plain status text, so the player sees a branded panel (title, description, position, queue size, queue time, priority, server name, a status line and optional extra text blocks) before they have even loaded into the server. Set `Config.Card.enabled = false` to fall back to the original text-only messages (`Config.Language.pos` etc.), and `Config.Card.fallbackToText = true` (the default) makes a card-presentation failure fall back to text automatically rather than leaving the player with no message at all.

## Priority and the whitelist

- `Config.Priority` maps an identifier (hex Steam ID, `steam:` id, or `ip:x.x.x.x`) to a priority number; higher numbers are placed further forward in the queue. IDs are matched case-insensitively.
- An `ip:` identifier is only kept in a player's identifier list if that exact `ip:` value itself has a configured priority (`Queue:GetIds` strips every other `ip:` entry when the player has more than one identifier) — so IP-based priority must name the literal address, and ordinary players are matched by their other identifiers (Steam/license) instead.
- `Config.PriorityOnly = true` turns the whole server into "whitelist only": only identifiers present in `Config.Priority`, a temporary priority grant, or added at runtime via `Queue.AddPriority` may connect at all.
- `Queue:HexIdToSteamId` converts a hex Steam identifier to the classic Steam form (written in lower case, `steam_0:a:b`, because lookups lower-case every identifier; it returns `nil` for non-`steam:` identifiers) so priority lists written against either format are matched; the converted form is also checked when looking up priority and temporary priority.

## Hardcap removal

With `Config.DisableHardCap` true (the default), kora_queue cancels `hardcap`'s `onResourceStarting` and calls `StopResource('hardcap')` on its own start, since a vanilla hard player cap would fight the queue's own admission logic.

## Integrate from another resource

Load `@kora_queue/connectqueue.lua` as a server script in your own resource to get the `Queue` facade (see Installation). Priority can be granted at runtime, and a join hook can veto a connection with a custom reason.

```lua title="server.lua"
-- Server, in another resource that loaded @kora_queue/connectqueue.lua
Queue.OnReady(function()
    Queue.OnJoin(function(src, cb)
        if isBanned(src) then
            cb('You are banned from this server.') -- refuses the connection
            return
        end
        cb(false) -- allow; cb(nil) also allows, but omitting the call hangs the connection
    end)
end)
```

## Grant or revoke priority

```lua title="server.lua"
-- Server, in another resource
Queue.AddPriority('license:abcdef...', 50)         -- permanent priority
Queue.AddPriority('license:abcdef...', 20, 600)     -- temporary: 20 power for 600 seconds
Queue.RemovePriority('license:abcdef...')
```
