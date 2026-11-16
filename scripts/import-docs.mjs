import {execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/;
const safePath = value => typeof value === 'string' && value.length > 0 &&
  !value.startsWith('/') && !value.includes('\\') &&
  value.split('/').every(part => part !== '' && part !== '.' && part !== '..');
async function hasEntry(directory, entryPage) {
  const target = path.join(directory, entryPage);
  try {
    const basename = path.basename(target);
    const files = await fs.readdir(path.dirname(target));
    return files.some(file => file.startsWith(`${basename}.`) && /^\.mdx?$/i.test(file.slice(basename.length)));
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}
const git = (directory, args, encoding = 'utf8') => execFileSync('git', ['-C', directory, ...args], {
  encoding, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
  env: {...process.env, GIT_TERMINAL_PROMPT: '0'},
});

// Resource docs use several Markdown extensions (for example MkDocs attribute
// lists and Jinja URL variables). Normalize those into plain Markdown before
// Docusaurus's MDX parser sees them. Code blocks and inline code stay untouched.
function normalizeMarkdown(input) {
  const output = [];
  const inlineCode = [];
  let fence = null;
  for (const line of input.split('\n')) {
    const marker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
    if (marker) {
      if (!fence) fence = marker[0];
      else if (marker[0] === fence) fence = null;
      output.push(line);
      continue;
    }
    if (fence) { output.push(line); continue; }
    if (/^\s*\{:\s*[^}]+\}\s*$/.test(line)) continue;
    let text = line.replace(/<((?:https?:\/\/)[^ >]+)>/g, '[$1]($1)');
    text = text.replace(/`+[^`]*`+/g, code => `\0${inlineCode.push(code) - 1}\0`);
    text = text.replace(/\{\{\s*site\.baseurl\s*\}\}/g, '');
    text = text.replaceAll('{', '&#123;').replaceAll('}', '&#125;');
    text = text.replace(/<(?=[A-Za-z/!])/g, '&lt;');
    text = text.replace(/\0(\d+)\0/g, (_, index) => inlineCode[Number(index)]);
    output.push(text);
  }
  return output.join('\n');
}

const RESOURCE_TYPES = ['compat', 'bridge', 'creator'];
const idPattern = /^[a-z][a-z0-9_-]*$/;
const dirName = /^[A-Za-z0-9_.-]+$/;
const githubUrl = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)?$/;
// Folder layout for typed (schema v3) resources: compat -> [compat]/<name>,
// bridge -> [bridges]/<name>, creator -> [creators]/[<creatorId>]/<name> (bracketed so FiveM scans it).
// Untyped (Kora/legacy) entries keep their existing v2 paths unchanged.
function validateFolder(resource) {
  const layout = {compat: ['[compat]', 1], bridge: ['[bridges]', 1], creator: ['[creators]', 2]}[resource.type];
  if (!layout) return;
  const [root, ...rest] = typeof resource.path === 'string' ? resource.path.split('/') : [];
  if (root !== layout[0] || rest.length !== layout[1] || !rest.every((part, i) => dirName.test(part) || (resource.type === 'creator' && i === 0 && /^\[[a-z][a-z0-9_-]*\]$/.test(part)))) throw new Error(`Invalid path for ${resource.type} ${resource.id}`);
  if (resource.type === 'creator' && rest[0] !== `[${resource.creator}]`) throw new Error(`Path creator folder must be [<creator>]: ${resource.id}`);
}
function validateGraph(catalog) {
  const byId = new Map(catalog.resources.map(resource => [resource.id, resource]));
  for (const resource of catalog.resources) {
    if (resource.dependsOn === undefined) continue;
    if (!Array.isArray(resource.dependsOn) || new Set(resource.dependsOn).size !== resource.dependsOn.length) throw new Error(`Invalid dependsOn: ${resource.id}`);
    for (const dependency of resource.dependsOn) {
      if (dependency === resource.id) throw new Error(`Resource cannot depend on itself: ${resource.id}`);
      if (!byId.has(dependency)) throw new Error(`Unknown dependency ${dependency} for ${resource.id}`);
    }
  }
  const state = new Map();
  const visit = (id, trail) => {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'active') throw new Error(`Dependency cycle: ${[...trail, id].join(' -> ')}`);
    state.set(id, 'active');
    for (const dependency of byId.get(id).dependsOn ?? []) visit(dependency, [...trail, id]);
    state.set(id, 'done');
  };
  for (const id of byId.keys()) visit(id, []);
}
// Transitive dependencies of a resource id (excluding itself), in discovery order.
export function resolveDependencies(catalog, id) {
  const byId = new Map(catalog.resources.map(resource => [resource.id, resource]));
  const seen = new Set();
  const walk = current => { for (const dependency of byId.get(current)?.dependsOn ?? []) if (!seen.has(dependency)) { seen.add(dependency); walk(dependency); } };
  walk(id);
  return [...seen];
}
// Third-party types (compat, bridge, creator) never have docs on this site and are not docs plugins.
export const THIRD_PARTY_TYPES = ['compat', 'bridge', 'creator'];
export const hasDocs = resource => !THIRD_PARTY_TYPES.includes(resource.type) && resource.versions.length > 0;

export function validateCatalog(catalog, {allowLocal = false} = {}) {
  if (![1, 2, 3].includes(catalog.schemaVersion) || !Array.isArray(catalog.resources)) throw new Error('Expected catalog schemaVersion 1, 2 or 3 and resources array');
  const v3 = catalog.schemaVersion >= 3;
  const creatorIds = new Set();
  if (catalog.creators !== undefined) {
    if (!v3 || !Array.isArray(catalog.creators)) throw new Error('creators requires schemaVersion 3 and must be an array');
    for (const creator of catalog.creators) {
      if (!idPattern.test(creator?.id ?? '') || creatorIds.has(creator.id)) throw new Error('Invalid or duplicate creator id');
      creatorIds.add(creator.id);
      if (typeof creator.name !== 'string' || !creator.name.trim()) throw new Error(`Missing creator name: ${creator.id}`);
      if (!githubUrl.test(creator.url ?? '')) throw new Error(`Creator url must be a GitHub HTTPS URL: ${creator.id}`);
      if (creator.description !== undefined && typeof creator.description !== 'string') throw new Error(`Invalid creator description: ${creator.id}`);
    }
  }
  const ids = new Set();
  for (const resource of catalog.resources) {
    if (!/^[a-z][a-z0-9_-]*$/.test(resource.id ?? '') || ids.has(resource.id)) throw new Error('Invalid or duplicate resource id');
    ids.add(resource.id);
    if (!v3 && (resource.type !== undefined || resource.creator !== undefined || resource.subpath !== undefined)) throw new Error(`type/creator/subpath require schemaVersion 3: ${resource.id}`);
    if (resource.type !== undefined && !RESOURCE_TYPES.includes(resource.type)) throw new Error(`Invalid type: ${resource.id}`);
    if (resource.type === 'creator' ? !creatorIds.has(resource.creator) : resource.creator !== undefined) throw new Error(`Invalid creator reference: ${resource.id}`);
    if (resource.subpath !== undefined && !safePath(resource.subpath)) throw new Error(`Unsafe subpath: ${resource.id}`);
    validateFolder(resource);
    if (typeof resource.title !== 'string' || !resource.title.trim()) throw new Error(`Missing title: ${resource.id}`);
    const github = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\.git$/;
    if (!github.test(resource.repository ?? '') && !(allowLocal && path.isAbsolute(resource.repository ?? ''))) throw new Error('Repository must be a GitHub HTTPS .git URL');
    if ((resource.docsPath !== null && !safePath(resource.docsPath)) || !safePath(resource.entryPage) || /[?#\s]/.test(resource.entryPage)) throw new Error('Unsafe docsPath or entryPage');
    const releaseless = ['dependency', 'internal'].includes(resource.kind) && Array.isArray(resource.versions) && resource.versions.length === 0 && resource.latest === null;
    if (releaseless) continue; // schema v2: dependency/internal entries may have no releases
    if (!Array.isArray(resource.versions) || resource.versions.length === 0) throw new Error('Resource needs at least one version');
    const versions = new Set();
    for (const release of resource.versions) {
      if (!semver.test(release.version ?? '') || versions.has(release.version)) throw new Error('Invalid or duplicate version');
      versions.add(release.version);
      if (!/^[a-f0-9]{40}$/.test(release.commit ?? '')) throw new Error('Commit must be a full lowercase SHA');
      if (release.tag !== `v${release.version}`) throw new Error('Tag must match v<version>');
      if (Object.hasOwn(release, 'docsPath') && release.docsPath !== null && !safePath(release.docsPath)) throw new Error('Unsafe release docsPath');
      if (Object.hasOwn(release, 'entryPage') && (!safePath(release.entryPage) || /[?#\s]/.test(release.entryPage))) throw new Error('Unsafe release entryPage');
    }
    if (!versions.has(resource.latest) || resource.latest.includes('-')) throw new Error('latest must name a registered stable version');
    const latestRelease = resource.versions.find(item => item.version === resource.latest);
    const latestPath = Object.hasOwn(latestRelease, 'docsPath') ? latestRelease.docsPath : resource.docsPath;
    if (!latestPath && resource.docsAvailable !== false) throw new Error('Available docs require a source path');
  }
  validateGraph(catalog);
  return catalog;
}

// Compat entries are tagged third-party shims without docs (not docs plugins). In sync mode confirm each
// tag resolves to the pinned commit and that its manifest declares the catalogued version.
async function verifyPinnedCompat(catalog) {
  const scratch = await fs.mkdtemp(path.join(os.tmpdir(), 'kora-compat-verify-'));
  try {
    for (const resource of catalog.resources.filter(item => item.type === 'compat' && item.versions.length > 0)) {
      const repository = path.join(scratch, resource.id);
      await fs.mkdir(repository);
      git(repository, ['init', '--quiet']);
      git(repository, ['remote', 'add', 'origin', resource.repository]);
      for (const release of resource.versions) {
        git(repository, ['fetch', '--quiet', '--depth=1', 'origin', `refs/tags/${release.tag}:refs/tags/${release.tag}`]);
        if (git(repository, ['rev-parse', `refs/tags/${release.tag}^{commit}`]).trim() !== release.commit) throw new Error(`Tag/commit mismatch: ${resource.id} ${release.version}`);
        const manifest = git(repository, ['show', `${release.commit}:${resource.subpath ? `${resource.subpath}/` : ''}fxmanifest.lua`]);
        const declarations = [...manifest.matchAll(/^\s*version\s*(?:\(\s*)?['"]([^'"]+)['"]/gm)];
        if (declarations.length !== 1 || declarations[0][1] !== release.version) throw new Error(`Manifest version mismatch: ${resource.id} ${release.version}`);
      }
    }
  } finally { await fs.rm(scratch, {recursive: true, force: true}); }
}

function fetchRelease(repository, resource, release, tags, requireTag) {
  const tagRef = `refs/tags/${release.tag}`;
  // Historical tags may be removed while their immutable commits remain on GitHub.
  // Existing tags must still match; --sync additionally requires the tag to exist.
  const useTag = requireTag || tags.has(tagRef);
  git(repository, ['fetch', '--quiet', '--depth=1', 'origin', useTag ? `${tagRef}:${tagRef}` : release.commit]);
  const resolved = git(repository, ['rev-parse', 'FETCH_HEAD^{commit}']).trim();
  if (resolved !== release.commit) throw new Error(`Tag/commit mismatch: ${resource.id} ${release.version}`);
  return resolved;
}

export async function importDocs({siteDir = root, catalog, allowLocal = false, sync = false} = {}) {
  catalog ??= JSON.parse(await fs.readFile(path.join(siteDir, 'catalog/resources.json'), 'utf8'));
  validateCatalog(catalog, {allowLocal});
  if (sync) await verifyPinnedCompat(catalog);
  // The docs site only consumes resources that have releases (v2 dependency/internal entries have none).
  catalog = {...catalog, resources: catalog.resources.filter(hasDocs)};
  const scratch = await fs.mkdtemp(path.join(os.tmpdir(), 'kora-docs-import-'));
  const staged = path.join(scratch, 'output');
  await fs.mkdir(path.join(staged, '.generated/current'), {recursive: true});
  try {
    for (const resource of catalog.resources) {
      console.log(`Importing ${resource.id}`);
      const repository = path.join(scratch, resource.id);
      await fs.mkdir(repository);
      git(repository, ['init', '--quiet']);
      git(repository, ['remote', 'add', 'origin', resource.repository]);
      const tags = new Set(git(repository, ['ls-remote', '--tags', 'origin']).trim().split('\n').map(line => line.split('\t')[1]));
      const plugin = `resource-${resource.id}`;
      await fs.mkdir(path.join(staged, '.generated/current', resource.id), {recursive: true});
      for (const release of resource.versions) {
        const rawDocsPath = Object.hasOwn(release, 'docsPath') ? release.docsPath : resource.docsPath;
        const docsPath = rawDocsPath === null || !resource.subpath ? rawDocsPath : `${resource.subpath}/${rawDocsPath}`;
        const entryPage = release.entryPage ?? resource.entryPage;
        const resolved = fetchRelease(repository, resource, release, tags, sync);
        const manifest = git(repository, ['show', `${resolved}:${resource.subpath ? `${resource.subpath}/` : ''}fxmanifest.lua`]);
        const declarations = [...manifest.matchAll(/^\s*version\s*(?:\(\s*)?['"]([^'"]+)['"]/gm)];
        if (declarations.length !== 1 || declarations[0][1] !== release.version) throw new Error(`Manifest version mismatch: ${resource.id} ${release.version}`);
        const output = path.join(staged, `${plugin}_versioned_docs`, `version-${release.version}`);
        await fs.mkdir(output, {recursive: true});
        let markdownCount = 0;
        if (docsPath === null) {
          const title = resource.title.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
          await fs.writeFile(path.join(output, 'index.md'), `---\ntitle: ${title}\n---\n\n# ${title}\n\nDocumentation for this resource is coming soon. This page records the v${release.version} release.\n`);
          markdownCount = 1;
        } else if (/\.mdx?$/i.test(docsPath)) {
          const bytes = git(repository, ['show', `${resolved}:${docsPath}`], null);
          await fs.writeFile(path.join(output, 'index.md'), normalizeMarkdown(bytes.toString('utf8')));
          markdownCount = 1;
        } else {
          const entries = git(repository, ['ls-tree', '-rz', `${resolved}:${docsPath}`]).split('\0').filter(Boolean);
          for (const entry of entries) {
            const match = /^(\d+) (\w+) ([a-f0-9]+)\t([\s\S]+)$/.exec(entry);
            if (!match || !['100644', '100755'].includes(match[1]) || match[2] !== 'blob' || !safePath(match[4])) throw new Error('Docs must contain only regular files; symlinks and submodules are rejected');
            const filename = match[4];
            const target = path.join(output, filename);
            await fs.mkdir(path.dirname(target), {recursive: true});
            const bytes = git(repository, ['cat-file', 'blob', match[3]], null);
            await fs.writeFile(target, /\.mdx?$/i.test(filename) ? normalizeMarkdown(bytes.toString('utf8')) : bytes);
            if (/\.mdx?$/i.test(filename)) markdownCount++;
          }
        }
        if (!markdownCount) throw new Error(`No Markdown found: ${resource.id} ${release.version}`);
        if (!await hasEntry(output, entryPage)) throw new Error(`Entry page missing: ${entryPage}`);
        const sidebarDirectory = path.join(staged, `${plugin}_versioned_sidebars`);
        await fs.mkdir(sidebarDirectory, {recursive: true});
        await fs.writeFile(path.join(sidebarDirectory, `version-${release.version}-sidebars.json`), JSON.stringify({docs: [{type: 'autogenerated', dirName: '.'}]}, null, 2));
      }
      await fs.writeFile(path.join(staged, `${plugin}_versions.json`), JSON.stringify(resource.versions.map(release => release.version), null, 2));
    }
    await fs.writeFile(path.join(staged, '.generated/catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
    // Publish only after the complete catalog has imported successfully.
    const owned = name => name === '.generated' || /^resource-[a-z][a-z0-9_-]*_(versions\.json|versioned_docs|versioned_sidebars)$/.test(name);
    for (const name of await fs.readdir(siteDir)) if (owned(name)) await fs.rm(path.join(siteDir, name), {recursive: true, force: true});
    for (const name of await fs.readdir(staged)) await fs.cp(path.join(staged, name), path.join(siteDir, name), {recursive: true});
    return catalog;
  } finally {
    await fs.rm(scratch, {recursive: true, force: true});
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const catalog = await importDocs({sync: process.argv.includes('--sync')});
    console.log(`Imported ${catalog.resources.length} resource(s).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
