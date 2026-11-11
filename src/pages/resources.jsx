import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import catalog from '../../.generated/catalog.json';
import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';
export default function Resources() {
  const docs = useAllDocsData();
  const releasePath = (resource, release) => {
    const version = docs[`resource-${resource.id}`].versions.find(item => item.name === release.version);
    return version.docs.find(doc => doc.id === resource.entryPage)?.path ?? version.path;
  };
  return <Layout title="Resources" description="Documentation versions for each Kora resource">
    <main className="container margin-vert--xl">
      <h1>Resources</h1>
      <p>Choose a resource and its release. Each version is imported from an exact source commit.</p>
      {catalog.resources.length === 0
        ? <p>No resource releases have been registered yet. <Link to="/guides/publishing-resources">Connect your first resource.</Link></p>
        : <div className="resource-list">{catalog.resources.map(resource => <section className="resource-card" key={resource.id}>
          <h2>{resource.title}</h2>
          <ul>{resource.versions.map(release => <li key={release.version}>
            <Link to={releasePath(resource, release)}>{release.version}</Link>
            {release.version === resource.latest ? ' — latest' : ''}{!resource.docsAvailable ? ' — docs coming soon' : ''}
          </li>)}</ul>
        </section>)}</div>}
    </main>
  </Layout>;
}
