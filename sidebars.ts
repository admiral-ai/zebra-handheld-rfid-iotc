import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Zebra Handheld RFID — IoT Connector
 * Conceptual Documentation Sidebar
 *
 * Voice stance: outcome- / scent-phrased labels throughout, sentence case.
 *
 * Source-of-truth note: chapter labels come from each page's
 * front-matter `sidebar_label`. The sidebar uses short-form doc
 * references (just the doc id) so there is one source of truth
 * for label text. Part labels live in this file because they are
 * structural (no doc page underlies them).
 *
 * Eight Parts cover the full doc set (~115 pages). Each Part's
 * concept/tutorial "spine" is surfaced first; how-to and reference
 * pages are grouped into collapsed sub-categories so everything is
 * reachable from the nav (no orphaned pages). Each top-level Part
 * carries `link: { type: 'generated-index' }` so its breadcrumb is
 * clickable and it gets an auto-generated landing page. The core
 * Part 4–6 chapters map to the external MQTT API Reference sub-tags.
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
        'foundations/start',
        'foundations/documentation-guide',
        'foundations/mqtt-primer',
        'foundations/docs-and-api-reference',
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
          'The mental models you need before touching the API: what IOTC is, which sled you have, how the actors interact, and how the reader is bootstrapped with 123RFID Desktop.',
        slug: '/part-2',
      },
      items: [
        'foundations/about-iotc',
        'foundations/hardware-tiers',
        'foundations/actors',
        'foundations/bootstrap-tools',
        'foundations/communication-flow',
        'foundations/native-mqtt-vs-openapi',
        {
          type: 'category',
          label: 'Architecture & MQTT internals',
          collapsible: true,
          collapsed: true,
          items: [
            'foundations/architecture/end-to-end',
            'foundations/architecture/interface-model',
            'foundations/architecture/handheld-considerations',
            'foundations/mqtt/topic-hierarchy',
            'foundations/mqtt/qos',
            'foundations/mqtt/auth-model',
            'foundations/mqtt/connection-lifecycle',
          ],
        },
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
          'A seven-phase, end-to-end walkthrough from a sealed box to live inventory and back. Phase 0 covers prerequisites.',
        slug: '/part-3',
      },
      items: [
        'quick-start/overview',
        {
          type: 'category',
          label: 'Phase 0: Prerequisites',
          collapsible: true,
          collapsed: false,
          link: {
            type: 'generated-index',
            title: 'Phase 0: Prerequisites',
            description:
              'Hardware, software, and credentials. Get these in place before Phase 1.',
            slug: '/quick-start/phase-0',
          },
          items: [
            'quick-start/prerequisites/requirements',
            'quick-start/prerequisites/credentials',
          ],
        },
        'quick-start/phase-1',
        'quick-start/phase-2',
        'quick-start/phase-3',
        'quick-start/phase-4',
        'quick-start/phase-5',
        'quick-start/phase-6',
        'quick-start/phase-7',
      ],
    },
    {
      type: 'category',
      label: 'Part 4: Manage your reader',
      collapsible: true,
      collapsed: true,
      className: 'sidebar-section-header',
      link: {
        type: 'generated-index',
        title: 'Part 4: Manage your reader',
        description:
          'Device state, network configuration, MQTT endpoints, TLS and certificate management, and firmware / reboot operations. The core chapters map to sub-tags of the external MQTT API Reference.',
        slug: '/part-4',
      },
      items: [
        'infrastructure/device-state',
        {
          type: 'category',
          label: 'Network',
          collapsible: true,
          collapsed: true,
          items: [
            'infrastructure/network/architecture',
            'infrastructure/network/wifi',
            'infrastructure/network/ethernet',
            'infrastructure/network/troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'MQTT endpoints',
          collapsible: true,
          collapsed: true,
          items: [
            'infrastructure/endpoints/about',
            'infrastructure/endpoints/configure',
            'infrastructure/endpoints/multi-endpoint',
            'infrastructure/endpoints/view',
          ],
        },
        {
          type: 'category',
          label: 'Security (TLS & certificates)',
          collapsible: true,
          collapsed: true,
          items: [
            'infrastructure/security/model',
            'infrastructure/security/tls-setup',
            'infrastructure/security/certificate-management',
            'infrastructure/security/rotation',
          ],
        },
        'infrastructure/system-operations',
      ],
    },
    {
      type: 'category',
      label: 'Part 5: Read tags',
      collapsible: true,
      collapsed: true,
      className: 'sidebar-section-header',
      link: {
        type: 'generated-index',
        title: 'Part 5: Read tags',
        description:
          'Operating-mode profiles, start/stop/trigger semantics, and post-singulation filtering — the on-air RFID surface the reader exposes over MQTT.',
        slug: '/part-5',
      },
      items: [
        'rfid/operating-mode-profiles',
        'rfid/operating-mode/configure',
        'rfid/operating-mode/trigger-composition',
        'rfid/start-stop-inventory',
        'rfid/post-filters',
        'rfid/operating-mode/post-filters-configure',
      ],
    },
    {
      type: 'category',
      label: 'Part 6: Observe and monitor',
      collapsible: true,
      collapsed: true,
      className: 'sidebar-section-header',
      link: {
        type: 'generated-index',
        title: 'Part 6: Observe and monitor',
        description:
          'Configure which events the reader emits, then design pipelines around heartbeats, alerts, connection-state transitions, and tag-read events.',
        slug: '/part-6',
      },
      items: [
        'observability/configure-events',
        'observability/heartbeat',
        'observability/alerts',
        'observability/mqtt-connection',
        {
          type: 'category',
          label: 'Event model & catalog',
          collapsible: true,
          collapsed: true,
          items: [
            'observability/events/model',
            'observability/events/catalog',
          ],
        },
        {
          type: 'category',
          label: 'Monitoring how-tos',
          collapsible: true,
          collapsed: true,
          items: [
            'observability/monitoring/device-health',
            'observability/monitoring/battery',
            'observability/monitoring/connection-quality',
            'observability/monitoring/fleet-dashboard',
          ],
        },
        {
          type: 'category',
          label: 'Tag data',
          collapsible: true,
          collapsed: true,
          items: [
            'rfid/dataevt-schema',
            'rfid/tag-data/architecture',
            'rfid/tag-data/interpret',
            'rfid/tag-data/dual-channels',
            'rfid/tag-data/process',
          ],
        },
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
          'Provisioning models (single-reader → MDM-managed fleet), bulk configuration, drift, reliability under network duress, migration, and cloud integration.',
        slug: '/part-7',
      },
      items: [
        'fleet/provisioning-models',
        'fleet/bulk-management',
        'fleet/management/drift',
        'fleet/retention-and-retry',
        {
          type: 'category',
          label: 'Provisioning how-tos',
          collapsible: true,
          collapsed: true,
          items: [
            'fleet/provisioning/bulk-123rfid',
            'fleet/provisioning/soti-connect',
            'fleet/provisioning/automation',
          ],
        },
        {
          type: 'category',
          label: 'Migration',
          collapsible: true,
          collapsed: true,
          items: [
            'fleet/migration/plan',
            'fleet/migration/execute',
            'fleet/migration/verify',
          ],
        },
        {
          type: 'category',
          label: 'Cloud integration',
          collapsible: true,
          collapsed: true,
          items: [
            'fleet/cloud-integration/patterns',
            'fleet/cloud-integration/aws',
            'fleet/cloud-integration/azure',
            'fleet/cloud-integration/gcp',
            'fleet/cloud-integration/custom-broker',
            'fleet/cloud-integration/tutorial-fleet',
          ],
        },
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
          'Symptom-first diagnostics, the failure-mode catalogue, the where-things-fail model, recovery playbooks, common misconceptions, troubleshooting how-tos, the command reference, FAQs, appendices, and the glossary of canonical terms and limits.',
        slug: '/part-8',
      },
      items: [
        'diagnose/symptoms',
        'diagnose/failure-modes',
        'diagnose/where-things-fail',
        'diagnose/recovery-playbooks',
        'diagnose/misconceptions',
        {
          type: 'category',
          label: 'Troubleshooting how-tos',
          collapsible: true,
          collapsed: true,
          items: [
            'reference/troubleshooting/approach',
            'reference/troubleshooting/connection',
            'reference/troubleshooting/rfid',
            'reference/troubleshooting/tag-data',
            'reference/troubleshooting/battery',
          ],
        },
        'reference/api-overview',
        {
          type: 'category',
          label: 'Command reference',
          collapsible: true,
          collapsed: true,
          items: [
            'reference/mgmt/device-status',
            'reference/mgmt/network',
            'reference/mgmt/endpoint',
            'reference/mgmt/certificates',
            'reference/mgmt/system-operations',
            'reference/mgmt/event-configuration',
            'reference/ctrl/operating-mode',
            'reference/ctrl/tag-filtering',
            'reference/ctrl/inventory-control',
            'reference/data/tag-data-event',
            'reference/events/all-events',
            'reference/mdm/about',
          ],
        },
        {
          type: 'category',
          label: 'Error codes & handling',
          collapsible: true,
          collapsed: true,
          items: [
            'reference/errors/codes',
            'reference/errors/format',
            'reference/errors/handling',
          ],
        },
        {
          type: 'category',
          label: 'FAQ',
          collapsible: true,
          collapsed: true,
          items: [
            'reference/faq/general',
            'reference/faq/connectivity',
            'reference/faq/compatibility',
            'reference/faq/rfid',
            'reference/faq/fleet',
          ],
        },
        {
          type: 'category',
          label: 'Appendices',
          collapsible: true,
          collapsed: true,
          items: [
            'reference/appendices/regulatory',
            'reference/appendices/firmware-history',
            'reference/appendices/tag-standards',
            'reference/appendices/topic-quick-reference',
          ],
        },
        'reference/glossary',
        'foundations/v1-1-features',
      ],
    },
  ],
};

export default sidebars;
