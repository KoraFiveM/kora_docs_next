import fs from 'node:fs';
import {themes} from 'prism-react-renderer';
import {fileURLToPath} from 'node:url';

const catalog = JSON.parse(fs.readFileSync(new URL('./.generated/catalog.json', import.meta.url)));
const resources = catalog.resources;
const siteUrl = process.env.DOCS_URL || 'https://docs.koraframe.work';
const baseUrl = process.env.DOCS_BASE_URL || '/';
export default {
  title: 'Kora Docs',
  tagline: 'Resource documentation, matched to your release.',
  url: siteUrl,
  baseUrl,
  favicon: 'img/favicon.svg',
  onBrokenLinks: 'warn',
  markdown: {hooks: {onBrokenMarkdownLinks: 'warn'}},
  presets: [['classic', {
    docs: {path: 'docs', routeBasePath: 'guides', sidebarPath: './sidebars.js'},
    blog: false,
    theme: {customCss: './src/css/custom.css'},
  }]],
  themes: [['cosmos-docusaurus-theme', {injectFavicon: false}], ['@easyops-cn/docusaurus-search-local', {
    hashed: true, indexBlog: false, docsRouteBasePath: ['guides', 'resources'],
    docsDir: ['docs', ...resources.flatMap(resource => resource.versions.map(release => `resource-${resource.id}_versioned_docs/version-${release.version}`))],
  }]],
  plugins: [
    ['docusaurus-markdown-source-plugin', {docsPath: '/'}],
    ['./plugins/resource-graph.cjs', {resources}],
    ['@coffeecup_tech/docusaurus-plugin-structured-data', {
      baseSchema: {website: {
        '@type': 'WebSite', '@id': `${siteUrl}/#website`,
        url: new URL(baseUrl, siteUrl).toString(), name: 'Kora Docs',
        inLanguage: 'en', description: 'Resource documentation, matched to your release.',
      }},
      outputFile: fileURLToPath(new URL('./.generated/StructuredDataRoot.jsx', import.meta.url)),
    }],
    ...resources.map(resource => ['@docusaurus/plugin-content-docs', {
    id: `resource-${resource.id}`,
    path: `.generated/current/${resource.id}`,
    routeBasePath: `resources/${resource.id}`,
    sidebarPath: './sidebars.js',
    includeCurrentVersion: false,
    lastVersion: resource.latest,
    versions: Object.fromEntries(resource.versions.map(({version}) => [version, {
      label: version, path: version,
    }])),
  }])],
  themeConfig: {
    colorMode: {defaultMode: 'dark', respectPrefersColorScheme: false},
    navbar: {title: 'Kora', items: [
      {to: '/guides/introduction', label: 'Guides', position: 'left'},
      {to: '/resources', label: 'Resources', position: 'left'},
      {to: '/graph', label: 'Graph', position: 'left'},
      {href: 'https://github.com/KoraFiveM', label: 'GitHub', position: 'right'},
    ]},
    footer: {style: 'dark', copyright: 'Kora · FiveM framework'},
    prism: {theme: themes.github, darkTheme: themes.dracula, additionalLanguages: ['lua', 'bash', 'json']},
  },
};
