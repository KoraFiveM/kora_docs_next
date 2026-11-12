---
title: Testing
sidebar_position: 9
---

# Testing

Run these from the resource root with `kora_lib` checked out next to it (`../kora_lib`), because the Lua tests load its mocks and build files.

| Command | What it checks |
| --- | --- |
| `lua tests/legacy_exports.lua` | Every shell handler is provided under `qb-interior`, factory return shape, `CreateApartmentFurnished` POI points, the bundled `CreateGarageMed` and `CreateFurniMotelStandard` assets, and `DespawnInterior`. |
| `lua tests/geometry.lua` | `createGeometry` and `removeGeometry` behaviour: ownership, placement modes, rejection of invalid input, cleanup on owner stop. |
| `python3 tests/shell_assets.py` | Re-reads `stream/starter_shells_k4mb1.ytyp`, checks the 16 bundled factories against their archetypes and fails if `bundled-shell-bounds.json` is stale. Run with `--update` to rewrite the report. |

None of these start FiveM.

`tests/checklist-core-and-libraries.feature` holds four manual QA scenarios for `kora_qa` (registered with `qa_feature` in `fxmanifest.lua`): shell loads when entered, exit position and heading, shell removed on leaving, and the `createGeometry` / `removeGeometry` exports via `/runcode`.
