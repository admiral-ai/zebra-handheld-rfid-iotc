import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Zebra Handheld RFID — IoT Connector
 * Conceptual Documentation Sidebar
 *
 * Voice stance: outcome- / scent-phrased labels throughout.
 *
 * Source-of-truth note: chapter labels come from each page's
 * front-matter `sidebar_label`. The sidebar uses short-form doc
 * references (just the doc id) so there is one source of truth
 * for label text. Part labels live in this file because they are
 * structural (no doc page underlies them).
 *
 * Every Part and sub-category carries `link: { type: 'generated-index' }`
 * so the breadcrumb is fully clickable at every level (not just Home),
 * and each category gets an auto-generated landing page listing its
 * children.
 *
 * Eight Parts, ~46 curated entries (~120 total docs in /docs/**;
 * the rest are reachable via in-page cross-links and the symptom
 * index, by design). Parts 4–6 still map one-to-one to the
 * external MQTT API Reference site's sub-tags.
 */

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Part 1: Get oriented',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      link: {
        type: 'generated-index',
        title: 'Part 1: Get oriented',
        description:
          'Where to start, the MQTT primer, and how this site pairs with the auto-generated MQTT API Reference.',
        slug: '/part-1',
      },
      items: [
        'foundations/orient/about',
        'foundations/mqtt/primer',
        'foundations/orient/docs-and-api-ref',
      ],
    },
    {
      type: 'category',
      label: 'Part 2: Foundations',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      link: {
        type: 'generated-index',
        title: 'Part 2: Foundations',
        description:
          'The mental models you need before touching the API: what IOTC is, which sled you have, how the actors interact, and which bootstrap tool you will use.',
        slug: '/part-2',
      },
      items: [
        'foundations/introduction/about-iotc',
        'foundations/introduction/supported-hardware',
        'foundations/architecture/components',
        'foundations/introduction/bootstrap-tools',
        'foundations/architecture/communication-flow',
        'foundations/concepts/native-mqtt-vs-openapi',
      ],
    },
    {
      type: 'category',
      label: 'Part 3: Quick start',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      link: {
        type: 'generated-index',
        title: 'Part 3: Quick start',
        description:
          'A seven-phase, end-to-end walkthrough from a sealed box to live inventory and back. Phase 0 covers prerequisites; Phase 2 splits into Direct (123RFID Desktop) and Bridged (123RFID Mobile) variants.',
        slug: '/part-3',
      },
      items: [
        'getting-started/quick-start/overview',
        {
          type: 'category',
          label: 'Phase 0: Prerequisites',
          collapsible: true,
          collapsed: false,
          link: {
            type: 'generated-index',
            title: 'Phase 0: Prerequisites',
            description:
              'Hardware, software, credentials, and a Bluetooth pair (when required). Get these in place before Phase 1.',
            slug: '/quick-start/phase-0',
          },
          items: [
            'getting-started/prerequisites/requirements',
            'getting-started/prerequisites/credentials',
            'getting-started/prerequisites/bluetooth-pairing',
          ],
        },
        'getting-started/quick-start/step-1-connect',
        {
          type: 'category',
          label: 'Phase 2: Bootstrap (Direct or Bridged)',
          collapsible: true,
          collapsed: false,
          link: {
            type: 'generated-index',
            title: 'Phase 2: Bootstrap (Direct or Bridged)',
            description:
              'Pick the tier-matched walkthrough: Direct sleds via 123RFID Desktop on Windows, or Bridged (RFD40 Standard) via 123RFID Mobile on Android.',
            slug: '/quick-start/phase-2',
          },
          items: [
            'getting-started/quick-start/step-2-discover',
            'getting-started/quick-start/step-2-discover-mobile',
          ],
        },
        'getting-started/quick-start/step-3-subscribe',
        'getting-started/quick-start/step-4-start',
        'getting-started/quick-start/step-5-read',
        'getting-started/quick-start/step-6-stop',
        'getting-started/quick-start/step-7-reboot',
      ],
    },
    {
      type: 'category',
      label: 'Part 4: Manage your reader',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      link: {
        type: 'generated-index',
        title: 'Part 4: Manage your reader',
        description:
          'Device state, network configuration, MQTT endpoints, TLS and certificate management, the unified config document, and firmware / reboot operations. Each chapter maps to a sub-tag of the external MQTT API Reference.',
        slug: '/part-4',
      },
      items: [
        'infrastructure/management/device-state',
        'infrastructure/network/architecture',
        'infrastructure/network/wifi',
        'infrastructure/endpoints/about',
        'infrastructure/security/model',
        'infrastructure/management/config-document',
        'infrastructure/management/system-operations',
      ],
    },
    {
      type: 'category',
      label: 'Part 5: Read tags',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      link: {
        type: 'generated-index',
        title: 'Part 5: Read tags',
        description:
          'Operating-mode profiles, start/stop/trigger semantics, and post-singulation filtering — the on-air RFID surface the reader exposes over MQTT.',
        slug: '/part-5',
      },
      items: [
        'rfid/operating-mode/profiles',
        'rfid/operating-mode/start-stop',
        'rfid/operating-mode/post-filters-about',
      ],
    },
    {
      type: 'category',
      label: 'Part 6: Observe and monitor',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      link: {
        type: 'generated-index',
        title: 'Part 6: Observe and monitor',
        description:
          'Configure which events the reader emits, then design pipelines around heartbeats, alerts, connection-state transitions, and tag-read events.',
        slug: '/part-6',
      },
      items: [
        'observability/events/configure',
        'observability/events/heartbeat',
        'observability/events/alerts',
        'observability/events/mqtt-connection',
        'rfid/tag-data/dataevt-schema',
      ],
    },
    {
      type: 'category',
      label: 'Part 7: Scale to a fleet',
      collapsible: true,
      collapsed: true,
      className: 'sidebar-section-header',
      link: {
        type: 'generated-index',
        title: 'Part 7: Scale to a fleet',
        description:
          'Provisioning models (single-reader → MDM-managed fleet), bulk configuration, and reliability under network duress (retention, retry, drift).',
        slug: '/part-7',
      },
      items: [
        'fleet/provisioning/models',
        'fleet/management/about-bulk',
        'fleet/reliability/retention-retry',
      ],
    },
    {
      type: 'category',
      label: 'Part 8: Diagnose and reference',
      collapsible: true,
      collapsed: true,
      className: 'sidebar-section-header',
      link: {
        type: 'generated-index',
        title: 'Part 8: Diagnose and reference',
        description:
          'Symptom-first diagnostics, the failure-mode catalogue, the two-edges model, recovery playbooks, common misconceptions, and the glossary of canonical terms and limits.',
        slug: '/part-8',
      },
      items: [
        'reference/diagnose/symptom-index',
        'reference/diagnose/failure-modes',
        'reference/diagnose/two-edges',
        'reference/diagnose/recovery-playbooks',
        'reference/diagnose/misconceptions',
        'foundations/introduction/glossary',
      ],
    },
  ],
};

export default sidebars;
