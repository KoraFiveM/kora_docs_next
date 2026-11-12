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
  for (const name of ['package.json', 'docusaurus.config.js', 'sidebars.js', 'src', 'docs', 'static', 'plugins']) {
    await fs.cp(path.join(root, name), path.join(site, name), {recursive: true});
  }
  await fs.symlink(path.join(root, 'node_modules'), path.join(site, 'node_modules'), 'dir');
  const catalog = await fixture(temporary);
  await importDocs({siteDir: site, catalog, allowLocal: true});
  const cli = path.join(root, 'node_modules/@docusaurus/core/bin/docusaurus.mjs');
  const env = {...process.env, DOCS_URL:'https://example.invalid', DOCS_BASE_URL:'/kora_docs_next/'};
  execFileSync(process.execPath, [cli, 'generate-structured-data'], {cwd: site, stdio: 'inherit', env});
  execFileSync(process.execPath, [cli, 'build'], {
    cwd: site, stdio: 'inherit', env: {...env, DOCUSAURUS_IGNORE_SSG_WARNINGS: 'false'},
  });
  for (const resource of catalog.resources) for (const release of resource.versions) {
    const directory = path.join(site, 'build/resources', resource.id, release.version);
    const html = await fs.readFile(path.join(directory, 'index.html'), 'utf8');
    assert.ok(html.includes(`${resource.id} ${release.version}`));
    assert.ok(html.includes('1.0.0') && html.includes('1.1.0'), 'Both resource versions appear in the selector');
    await fs.access(path.join(directory, 'configuration/index.html'));
    const markdown = await fs.readFile(path.join(directory, 'index.md'), 'utf8');
    assert.ok(markdown.includes(`${resource.id} ${release.version}`), 'Versioned Markdown is published');
    assert.ok(html.includes('application/ld+json'), 'Structured data is present');
    assert.ok(html.includes('https://example.invalid/kora_docs_next/'), 'Structured data uses the Pages site URL');
    assert.ok(html.includes(`https://example.invalid/kora_docs_next/resources/${resource.id}/${release.version}/index.md`), 'Markdown alternate uses the Pages base URL');
  }
  await fs.access(path.join(site, 'build/graph/index.html'));
  await fs.access(path.join(site, 'build/llms.txt'));
  const searchIndex = (await fs.readdir(path.join(site, 'build'))).find(name => name.startsWith('search-index'));
  assert.ok(searchIndex, 'Local search index exists');
  const searchData = await fs.readFile(path.join(site, 'build', searchIndex), 'utf8');
  assert.ok(searchData.includes('kora_core') && searchData.includes('kora_inventory'), 'Search indexes both resource instances');
  console.log('Versioned build passed: two resources, two versions, asset links and version selectors.');
} finally {await fs.rm(temporary, {recursive: true, force: true});}
