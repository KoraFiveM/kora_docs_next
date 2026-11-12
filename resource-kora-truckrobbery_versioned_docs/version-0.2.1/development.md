---
title: Development
sidebar_position: 8
---

# Development

## FFT hooks

`fft_hooks.lua` (client) and `fft_hooks_server.lua` (server) are loaded last in `fxmanifest.lua`. Both return immediately unless the convar `fft_kora_hooks` is `true`, so they are inert on a normal server. When enabled they expose, on each side:

- `exports.kora_truckrobbery:fftVersion()` - returns `1`.
- `exports.kora_truckrobbery:fftAction(action, ...)` - callable only by the `fft` resource.

Server actions (the second argument is the tester player source, who must have an `fftSession` state):

| Action | Description |
| --- | --- |
| `state` | Read-only snapshot: robbery state, whether the coordinates are configured ones, whether the tester started it, the on-duty police count and `Config.ActivePolice`. |
| `waive` | Arms a one-shot skip of the police requirement for the tester's next start. Refused when a robbery is already in progress. |
| `reset` | Drops an unused waiver and clears the robbery only if the tester's waived start created it. |

The server hook uses the `TruckRobberyFFT` table defined in `server/server.lua`. A tester that disconnects has their waived robbery cleared.

Client actions (require the `fft` resource started and `LocalPlayer.state.fftSession`):

| Action | Description |
| --- | --- |
| `state` | Counts local `stockade` vehicles and `s_m_m_security_01` peds. |
| `cleanup` | Removes those local entities through `Kora.entities.remove`, which only deletes entities this resource created. |

## Tests

- `lua tests/looting.lua` (from the resource root) runs the real client and server files against stubs and checks the retry behaviour of "Rob Truck" and the cleanup order. It does not start FiveM.
- `tests/checklist-crime.feature` holds QA scenarios for `kora_qa`, registered by `qa_feature` in `fxmanifest.lua`.
