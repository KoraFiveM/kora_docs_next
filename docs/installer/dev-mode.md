---
title: Development mode
sidebar_position: 1.5
---

# Development mode

Development mode creates **forks** of the Kora resources and clones them from there, so you can change a resource and send the change back. See [Production and development](./overview.md#production-and-development) for how it differs from production.

## Signing in to GitHub

In the wizard, Kora signs you in to GitHub for you (it uses the GitHub CLI, `gh`, which it can install). You get a **one-time code**:

1. Copy the code (the **Copy** button, or `C`).
2. Open GitHub (the **Open** button, or `O`) and enter the code.
3. Return to the wizard; it continues on its own.

If you are already signed in, this step is skipped.

## Choosing where your forks go

The next screen lists the places your forks can go: **your own account**, then each **organisation** you belong to. An entry shown in grey cannot be used, and the reason is shown next to it. Use `Up`/`Down` and `Enter`, `R` to refresh the list, or `T` to type a name yourself.

An organisation keeps all the copies together and lets your team share them; your own account works too.

### Create a new organisation

Choose **Create a new organisation** (or press `N`). GitHub does not allow organisations to be created through its API, so Kora cannot do it for you: it opens GitHub's page, you create the organisation there, then come back and press **Refresh** / **I'm done**. Kora spots the new organisation and selects it.

### Your choice is remembered

Kora remembers your last choice and offers it first next time.

## From the command line

List the places forks can go:

```bash
kora github owners
kora install --github-owner list     # the same list
```

Then pass your choice for a headless install:

```bash
kora install --mode dev --github-owner my-org --code KORA-7F3K-92QX ...
```

A headless dev install must have `--github-owner`; the website never decides where your forks go. Kora checks the value against the real list and tells you if it cannot be used. These commands need `gh` installed and signed in (`gh auth login`). Your token needs the `repo` and `read:org` scopes.

Kora never pushes to the Kora repositories and never deletes your forks.
