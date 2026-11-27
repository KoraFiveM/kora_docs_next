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

const activeEnsures = text => [...text.matchAll(/^\s*ensure\s+(\S+)\s*$/gm)].map(match => match[1]);

test('template server.cfg has no active ensure lines', async () => {
  const cfg = await fs.readFile(fileURLToPath(new URL('../tools/templates/server.cfg', import.meta.url)), 'utf8');
  assert.deepEqual(activeEnsures(cfg), []);
});

test('recipe appends each folder ensure once, in order, folders only', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'gen-ensure-'));
  try {
    const kind = 'dependency';
    // FIXTURE only. Deliberately scrambled order; optional/internal resources must not add folders.
    const catalog = {schemaVersion: 3, creators: [{id: 'mrnewb', name: 'Fake', url: 'https://github.com/example'}], resources: [
      entry('a-kora', 1, {path: '[kora]/a', group: 'kora', kind}),
      entry('b-kora', 2, {path: '[kora]/b', group: 'kora', kind}),
      entry('c-maps', 3, {path: '[default-maps]/c', group: 'default-maps', kind}),
      entry('d-pre', 4, {path: '[pre]/d', group: 'pre', kind}),
      entry('e-cfx', 5, {path: '[cfx-default]', group: 'cfx-default', kind}),
      entry('f-standalone', 6, {path: '[standalone]/f', group: 'standalone', kind}),
      entry('g-compat', 7, {type: 'compat', path: '[compat]/g', group: 'compat', kind}),
      entry('h-bridge', 8, {type: 'bridge', path: '[bridges]/h', group: 'bridges', kind}),
      entry('i-creator', 9, {type: 'creator', creator: 'mrnewb', path: '[creators]/[mrnewb]/i', group: 'creators', kind}),
      entry('j-optional-compat', 10, {type: 'compat', path: '[compat]/j', group: 'compat', kind: 'optional'}),
      entry('k-internal', 11, {path: '[other]/k', group: 'other', kind: 'internal'}),
    ]};
    const file = path.join(dir, 'resources.json'), out = path.join(dir, 'out');
    await fs.writeFile(file, JSON.stringify(catalog));
    const run = spawnSync('python3', ['-I', script, '--catalog', file, '--out', out], {encoding: 'utf8'});
    assert.equal(run.status, 0, run.stderr);
    const recipe = await fs.readFile(path.join(out, 'recipe.yaml'), 'utf8');
    const ensures = activeEnsures(recipe);
    assert.deepEqual(ensures, ['[cfx-default]', '[compat]', '[pre]', '[standalone]', '[default-maps]', '[kora]', '[bridges]', '[creators]', '[addons]', '[streamedassets]']);
    assert.ok(ensures.every(name => /^\[[^\]/]+\]$/.test(name)), 'folders only, no single-resource or unbracketed ensure');
    assert.equal(new Set(ensures).size, ensures.length, 'each folder ensured once');
    assert.ok(recipe.includes('- action: write_file\n  file: ./server.cfg\n  append: true\n  data: |\n\n    ensure [cfx-default]\n'));
    for (const dirName of ['[addons]', '[streamedassets]/[cars]', '[streamedassets]/[maps]', '[streamedassets]/[props]', '[streamedassets]/[peds]']) {
      assert.equal(recipe.split(`- action: ensure_dir\n  path: ./resources/${dirName}\n`).length - 1, 1, dirName);
    }
    // Ensures come after every download and before the final variable replacement of server.cfg.
    assert.ok(recipe.lastIndexOf('action: download_github') < recipe.indexOf('append: true'));
    assert.ok(recipe.indexOf('append: true') < recipe.lastIndexOf('mode: all_vars'));
  } finally { await fs.rm(dir, {recursive: true, force: true}); }
});

test('optional resources install by default only with defaultOn (retired never)', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'gen-default-on-'));
  try {
    const catalog = {schemaVersion: 3, resources: [
      entry('kora-thing', 1, {path: '[kora]/kora_thing', group: 'kora', kind: 'dependency'}),
      entry('opt-on', 2, {path: '[peds]/opt_on', group: 'other', kind: 'optional', defaultOn: true}),
      entry('opt-off', 3, {path: '[peds]/opt_off', group: 'other', kind: 'optional'}),
      entry('opt-retired', 4, {path: '[peds]/opt_retired', group: 'other', kind: 'optional', defaultOn: true, retired: true}),
    ]};
    const file = path.join(dir, 'resources.json'), out = path.join(dir, 'out');
    await fs.writeFile(file, JSON.stringify(catalog));
    const run = spawnSync('python3', ['-I', script, '--catalog', file, '--out', out], {encoding: 'utf8'});
    assert.equal(run.status, 0, run.stderr);
    const manifest = await fs.readFile(path.join(out, 'resources.manifest'), 'utf8');
    assert.match(manifest, /opt_on\t/);
    assert.doesNotMatch(manifest, /opt_off|opt_retired/);
    assert.match(await fs.readFile(path.join(out, 'recipe.yaml'), 'utf8'), /dest: \.\/resources\/\[peds\]\/opt_on\n/);
  } finally { await fs.rm(dir, {recursive: true, force: true}); }
});
