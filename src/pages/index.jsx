import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
export default function Home() {
  return <Layout title="Documentation" description="Kora framework and versioned resource documentation">
    <main className="container margin-bottom--xl kora-home">
      <div className="kora-intro">
        <p className="kora-eyebrow">KORA DOCUMENTATION</p>
        <h1>Build with Kora.</h1>
        <p className="hero__subtitle">Guides and resource references, matched to the version you use.</p>
        <Link className="button button--primary margin-right--md" to="/guides/introduction">Read the guides</Link>
        <Link className="button button--secondary" to="/resources">Browse resources</Link>
      </div>
    </main>
  </Layout>;
}
