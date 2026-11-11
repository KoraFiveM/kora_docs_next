import React from 'react';
import Link from '@docusaurus/Link';
import Original from '@theme-original/DocSidebarItems';
import ResourceTree from '../../components/ResourceTree';

export default function DocSidebarItems(props) {
  return <>
    {props.level === 1 && <li className="menu__list-item">
      <Link className="menu__link" to="/resources"><strong>Resources</strong></Link>
      <ResourceTree />
    </li>}
    <Original {...props} />
  </>;
}
