import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const script = fileURLToPath(new URL('../scripts/check-catalog.mjs', import.meta.url));
test('CI permits new versions but rejects replacing published versions', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'catalog-guard-'));
  const git = (...args) => execFileSync('git', ['-C', directory, ...args], {encoding: 'utf8'}).trim();
  try {
    await fs.mkdir(path.join(directory, 'catalog'));
    const previous = {schemaVersion: 2, resources: [{id: 'core', title: 'Core', repository: 'https://github.com/KoraFiveM/kora_core.git', path: '[pre]/kora_core', group: 'pre', kind: 'kora', branch: 'dev', order: 1, docsPath: 'docs', entryPage: 'index', latest: '1.0.0', versions: [{version: '1.0.0', tag: 'v1.0.0', commit: 'a'.repeat(40)}]}]};
    const catalogFile = path.join(directory, 'catalog/resources.json');
    await fs.writeFile(catalogFile, JSON.stringify(previous));
    git('init', '--quiet'); git('config', 'user.email', 'fixture@example.invalid'); git('config', 'user.name', 'Fixture');
    git('add', '.'); git('commit', '--quiet', '-m', 'Published catalog');
    const eventFile = path.join(directory, 'event.json');
    await fs.writeFile(eventFile, JSON.stringify({pull_request: {base: {sha: git('rev-parse', 'HEAD')}}}));
    const run = () => spawnSync(process.execPath, [script], {cwd: directory, encoding: 'utf8', env: {...process.env, GITHUB_EVENT_PATH: eventFile}});
    const added = structuredClone(previous);
    added.resources[0].versions.unshift({version: '1.1.0', tag: 'v1.1.0', commit: 'b'.repeat(40)}); added.resources[0].latest = '1.1.0';
    await fs.writeFile(catalogFile, JSON.stringify(added));
    assert.equal(run().status, 0);
    for (const mutate of [
      value => {value.resources = [];},
      value => {value.resources[0].docsPath = 'other';},
      value => {value.resources[0].versions = []; value.resources[0].latest = null; value.resources[0].kind = 'dependency';},
      value => {value.resources[0].path = '[kora]/kora_core';},
      value => {value.resources[0].versions[0].commit = 'b'.repeat(40);},
      value => {value.resources[0].versions[0].docsPath = 'other';},
    ]) {
      const changed = structuredClone(previous); mutate(changed);
      await fs.writeFile(catalogFile, JSON.stringify(changed));
      const result = run(); assert.equal(result.status, 1); assert.match(result.stderr, /Cannot/);
    }
  } finally {await fs.rm(directory, {recursive: true, force: true});}
});

test('catalog validation rejects schema, duplicate id and duplicate path problems', async () => {
  const catalog = JSON.parse(await fs.readFile(new URL('../catalog/resources.json', import.meta.url), 'utf8'));
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'catalog-schema-'));
  try {
    await fs.mkdir(path.join(directory, 'catalog'));
    fsSync.writeFileSync(path.join(directory, 'none.json'), '{}');
    const run = value => { fsSync.writeFileSync(path.join(directory, 'catalog/resources.json'), JSON.stringify(value)); return spawnSync(process.execPath, [script], {cwd: directory, encoding: 'utf8', env: {...process.env, GITHUB_EVENT_PATH: path.join(directory, 'none.json')}}); };
    assert.equal(run(catalog).status, 0);
    const bad = [
      [v => {v.resources[1].id = v.resources[0].id;}, /duplicate id/],
      [v => {v.resources[1].path = v.resources[0].path;}, /duplicate path/],
      [v => {v.resources[1].order = v.resources[0].order;}, /duplicate order/],
      [v => {delete v.resources[0].order;}, /missing order/],
      [v => {v.resources[0].order = 1.5;}, /order/],
      [v => {v.resources[0].order = 0;}, /order/],
      [v => {v.resources[0].group = 'nope';}, /group/],
      [v => {v.resources[0].repository = 'http://example.com/x';}, /repository/],
      [v => {v.resources[0].versions = []; v.resources[0].latest = null;}, /kora|versions|latest/],
    ];
    for (const [mutate, pattern] of bad) { const v = structuredClone(catalog); mutate(v); const r = run(v); assert.equal(r.status, 1); assert.match(r.stderr, pattern); }
    const deps = structuredClone(catalog); assert.ok(deps.resources.some(r => r.kind === 'dependency' && r.versions.length === 0));
  } finally {await fs.rm(directory, {recursive: true, force: true});}
});
