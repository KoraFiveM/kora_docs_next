import {execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {importDocs, validateCatalog} from './import-docs.mjs';

const root = process.cwd();
const catalogFile = path.join(root, 'catalog/resources.json');
const catalog = JSON.parse(await fs.readFile(catalogFile, 'utf8'));
const allowLocal = process.argv.includes('--allow-local-for-tests');
validateCatalog(catalog, {allowLocal});
const scratch = await fs.mkdtemp(path.join(os.tmpdir(), 'kora-docs-reconcile-'));
const failures = [];
await fs.rm(path.join(root, 'docs-reconcile-errors.txt'), {force:true});
let changed = false;
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], {
  encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
  env: {...process.env, GIT_TERMINAL_PROMPT: '0'},
}).trim();
const stable = tag => /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(tag);
const compare = (a, b) => {
  const left = a.replace(/^v/, '').split('.').map(Number), right = b.replace(/^v/, '').split('.').map(Number);
  return left[0]-right[0] || left[1]-right[1] || left[2]-right[2];
};
const docsFile = (file, resource) => {
  const current = resource.versions.find(item => item.version === resource.latest);
  const source = current && Object.hasOwn(current, 'docsPath') ? current.docsPath : resource.docsPath;
  return file.startsWith('docs/') || /^readme\.md$/i.test(file) || (typeof source === 'string' && /\.mdx?$/i.test(source) && file === source);
};
const safeOther = file => file === 'AGENTS.md';

async function sourceFor(repo, tag, resource) {
  let files = [];
  try { files = git(repo, 'ls-tree', '-r', '--name-only', tag, '--', 'docs').split('\n').filter(Boolean); } catch { /* no docs */ }
  const markdown = files.filter(file => /\.mdx?$/i.test(file));
  if (markdown.length) {
    const entry = markdown.find(file => /^docs\/(index|readme)\.mdx?$/i.test(file)) ?? markdown.sort()[0];
    return {docsPath:'docs', entryPage:entry.slice(5).replace(/\.mdx?$/i, ''), docsAvailable:true};
  }
  const rootFiles = git(repo, 'ls-tree', '--name-only', tag).split('\n');
  const current = resource.versions.find(item => item.version === resource.latest);
  const previous = current && Object.hasOwn(current, 'docsPath') ? current.docsPath : resource.docsPath;
  const preferred = typeof previous === 'string' && /\.mdx?$/i.test(previous) && rootFiles.includes(previous) ? previous : null;
  const markdownFile = preferred ?? rootFiles.find(file => /^readme\.md$/i.test(file)) ?? rootFiles.find(file => /\.mdx?$/i.test(file) && file !== 'AGENTS.md');
  return markdownFile ? {docsPath:markdownFile,entryPage:'index',docsAvailable:true} : {docsPath:null,entryPage:'index',docsAvailable:false};
}

