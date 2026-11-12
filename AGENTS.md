# Kora Docs Next

Read README.md before editing. This repository is a Docusaurus documentation site, separate from the Docker setup and the original kora_docs.

Resource Markdown belongs in the owning resource repository. Register released docs in catalog/resources.json with exact full commit SHAs and tags; never replace an already published version's commit. Generated content and build output are ignored and must not be committed.

Keep styling in src/css/custom.css and presentational pages. Prefer stock Docusaurus behaviour and plain Markdown. The only theme wrapper provides an active-resource version dropdown. Keep importer and catalog changes independent of cosmetic work.

Run npm test and npm run build. Importer tests use temporary local Git repositories and must not fetch or modify real resource repositories. Do not enable hosting, change resource repositories, or publish releases merely to validate the site.

## Shared contributor guides

Read docs/contributing.md, docs/lua-tooling.md and docs/architecture-standards.md
for the shared human/agent standards. The Docker setup repository owns the canonical
CONTRIBUTING.md and tooling templates; keep these explanatory guides consistent.
Do not change released resource snapshots to publish shared contributor guidance.

Copyright © 2026 Kora Framework (new contribution guidance).
