import React, { useEffect } from 'react';
import Layout from '@theme-original/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function LayoutWrapper(props) {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  const buildTimestamp = customFields?.buildTimestamp;

  useEffect(() => {
    if (!buildTimestamp) {
      console.warn('No buildTimestamp found in customFields');
      return;
    }

    const stored = localStorage.getItem('buildTimestamp');

    if (stored && stored !== buildTimestamp.toString()) {
      console.log('[Auto Reload] New build detected. Reloading...');
      localStorage.setItem('buildTimestamp', buildTimestamp);
      window.location.reload(true);
    } else {
      localStorage.setItem('buildTimestamp', buildTimestamp);
    }
  }, [buildTimestamp]);

  return <Layout {...props} />;
}
