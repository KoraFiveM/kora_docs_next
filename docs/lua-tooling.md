---
title: Kora Framework Lua style and local tooling
sidebar_position: 5
---

# Kora Framework Lua style and local tooling

Use **StyLua 2.6.0**, **LuaLS 3.19.2**, and Python 3.10+.
Install the appropriate official release assets:
[StyLua](https://github.com/JohnnyMorganz/StyLua/releases/tag/v2.6.0) and
[LuaLS](https://github.com/LuaLS/lua-language-server/releases/tag/3.19.2).
Extract the whole LuaLS distribution and put its executable on PATH. Use Linux
binaries in WSL. `KORA_STYLUA` and `KORA_LUA_LANGUAGE_SERVER` may specify executable
paths instead; the runner verifies exact versions.

Each adopted resource's `.standards/README.md` is the complete local reference.
Pins and definition provenance travel with the resource. Checks do not download
dependencies or need FXServer. Missing tools or definitions are errors.

## Commands

From a resource root:

```sh
python3 tools/lua_quality.py list
python3 tools/lua_quality.py check
python3 tools/lua_quality.py lint --realm server
python3 tools/lua_quality.py lint --realm client
```

To work on particular files, use paths present in that resource, for example in
garages:

```sh
python3 tools/lua_quality.py check server/server.lua
python3 tools/lua_quality.py format client/client.lua
```

`check` runs formatting verification and static diagnostics without editing source.
`lint` runs diagnostics only. `format` rewrites explicitly named files/directories;
it refuses an invocation without targets. Exit 0 means clean, 1 means findings,
and 2 means a tooling/configuration error.

Full-resource checks expose existing debt. Fix findings introduced by the change
and report old findings honestly. Scoped checks analyze the necessary realm context
but report selected files. There is no hidden baseline or blanket suppression.
Local checks are available now; pipeline enforcement and automatic hooks are deferred.

## Style

Use four spaces, camelCase locals/functions, descriptive names and early returns.
Keep existing public names and FiveM native spelling. Prefer single quotes and a
120-column target; committed StyLua configuration determines the exact output.
Avoid dense one-line branches, clever global mutation and unnecessary indirection.

```lua
---Server: resolves an owned record; may yield.
---@param src integer Connected player server ID.
---@param recordId integer Server-owned record identifier.
---@return table? record
---@return string? errorMessage
local function findOwnedRecord(src, recordId)
    if type(recordId) ~= 'number' or recordId % 1 ~= 0 or recordId <= 0 then
        return nil, 'invalid record ID'
    end

    return Records.findOwned(src, recordId)
end
```

Use annotations for public contracts, and runtime validation for untrusted input.
Preserve existing error/boolean/multi-return conventions. New fallible Lua APIs
normally return a value plus an optional error string.

## Realm boundaries and definitions

`.standards/resource.json` explicitly assigns Lua source to client, server, shared,
manifest or test contexts. Add new files and their manifest entries together.
Unknown files fail rather than being guessed into a realm. Dynamically loaded
files and consumer includes also need an inventory entry.

The CLI isolates client/server contexts, analyzes shared code separately, and keeps
manifest globals and test mocks out of runtime checks. FiveM definitions retain
native realm markers; Kora Framework API fields are filtered by their documented realm.
Generated/browser/vendor/runtime files are excluded. Runtime build loaders are
included. Resource-specific declarations may extend the appropriate
`.standards/definitions-<realm>/` directory without wildcard globals.

Dynamic exports, deliberate runtime realm branches and incomplete existing
annotations limit static proof. Report these findings; do not suppress an entire
resource to claim success. Behavior tests still need to verify authority and lifecycle.

Use the StyLua and LuaLS editor extensions, with the committed formatter config.
An editor indexing both realms together cannot enforce the CLI's isolation. Avoid
workspace-wide native allowlists and keep CLI results authoritative.

---

Copyright © 2026 Kora Framework.
