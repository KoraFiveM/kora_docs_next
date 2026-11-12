---
title: Troubleshooting
sidebar_position: 10
---

# Troubleshooting

## An optional factory errors or does nothing

The 109 factories in `client/optional.lua` reference models that are not in this resource's `stream/` folder. If the pack is not installed, `Kora.stream.loadModel` raises an "Invalid model" assertion error for the unknown model, which surfaces as a script error in the caller rather than a `false, reason` return. Install and stream the matching pack, or do not call that factory.

## A factory errors when it cannot return a shell

Factories return `false, reason` if the model does not stream or the object cannot be created. `CreateApartmentFurnished` then indexes the failed result (`shell[2]`) and raises a Lua error. Other factories return the `false` to the caller.

## The shell appears shifted or the exit is wrong

`legacy` placement uses `CreateObject`, which applies the model offset; `centered` uses `CreateObjectNoOffset`. Pick the mode that matches how the exit offsets were authored (the stock factories use `legacy`). See [Shell geometry](./shell-geometry.md).

## `createGeometry` returns `false`

The second return value is the reason. Possible messages from the code: `Invalid shell origin.`, `Invalid shell placement mode.`, `A shell model is required.`, `Unknown shell model.`, or `Shell geometry could not be created.` (also returned if the calling resource stopped while the model was loading). See [Exports](./api/index.md).

## `removeGeometry` returns `false`

Either the argument is not a table (`Shell objects are required.`) or one of the entities was created by a different resource (`Shell geometry belongs to another resource.`). Nothing is deleted in that case.

## The legacy factory teleports the player

That is intended: legacy factories fade the screen and move the player to the exit. Use `createGeometry` for a shell without a teleport.

## Naming

The garage shell model is `shell_garagem` (`CreateGarageMed`). The old name `shell_garagemed` does not exist in this resource.
