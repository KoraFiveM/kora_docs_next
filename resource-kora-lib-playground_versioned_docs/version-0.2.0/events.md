---
title: Events and callbacks
sidebar_position: 10
---

# Events and callbacks

The resource uses the `Kora.events` and `Kora.callback` modules from `kora_lib`, not raw `RegisterNetEvent`. Callback results are tables with `ok` and, on failure, `err`.

## Server callbacks

| Name | Arguments | Access | Returns |
| --- | --- | --- | --- |
| `playground:ping` | message | anyone | `pong: message` |
| `playground:sqlStats` | none | `command.playground` | `ok`, `stats` from `exports.kora_sql:stats()` |
| `playground:giveItem` | item name, amount | `command.playground` | `ok`, `err` from `kora_inventory:AddItem`; amount must be a positive integer and is capped at 1000 |
| `playground:selfRevive` | none | `command.playground`, cooldown | `ok`; `native = true` when `kora_admin` is not started |
| `playground:authoriseVehicle` | model | `command.playground`, cooldown | model must match letters, digits and `_`, max 32 characters |
| `playground:giveVehicleKeys` | vehicle net id | `command.playground` | the caller must be driving that vehicle; keys come from the plate the server reads |
| `playground:authoriseLegion` | none | `command.playground`, cooldown | `ok` |
| `playground:grantTemporaryRole` | target id, role, minutes | `command.playground` | calls `kora_admin:grantPlaygroundTemporaryAccess`; role is `moderator` or `admin` |
| `playground:revokeTemporaryRole` | target id, role | `command.playground` | calls `kora_admin:revokePlaygroundTemporaryAccess` |

## Client to server events (`Kora.events.trigger`)

| Name | Payload | Notes |
| --- | --- | --- |
| `playground:event` | message | Prints a sanitised line (colour codes and control characters stripped, 200 characters) and pushes `playground:eventAck`. |
| `playground:feedbackSubmitted` | form table | Rate limit 2 per 120 s. See [Feedback](./feedback.md). |
| `playground:test` | action, data | Rate limit 30 per 60 s. Actions: `next`, `works`, `fail`, `skip`, `list`, `tests`, `release`, `setspot`, `acceptspots`, `whoami`. |
| `playground:testTp` | spot index | Rate limit 10 per 30 s. |
| `playground:testSetup` | none | Rate limit 6 per 30 s. |

## Server to client pushes (`Kora.events.push`)

| Name | Payload |
| --- | --- |
| `playground:eventAck` | text |
| `playground:feedbackProcessed` | `ok`, `message`, `reportId` |
| `playground:testResult` | bot result, or a notice from `playground_testnotify` |
| `playground:testTpGo` | `x`, `y`, `z`, `h`, `label`, `proposed` |
| `playground:testSetupGo` | `gave`, `refused`, `revive`, `vehicle`, `commands` |

## Local events

| Name | Direction | Purpose |
| --- | --- | --- |
| `kora_lib-playground:server:feedbackUploadRequested` | Lua to Node uploader | Upload job (id, bot URL and secret, report JSON, screenshot path). |
| `kora_lib-playground:server:feedbackUploaded` | Node uploader to Lua | Id, HTTP status, body, error, report URL. |
| `kora_lib-playground:server:feedbackUploaderReady` | Node uploader to Lua | Uploader loaded. |

## Events consumed from other resources

`onResourceStart`, `onResourceStop`, `playerJoining`, `playerDropped`, `txAdmin:events:serverShuttingDown`. It triggers `kora_admin:client:revive` on the caller and `kora_police:server:toggleDuty` from `/testpolice_duty`.
