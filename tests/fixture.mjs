import {execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
const git = (repo, ...args) => execFileSync('git', ['-C', repo, ...args], {encoding: 'utf8'}).trim();
export async function fixture(directory) {
  const resources = [];
  for (const id of ['kora_inventory', 'kora_core']) {
    const repository = path.join(directory, id);
    await fs.mkdir(path.join(repository, 'docs/images'), {recursive: true});
    git(repository, 'init', '--quiet');
    git(repository, 'config', 'user.email', 'fixture@example.invalid');
    git(repository, 'config', 'user.name', 'Docs fixture');
    const versions = [];
    for (const version of ['1.0.0', '1.1.0']) {
      await fs.writeFile(path.join(repository, 'fxmanifest.lua'), `fx_version 'cerulean'\nversion '${version}'\n`);
      await fs.writeFile(path.join(repository, 'docs/index.md'), `---\ntitle: ${id}\n---\n\n# ${id} ${version}\n\n[Configuration](./configuration.md)\n\n![Mark](./images/mark.svg)\n`);
      await fs.writeFile(path.join(repository, 'docs/configuration.md'), `# Configuration\n\nFixture ${version}.\n`);
      await fs.writeFile(path.join(repository, 'docs/images/mark.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16"/></svg>');
      git(repository, 'add', '.'); git(repository, 'commit', '--quiet', '-m', version); git(repository, 'tag', `v${version}`);
      versions.unshift({version, tag: `v${version}`, commit: git(repository, 'rev-parse', 'HEAD')});
    }
    resources.push({id, title: id, repository, docsPath: 'docs', entryPage: 'index', latest: '1.1.0', versions});
  }
  return {schemaVersion: 1, resources};
}
