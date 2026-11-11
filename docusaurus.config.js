import fs from 'node:fs';
import {themes} from 'prism-react-renderer';

const catalog = JSON.parse(fs.readFileSync(new URL('./.generated/catalog.json', import.meta.url)));
const resources = catalog.resources;
export default {
  title: 'Kora Docs',
  tagline: 'Resource documentation, matched to your release.',
  url: process.env.DOCS_URL || 'https://docs.koraframe.work',
  baseUrl: process.env.DOCS_BASE_URL || '/',
  favicon: 'img/favicon.svg',
  onBrokenLinks: 'throw',
  markdown: {hooks: {onBrokenMarkdownLinks: 'throw'}},
  presets: [['classic', {
    docs: {path: 'docs', routeBasePath: 'guides', sidebarPath: './sidebars.js'},
    blog: false,
    theme: {customCss: './src/css/custom.css'},
  }]],
  plugins: resources.map(resource => ['@docusaurus/plugin-content-docs', {
    id: `resource-${resource.id}`,
    path: `.generated/current/${resource.id}`,
    routeBasePath: `resources/${resource.id}`,
    sidebarPath: './sidebars.js',
    includeCurrentVersion: false,
    lastVersion: resource.latest,
    versions: Object.fromEntries(resource.versions.map(({version}) => [version, {
      label: version, path: version,
    }])),
  }]),
  themeConfig: {
    colorMode: {defaultMode: 'dark', respectPrefersColorScheme: false},
    navbar: {title: 'Kora', items: [
      {to: '/guides/introduction', label: 'Guides', position: 'left'},
      {to: '/resources', label: 'Resources', position: 'left'},
      {href: 'https://github.com/KoraFiveM', label: 'GitHub', position: 'right'},
    ]},
    footer: {style: 'dark', copyright: 'Kora · FiveM framework'},
    prism: {theme: themes.github, darkTheme: themes.dracula, additionalLanguages: ['lua', 'bash', 'json']},
  },
};
