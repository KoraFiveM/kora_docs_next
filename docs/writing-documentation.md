---
title: Writing documentation
sidebar_position: 2
---

# Writing documentation

Keep resource documentation in that resource repository's `docs/` directory. Update it in the same pull request as the code it describes.

Use ordinary Markdown, relative links, fenced code blocks with language names, and relative image paths. Docusaurus front matter can set `title` and `sidebar_position`. Start with `index.md`, then add installation, configuration, and API pages as needed.

```lua
-- Example manifest metadata; use the resource's actual release number.
version '1.2.0'
```

Use `fxmanifest.lua`'s `version` field for the resource version. Its `fx_version` field describes FiveM compatibility and is managed separately.

Prefer Markdown to MDX. MDX executes code during the trusted site build; register only repositories and commits reviewed by the maintainers. No resource install scripts or frontend builds run during import.

Keep assets under `docs/`, and use relative links so old releases remain self-contained. Avoid root-relative links into a different resource version.

Code and documentation contributors follow [the shared contribution standards](./contributing.md).
Document public API realms, units, returns, yielding/failure behavior and ownership;
use the [architecture guide](./architecture-standards.md) and
[Lua tooling guide](./lua-tooling.md) when changing code examples.

Copyright © 2026 Kora Framework (new contribution guidance).
