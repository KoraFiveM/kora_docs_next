import React from 'react';
import OriginalBadge from '@theme-original/DocVersionBadge';
import {useHistory} from '@docusaurus/router';
import {useVersions, useDocsVersion, useActiveDocContext} from '@docusaurus/plugin-content-docs/client';

function ResourceVersions({pluginId}) {
  const history = useHistory();
  const versions = useVersions(pluginId);
  const current = useDocsVersion();
  const context = useActiveDocContext(pluginId);
  const select = name => {
    const version = versions.find(item => item.name === name);
    const target = context.alternateDocVersions[name] ?? version.docs.find(doc => doc.id === version.mainDocId);
    history.push(target.path);
  };
  return <label className="resource-version-picker">
    Documentation version{' '}
    <select value={current.version} onChange={event => select(event.target.value)}>
      {versions.map(version => <option key={version.name} value={version.name}>{version.label}</option>)}
    </select>
  </label>;
}

// Docusaurus supplies version and alternate-page data; the control also works on mobile.
export default function DocVersionBadge(props) {
  const {pluginId} = useDocsVersion();
  return <><OriginalBadge {...props} />{pluginId.startsWith('resource-') &&
    <ResourceVersions pluginId={pluginId} />}</>;
}
