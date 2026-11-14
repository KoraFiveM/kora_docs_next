import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const catalogFile = 'catalog/resources.json';
const catalog = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
const schema = JSON.parse(fs.readFileSync(new URL('../catalog/resources.schema.json', import.meta.url), 'utf8'));

// Minimal JSON Schema evaluator (draft 2020-12 subset used by resources.schema.json; no dependencies needed in CI).
function validate(value, node, root, at, errors) {
  if (node.$ref) node = {...root.$defs[node.$ref.split('/').pop()], ...Object.fromEntries(Object.entries(node).filter(([k]) => k !== '$ref'))};
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : Number.isInteger(value) ? 'integer' : typeof value;
  const ok = (v, n) => { const e = []; validate(v, n, root, at, e); return e.length === 0; };
  if (node.type && !(node.type === type || (node.type === 'number' && type === 'integer'))) { errors.push(`${at}: expected ${node.type}`); return; }
  if ('const' in node && value !== node.const) errors.push(`${at}: must be ${JSON.stringify(node.const)}`);
  if (node.minimum !== undefined && typeof value === 'number' && value < node.minimum) errors.push(`${at}: must be >= ${node.minimum}`);
  if (node.enum && !node.enum.includes(value)) errors.push(`${at}: must be one of ${node.enum.join('|')}`);
  if (node.oneOf && node.oneOf.filter(n => ok(value, n)).length !== 1) errors.push(`${at}: does not match exactly one allowed shape`);
  if (node.anyOf && !node.anyOf.some(n => ok(value, n))) errors.push(`${at}: does not match any allowed shape`);
  for (const sub of node.allOf ?? []) {
    if (sub.if) { if (ok(value, sub.if) && sub.then) validate(value, sub.then, root, at, errors); }
    else validate(value, sub, root, at, errors);
  }
  if (typeof value === 'string') {
    if (node.minLength && value.length < node.minLength) errors.push(`${at}: too short`);
    if (node.pattern && !new RegExp(node.pattern).test(value)) errors.push(`${at}: ${JSON.stringify(value)} does not match ${node.pattern}`);
  }
  if (type === 'array') {
    if (node.minItems !== undefined && value.length < node.minItems) errors.push(`${at}: needs at least ${node.minItems} item(s)`);
    if (node.maxItems !== undefined && value.length > node.maxItems) errors.push(`${at}: allows at most ${node.maxItems} item(s)`);
    if (node.items) value.forEach((item, i) => validate(item, node.items, root, `${at}[${i}]`, errors));
  }
  if (type === 'object') {
    for (const key of node.required ?? []) if (!Object.hasOwn(value, key)) errors.push(`${at}: missing ${key}`);
    for (const [key, v] of Object.entries(value)) {
      if (node.properties?.[key]) validate(v, node.properties[key], root, `${at}.${key}`, errors);
      else if (node.additionalProperties === false) errors.push(`${at}: unknown field ${key}`);
    }
  }
}
export function checkCatalog(catalog) {
  const errors = [];
  validate(catalog, schema, schema, '$', errors);
  const ids = new Set(), paths = new Set(), repos = new Set(), orders = new Map();
  for (const r of catalog.resources ?? []) {
    if (ids.has(r.id)) errors.push(`duplicate id ${r.id}`); ids.add(r.id);
    if (paths.has(r.path)) errors.push(`duplicate path ${r.path}`); paths.add(r.path);
    if (Number.isInteger(r.order)) { if (orders.has(r.order)) errors.push(`duplicate order ${r.order} (${orders.get(r.order)}, ${r.id})`); else orders.set(r.order, r.id); }
    if (repos.has(r.repository)) errors.push(`duplicate repository ${r.repository}`); repos.add(r.repository);
    if (r.latest !== null && !(r.versions ?? []).some(v => v.version === r.latest)) errors.push(`${r.id}: latest ${r.latest} is not a registered version`);
    const versions = new Set();
    for (const v of r.versions ?? []) {
      if (versions.has(v.version)) errors.push(`${r.id}: duplicate version ${v.version}`); versions.add(v.version);
      if (v.tag !== `v${v.version}`) errors.push(`${r.id}: tag must be v${v.version}`);
    }
  }
  return errors;
}
const schemaErrors = checkCatalog(catalog);
if (schemaErrors.length) { console.error(schemaErrors.join('\n')); process.exit(1); }
console.log(`Catalog schema OK (${catalog.resources.length} resources).`);

// CI compares against the PR base or the previous push before building trusted docs.
try {
  const current = catalog;
  // Outside CI (no event file) only the schema checks above apply.
  const event = process.env.GITHUB_EVENT_PATH ? JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')) : {};
  const before = event.pull_request?.base.sha ?? event.before;
  if (before && !/^0+$/.test(before)) {
    const exists = execFileSync('git', ['ls-tree', '--name-only', before, 'catalog/resources.json'], {encoding: 'utf8'});
    if (exists.trim()) {
      const previous = JSON.parse(execFileSync('git', ['show', `${before}:catalog/resources.json`], {encoding: 'utf8'}));
      for (const resource of previous.resources) {
        const next = current.resources.find(item => item.id === resource.id);
        if (!next) throw new Error(`Cannot remove published resource ${resource.id}`);
        for (const field of ['repository', 'docsPath', 'entryPage', ...(Object.hasOwn(resource, 'path') ? ['path', 'group', 'kind'] : [])]) {
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
