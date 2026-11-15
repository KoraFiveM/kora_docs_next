---
title: Add resources
sidebar_position: 4.5
---

# Add resources to a server

You can add resources to a server you have already installed, without installing again. Anything a resource depends on is added with it, and resources that are already installed are skipped. Existing servers are not rearranged: nothing is moved, renamed or removed, and only the missing `ensure` lines are appended to `server.cfg`. See [Resources and folders](./resources.md).

There are three ways to say what to add.

## With a code from the website

On [koraframe.work/installer](https://koraframe.work/installer) open the **Add resources** tab, pick the resources and choose **Create add-resources code**. The page shows a one-time code and a one-line command for Linux and for Windows. It has the form:

```bash
kora add-resources YOUR-SERVER-NAME --code KORA-7F3K-92QX
```

Replace `YOUR-SERVER-NAME` with the name shown by `kora status` (or the server folder). No license key is needed. The code only carries the list of resources; it works with `kora add-resources` and is not accepted by `kora install --code`.

## With resource ids

```bash
kora add-resources my-server --resource some_resource --resource another_one
```

`--resource` can be repeated, and cannot be combined with `--code`.

## By browsing in the manager

Open `kora manager`, select the server and press `g` (**Add resources**). You can paste a code or browse compatibility resources, bridges and creator resources. See [Report an issue and open a pull request](./report-and-pr.md) for the other manager keys added in v0.3.0.

## What happens

Kora lists what it will add, marked `(needed by another)` for dependencies, with the folder each goes to and whether it is pinned, a branch head or your fork, then asks you to confirm. On a development server, Kora's own resources are cloned from your fork, and Kora offers to sign you in to GitHub first if needed. Bridge and creator resources are always pinned, never forked. When it is done, restart the server to load the new resources.

| Option | Meaning |
| --- | --- |
| `--code <CODE>` | A code made on the website's **Add resources** tab. |
| `--resource <ID>` | A catalog resource id (repeatable). |
| `--dry-run` | Show what would be added, change nothing. |
| `-y`, `--yes` | Do not ask for confirmation. |

Without `--code` or `--resource` the command stops with exit code `2` and points you to the manager.
