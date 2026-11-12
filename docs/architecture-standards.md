---
title: Kora Framework architecture and ownership
sidebar_position: 6
---

# Kora Framework architecture and ownership

New features use Kora Framework APIs. Thin adapters translate genuine external
or legacy contracts into one owning implementation. Do not require every feature
to support interchangeable frameworks.

## DRY through ownership

Search existing APIs before writing a helper. Generic mechanisms belong in
`kora_lib`; player mutation and money belong in `kora_core`; database execution
belongs in `kora_sql`; inventory operations belong in `kora_inventory`. Feature
policy stays with its feature resource.

```lua
-- Bad: bypasses dirty tracking and replication.
playerData.money.bank = playerData.money.bank + amount

-- Good: after validation, call the owner.
local ok, err = exports.kora_core:addMoney(src, 'bank', amount, 'job-payout')
```

Share a validator or policy when its semantics, errors and lifecycle actually match.
Similar-looking loops can remain separate. Avoid speculative generic managers,
provider registries and layers without a real requirement.

## Cohesive structure

A small resource may retain `client.lua` and `server.lua`. Growing resources should
make domain and realm boundaries visible, using their established layout:

```text
config.lua
modules/<feature>/shared.lua   pure rules safe to expose to clients
modules/<feature>/server.lua   authoritative operations
modules/<feature>/client.lua   presentation and intent transport
compat/                       external contract adapters
test/                         existing harness and regression cases
docs/                         behavior and public API
```

Extract related logic when the changed feature needs it, without migrating
unrelated features or enforcing arbitrary file sizes. Declare dependencies and
explicit load order where it matters. Existing independent module globs may remain.
Shared code is available to clients: secrets and server-only policy do not belong there.

## Thin adapters and handlers

A handler validates intent, resolves authority, calls domain logic, then translates
its response. An adapter owns names, argument conversion and result-shape mapping;
it does not duplicate pricing, inventory or permission rules.

```lua
-- Illustrative: use the owner's existing compatibility registration helper.
registerLegacyExport('legacy-garages', 'StoreVehicle', function(vehicleId)
    return Garage.store(vehicleId)
end)
```

Calling the internal operation directly can preserve the original invoking resource.
An additional exports hop may change `GetInvokingResource()`, affecting cleanup,
authorization and audit attribution. Capture the caller before yielding or crossing
another boundary when needed. Test the adapter's success and failure contracts.
Do not silently switch to a second mutation implementation when a provider fails.

## Authority and lifecycle

Clients send intent and identifiers. The server resolves prices, balances, item
records, ownership, permissions, proximity and routing buckets. Bound payloads and
rate limits appropriately. Reject malformed and non-finite values.

Capture event source before yielding. Revalidate mutable state and session identity
after a yield. Handle disconnects, duplicate actions, stale replies and restarts.
Use the owner's transaction, lock or mutation funnel for atomic operations; define
compensation when several resource operations cannot form one transaction.

Core's single player mutation funnel, target's registration ownership and
jobcreator's single validator/write path are existing examples to preserve. Native
target filtering remains framework-agnostic; Kora Framework-first does not override that
resource's documented contract.

Every timer, entity, registration, subscription and UI focus needs an owner and
idempotent cleanup. Disabled features should register no work. Prefer events and
existing schedulers, bound retries, and measure idle/active cost for hot-loop changes.
Use assertions for programmer misuse, explicit failures for ordinary runtime
rejection, and the existing audit/logging facilities without sensitive payloads.

---

Copyright © 2026 Kora Framework.
