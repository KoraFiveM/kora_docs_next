import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const script = fileURLToPath(new URL('../scripts/check-catalog.mjs', import.meta.url));
test('CI permits new versions but rejects replacing published versions', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'catalog-guard-'));
  const git = (...args) => execFileSync('git', ['-C', directory, ...args], {encoding: 'utf8'}).trim();
  try {
    await fs.mkdir(path.join(directory, 'catalog'));
    const previous = {schemaVersion: 1, resources: [{id: 'core', repository: 'repo', docsPath: 'docs', entryPage: 'index', versions: [{version: '1.0.0', tag: 'v1.0.0', commit: 'a'.repeat(40)}]}]};
    const catalogFile = path.join(directory, 'catalog/resources.json');
    await fs.writeFile(catalogFile, JSON.stringify(previous));
    git('init', '--quiet'); git('config', 'user.email', 'fixture@example.invalid'); git('config', 'user.name', 'Fixture');
    git('add', '.'); git('commit', '--quiet', '-m', 'Published catalog');
    const eventFile = path.join(directory, 'event.json');
    await fs.writeFile(eventFile, JSON.stringify({pull_request: {base: {sha: git('rev-parse', 'HEAD')}}}));
    const run = () => spawnSync(process.execPath, [script], {cwd: directory, encoding: 'utf8', env: {...process.env, GITHUB_EVENT_PATH: eventFile}});
    const added = structuredClone(previous);
    added.resources[0].versions.unshift({version: '1.1.0', tag: 'v1.1.0', commit: 'b'.repeat(40)});
    await fs.writeFile(catalogFile, JSON.stringify(added));
    assert.equal(run().status, 0);
    for (const mutate of [
      value => {value.resources = [];},
      value => {value.resources[0].docsPath = 'other';},
      value => {value.resources[0].versions = [];},
      value => {value.resources[0].versions[0].commit = 'b'.repeat(40);},
    ]) {
      const changed = structuredClone(previous); mutate(changed);
      await fs.writeFile(catalogFile, JSON.stringify(changed));
      const result = run(); assert.equal(result.status, 1); assert.match(result.stderr, /Cannot/);
    }
  } finally {await fs.rm(directory, {recursive: true, force: true});}
});
