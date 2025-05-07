import React, { useEffect } from 'react';
import Layout from '@theme-original/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function LayoutWrapper(props) {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  const buildTimestamp = customFields?.buildTimestamp;
  console.log('[Debug] buildTimestamp:', buildTimestamp);

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

  useEffect(() => {
    sessionStorage.removeItem('chunkReloaded');

    const handler = (event) => {
      if (
        event?.reason?.message &&
        event.reason.message.includes('Loading chunk')
      ) {
        const hasReloaded = sessionStorage.getItem('chunkReloaded');

        if (!hasReloaded) {
          console.warn('[ChunkLoadError] Reloading due to stale chunk...');
          sessionStorage.setItem('chunkReloaded', 'true');
          window.location.reload(true);
        } else {
          console.error('Already reloaded once. Not reloading again.');
        }
      }
    };

    window.addEventListener('unhandledrejection', handler);

    return () => {
      window.removeEventListener('unhandledrejection', handler);
    };
  }, []);

  return <Layout {...props} />;
}
