---
title: Contributing to Kora
sidebar_position: 4
---

# Contributing to Kora

Humans and coding agents follow the same standards. The
[canonical CONTRIBUTING.md](https://github.com/KoraFiveM/kora_docker_dev/blob/main/CONTRIBUTING.md)
and each resource's local CONTRIBUTING.md describe the review contract.
This guide accompanies standards revision **2026-11-12.1**.

Before editing, read the resource's README, AGENTS.md and relevant module guides.
Trace the existing API, callers and tests. Identify the owner of the behavior and
state before creating a helper. Local architectural constraints remain binding;
record policy conflicts explicitly instead of silently deleting a rule.

## Everyday workflow

1. Make the change in the owning resource repository. The Docker setup does not
   own resource source. Keep docs-site changes separate too.
2. Use the [architecture standards](./architecture-standards.md) to keep domain
   rules, adapters, state ownership and transport boundaries clear.
3. Apply four-space Lua indentation and camelCase names. StyLua settles layout,
   single-quote preference and the 120-column target.
4. Annotate public APIs with realm, parameters, returns, yielding, side effects
   and expected failure behavior. Preserve existing contracts.
5. Run [local Lua checks](./lua-tooling.md) and relevant behavior tests. Fix new
   findings and report pre-existing debt separately.
6. Update matching resource docs in the same change. Report what changed, why,
   test results and any in-game checks still needed.

Standards apply to new and relevant changed code. Extract related logic when
needed, and keep broad reformatting or restructuring in separate PRs. Do not
copy an existing violation simply because it is nearby. Tooling adoption does
not mean the existing codebase is clean. Pipeline enforcement is a separate PR;
no automatic hooks are installed.

## Review checklist

- One resource owns each rule; reuse its public API and existing validators.
- Transport handlers are thin; clients send intent, and the server resolves authority.
- Adapters preserve return shapes and invoking-resource ownership.
- Mutations handle failures, duplicate/stale requests and state changes across yields.
- Registrations, timers, entities and UI focus have cleanup paths.
- Meaningful logic and changed contracts have focused regression coverage.
- Public annotations and documentation match the code.
- Local check/lint results distinguish new findings from known debt.
- The diff contains no secrets, unrelated edits or generated noise.

Use the existing deterministic harness; do not force mock tests for trivial
wrappers or documentation-only edits. Hot-loop changes need measured idle and
active costs. Offline tests cannot stand in for an in-game check that was not run.

## Adoption

First-wave adoption covers Kora feature resources, core/lib/sql, target, theme and
utils. Inventory, voice, chat, queue, emotemenu, sound, phone-stevie and imported/demo
assets remain outside this wave. The setup repository's
[rollout inventory](https://github.com/KoraFiveM/kora_docker_dev/blob/main/standards/rollout.json)
records exact repository paths.

Each adopted resource carries its own tooling snapshot and revision. A standalone
checkout needs no Docker setup checkout. Shared templates live in the setup repo;
resource-specific source inventories, local type declarations and test commands
remain owned by their resource. Agents use the same commands and review bar as humans.
