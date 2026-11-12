import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';
import catalog from '../../.generated/catalog.json';

export default function ResourceTree() {
  const docs = useAllDocsData();
  const {pathname} = useLocation();
  const label = doc => doc.id.replace(/[-_]+/g, ' ').replace(/\//g, ' / ');
  const resources = [...catalog.resources].sort((a, b) => a.title.localeCompare(b.title));
  return <ul className="menu__list resource-tree">
    {resources.map(resource => {
      const versions = docs[`resource-${resource.id}`]?.versions ?? [];
      const active = pathname.includes(`/resources/${resource.id}/`);
      const version = (active && versions.find(item => {
        const prefix = item.path.replace(/\/$/, '');
        return pathname === prefix || pathname.startsWith(`${prefix}/`);
      })) || versions.find(item => item.name === resource.latest);
      if (!version) return null;
      const entry = version.docs.find(doc => doc.id === resource.entryPage) ?? version.docs.find(doc => doc.id === version.mainDocId);
      if (!entry) return null;
      return <li className="menu__list-item" key={resource.id}>
        <details open={active || undefined}>
          <summary>{resource.title}</summary>
          <ul className="menu__list">
            <li className="menu__list-item"><Link className="menu__link" to={entry.path}>Overview</Link></li>
            {[...version.docs].filter(doc => doc.id !== entry.id).sort((a, b) => label(a).localeCompare(label(b))).map(doc =>
              <li className="menu__list-item" key={doc.id}><Link className="menu__link" to={doc.path}>{label(doc)}</Link></li>)}
          </ul>
        </details>
      </li>;
    })}
  </ul>;
}
