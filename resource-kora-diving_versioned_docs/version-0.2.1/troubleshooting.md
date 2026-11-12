---
title: Troubleshooting
sidebar_position: 7
---

# Troubleshooting

- **Items do nothing or are unknown**: the four items must exist in `kora_inventory` ([Items](./items.md)).
- **No target options on coral or the buyer**: check `kora_target` is started.
- **No breathing sounds**: `InteractSound` is not declared and must be running.
- **"need an oxygen tube" message**: oxygen is 0. Use `diving_fill` first.
- **Refill refused with the current level shown**: refills only work when oxygen is 0.
- **Gear refuses to equip**: the player must not be swimming or in a vehicle.
- **Oxygen lost on relog or restart**: oxygen is only kept in client memory. It is not saved.
- **Coral does not respawn after a restart of the resource**: state is in memory, so a restart resets all coral to available.
- **Coral gone but no item received**: the server marks the coral picked before it calls `AddItem` and does not check its result, so a full inventory can lose the coral.
- **Pick or sell rejected**: the server asserts you are within 10.0 units of the coral or buyer. The assert messages come from `locales`.
