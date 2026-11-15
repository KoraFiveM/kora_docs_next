---
title: Report an issue and open a pull request
sidebar_position: 5.5
---

# Report an issue and open a pull request

Both actions are in `kora manager` (select a server first) and use the GitHub CLI (`gh`). If `gh` is not signed in, Kora offers to sign you in with the browser first.

| Action | Key | Available in |
| --- | --- | --- |
| **Report an issue** | `b` | production and development servers |
| **Open pull request** | `p` | development servers only |

## Report an issue

Choose a resource of the server, then write a title and a description. Kora creates the issue in that resource's repository through `gh`. It adds only the Kora version, your system, the server mode, the resource and its version (commit), and the game and server builds. It never adds paths, host names, ports, keys or passwords.

## Open a pull request

For a development server whose resource is your fork. Kora checks that there is a pull request to make (a branch of your fork with commits the original repository does not have) and shows what it will do: push that branch to your fork on GitHub and open a pull request into the original repository and branch. Nothing is sent until you confirm with **Open pull request (Enter)**.

It is not possible for:

- production servers, which use pinned copies rather than forks;
- bridge and creator resources, which belong to someone else and are pinned copies. Use **Report an issue** for those;
- a resource that is not on a branch (detached): check out a branch with your changes first.

See also [Development mode](./dev-mode.md).
