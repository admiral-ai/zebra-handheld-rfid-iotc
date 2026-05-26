import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Zebra Handheld RFID — IoT Connector',
  tagline: 'MQTT API Documentation for RFD40 / RFD90 Series Handheld RFID Reader Sleds',
  url: 'https://al1913-zebra.github.io',
  baseUrl: '/zebra-handheld-rfid-iotc/',
  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: true,
  favicon: 'img/zebra-logo-black-stacked.png',
  organizationName: 'al1913-zebra',
  projectName: 'zebra-handheld-rfid-iotc',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  future: {
    faster: true,
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
    },
  },
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  plugins: [
    'docusaurus-plugin-sass',
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/api/reference',
            to: '/reference/api-overview',
          },
          // URL-naming rulebook pass — see /brain/URL-NAMING.md §9.
          // Each entry redirects the legacy URL to the rulebook-aligned URL.
          { from: '/foundations/introduction/about-iotc',          to: '/foundations/about-iotc' },
          { from: '/foundations/introduction/supported-hardware',  to: '/foundations/hardware-tiers' },
          { from: '/foundations/introduction/bootstrap-tools',     to: '/foundations/bootstrap-tools' },
          { from: '/foundations/introduction/glossary',            to: '/reference/glossary' },
          { from: '/foundations/introduction/documentation-guide', to: '/foundations/documentation-guide' },
          { from: '/foundations/introduction/v1-1-features',       to: '/foundations/v1-1-features' },
          { from: '/foundations/concepts/native-mqtt-vs-openapi',  to: '/foundations/native-mqtt-vs-openapi' },
          { from: '/foundations/orient/about',                     to: '/foundations/start' },
          { from: '/foundations/orient/docs-and-api-ref',          to: '/foundations/docs-and-api-reference' },
          { from: '/foundations/architecture/components',          to: '/foundations/actors' },
        ],
      },
    ],
  ],
  themeConfig: {
    image: 'img/zebra-social-card.png',
    metadata: [
      { name: 'og:site_name', content: 'Zebra IoT Connector — Handheld RFID Documentation' },
      { name: 'og:title', content: 'Zebra IoT Connector | Handheld RFID Developer Documentation' },
      { name: 'og:description', content: 'MQTT API documentation for Zebra RFD40/RFD90 handheld RFID reader sleds. Guides, API reference, and fleet management resources.' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@ZebraTechnology' },
    ],
    navbar: {
      title: 'IoT Connector',
      logo: {
        alt: 'Zebra Technologies',
        src: 'img/zebra-logo-black-horizontal.svg',
        srcDark: 'img/zebra-logo-white-horizontal.svg',
      },
      items: [
        {
          type: 'docSidebar',
          label: 'Documentation',
          sidebarId: 'docs',
          position: 'left',
        },
        {
          href: 'https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/',
          label: 'API Reference',
          position: 'left',
        },
        {
          href: 'https://developer.zebra.com',
          label: 'Developer Portal',
          position: 'right',
        },
        {
          href: 'https://github.com/al1913-zebra/zebra-handheld-rfid-iotc',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'About this documentation', to: '/foundations/orient/about' },
            { label: 'Quick Start', to: '/getting-started/quick-start/overview' },
            { label: 'API Reference', href: 'https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/' },
            { label: 'Diagnose & Recover', to: '/reference/diagnose/symptom-index' },
          ],
        },
        {
          title: 'Zebra Resources',
          items: [
            { label: 'Developer Portal', href: 'https://developer.zebra.com' },
            { label: 'Support', href: 'https://www.zebra.com/us/en/support-downloads.html' },
            { label: 'Product Page (RFD40)', href: 'https://www.zebra.com/us/en/products/rfid/rfid-handhelds/rfd40.html' },
            { label: 'Product Page (RFD90)', href: 'https://www.zebra.com/us/en/products/rfid/rfid-handhelds/rfd90.html' },
          ],
        },
        {
          title: 'Help & Resources',
          items: [
            { label: 'Foundations', to: '/foundations/introduction/about-iotc' },
            { label: 'Glossary', to: '/foundations/introduction/glossary' },
            { label: 'Recovery playbooks', to: '/reference/diagnose/recovery-playbooks' },
            { label: 'Common misconceptions', to: '/reference/diagnose/misconceptions' },
          ],
        },
        {
          title: 'Engage',
          items: [
            { label: 'GitHub', href: 'https://github.com/al1913-zebra/zebra-handheld-rfid-iotc' },
            { label: 'Developer Community', href: 'https://developer.zebra.com/community' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/company/zebra-technologies' },
            { label: 'YouTube', href: 'https://www.youtube.com/@ZebraTechnologies' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Zebra Technologies Corporation and/or its affiliates. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.palenight,
      additionalLanguages: [
        'bash',
        'json',
        'yaml',
        'csharp',
        'java',
        'kotlin',
        'swift',
        'python',
        'ruby',
        'go',
        'rust',
        'tsx',
        'protobuf',
        'toml',
      ],
    },
    algolia: {
      appId: 'K938TH8OJ2',
      apiKey: '937ceb2bb24819a130272f1604412f35',
      indexName: 'Zebra IoT Connector Handheld RFID Docs',
      contextualSearch: true,
      searchPagePath: 'search',
      searchParameters: {},
    },
    imgZoom: {
      selector: '.markdown img:not([src^="http"])',
      zoomedInClass: 'zoomed-in-img',
    },
    mermaid: {
      theme: { light: 'neutral', dark: 'forest' },
    },
  } satisfies Preset.ThemeConfig,
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          sidebarCollapsible: true,
          editUrl: 'https://github.com/al1913-zebra/zebra-handheld-rfid-iotc/tree/main/',
          routeBasePath: '/',
          breadcrumbs: true,
        },
        theme: {
          customCss: './src/css/custom.scss',
        },
        blog: false,
        sitemap: {
          ignorePatterns: [],
        },
      } satisfies Preset.Options,
    ],
  ],
  scripts: [],
  stylesheets: [],
  clientModules: ['./src/client-modules/img-zoom'],
};

export default config;
