# Kora Docs Next

A minimal Docusaurus site for Kora guides and independently versioned resource documentation. The existing `KoraFiveM/kora_docs` site is untouched. This is a fresh foundation; existing JavaScript reference content has not been migrated.

## Run locally

Use Node 22 (see `.nvmrc`) and Git:

```sh
npm ci
npm start
```

`npm start` prepares site metadata from committed documentation snapshots, then starts Docusaurus. It works without resource GitHub access.

```sh
npm test             # Offline importer tests with temporary local Git repositories
npm run test:build   # Build two fixture resources, each with two versions; verify output
npm run build        # Import pinned resource docs and build the actual site
npm run serve        # Serve build/ locally
```

## What belongs where

- Resource repositories own `docs/`, code, `fxmanifest.lua`, and release tags.
- `catalog/resources.json` pins the released resource documentation included here.
- `resource-*_versioned_docs/`, `resource-*_versioned_sidebars/`, and `resource-*_versions.json` are checked-in snapshots of published documentation so public Pages builds do not need access to private resource repositories.
- `docs/` contains shared, unversioned contributor and publishing guides.
- `src/css/custom.css` customizes the Cosmos theme with Kora neutral dark surfaces, lime `#95FF00`, and green `#22C55E`/`#4ADE80`.
- `src/pages/` contains the landing page and resource/version directory.
- `src/theme/DocVersionBadge/` wraps stock components to show a version dropdown for the active resource. Docusaurus handles version navigation and page matching.
- `.generated/` and `resource-*_versioned_*` are generated and ignored. Do not edit or commit them.

The favicon is a simple K monogram, not an official logo asset. Branding colours come from the original site's `src/styles.css`. Change appearance without changing the catalog or importer. Avoid replacing the stock router, sidebar, Markdown renderer, or syntax highlighter.

## Register a resource release

The catalog lists every Kora resource at `v0.1.0`. Resources without Markdown get a clearly labelled placeholder until documentation is added.

Example structure (replace the placeholder SHA with the real release commit):

```json
{
  "schemaVersion": 1,
  "resources": [
    {
      "id": "kora_inventory",
      "title": "Kora Inventory",
      "repository": "https://github.com/KoraFiveM/kora_inventory.git",
      "docsPath": "docs",
      "entryPage": "index",
      "latest": "2.3.0",
      "versions": [
        {
          "version": "2.3.0",
          "tag": "v2.3.0",
          "commit": "REPLACE_WITH_FULL_40_CHARACTER_COMMIT_SHA"
        }
      ]
    }
  ]
}
```

List versions newest first; `latest` explicitly selects a stable release. Each resource gets its own Docusaurus docs plugin instance. Version URLs stay explicit, including the latest version:

```text
/resources/kora_inventory/2.3.0/
/resources/kora_inventory/2.2.0/
/resources/kora_core/1.8.0/
```

`entryPage` is the Markdown document ID, normally `index`, without an extension. Use filename-based document IDs; do not override `id` in front matter. Relative Markdown and image links are resolved by Docusaurus. Keep assets inside the resource's `docsPath`.

The sync importer fetches release tags into temporary Git repositories and verifies each tag against its full pinned commit and `fxmanifest.lua` version. It copies committed regular files only; it rejects symlinks and submodules. It never executes resource install/build scripts or changes local resource checkouts. Only GitHub HTTPS source URLs are accepted by the CLI. The versioned Markdown snapshots are checked in so CI builds are self-contained.

MDX is executable build input: catalog changes are trusted-code changes and require review. Public repositories work without credentials. Private repositories require CI Git credentials with access to those repositories; the docs repository's default token alone usually cannot read other private repos. Never put tokens in the catalog or clone URLs.

## Publication

CI runs offline tests, the multi-resource fixture build, and the actual site build. GitHub Pages deploys the built site on pushes to `main`. The site and source repository are public.

Publish `build/` to your preferred static host. Set `DOCS_URL` to the real origin and `DOCS_BASE_URL` to the hosting path before building. For GitHub project Pages, use `DOCS_BASE_URL=/kora_docs_next/`. The default `https://docs.koraframe.work` is configuration, not a provisioned domain.

CI enforces append-only published catalog entries: old releases cannot be removed or repinned, and their repository/docs path stays fixed. Protect release tags upstream too. Correct released documentation through the owning resource's release policy. Establish an archive policy before retaining large numbers of versions; every retained page participates in the site build.

## Release automation boundary

This repository imports already released resource versions. Automated version bumps to `fxmanifest.lua`, changelogs, and release tags belong in each resource repository's release workflow. Those workflows are not installed or changed here.

Next integrations can propose catalog-update PRs when resources release, and add a Kora-wide selector using the central deployment manifest. Neither requires reimplementing resource versioning. Existing hash URLs and JavaScript content from the original site need a separate migration and redirect map before replacing it.

## Site integrations

Local search indexes the guides and resource documentation. The graph links guides and the latest release of each resource. Markdown versions of pages and `llms.txt` are generated at build time.

Structured data is generated before `start` and `build`. The structured-data plugin currently supplies generic website and page metadata; its automatic front-matter discovery does not cover the versioned resource routes.

## Dependency maintenance

Docusaurus and direct dependencies are pinned in package.json, with a committed npm lockfile. Explicit overrides select patched `tinypool`, `serialize-javascript`, and `sockjs`'s `uuid`; remove them when upstream constraints adopt patched versions. Run the fixture build when updating these dependencies.

`npm audit` may still report the upstream `deepmerge` prototype-poisoning advisory through Docusaurus's SVG tooling; there is no patched published version in the current dependency line. Only reviewed repository content participates in builds. Recheck upstream fixes during dependency updates.

Automatic documentation patch releases are configured in `docs/publishing-resources.md`. They are disabled until the GitHub App secrets and repository variable are configured.
