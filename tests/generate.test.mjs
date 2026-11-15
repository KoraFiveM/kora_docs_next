import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const script = fileURLToPath(new URL('../tools/generate.py', import.meta.url));
// FIXTURE only: a fake creator, never part of the real catalog.
const entry = (id, order, extra) => ({id, title: id, repository: `https://github.com/example/${id}.git`, branch: 'main', order, docsPath: null, entryPage: 'index', latest: null, docsAvailable: false, versions: [], ...extra});

test('creator folders keep brackets in recipe, manifest and bash output', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'gen-test-'));
  try {
    const catalog = {schemaVersion: 3, creators: [{id: 'mrnewb', name: 'Fake', url: 'https://github.com/example'}], resources: [
      entry('kora-thing', 1, {path: '[kora]/kora_thing', group: 'kora', kind: 'dependency'}),
      entry('fakecreatorscript', 2, {type: 'creator', creator: 'mrnewb', path: '[creators]/[mrnewb]/x', group: 'creators', kind: 'optional'}),
      entry('fakecreatordefault', 3, {type: 'creator', creator: 'mrnewb', path: '[creators]/[mrnewb]/y', group: 'creators', kind: 'dependency'}),
    ]};
    const file = path.join(dir, 'resources.json'), out = path.join(dir, 'out');
    await fs.writeFile(file, JSON.stringify(catalog));
    const run = spawnSync('python3', ['-I', script, '--catalog', file, '--out', out], {encoding: 'utf8'});
    assert.equal(run.status, 0, run.stderr);
    const read = name => fs.readFile(path.join(out, name), 'utf8');
    const recipe = await read('recipe.yaml');
    assert.match(recipe, /dest: \.\/resources\/\[creators\]\/\[mrnewb\]\/y\n/);
    // The recipe is self-contained: the three files are embedded verbatim, placeholders stay literal, nothing is downloaded for them.
    assert.doesNotMatch(recipe, /txAdmin[R]ecipe|kora-recipe/);
    const templates = fileURLToPath(new URL('../tools/templates/', import.meta.url));
    for (const [name, dest] of [['server.cfg', './server.cfg'], ['permissions.cfg', './permissions.cfg'], ['kora.sql', './kora.sql']]) {
      const body = await fs.readFile(path.join(templates, name), 'utf8');
      const block = body.split('\n').slice(0, -1).map(line => line ? `    ${line}` : '').join('\n') + '\n';
      assert.ok(recipe.includes(`- action: write_file\n  file: ${dest}\n  data: |\n${block}`), `${name} embedded verbatim`);
    }
    for (const placeholder of ['{{serverEndpoints}}', '{{maxClients}}', '{{svLicense}}', '{{dbConnectionString}}', '{{addPrincipalsMaster}}']) assert.ok(recipe.includes(placeholder), placeholder);
    assert.match(await read('resources.manifest'), /^resources\/\[creators\]\/\[mrnewb\]\/y\t/m);
    assert.match(await read('resources.sh'), /\$'resources\/\[creators\]\/\[mrnewb\]\/y\\t/);
    assert.match(await read('resources.manifest'), /^resources\/kora\/kora_thing\t/m); // other folders unchanged
    assert.doesNotMatch(await read('resources.manifest'), /\[mrnewb\]\/x/); // optional is not default
  } finally { await fs.rm(dir, {recursive: true, force: true}); }
});