async function addSnapshot(resource, repo, tag) {
  const version = tag.slice(1), commit = git(repo, 'rev-parse', `${tag}^{commit}`);
  const source = await sourceFor(repo, tag, resource);
  const release = {version, tag, commit, docsPath:source.docsPath, entryPage:source.entryPage};
  const snapshotSite = await fs.mkdtemp(path.join(scratch, 'snapshot-'));
  const single = {...resource, docsPath:source.docsPath, entryPage:source.entryPage, docsAvailable:source.docsAvailable, latest:version, versions:[release]};
  await importDocs({siteDir:snapshotSite, catalog:{schemaVersion:1,resources:[single]}, sync:true, allowLocal});
  const plugin = `resource-${resource.id}`;
  for (const file of [`${plugin}_versioned_docs/version-${version}`, `${plugin}_versioned_sidebars/version-${version}-sidebars.json`]) {
    const destination = path.join(root, file);
    try { await fs.access(destination); throw new Error(`Snapshot already exists: ${file}`); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    await fs.mkdir(path.dirname(destination), {recursive:true});
    await fs.cp(path.join(snapshotSite, file), destination, {recursive:true});
  }
  resource.versions.unshift(release);
  resource.versions.sort((a,b) => compare(b.version,a.version));
  resource.latest = resource.versions[0].version;
  resource.docsAvailable = source.docsAvailable;
  await fs.writeFile(path.join(root, `${plugin}_versions.json`), JSON.stringify(resource.versions.map(item=>item.version),null,2)+'\n');
  changed = true;
  console.log(`${resource.id}: imported ${tag} at ${commit}`);
}

async function reconcile(resource) {
  const repo = path.join(scratch, resource.id);
  await fs.mkdir(repo);
  git(repo, 'init', '--quiet');
  git(repo, 'remote', 'add', 'origin', resource.repository);
  git(repo, 'fetch', '--quiet', '--filter=blob:none', '--depth=200', 'origin', '+refs/heads/dev:refs/remotes/origin/dev', '+refs/tags/*:refs/tags/*');
  let tags = git(repo, 'tag', '--list', 'v*').split('\n').filter(stable).sort(compare);
  for (const release of resource.versions) {
    if (!tags.includes(release.tag)) throw new Error(`catalog tag ${release.tag} missing`);
    if (git(repo, 'rev-parse', `${release.tag}^{commit}`) !== release.commit) throw new Error(`catalog tag ${release.tag} moved`);
  }
  for (const tag of tags.filter(tag => compare(tag, resource.latest)>0)) await addSnapshot(resource, repo, tag);
  const base = `v${resource.latest}`;
  const files = git(repo, 'diff', '--name-only', `${base}..refs/remotes/origin/dev`).split('\n').filter(Boolean);
  if (!files.some(file => docsFile(file, resource))) return;
  const unsafe = files.filter(file => !docsFile(file, resource) && !safeOther(file));
  if (unsafe.length) throw new Error(`documentation changes are mixed with code changes since ${base}: ${unsafe.slice(0,5).join(', ')}`);
  // A patch release must descend from the previous release; do not guess across rewrites.
  git(repo, 'merge-base', '--is-ancestor', `${base}^{commit}`, 'refs/remotes/origin/dev');
  const manifest = git(repo, 'show', 'refs/remotes/origin/dev:fxmanifest.lua');
  const versionPattern = /^(\s*version\s*['"])([^'"]+)(['"])/gm;
  const matches = [...manifest.matchAll(versionPattern)];
  if (matches.length !== 1 || matches[0][2] !== resource.latest) throw new Error(`dev manifest version does not match ${base}`);
  const components = resource.latest.split('.').map(Number); components[2]++;
  const next = components.join('.'), nextTag = `v${next}`;
  if (tags.includes(nextTag)) throw new Error(`${nextTag} already exists`);
  git(repo, 'checkout', '--quiet', '--detach', 'refs/remotes/origin/dev');
  const current = await fs.readFile(path.join(repo, 'fxmanifest.lua'), 'utf8');
  await fs.writeFile(path.join(repo, 'fxmanifest.lua'), current.replace(versionPattern, `$1${next}$3`));
  git(repo, 'add', 'fxmanifest.lua');
  git(repo, '-c', 'user.name=Kora Docs Automation', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com', 'commit', '--quiet', '-m', `chore: release documentation v${next}`);
  git(repo, 'tag', nextTag);
  // Atomic push ensures the version commit and tag appear together; a concurrent push fails safely.
  git(repo, 'push', '--atomic', 'origin', 'HEAD:refs/heads/dev', `refs/tags/${nextTag}:refs/tags/${nextTag}`);
  console.log(`${resource.id}: released ${nextTag}`);
  await addSnapshot(resource, repo, nextTag);
}

try {
  for (const resource of catalog.resources) {
    try { await reconcile(resource); }
    catch (error) { failures.push(`${resource.id}: ${error.message}`); console.error(`ERROR ${failures.at(-1)}`); }
  }
  if (changed) await fs.writeFile(catalogFile, JSON.stringify(catalog,null,2)+'\n');
  if (failures.length) {
    await fs.writeFile(path.join(root, 'docs-reconcile-errors.txt'), failures.join('\n')+'\n');
    console.error(`${failures.length} resource(s) need attention; successful snapshots can still be published.`);
  }
} finally { await fs.rm(scratch,{recursive:true,force:true}); }
