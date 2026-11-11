import React from 'react';
import Original from '@theme-original/DocSidebarItems';
import ResourceTree from '../../components/ResourceTree';

export default function DocSidebarItems(props) {
  return <>
    {props.level === 1 && <li className="menu__list-item"><details open><summary>Resources</summary><ResourceTree /></details></li>}
    <Original {...props} />
  </>;
}
