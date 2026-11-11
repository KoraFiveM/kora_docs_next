# kora_consumables

Server-validated food, drink, liquor and smoke items. Using an item needs it held; the server removes it
and applies the status after the client progress bar finishes.

## QBCore compatibility

`AddFood(name, replenish)`, `AddDrink`, `AddAlcohol` and `AddCustom(name, data)` are exported (also as
`exports['qb-smallresources']`) with the stock signatures and `(ok, reason)` returns. Server resources only.

- `replenish` is a number 0-100 added to hunger (food) or thirst (drink, alcohol).
- The item must exist in the shared items and must not already be configured, otherwise
  `false, 'item does not exist'` / `false, 'already added'`.
- `AddCustom` takes the stock `progress`, `animation`, `prop` and `replenish` tables. `replenish.event` is
  raised on the client by the server after a completed use. `replenish.server = true` events are not wired,
  because stock fires them from the client.
- Added items are sent to online clients and to players who join later.
