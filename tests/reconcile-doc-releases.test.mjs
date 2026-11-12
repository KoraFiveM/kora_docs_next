import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const script = fileURLToPath(new URL('../scripts/reconcile-doc-releases.mjs', import.meta.url));
const git = (directory, ...args) => execFileSync('git', ['-C', directory, ...args], {encoding:'utf8', stdio:['ignore','pipe','pipe']}).trim();

test('releases docs-only changes, preserves older snapshots and refuses mixed code changes', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'kora-docs-release-test-'));
  try {
    const origin=path.join(tmp,'origin.git'), work=path.join(tmp,'work'), site=path.join(tmp,'site');
    await fs.mkdir(origin); await fs.mkdir(work); await fs.mkdir(path.join(site,'catalog'), {recursive:true});
    git(origin,'init','--bare','--quiet'); git(work,'init','--quiet');
    git(work,'config','user.name','Fixture'); git(work,'config','user.email','fixture@example.invalid');
    git(work,'checkout','-b','dev'); git(work,'remote','add','origin',origin);
    await fs.mkdir(path.join(work,'docs'));
    await fs.writeFile(path.join(work,'fxmanifest.lua'),"fx_version 'cerulean'\nversion '0.1.0'\n");
    await fs.writeFile(path.join(work,'docs/index.md'),'# Original\n');
    git(work,'add','.'); git(work,'commit','--quiet','-m','baseline');
    const baseline=git(work,'rev-parse','HEAD'); git(work,'tag','v0.1.0'); git(work,'push','--quiet','origin','dev','v0.1.0');
    const catalog={schemaVersion:1,resources:[{id:'kora-demo',title:'Kora Demo',repository:origin,docsPath:'docs',entryPage:'index',docsAvailable:true,latest:'0.1.0',versions:[{version:'0.1.0',tag:'v0.1.0',commit:baseline}]}]};
    await fs.writeFile(path.join(site,'catalog/resources.json'),JSON.stringify(catalog));
    const old=path.join(site,'resource-kora-demo_versioned_docs/version-0.1.0'); await fs.mkdir(old,{recursive:true}); await fs.writeFile(path.join(old,'index.md'),'original snapshot');
    await fs.writeFile(path.join(work,'docs/index.md'),'# New documentation\n');
    git(work,'add','.'); git(work,'commit','--quiet','-m','docs'); git(work,'push','--quiet','origin','dev');
    const run=()=>spawnSync(process.execPath,[script,'--allow-local-for-tests'],{cwd:site,encoding:'utf8',timeout:60000});
    let result=run(); assert.equal(result.status,0,result.stderr); assert.equal(await fs.readFile(path.join(old,'index.md'),'utf8'),'original snapshot');
    let updated=JSON.parse(await fs.readFile(path.join(site,'catalog/resources.json'),'utf8'));
    assert.equal(updated.resources[0].latest,'0.1.1');
    assert.match(await fs.readFile(path.join(site,'resource-kora-demo_versioned_docs/version-0.1.1/index.md'),'utf8'),/New documentation/);
    assert.equal(git(origin,'show','refs/tags/v0.1.1:fxmanifest.lua').includes("version '0.1.1'"),true);
    result=run(); assert.equal(result.status,0,result.stderr); assert.equal(git(origin,'tag','--list').split('\n').length,2);
    // A run interrupted after creating the resource tag must publish it next time.
    await fs.rm(path.join(site,'resource-kora-demo_versioned_docs/version-0.1.1'),{recursive:true});
    await fs.rm(path.join(site,'resource-kora-demo_versioned_sidebars/version-0.1.1-sidebars.json'));
    await fs.writeFile(path.join(site,'catalog/resources.json'),JSON.stringify(catalog));
    result=run(); assert.equal(result.status,0,result.stderr);
    updated=JSON.parse(await fs.readFile(path.join(site,'catalog/resources.json'),'utf8'));
    assert.equal(updated.resources[0].latest,'0.1.1');
    assert.equal(git(origin,'tag','--list').split('\n').length,2);
    git(work,'pull','--quiet','--ff-only','origin','dev');
    await fs.writeFile(path.join(work,'docs/index.md'),'# Later docs\n'); await fs.writeFile(path.join(work,'client.lua'),'print(1)\n');
    git(work,'add','.'); git(work,'commit','--quiet','-m','code and docs'); git(work,'push','--quiet','origin','dev');
    result=run(); assert.equal(result.status,0,result.stderr);
    assert.match(await fs.readFile(path.join(site,'docs-reconcile-errors.txt'),'utf8'),/mixed with code changes/);
    assert.equal(git(origin,'tag','--list').split('\n').length,2);
    // A separately released version can move its docs to a new source path.
    await fs.rm(path.join(work,'docs'),{recursive:true});
    await fs.writeFile(path.join(work,'README.md'),'# New location\n');
    await fs.writeFile(path.join(work,'fxmanifest.lua'),"fx_version 'cerulean'\nversion '0.1.2'\n");
    git(work,'add','-A'); git(work,'commit','--quiet','-m','manual release'); git(work,'tag','v0.1.2'); git(work,'push','--quiet','origin','dev','v0.1.2');
    result=run(); assert.equal(result.status,0,result.stderr);
    updated=JSON.parse(await fs.readFile(path.join(site,'catalog/resources.json'),'utf8'));
    assert.equal(updated.resources[0].latest,'0.1.2');
    assert.equal(updated.resources[0].versions[0].docsPath,'README.md');
    assert.match(await fs.readFile(path.join(site,'resource-kora-demo_versioned_docs/version-0.1.2/index.md'),'utf8'),/New location/);
    assert.equal(await fs.readFile(path.join(old,'index.md'),'utf8'),'original snapshot');
  } finally {await fs.rm(tmp,{recursive:true,force:true});}
});
