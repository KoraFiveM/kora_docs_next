import React from 'react';
import OriginalRoot from '@theme-original/Root';
import StructuredDataRoot from '@site/.generated/StructuredDataRoot.jsx';

export default function Root({children}) {
  return <OriginalRoot><StructuredDataRoot>{children}</StructuredDataRoot></OriginalRoot>;
}
