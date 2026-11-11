---
title: Publishing resources
sidebar_position: 3
---

# Publishing resources

1. Release the resource in its owning repository. The release commit should contain the code, `docs/`, and matching `fxmanifest.lua` version.
2. Open a pull request updating `catalog/resources.json` in this repository. Record the full commit SHA, readable tag, version, docs directory, and entry page.
3. Run `npm ci`, `npm test`, and `npm run build`. CI checks the tag resolves to the recorded commit, the manifest version matches, and the docs build with valid links.
4. Merge the catalog update. Publish the generated `build/` directory through the chosen static host.

See the repository README for the exact catalog format. Resource releases do not modify this repository automatically yet. A future notification workflow can propose catalog PRs through the same checks.

Version routes contain explicit versions, including the latest release. The Resources page marks the selected latest stable release. Old published version entries are append-only: keep their pinned commits and source tags unchanged.

Publishing a resource or deploying the game server does not automatically deploy this docs site. A Kora-wide release selector is planned separately; this site currently selects versions per resource.
