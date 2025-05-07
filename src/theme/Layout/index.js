import React, { useEffect, useState } from 'react';
import Layout from '@theme-original/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function LayoutWrapper(props) {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  const buildTimestamp = customFields?.buildTimestamp;
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  useEffect(() => {
    if (!buildTimestamp) {
      console.warn('No buildTimestamp found in customFields');
      return;
    }

    const stored = localStorage.getItem('buildTimestamp');

    if (stored && stored !== buildTimestamp.toString()) {
      console.log('[Auto Reload] New build detected.');
      setShowUpdateBanner(true);
    }

    localStorage.setItem('buildTimestamp', buildTimestamp);
  }, [buildTimestamp]);

  const handleUpdateClick = () => {
    window.location.reload();
  };

  return (
    <>
      {showUpdateBanner && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            background: '#fffae6',
            color: '#333',
            padding: '10px',
            textAlign: 'center',
            zIndex: 1000,
            boxShadow: '0 -1px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          New version available.{' '}
          <button
            onClick={handleUpdateClick}
            style={{
              marginLeft: '10px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Click to update
          </button>
        </div>
      )}
      <Layout {...props} />
    </>
  );
}
