---
title: Development mode
sidebar_position: 1.5
---

# Development mode

Development mode clones the Kora resources from **forks** on your GitHub account or organisation, so you can change a resource and send the change back. See [Production and development](./overview.md#production-and-development) for how it differs from production.

## Signing in to GitHub

The install wizard (in the panel or the terminal) signs you in to GitHub for you. It uses the GitHub CLI, `gh`, which it can install. You get a **one-time code**:

1. Copy the code (the **Copy** button, or `C` in the terminal).
2. Open GitHub (the **Open** button, or `O`) and enter the code.
3. Return to the wizard; it continues on its own.

If you are already signed in, this step is skipped. When Kora runs with `sudo` on Linux, GitHub commands still use your own GitHub sign-in.

## Choosing where your forks go

The wizard lists the places your forks can go: **your own account**, then each **organisation** you belong to. An entry shown in grey cannot be used, and the reason is shown next to it. You can refresh the list or type a name yourself.

An organisation keeps all the copies together and lets your team share them; your own account works too.

### Create a new organisation

Choose **Create a new organisation**. GitHub does not allow organisations to be created through its API, so Kora cannot do it for you: it opens GitHub's page, you create the organisation there, then come back and refresh. Kora spots the new organisation and selects it.

Kora remembers your last choice and offers it first next time.

## Forks you already have

Kora reuses a fork you already have of each Kora repository, even if GitHub named it `name-1`, you renamed it, or it is a fork of another fork: it recognises a fork by the repository it comes from, not by its name. A repository of yours with the same name that is not a fork of the Kora repository is refused, never used.

Progress says how many forks were created and how many reused, for example "created 2 forks, reused 14 you already had". The same applies when you [add resources](./add-resources.md).

An existing fork that is only behind the Kora repository is brought up to date on GitHub (a fast-forward, never forced). A fork with commits of its own is not touched: the install result and `install.log` list it with the safe fix (`git fetch upstream && git merge upstream/<branch>`, then push).

## From the command line

List the places forks can go:

```bash
kora github owners
kora install --github-owner list     # the same list
```

Then pass your choice for an unattended install:

```bash
kora install --mode dev --github-owner my-org --name dev ...
```

An unattended development install must have `--github-owner`. If `gh` is not installed or signed in yet, Kora sets it up and signs you in in the browser, then checks the owner before anything is forked. Your token needs the `repo` and `read:org` scopes.

Kora never pushes to the Kora repositories and never deletes your forks.

## Updates and pull requests

A development server updates itself on a schedule (daily at 04:00 by default); see [Updating](./updating.md). To send a change back, use the panel's **GitHub** tab or press `p` in `kora manager` (**Open pull request**); see [Report an issue and open a pull request](./report-and-pr.md).
