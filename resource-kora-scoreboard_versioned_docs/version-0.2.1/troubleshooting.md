---
title: Troubleshooting
sidebar_position: 8
---

# Troubleshooting

## The scoreboard does not open

- Check the client console for `[qb-scoreboard] could not open:`. It means `Kora.nui.openApp` failed; verify `kora_lib` is started.
- Another app may already be open in the `kora_lib` shell.
- In hold mode, releasing the key before the server answered cancels the open.

## Key does nothing

`Config.OpenKey` is only the default for new bindings. Players who already have a binding keep it. Have them rebind "Open Scoreboard" in FiveM settings, or reset their key bindings.

## Police count is wrong

Only players with job name `police` who are on duty are counted, and the count is taken when the panel opens. Close and reopen to refresh. Other law-enforcement jobs are not counted.

## Activity shows "Ready" but the robbery refuses to start

The scoreboard is informational. Set `minimumPolice` to match the robbery script's own requirement.

## Activity never shows "On cooldown"

The robbery script must call `qb-scoreboard:server:SetActivityBusy` from the server with an id from `Config.IllegalActions`. Busy state is kept only in each client's memory, so players who join or restart their client later do not see a cooldown that began earlier, and a resource restart clears it.

## No ID labels

Labels appear only within 10 metres, only while the panel is open, and only for opted-in players unless `Config.ShowIDforALL` is on.

## Footer shows the wrong key

The footer text uses `Config.OpenKey` at registration time and does not follow player rebinds. See [Configuration](./configuration.md).
