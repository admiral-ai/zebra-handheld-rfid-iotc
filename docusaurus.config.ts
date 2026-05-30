import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';
import type * as Preset from '@docusaurus/preset-classic';

// remark-d2 is ESM-only; Docusaurus' config-loader (jiti) chokes on
// top-level await, so we wrap the whole config in an async default
// export and resolve the dynamic import inside it.

export default async function createConfig(): Promise<Config> {
  const remarkD2 = (await import('remark-d2')).default;

  // Site base URL. remark-d2's linkPath must include this prefix or
  // generated img src attributes will skip /zebra-handheld-rfid-iotc/
  // and 404 in production. Define once and reference below.
  const baseUrl = '/zebra-handheld-rfid-iotc/';
  const d2LinkPath = `${baseUrl}d2`.replace(/\/+/g, '/');

  const config: Config = {
  title: 'Zebra Handheld RFID Reader | IoT Connector',
  tagline: 'MQTT API Documentation for RFD40 / RFD90 Series Handheld RFID Reader Sleds',
  url: 'https://al1913-zebra.github.io',
  baseUrl,
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
  plugins: [
    'docusaurus-plugin-sass',
    // PushFeedback web component bundle. We DO NOT use the
    // docusaurus-pushfeedback plugin because it only creates a
    // floating <feedback-button> in the body. We want an inline
    // embedded <feedback-modal> at the bottom of every doc page —
    // see src/theme/DocItem/Footer/index.tsx for the swizzle that
    // renders the actual widget element. Here we just load the CDN
    // assets (CSS + ESM bundle) on every page.
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
          // Pass 2 — see /brain/URL-NAMING.md §9 (pass 2). Higher-blast-radius renames.
          { from: '/foundations/mqtt/primer',                              to: '/foundations/mqtt-primer' },
          { from: '/foundations/architecture/communication-flow',          to: '/foundations/communication-flow' },
          { from: '/getting-started/quick-start/overview',                 to: '/quick-start/overview' },
          { from: '/getting-started/prerequisites/requirements',           to: '/quick-start/prerequisites/requirements' },
          { from: '/getting-started/prerequisites/credentials',            to: '/quick-start/prerequisites/credentials' },
          { from: '/getting-started/quick-start/step-1-connect',           to: '/quick-start/phase-1' },
          { from: '/getting-started/quick-start/step-2-discover',          to: '/quick-start/phase-2' },
          { from: '/getting-started/quick-start/step-2-discover-mobile',   to: '/quick-start/phase-2' },
          { from: '/getting-started/quick-start/step-3-subscribe',         to: '/quick-start/phase-3' },
          { from: '/getting-started/quick-start/step-4-start',             to: '/quick-start/phase-4' },
          { from: '/getting-started/quick-start/step-5-read',              to: '/quick-start/phase-5' },
          { from: '/getting-started/quick-start/step-6-stop',              to: '/quick-start/phase-6' },
          { from: '/getting-started/quick-start/step-7-reboot',            to: '/quick-start/phase-7' },
          { from: '/infrastructure/management/device-state',               to: '/infrastructure/device-state' },
          { from: '/infrastructure/management/system-operations',          to: '/infrastructure/system-operations' },
          { from: '/observability/events/configure',                       to: '/observability/configure-events' },
          { from: '/observability/events/heartbeat',                       to: '/observability/heartbeat' },
          { from: '/observability/events/alerts',                          to: '/observability/alerts' },
          { from: '/observability/events/mqtt-connection',                 to: '/observability/mqtt-connection' },
          { from: '/rfid/operating-mode/profiles',                         to: '/rfid/operating-mode-profiles' },
          { from: '/rfid/operating-mode/start-stop',                       to: '/rfid/start-stop-inventory' },
          { from: '/rfid/operating-mode/post-filters-about',               to: '/rfid/post-filters' },
          { from: '/rfid/tag-data/dataevt-schema',                         to: '/rfid/dataevt-schema' },
          { from: '/fleet/provisioning/models',                            to: '/fleet/provisioning-models' },
          { from: '/fleet/management/about-bulk',                          to: '/fleet/bulk-management' },
          { from: '/fleet/reliability/retention-retry',                    to: '/fleet/retention-and-retry' },
          { from: '/reference/diagnose/symptom-index',                     to: '/diagnose/symptoms' },
          { from: '/reference/diagnose/failure-modes',                     to: '/diagnose/failure-modes' },
          { from: '/reference/diagnose/two-edges',                         to: '/diagnose/where-things-fail' },
          { from: '/reference/diagnose/recovery-playbooks',                to: '/diagnose/recovery-playbooks' },
          { from: '/reference/diagnose/misconceptions',                    to: '/diagnose/misconceptions' },
          // NOTE. The entire /sdks/* section and /reference/appendices/libraries
          // were deleted as not-required. No redirects are kept for these URLs —
          // they intentionally 404. (Earlier passes added redirects pointing them
          // at /foundations/mqtt-primer; those were removed because the plugin
          // generates a redirect-shell HTML page at each "from" URL, which kept
          // the deleted URLs resolving as redirect pages instead of true 404s.)
        ],
      },
    ],
  ],
  themeConfig: {
    image: 'img/zebra-social-card.png',
    metadata: [
      { name: 'og:site_name', content: 'Zebra IoT Connector | Handheld RFID Reader Documentation' },
      { name: 'og:title', content: 'Zebra IoT Connector | Handheld RFID Reader Developer Documentation' },
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
            { label: 'About this documentation', to: '/foundations/start' },
            { label: 'Quick Start', to: '/quick-start/overview' },
            { label: 'API Reference', href: 'https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/' },
            { label: 'Diagnose & Recover', to: '/diagnose/symptoms' },
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
            { label: 'Foundations', to: '/foundations/about-iotc' },
            { label: 'Glossary', to: '/reference/glossary' },
            { label: 'Recovery playbooks', to: '/diagnose/recovery-playbooks' },
            { label: 'Common misconceptions', to: '/diagnose/misconceptions' },
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
  } satisfies Preset.ThemeConfig,
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          sidebarCollapsible: true,
          // editUrl intentionally omitted to hide the "Edit this page" link
          // on every doc page. The feedback widget at the bottom of each
          // page replaces this affordance (see src/theme/DocItem/Footer).
          routeBasePath: '/',
          breadcrumbs: true,
          // remark-d2 compiles every ```d2``` fenced block to SVG via the
          // `d2` CLI (must be on PATH at build time) and rewrites the
          // fence to an <img> tag.
          //   defaultD2Opts: pin themes — 0 (Neutral Default) light + 200
          //                  (Dark Mauve) dark per /brain/D2-MIGRATION.md §3.
          //                  Layout engine left as default (dagre); switch
          //                  to elk per-diagram via fence metadata when
          //                  needed for nested architectures.
          //   htmlImage: false — Docusaurus' MDX pipeline rejects raw
          //                      <img> tags ("Cannot handle unknown
          //                      node `raw`"). Markdown ![] syntax is
          //                      what we want anyway.
          //   linkPath: must include the site baseUrl so generated
          //             img tags resolve correctly under GitHub Pages.
          //             The default "/d2" produces absolute URLs that
          //             skip our /zebra-handheld-rfid-iotc/ prefix and
          //             404 in production.
          remarkPlugins: [
            [
              remarkD2,
              {
                defaultD2Opts: ['-t=0', '--dark-theme=200'],
                htmlImage: false,
                defaultImageAttrs: { alt: 'Diagram' },
                linkPath: d2LinkPath,
              },
            ],
          ],
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
  scripts: [
    // PushFeedback web component bundle. Loaded once per page; the
    // <feedback-modal> tag is rendered in src/theme/DocItem/Footer.
    {
      src: 'https://cdn.jsdelivr.net/npm/pushfeedback/dist/pushfeedback/pushfeedback.esm.js',
      type: 'module',
      async: true,
    },
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/pushfeedback/dist/pushfeedback/pushfeedback.css',
      rel: 'stylesheet',
    },
  ],
  clientModules: ['./src/client-modules/img-zoom'],
  };

  return config;
}
