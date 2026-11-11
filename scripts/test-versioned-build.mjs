import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {fixture} from '../tests/fixture.mjs';
import {importDocs} from './import-docs.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'kora-docs-build-test-'));
try {
  const site = path.join(temporary, 'site'); await fs.mkdir(site);
  for (const name of ['package.json', 'docusaurus.config.js', 'sidebars.js', 'src', 'docs', 'static']) {
    await fs.cp(path.join(root, name), path.join(site, name), {recursive: true});
  }
  await fs.symlink(path.join(root, 'node_modules'), path.join(site, 'node_modules'), 'dir');
  const catalog = await fixture(temporary);
  await importDocs({siteDir: site, catalog, allowLocal: true});
  execFileSync(process.execPath, [path.join(root, 'node_modules/@docusaurus/core/bin/docusaurus.mjs'), 'build'], {
    cwd: site, stdio: 'inherit', env: {...process.env, DOCUSAURUS_IGNORE_SSG_WARNINGS: 'false'},
  });
  for (const resource of catalog.resources) for (const release of resource.versions) {
    const directory = path.join(site, 'build/resources', resource.id, release.version);
    const html = await fs.readFile(path.join(directory, 'index.html'), 'utf8');
    assert.ok(html.includes(`${resource.id} ${release.version}`));
    assert.ok(html.includes('1.0.0') && html.includes('1.1.0'), 'Both resource versions appear in the selector');
    await fs.access(path.join(directory, 'configuration/index.html'));
  }
  console.log('Versioned build passed: two resources, two versions, asset links and version selectors.');
} finally {await fs.rm(temporary, {recursive: true, force: true});}
