---
title: Publishing resources
sidebar_position: 3
---

# Publishing resources

Resource documentation is published from tagged commits. The automatic reconciler checks `dev` every ten minutes and can also be run manually. When only documentation and contributor instructions have changed since the latest release, it increments the resource patch version, commits `fxmanifest.lua`, creates the matching tag, and registers its pinned GitHub commit in the catalog. The Pages workflow then publishes it.

If code changes are mixed in with documentation changes, the reconciler reports the resource for a deliberate release instead of guessing that a patch bump is safe. Existing released catalog entries and tags stay pinned. A version commit to `dev` triggers the existing shared-dev deployment workflow.

For manual publication, release the resource in its own repository, add the new version and commit to `catalog/resources.json`, run `npm run build` with access to the resource repos, and submit only the catalog update through the usual docs repository workflow.

Start/build imports the catalogued docs directly from GitHub. Generated Markdown, sidebars and version lists are ignored build inputs; do not include them in publication commits. `npm run docs:sync` is an additional tag audit that requires all historical release tags to remain available.

## Enable automatic releases

An organisation administrator must install a GitHub App on the docs repository and the Kora resource repositories with **Contents: read and write** permission. Store its app ID as `KORA_DOCS_APP_ID` and private key as `KORA_DOCS_APP_PRIVATE_KEY` in the docs repository’s Actions secrets. Permit the app to push to the resources’ `dev` branches and the docs repository’s `main` branch under any branch rules. Set the repository Actions variable `DOCS_RELEASE_AUTOMATION_ENABLED` to `true`, then run **Reconcile resource documentation releases** once using Actions. Until then, the workflow is disabled.

The app token is scoped to Contents permission. GitHub App commits to this repository trigger the existing Pages workflow. A failed push is retried on the next reconciliation; successfully created tags are imported on the next run if publication was interrupted.
