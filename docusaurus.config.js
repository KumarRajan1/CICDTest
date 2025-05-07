// @ts-check
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',
  url: 'https://your-site.netlify.app',
  baseUrl: '/',
  organizationName: 'my-org',
  projectName: 'my-docusaurus-site',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'mapping',
        path: 'mapping',
        routeBasePath: 'mapping',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'analytics',
        path: 'analytics',
        routeBasePath: 'analytics',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    // [
    //   '@docusaurus/plugin-content-docs',
    //   {
    //     id: 'telematics',
    //     path: 'telematics',
    //     routeBasePath: 'telematics',
    //     sidebarPath: require.resolve('./sidebars.js'),
    //   },
    // ],
  ],
  customFields: {
    buildTimestamp: Date.now(),
  },

  themeConfig: {
     /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    navbar: {
      title: 'My Site',
      logo: {
        alt: 'Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        { to: 'mapping/web', label: 'Mapping', position: 'left' },
          { to: 'analytics/mgis-widgets', label: 'Analytics', position: 'left' },
          // { to: 'telematics/get-your-key', label: 'Telematics', position: 'left' },
        {
          href: 'https://github.com/my-org/my-docusaurus-site',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Mapping', to: 'mapping/web' },
            { label: 'Analytics', to: 'analytics/mgis-widgets' },
            // { label: 'Telematics', to: '/telematics' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
