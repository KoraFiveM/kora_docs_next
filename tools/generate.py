#!/usr/bin/env python3
"""Generate txAdmin recipe, installer manifest and bash arrays from catalog/resources.json (schema v2/v3).

Resources are emitted sorted by the required integer `order` field.
Usage: generate.py [--catalog FILE] [--out DIR] [--include-internal] [--check]
Outputs (in --out, default tools/out):
  recipe.yaml            txAdmin recipe (kind:internal and kind:optional skipped; `subpath` emitted)
  resources.manifest     path<TAB>repo[<TAB>subpath] (kind:internal and kind:optional skipped)
  resources.sh           bash arrays for setup-kora-dev.sh (public resources)
  resources.internal.sh  same, including kind:internal (written only with --include-internal)
--check regenerates in memory and fails (exit 1) if files in --out differ.
"""
import argparse, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
GROUPS = {"pre", "kora", "standalone", "cfx-default", "default-maps", "compat", "props", "bridges", "creators", "other"}
KINDS = {"kora", "dependency", "optional", "internal"}
PAUSE_EVERY = 3      # downloads between waste_time pauses (txAdmin rate limiting)
PAUSE_SECONDS = 5
REQUIRED = ("id", "repository", "path", "group", "kind", "branch", "order")


def load(catalog):
    with open(catalog, encoding="utf-8") as f:
        data = json.load(f)
    if data.get("schemaVersion") not in (2, 3):
        sys.exit(f"{catalog}: schemaVersion is {data.get('schemaVersion')!r}, need 2 or 3")
    res = data["resources"]
    seen = set()
    for r in res:
        miss = [k for k in REQUIRED if r.get(k) in (None, "", 0)]
        if miss:
            sys.exit(f"resource {r.get('id')!r}: missing {miss}")
        if r["group"] not in GROUPS or r["kind"] not in KINDS:
            sys.exit(f"resource {r['id']}: bad group/kind")
        if r["path"] in seen:
            sys.exit(f"duplicate path {r['path']}")
        seen.add(r["path"])
        if type(r["order"]) is not int or r["order"] < 1:
            sys.exit(f"resource {r['id']}: order must be an integer >= 1")
    orders = [r["order"] for r in res]
    if len(set(orders)) != len(orders):
        sys.exit("duplicate order values")
    return res


def ordered(res):
    """Sorted by `order`; a resource nested inside another's path still comes after its parent."""
    paths = {r["path"] for r in res}
    out, done, pending = [], set(), sorted(res, key=lambda r: r["order"])
    while pending:
        progressed = False
        for r in list(pending):
            parent = r["path"].rsplit("/", 1)[0] if "/" in r["path"] else None
            if parent in paths and parent not in done:
                continue
            out.append(r); done.add(r["path"]); pending.remove(r); progressed = True
        if not progressed:
            sys.exit("path nesting cycle")
    return out


def is_default(r, include_internal=False):
    """Default install set: optional resources (e.g. compat ox-lib) are never installed by default."""
    return r["kind"] != "optional" and (include_internal or r["kind"] != "internal")


def repo_url(r):
    u = r["repository"].rstrip("/")
    return u[:-4] if u.endswith(".git") else u


def repo_git(r):
    return repo_url(r) + ".git"


def repo_name(r):
    return repo_url(r).rsplit("/", 1)[1]


def fs_path(r):
    # Creator folders keep their brackets ([creators]/[<id>]/<name>) so FiveM scans them.
    # All other folders keep the historical bracket-stripped form used by the manifest/bash outputs.
    if r.get("type") == "creator" or r["path"].startswith("[creators]/"):
        return r["path"]
    return r["path"].replace("[", "").replace("]", "")


def read(name):
    with open(os.path.join(HERE, "templates", name), encoding="utf-8") as f:
        return f.read()


# Folder ensures appended to server.cfg (folders only; mirrors website/src/lib/recipe/generate.ts ensureFolders).
FOLDER_ORDER = ["[cfx-default]", "[compat]", "[pre]", "[standalone]", "[default-maps]", "[kora]", "[bridges]", "[creators]"]
LEGACY_FOLDERS = ("[pre]", "[standalone]", "[default-maps]")
ADDONS_DIR = "[addons]"
STREAMED_DIRS = ("[cars]", "[maps]", "[props]", "[peds]")


def ensure_folders(items):
    tops = []
    for r in items:
        top = r["path"].split("/")[0]
        if top.startswith("[") and top.endswith("]") and top not in tops:
            tops.append(top)
    known = set(FOLDER_ORDER) | {ADDONS_DIR, "[streamedassets]"}
    extra = [t for t in tops if t not in known]  # unknown bracketed folders: after the legacy ones, before [kora]
    order = FOLDER_ORDER[:5] + extra + FOLDER_ORDER[5:]
    return [f for f in order if f in tops] + [ADDONS_DIR, "[streamedassets]"]


