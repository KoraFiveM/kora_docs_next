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
const git = (directory, args, encoding = 'utf8') => execFileSync('git', ['-C', directory, ...args], {
  encoding, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
  env: {...process.env, GIT_TERMINAL_PROMPT: '0'},
});

export function validateCatalog(catalog, {allowLocal = false} = {}) {
  if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.resources)) throw new Error('Expected catalog schemaVersion 1 and resources array');
  const ids = new Set();
  for (const resource of catalog.resources) {
    if (!/^[a-z][a-z0-9_-]*$/.test(resource.id ?? '') || ids.has(resource.id)) throw new Error('Invalid or duplicate resource id');
    ids.add(resource.id);
    if (typeof resource.title !== 'string' || !resource.title.trim()) throw new Error(`Missing title: ${resource.id}`);
    const github = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\.git$/;
    if (!github.test(resource.repository ?? '') && !(allowLocal && path.isAbsolute(resource.repository ?? ''))) throw new Error('Repository must be a GitHub HTTPS .git URL');
    if (!safePath(resource.docsPath) || !safePath(resource.entryPage) || /[?#\s]/.test(resource.entryPage)) throw new Error('Unsafe docsPath or entryPage');
    if (!Array.isArray(resource.versions) || resource.versions.length === 0) throw new Error('Resource needs at least one version');
    const versions = new Set();
    for (const release of resource.versions) {
      if (!semver.test(release.version ?? '') || versions.has(release.version)) throw new Error('Invalid or duplicate version');
      versions.add(release.version);
      if (!/^[a-f0-9]{40}$/.test(release.commit ?? '')) throw new Error('Commit must be a full lowercase SHA');
      if (release.tag !== `v${release.version}`) throw new Error('Tag must match v<version>');
    }
    if (!versions.has(resource.latest) || resource.latest.includes('-')) throw new Error('latest must name a registered stable version');
  }
  return catalog;
}

export async function importDocs({siteDir = root, catalog, allowLocal = false} = {}) {
  catalog ??= JSON.parse(await fs.readFile(path.join(siteDir, 'catalog/resources.json'), 'utf8'));
  validateCatalog(catalog, {allowLocal});
  const scratch = await fs.mkdtemp(path.join(os.tmpdir(), 'kora-docs-import-'));
  const staged = path.join(scratch, 'output');
  await fs.mkdir(path.join(staged, '.generated/current'), {recursive: true});
  try {
    for (const resource of catalog.resources) {
      const repository = path.join(scratch, resource.id);
      await fs.mkdir(repository);
      git(repository, ['init', '--quiet']);
      git(repository, ['remote', 'add', 'origin', resource.repository]);
      const plugin = `resource-${resource.id}`;
      await fs.mkdir(path.join(staged, '.generated/current', resource.id), {recursive: true});
      for (const release of resource.versions) {
        git(repository, ['fetch', '--quiet', '--depth=1', 'origin', `refs/tags/${release.tag}:refs/tags/${release.tag}`]);
        const resolved = git(repository, ['rev-parse', `refs/tags/${release.tag}^{commit}`]).trim();
        if (resolved !== release.commit) throw new Error(`Tag/commit mismatch: ${resource.id} ${release.version}`);
        const manifest = git(repository, ['show', `${resolved}:fxmanifest.lua`]);
        const declarations = [...manifest.matchAll(/^\s*version\s*(?:\(\s*)?['"]([^'"]+)['"]/gm)];
        if (declarations.length !== 1 || declarations[0][1] !== release.version) throw new Error(`Manifest version mismatch: ${resource.id} ${release.version}`);
        const output = path.join(staged, `${plugin}_versioned_docs`, `version-${release.version}`);
        await fs.mkdir(output, {recursive: true});
        const entries = git(repository, ['ls-tree', '-rz', `${resolved}:${resource.docsPath}`]).split('\0').filter(Boolean);
        let markdownCount = 0;
        for (const entry of entries) {
          const match = /^(\d+) (\w+) ([a-f0-9]+)\t([\s\S]+)$/.exec(entry);
          if (!match || !['100644', '100755'].includes(match[1]) || match[2] !== 'blob' || !safePath(match[4])) throw new Error('Docs must contain only regular files; symlinks and submodules are rejected');
          const filename = match[4];
          const target = path.join(output, filename);
          await fs.mkdir(path.dirname(target), {recursive: true});
          await fs.writeFile(target, git(repository, ['cat-file', 'blob', match[3]], null));
          if (/\.mdx?$/.test(filename)) markdownCount++;
        }
        if (!markdownCount) throw new Error(`No Markdown found: ${resource.id} ${release.version}`);
        const entryExists = await Promise.all(['.md', '.mdx'].map(extension => fs.access(path.join(output, resource.entryPage + extension)).then(() => true, () => false)));
        if (!entryExists.some(Boolean)) throw new Error(`Entry page missing: ${resource.entryPage}`);
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
    const catalog = await importDocs();
    console.log(`Imported ${catalog.resources.length} resource(s).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
