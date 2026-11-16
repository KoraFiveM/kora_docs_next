import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {importDocs, validateCatalog} from '../scripts/import-docs.mjs';
const git = (repo, ...args) => execFileSync('git', ['-C', repo, ...args], {encoding: 'utf8'}).trim();

import {fixture} from './fixture.mjs';

test('default import fetches pinned GitHub sources without snapshots and refuses stale fallback', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'docs-test-'));
  try {
    const catalog = await fixture(directory);
    const siteDir = path.join(directory, 'site');
    await fs.mkdir(path.join(siteDir, 'catalog'), {recursive: true});
    const env = {...process.env, GIT_CONFIG_COUNT: String(catalog.resources.length)};
    for (const [index, resource] of catalog.resources.entries()) {
      const url = `https://github.com/KoraFiveM/${resource.id}.git`;
      // Rewrite only these fixture URLs inside the subprocess; no real network or Git config changes.
      env[`GIT_CONFIG_KEY_${index}`] = `url.${resource.repository}.insteadOf`;
      env[`GIT_CONFIG_VALUE_${index}`] = url;
      resource.repository = url;
    }
    await fs.writeFile(path.join(siteDir, 'catalog/resources.json'), JSON.stringify(catalog));
    const importer = new URL('../scripts/import-docs.mjs', import.meta.url).href;
    const run = (sync = false) => spawnSync(process.execPath, ['--input-type=module', '-e',
      `import {importDocs} from ${JSON.stringify(importer)}; await importDocs({siteDir: process.argv[1], sync: process.argv.includes('--sync')});`,
      siteDir, ...(sync ? ['--sync'] : [])],
    {encoding: 'utf8', env, timeout: 60000});
    let result = run();
    assert.equal(result.status, 0, result.stderr);
    const entry = path.join(siteDir, 'resource-kora_inventory_versioned_docs/version-1.1.0/index.md');
    assert.match(await fs.readFile(entry, 'utf8'), /kora_inventory 1\.1\.0/);
    await fs.writeFile(entry, 'stale local copy');
    result = run();
    assert.equal(result.status, 0, result.stderr);
    const content = await fs.readFile(entry, 'utf8');
    assert.match(content, /kora_inventory 1\.1\.0/);
    const metadata = await fs.readFile(path.join(siteDir, '.generated/catalog.json'), 'utf8');
    git(path.join(directory, 'kora_core'), 'tag', '-d', 'v1.0.0');
    result = run();
    assert.equal(result.status, 0, 'Missing historical tag can use the exact pinned commit');
    result = run(true);
    assert.notEqual(result.status, 0, '--sync must still require release tags');
    assert.match(result.stderr, /v1\.0\.0/);
    await fs.rename(path.join(directory, 'kora_core'), path.join(directory, 'unavailable'));
    result = run();
    assert.notEqual(result.status, 0, 'Unavailable source must fail even when local docs exist');
    assert.match(result.stderr, /kora_core/);
    assert.equal(await fs.readFile(entry, 'utf8'), content);
    assert.equal(await fs.readFile(path.join(siteDir, '.generated/catalog.json'), 'utf8'), metadata);
  } finally {await fs.rm(directory, {recursive: true, force: true});}
});

test('imports independent versions, assets and exact committed content; cleans removed resources', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'docs-test-'));
  try {
    const catalog = await fixture(directory);
    const siteDir = path.join(directory, 'site'); await fs.mkdir(siteDir);
    await fs.writeFile(path.join(catalog.resources[0].repository, 'docs/index.md'), 'Uncommitted change');
    await importDocs({siteDir, catalog, allowLocal: true});
    const archived = path.join(siteDir, 'resource-kora_inventory_versioned_docs/version-1.0.0');
    assert.match(await fs.readFile(path.join(archived, 'index.md'), 'utf8'), /1\.0\.0/);
    assert.match(await fs.readFile(path.join(archived, 'images/mark.svg'), 'utf8'), /<svg/);
    await importDocs({siteDir, catalog: {schemaVersion: 3, resources: []}, sync: true});
    await assert.rejects(fs.access(archived));
  } finally {await fs.rm(directory, {recursive: true, force: true});}
});

