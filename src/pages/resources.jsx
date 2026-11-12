import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';
import ResourceTree from '../components/ResourceTree';
import catalog from '../../.generated/catalog.json';

export default function Resources() {
  const docs = useAllDocsData();
  const resources = [...catalog.resources].sort((a, b) => a.title.localeCompare(b.title));
  return <Layout title="Resources" description="Kora resource documentation">
    <div className="resource-directory">
      <aside className="resource-directory-sidebar" aria-label="Resource navigation">
        <h2>Resources</h2><ResourceTree />
      </aside>
      <main className="resource-directory-main">
        <h1>Resources</h1>
        <p>Explore the latest documentation for each Kora resource.</p>
        <div className="resource-list">{resources.map(resource => {
          const version = docs[`resource-${resource.id}`]?.versions.find(item => item.name === resource.latest);
          const release = resource.versions.find(item => item.version === version?.name);
          const entry = version?.docs.find(doc => doc.id === (release?.entryPage ?? resource.entryPage)) ?? version?.docs.find(doc => doc.id === version.mainDocId);
          return <section className="resource-card" key={resource.id}>
            <h2>{entry ? <Link to={entry.path}>{resource.title}</Link> : resource.title}</h2>
            <p>{resource.description}</p>
            <small>{resource.latest}{resource.docsAvailable === false ? ' · Documentation coming soon' : ''}</small>
          </section>;
        })}</div>
      </main>
    </div>
  </Layout>;
}
