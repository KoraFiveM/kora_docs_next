# Kora Docs Next

A minimal Docusaurus site for Kora guides and independently versioned resource documentation. The existing `KoraFiveM/kora_docs` site is untouched. This is a fresh foundation; existing JavaScript reference content has not been migrated.

## Run locally

Use Node 22 (see `.nvmrc`) and Git:

```sh
npm ci
npm start
```

`npm start` imports the registered resource docs, then starts Docusaurus. With the initial empty catalog, it works without resource GitHub access. Stop and restart after changing the catalog.

```sh
npm test             # Offline importer tests with temporary local Git repositories
npm run test:build   # Build two fixture resources, each with two versions; verify output
npm run build        # Import pinned resource docs and build the actual site
npm run serve        # Serve build/ locally
```

## What belongs where

- Resource repositories own `docs/`, code, `fxmanifest.lua`, and release tags.
- `catalog/resources.json` pins the released resource documentation included here.
- `docs/` contains shared, unversioned contributor and publishing guides.
- `src/css/custom.css` contains the minimal Kora theme: neutral dark surfaces, lime `#95FF00`, green `#22C55E`/`#4ADE80`, and system fonts.
- `src/pages/` contains the landing page and resource/version directory.
- `src/theme/DocVersionBadge/` wraps stock components to show a version dropdown for the active resource. Docusaurus handles version navigation and page matching.
- `.generated/` and `resource-*_versioned_*` are generated and ignored. Do not edit or commit them.

The favicon is a simple K monogram, not an official logo asset. Branding colours come from the original site's `src/styles.css`. Change appearance without changing the catalog or importer. Avoid replacing the stock router, sidebar, Markdown renderer, or syntax highlighter.

## Register a resource release

The catalog starts empty deliberately. Add real versions only after the resource has committed Markdown docs and a matching manifest version.

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

The importer fetches release tags into temporary Git repositories and verifies each tag against its full pinned commit and `fxmanifest.lua` version. It copies committed regular files only; it rejects symlinks and submodules. It never executes resource install/build scripts or changes local resource checkouts. Only GitHub HTTPS source URLs are accepted by the CLI; tests explicitly allow temporary local repositories.

MDX is executable build input: catalog changes are trusted-code changes and require review. Public repositories work without credentials. Private repositories require CI Git credentials with access to those repositories; the docs repository's default token alone usually cannot read other private repos. Never put tokens in the catalog or clone URLs.

## Publication

CI runs offline tests, the multi-resource fixture build, and the actual site build. It uploads `documentation-site` as an artifact. No hosting or custom domain is enabled automatically.

Publish `build/` to your preferred static host. Set `DOCS_URL` to the real origin and `DOCS_BASE_URL` to the hosting path before building. For GitHub project Pages, use `DOCS_BASE_URL=/kora_docs_next/`. The default `https://docs.koraframe.work` is configuration, not a provisioned domain.

CI enforces append-only published catalog entries: old releases cannot be removed or repinned, and their repository/docs path stays fixed. Protect release tags upstream too. Correct released documentation through the owning resource's release policy. Establish an archive policy before retaining large numbers of versions; every retained page participates in the site build.

## Release automation boundary

This repository imports already released resource versions. Automated version bumps to `fxmanifest.lua`, changelogs, and release tags belong in each resource repository's release workflow. Those workflows are not installed or changed here.

Next integrations can propose catalog-update PRs when resources release, and add a Kora-wide selector using the central deployment manifest. Neither requires reimplementing resource versioning. Existing hash URLs and JavaScript content from the original site need a separate migration and redirect map before replacing it.

## Dependency maintenance

Docusaurus and direct dependencies are pinned in package.json, with a committed npm lockfile. Explicit overrides select patched `tinypool`, `serialize-javascript`, and `sockjs`'s `uuid`; remove them when upstream constraints adopt patched versions. Run the fixture build when updating these dependencies.

`npm audit` may still report the upstream `deepmerge` prototype-poisoning advisory through Docusaurus's SVG tooling; there is no patched published version in the current dependency line. Only reviewed repository content participates in builds. Recheck upstream fixes during dependency updates.
