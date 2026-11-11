import React from 'react';
import Layout from '@theme/Layout';
import ResourceTree from '../components/ResourceTree';

export default function Resources() {
  return <Layout title="Resources" description="Kora resource documentation">
    <main className="container margin-vert--xl">
      <h1>Resources</h1>
      <p>Browse resources alphabetically. Open a resource to see its latest documentation; use the version selector on a documentation page for older releases.</p>
      <nav aria-label="Resource documentation"><ResourceTree /></nav>
    </main>
  </Layout>;
}
