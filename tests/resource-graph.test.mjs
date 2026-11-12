import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
const require = createRequire(import.meta.url);
const graph = require('../plugins/resource-graph.cjs');

test('graph maps latest resource docs to versioned Pages URLs', async () => {
  const site = await fs.mkdtemp(path.join(os.tmpdir(), 'resource-graph-'));
  try {
    const docs = path.join(site, 'resource-kora-core_versioned_docs/version-1.1.0');
    await fs.mkdir(docs,{recursive:true});
    await fs.writeFile(path.join(docs,'index.md'),'---\ntitle: Core\n---\n# Core\n[Setup](./setup.md)\n');
    await fs.writeFile(path.join(docs,'setup.md'),'---\ntitle: Setup\n---\n# Setup\n');
    const plugin = graph({siteDir:site,baseUrl:'/kora_docs_next/'},{resources:[{id:'kora-core',latest:'1.1.0'}]});
    const content = await plugin.loadContent();
    const urls = content.graphData.nodes.filter(node => node.url).map(node => node.url);
    assert.ok(urls.includes('/kora_docs_next/resources/kora-core/1.1.0'));
    assert.ok(urls.includes('/kora_docs_next/resources/kora-core/1.1.0/setup'));
    assert.equal(content.graphData.links.filter(link => link.type === 'link').length,1);
  } finally {await fs.rm(site,{recursive:true,force:true});}
});
