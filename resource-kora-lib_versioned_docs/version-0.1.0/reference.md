---
title: API index
permalink: /reference/
---

# API index

Every public kora_lib namespace has a reference page. Each page is generated from the `docs.md` file beside its implementation, and every normal exported function is checked against both that guide and `types.lua` by the test suite.

## Core

- [Cache](/reference/cache/) — fast local-player state and consumer-owned cached values
- [Configuration](/reference/config/) — typed, owner-editable resource settings
- [Callbacks](/reference/callback/) — promise-based client/server request and response
- [Events](/reference/events/) — client/server messages with session correlation and optional rate limits
- [Hash lookup](/reference/lookup/) — GTA model, weapon, component, object, ped, and pickup names
- [Locales](/reference/locales/) — language selection, lookup, and interpolation
- [Resources](/reference/resources/) — owner tracking and automatic cleanup registries
- [State bags](/reference/state/) — normalized state-bag subscriptions
- [Streaming](/reference/stream/) — models, animation data, effects, textures, audio, and collision

## Interface and player input

[Controls](/reference/controls/), [instructional buttons](/reference/instructional/), [interactions](/reference/interact/), [keybinds](/reference/keybind/), [minigames](/reference/minigames/), [NUI](/reference/nui/), [notifications](/reference/notify/), [progress bars](/reference/progressbar/), [text UI](/reference/textui/), and [theme](/reference/theme/).

## World and entities

[Animations](/reference/anim/), [blips](/reference/blips/), [camera overlays](/reference/camera/), [closest-entity helpers](/reference/closest/), [distance checks](/reference/distancecheck/), [drawing](/reference/drawing/), [developer editors](/reference/editor/), [entities](/reference/entities/), [effects](/reference/fx/), [freecam](/reference/freecam/), [placement](/reference/placement/), [raycasts](/reference/raycast/), [sound](/reference/sound/), [teleporting](/reference/teleport/), [vehicles](/reference/vehicle/), [visual effects](/reference/visuals/), [world queries](/reference/world/), and [zones](/reference/zones/).

## Gameplay and server systems

[Actions](/reference/actions/), [commands](/reference/commands/), [Discord](/reference/discord/), [logging](/reference/logging/), [permissions](/reference/permissions/), [QA hooks](/reference/qa/), [rewards](/reference/rewards/), [screenshots](/reference/screenshot/), [skills](/reference/skills/), and [status effects](/reference/status/).

## Utilities and compatibility

[Loops](/reference/loops/), [print helpers](/reference/prints/), [random selection](/reference/random/), [require](/reference/require/), [timers](/reference/timers/), and [general utilities](/reference/util/).

The [ox_lib provider](/reference/ox/) is primarily an implementation contract for the separate compatibility resource. Most consumers should start with the [ox_lib migration guide](/migration/ox-lib/) instead.