def inline_file(template, dest):
    """write_file step embedding tools/templates/<template> verbatim (txAdmin {{vars}} stay literal)."""
    body = read(template)
    if not body.endswith("\n") or body[:1] in " \t\n":
        sys.exit(f"templates/{template}: must end with a newline and not start with whitespace")
    lines = "".join(("    " + l if l.strip() else l) for l in body.splitlines(True))
    return f"- action: write_file\n  file: {dest}\n  data: |\n{lines}"


def render_header():
    out = []
    for line in read("recipe.header.yaml").splitlines(True):
        if line.startswith("# @inline "):
            _, _, template, dest = line.split()
            out.append(inline_file(template, dest))
        else:
            out.append(line)
    return "".join(out)


def gen_recipe(res):
    parts = [render_header()]
    count = 0  # the header downloads nothing; only resource downloads count toward GitHub rate limiting
    items = [r for r in ordered(res) if is_default(r)]
    for i, r in enumerate(items):
        sub = f"  subpath: {r['subpath']}\n" if r.get("subpath") else ""
        parts.append(
            f"- action: download_github\n  src: {repo_url(r)}\n  ref: {r['branch']}\n{sub}"
            f"  dest: ./resources/{r['path']}\n")
        count += 1
        if count % PAUSE_EVERY == 0 and i != len(items) - 1:
            parts.append(f"- action: waste_time\n  seconds: {PAUSE_SECONDS}\n")
    parts.append(f"- action: ensure_dir\n  path: ./resources/{ADDONS_DIR}\n")
    for d in STREAMED_DIRS:
        parts.append(f"- action: ensure_dir\n  path: ./resources/[streamedassets]/{d}\n")
    # The template server.cfg has no ensure lines: append each folder ensure exactly once.
    ensures = "".join(f"    ensure {f}\n" for f in ensure_folders(items))
    parts.append(f"- action: write_file\n  file: ./server.cfg\n  append: true\n  data: |\n\n{ensures}")
    parts.append(read("recipe.footer.yaml"))
    return "".join(parts)


def gen_manifest(res):
    lines = ["# path<TAB>repository URL; versions follow the remote branch head.\n"]
    for r in ordered(res):
        if is_default(r):
            sub = f"\t{r['subpath']}" if r.get("subpath") else ""
            lines.append(f"resources/{fs_path(r)}\t{repo_git(r)}{sub}\n")
    return "".join(lines)


def gen_sh(res, include_internal):
    rs = [r for r in ordered(res) if is_default(r, include_internal)]
    out = ["# Generated by tools/generate.py: do not edit.\n"]
    for var, grp in (("preRepos", "pre"), ("koraRepos", "kora"), ("standaloneRepos", "standalone")):
        out.append(f"{var}=(\n")
        for r in rs:
            if r["group"] == grp:
                out.append(f"  {repo_name(r)}\n")
        out.append(")\n\n")
    out.append("# Other resources: path<TAB>repo URL<TAB>branch\notherResources=(\n")
    for r in rs:
        if r["group"] not in ("pre", "kora", "standalone"):
            sub = f"\\t{r['subpath']}" if r.get("subpath") else ""
            out.append(f"  $'resources/{fs_path(r)}\\t{repo_git(r)}\\t{r['branch']}{sub}'\n")
    out.append(")\n\n")
    out.append("# Branch per repo name (default: dev)\ndeclare -A repoBranch=(\n")
    for r in rs:
        out.append(f"  [{repo_name(r)}]={r['branch']}\n")
    out.append(")\n")
    return "".join(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--catalog", default=os.path.join(HERE, "..", "catalog", "resources.json"))
    ap.add_argument("--out", default=os.path.join(HERE, "out"))
    ap.add_argument("--include-internal", action="store_true")
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()
    res = load(a.catalog)
    files = {
        "recipe.yaml": gen_recipe(res),
        "resources.manifest": gen_manifest(res),
        "resources.sh": gen_sh(res, False),
    }
    if a.include_internal or a.check and os.path.exists(os.path.join(a.out, "resources.internal.sh")):
        files["resources.internal.sh"] = gen_sh(res, True)
    if a.check:
        bad = []
        for n, c in files.items():
            p = os.path.join(a.out, n)
            if not os.path.exists(p) or open(p, encoding="utf-8").read() != c:
                bad.append(n)
        if bad:
            sys.exit("out of date: " + ", ".join(bad) + " (run tools/generate.py)")
        print("ok: outputs up to date")
        return
    os.makedirs(a.out, exist_ok=True)
    for n, c in files.items():
        with open(os.path.join(a.out, n), "w", encoding="utf-8", newline="\n") as f:
            f.write(c)
        print("wrote", os.path.join(a.out, n))


if __name__ == "__main__":
    main()