test('rejects moved tags and manifest mismatches without replacing the last import', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'docs-test-'));
  try {
    const catalog = await fixture(directory);
    const siteDir = path.join(directory, 'site'); await fs.mkdir(siteDir);
    await importDocs({siteDir, catalog, allowLocal: true});
    const metadata = await fs.readFile(path.join(siteDir, '.generated/catalog.json'), 'utf8');
    const wrong = structuredClone(catalog); wrong.resources[0].versions[0].commit = '0'.repeat(40);
    await assert.rejects(importDocs({siteDir, catalog: wrong, allowLocal: true}), /Tag\/commit mismatch/);
    const resource = catalog.resources[0];
    await fs.writeFile(path.join(resource.repository, 'fxmanifest.lua'), "version '9.9.9'\n");
    git(resource.repository, 'add', '.'); git(resource.repository, 'commit', '--quiet', '-m', 'incorrect version');
    git(resource.repository, 'tag', '-f', 'v1.1.0'); resource.versions[0].commit = git(resource.repository, 'rev-parse', 'HEAD');
    await assert.rejects(importDocs({siteDir, catalog, allowLocal: true}), /Manifest version mismatch/);
    assert.equal(await fs.readFile(path.join(siteDir, '.generated/catalog.json'), 'utf8'), metadata);
  } finally {await fs.rm(directory, {recursive: true, force: true});}
});

test('rejects unsafe paths, duplicate resources and unsupported repositories', () => {
  assert.throws(() => validateCatalog({schemaVersion: 4, resources: []}));
  const resource = {id: 'kora_core', title: 'Core', repository: 'https://github.com/KoraFiveM/kora_core.git', docsPath: 'docs', entryPage: 'index', latest: '1.0.0', versions: [{version: '1.0.0', tag: 'v1.0.0', commit: 'a'.repeat(40)}]};
  for (const changes of [{docsPath: '../secret'}, {entryPage: '/index'}, {repository: 'ext::command'}, {latest: '2.0.0'}]) {
    assert.throws(() => validateCatalog({schemaVersion: 3, resources: [{...resource, ...changes}]}));
  }
  assert.throws(() => validateCatalog({schemaVersion: 3, resources: [resource, resource]}));
  const firstDocs = {...resource, docsPath: null, docsAvailable: true, versions: [{...resource.versions[0], docsPath: 'docs'}]};
  assert.doesNotThrow(() => validateCatalog({schemaVersion: 3, resources: [firstDocs]}));
  assert.throws(() => validateCatalog({schemaVersion: 3, resources: [{...firstDocs, versions: resource.versions}]}));
});

test('rejects symlinks in resource documentation', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'docs-test-'));
  try {
    const catalog = await fixture(directory);
    const resource = catalog.resources[0];
    await fs.symlink('/etc/passwd', path.join(resource.repository, 'docs/unsafe'));
    git(resource.repository, 'add', '.'); git(resource.repository, 'commit', '--quiet', '-m', 'symlink');
    git(resource.repository, 'tag', '-f', 'v1.1.0'); resource.versions[0].commit = git(resource.repository, 'rev-parse', 'HEAD');
    const siteDir = path.join(directory, 'site'); await fs.mkdir(siteDir);
    await assert.rejects(importDocs({siteDir, catalog, allowLocal: true}), /symlinks/);
  } finally {await fs.rm(directory, {recursive: true, force: true});}
});

test('third-party bridge and creator entries are excluded from documentation imports', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'docs-test-'));
  try {
    const catalog = await fixture(directory);
    const third = (id, extra) => ({id, title: id, repository: `https://github.com/example/${id}.git`, group: 'bridges', kind: 'optional', branch: 'main', order: 90, docsPath: null, entryPage: 'index', latest: '1.0.0', docsAvailable: false, versions: [{version: '1.0.0', tag: 'v1.0.0', commit: 'b'.repeat(40)}], ...extra});
    catalog.creators = [{id: 'mrnewb', name: 'MrNewB', url: 'https://github.com/mrnewb'}];
    catalog.resources.push(
      third('somebridge', {type: 'bridge', path: '[bridges]/somebridge'}),
      third('somecreator', {type: 'creator', creator: 'mrnewb', path: '[creators]/[mrnewb]/somecreator', group: 'creators', order: 91}));
    const siteDir = path.join(directory, 'site'); await fs.mkdir(siteDir);
    const imported = await importDocs({siteDir, catalog, allowLocal: true});
    assert.deepEqual(imported.resources.map(r => r.id), ['kora_inventory', 'kora_core']);
  } finally {await fs.rm(directory, {recursive: true, force: true});}
});
