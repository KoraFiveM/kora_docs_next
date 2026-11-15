import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {validateCatalog, resolveDependencies, importDocs} from '../scripts/import-docs.mjs';

// FIXTURES only: fake repos/commits, not real catalog entries.
const release = {version: '1.0.0', tag: 'v1.0.0', commit: 'a'.repeat(40)};
const base = (id, extra = {}) => ({id, title: id, repository: `https://github.com/example/${id}.git`, docsPath: null, docsAvailable: false, entryPage: 'index', latest: '1.0.0', versions: [release], ...extra});
const catalog = () => ({
  schemaVersion: 3,
  creators: [{id: 'mrnewb', name: 'MrNewb', url: 'https://github.com/example', description: 'fixture'}],
  resources: [
    base('ox-lib', {type: 'compat', path: '[compat]/ox_lib'}),
    base('mrnewbbridge', {type: 'bridge', path: '[bridges]/mrnewbbridge', dependsOn: ['ox-lib']}),
    base('mrnewbsvehiclekeys', {type: 'creator', creator: 'mrnewb', path: '[creators]/[mrnewb]/mrnewbsvehiclekeys', dependsOn: ['mrnewbbridge']}),
    base('kora-thing', {path: '[pre]/kora_thing'}),
  ],
});

test('accepts typed resources and transitive dependsOn', () => {
  const value = validateCatalog(catalog());
  assert.deepEqual(resolveDependencies(value, 'mrnewbsvehiclekeys'), ['mrnewbbridge', 'ox-lib']);
});

test('schema v2 catalogs still validate but cannot use v3 fields', () => {
  assert.doesNotThrow(() => validateCatalog({schemaVersion: 2, resources: [base('kora-thing', {path: '[pre]/kora_thing'})]}));
  assert.throws(() => validateCatalog({schemaVersion: 2, resources: [base('x', {type: 'bridge'})]}));
  assert.throws(() => validateCatalog({schemaVersion: 2, creators: [], resources: []}));
});

test('rejects invalid types, tags, creators, paths and dependency graphs', () => {
  const mutations = [
    c => { c.resources[0].type = 'other'; },
    c => { c.resources[0].versions = [{version: '1.0.0', commit: 'a'.repeat(40)}]; }, // every entry needs a tag again, compat included
    c => { c.resources[2].creator = 'nobody'; },
    c => { delete c.resources[2].creator; },
    c => { c.resources[0].creator = 'mrnewb'; },
    c => { c.resources[2].path = '[creators]/[other]/x'; },
    c => { c.resources[2].path = '[creators]/mrnewb/x'; }, // unbracketed creator folder
    c => { c.resources[1].path = '[compat]/x'; },
    c => { c.resources[0].subpath = '../x'; },
    c => { c.resources[1].dependsOn = ['missing']; },
    c => { c.resources[1].dependsOn = ['mrnewbbridge']; },
    c => { c.resources[0].dependsOn = ['mrnewbsvehiclekeys']; },
    c => { c.creators[0].url = 'ext::x'; },
    c => { c.creators.push(c.creators[0]); },
  ];
  for (const mutate of mutations) { const c = catalog(); mutate(c); assert.throws(() => validateCatalog(c)); }
});

test('sync verifies compat tags resolve to the pinned commit and the manifest version', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'compat-test-'));
  const git = (...args) => execFileSync('git', ['-C', path.join(directory, 'compat'), ...args], {encoding: 'utf8'}).trim();
  try {
    const repo = path.join(directory, 'compat');
    await fs.mkdir(repo, {recursive: true});
    git('init', '--quiet', '-b', 'main'); git('config', 'user.email', 'f@example.invalid'); git('config', 'user.name', 'F');
    await fs.writeFile(path.join(repo, 'fxmanifest.lua'), "fx_version 'cerulean'\nversion '3.39.0'\n");
    git('add', '.'); git('commit', '--quiet', '-m', 'c'); git('tag', 'v3.39.0');
    const commit = git('rev-parse', 'HEAD');
    const make = (version, sha) => ({schemaVersion: 3, resources: [base('ox-lib', {type: 'compat', repository: repo, path: '[compat]/ox_lib', latest: version, versions: [{version, tag: `v${version}`, commit: sha}]})]});
    const siteDir = path.join(directory, 'site'); await fs.mkdir(siteDir);
    const result = await importDocs({siteDir, catalog: make('3.39.0', commit), allowLocal: true, sync: true});
    assert.equal(result.resources.length, 0); // compat entries are not docs plugins
    await assert.rejects(importDocs({siteDir, catalog: make('3.39.0', 'b'.repeat(40)), allowLocal: true, sync: true}), /Tag\/commit mismatch/);
    git('tag', 'v9.9.9');
    await assert.rejects(importDocs({siteDir, catalog: make('9.9.9', commit), allowLocal: true, sync: true}), /Manifest version mismatch/);
  } finally { await fs.rm(directory, {recursive: true, force: true}); }
});
