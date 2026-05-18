import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Zebra Handheld RFID — IoT Connector
 * Sidebar configuration — Conceptual TOC v2.0
 *
 * Eight Parts, thirty-two chapters. Concept chapters in Parts 4–6 are
 * one-to-one with the API Reference sub-tags so readers can pivot between
 * conceptual prose and the external MQTT API Reference in a single click.
 *
 * Three sidebars are defined:
 *   - docs        — the conceptual documentation (eight Parts)
 *   - sdks        — language-specific tutorials and library reference
 *   - apiReference — local MQTT API reference cross-link (the canonical
 *                    API reference is generated separately from the schema
 *                    corpus in api-schema-reference/)
 *
 * Tag-group icons are applied via className on category items.
 */

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Part 1: Orient',
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
        {
          type: 'doc',
          id: 'foundations/introduction/about-iotc',
          label: '2.1 What the IoT Connector is',
        },
        {
          type: 'doc',
          id: 'foundations/introduction/supported-hardware',
          label: '2.2 Hardware tiers & architecture paths',
        },
        {
          type: 'doc',
          id: 'foundations/architecture/components',
          label: '2.3 Reader, Host, Broker, Application',
        },
        {
          type: 'doc',
          id: 'foundations/architecture/communication-flow',
          label: '2.4 The message lifecycle',
        },
        {
          type: 'doc',
          id: 'foundations/concepts/native-mqtt-vs-openapi',
          label: '2.5 Native MQTT vs OpenAPI schema',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 3: Quick Start',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'getting-started/quick-start/overview',
          label: '3.1 Your first 30 minutes',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 4: Management Concepts',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'infrastructure/management/device-state',
          label: '4.1 Device state and identity',
        },
        {
          type: 'doc',
          id: 'infrastructure/network/architecture',
          label: '4.2 Network configuration',
        },
        {
          type: 'doc',
          id: 'infrastructure/endpoints/about',
          label: '4.3 MQTT endpoint architecture',
        },
        {
          type: 'doc',
          id: 'infrastructure/security/model',
          label: '4.4 Certificates and TLS trust',
        },
        {
          type: 'doc',
          id: 'infrastructure/management/config-document',
          label: '4.5 The configuration document',
        },
        {
          type: 'doc',
          id: 'infrastructure/management/system-operations',
          label: '4.6 System operations',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 5: Control Concepts',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'rfid/operating-mode/profiles',
          label: '5.1 Operating modes — seven profiles',
        },
        {
          type: 'doc',
          id: 'rfid/operating-mode/start-stop',
          label: '5.2 The RFID inventory cycle',
        },
        {
          type: 'doc',
          id: 'rfid/operating-mode/post-filters-about',
          label: '5.3 Tag filtering — pre vs post',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 6: Events & Data Concepts',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'observability/events/configure',
          label: '6.1 Event configuration',
        },
        {
          type: 'doc',
          id: 'observability/events/heartbeat',
          label: '6.2 Device health and heartbeats',
        },
        {
          type: 'doc',
          id: 'observability/events/alerts',
          label: '6.3 Alerts and exceptions',
        },
        {
          type: 'doc',
          id: 'observability/events/mqtt-connection',
          label: '6.4 MQTT connectivity events',
        },
        {
          type: 'doc',
          id: 'rfid/tag-data/dataevt-schema',
          label: '6.5 Tag data events',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 7: Operate & Scale',
      collapsible: true,
      collapsed: true,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'fleet/provisioning/models',
          label: '7.1 Fleet provisioning paths',
        },
        {
          type: 'doc',
          id: 'fleet/management/about-bulk',
          label: '7.2 Bulk configuration & drift',
        },
        {
          type: 'doc',
          id: 'fleet/reliability/retention-retry',
          label: '7.3 Reliability, retention, retry',
        },
        {
          type: 'doc',
          id: 'fleet/reliability/ai-rag',
          label: '7.4 AI and RAG consumption',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 8: Diagnose & Reference',
      collapsible: true,
      collapsed: true,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'reference/diagnose/symptom-index',
          label: '8.1 Symptom-first diagnostic index',
        },
        {
          type: 'doc',
          id: 'reference/diagnose/two-edges',
          label: '8.2 The two physical edges',
        },
        {
          type: 'doc',
          id: 'reference/diagnose/recovery-playbooks',
          label: '8.3 Recovery playbooks',
        },
        {
          type: 'doc',
          id: 'reference/diagnose/misconceptions',
          label: '8.4 Common misconceptions corrected',
        },
        {
          type: 'doc',
          id: 'foundations/introduction/glossary',
          label: '8.5 Glossary',
        },
      ],
    },
  ],

  apiReference: [
    {
      type: 'category',
      label: 'MQTT API Reference',
      collapsible: false,
      className: 'sidebar-section-header',
      items: [
        'reference/api-overview',
        {
          type: 'category',
          label: 'Management Interface (MGMT)',
          className: 'icon api-icon',
          collapsible: true,
          collapsed: false,
          items: [
            'reference/mgmt/device-status',
            'reference/mgmt/network',
            'reference/mgmt/endpoint',
            'reference/mgmt/certificates',
            'reference/mgmt/device-configuration',
            'reference/mgmt/system-operations',
            'reference/mgmt/event-configuration',
          ],
        },
        {
          type: 'category',
          label: 'Control Interface (CTRL)',
          className: 'icon tools-icon',
          collapsible: true,
          collapsed: false,
          items: [
            'reference/ctrl/operating-mode',
            'reference/ctrl/tag-filtering',
            'reference/ctrl/inventory-control',
          ],
        },
        {
          type: 'category',
          label: 'Data Interface (DATA)',
          className: 'icon sdk-icon',
          collapsible: true,
          collapsed: false,
          items: ['reference/data/tag-data-event'],
        },
        {
          type: 'category',
          label: 'MDM Interface',
          className: 'icon integrations-icon',
          collapsible: true,
          collapsed: true,
          items: ['reference/mdm/about'],
        },
        {
          type: 'category',
          label: 'Events',
          className: 'icon news-icon',
          collapsible: true,
          collapsed: false,
          items: ['reference/events/all-events'],
        },
      ],
    },
  ],

  sdks: [
    {
      type: 'category',
      label: 'SDKs & Examples',
      collapsible: false,
      className: 'sidebar-section-header',
      items: [
        'sdks/overview',
        {
          type: 'category',
          label: 'Language Tutorials',
          className: 'icon sdk-icon',
          collapsible: true,
          collapsed: false,
          items: [
            'sdks/python',
            'sdks/nodejs',
            'sdks/csharp',
          ],
        },
        {
          type: 'category',
          label: 'Recommended Libraries',
          className: 'icon legacy-icon',
          collapsible: true,
          collapsed: true,
          items: ['sdks/libraries'],
        },
      ],
    },
  ],
};

export default sidebars;
