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
 * Eight Parts, ~44 curated entries (~120 total docs in /docs/**;
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
      items: [
        'getting-started/quick-start/overview',
        {
          type: 'category',
          label: 'Phase 0: Prerequisites',
          collapsible: true,
          collapsed: false,
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
