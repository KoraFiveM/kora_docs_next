---
title: Exports
sidebar_position: 9
---

# Exports

The resource has no exports for general use. `fft_hooks.lua` registers two for the FFT test runner, only when the server convar `fft_kora_hooks` is `true` (for example `setr fft_kora_hooks true`). Otherwise the script returns immediately.

| Export | Side | Description |
| --- | --- | --- |
| `fftVersion()` | client | Returns the hook version (`2`). |
| `fftAction(action, ...)` | client | Returns `false` with a message unless the caller is the `fft` resource and a session is set in the local player state `fftSession`. The action table is empty, so every action returns `Unsupported FFT action: <name>`. |

The file's own comment says the hook no longer drives anything and can be removed together with its manifest entry.
