import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

// CI compares against the PR base or the previous push before building trusted docs.
try {
  const current = JSON.parse(fs.readFileSync('catalog/resources.json', 'utf8'));
  const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const before = event.pull_request?.base.sha ?? event.before;
  if (before && !/^0+$/.test(before)) {
    const exists = execFileSync('git', ['ls-tree', '--name-only', before, 'catalog/resources.json'], {encoding: 'utf8'});
    if (exists.trim()) {
      const previous = JSON.parse(execFileSync('git', ['show', `${before}:catalog/resources.json`], {encoding: 'utf8'}));
      for (const resource of previous.resources) {
        const next = current.resources.find(item => item.id === resource.id);
        if (!next) throw new Error(`Cannot remove published resource ${resource.id}`);
        for (const field of ['repository', 'docsPath', 'entryPage']) {
          if (resource[field] !== next[field]) throw new Error(`Cannot change published ${resource.id}.${field}`);
        }
        for (const release of resource.versions) {
          const match = next.versions.find(item => item.version === release.version);
          if (!match || match.tag !== release.tag || match.commit !== release.commit || match.docsPath !== release.docsPath || match.entryPage !== release.entryPage) throw new Error(`Cannot replace published ${resource.id} ${release.version}`);
        }
      }
    }
  }
  console.log('Published resource pins are unchanged.');
} catch (error) {console.error(error.message); process.exitCode = 1;}
