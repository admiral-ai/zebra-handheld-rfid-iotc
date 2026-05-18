import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Zebra Handheld RFID — IoT Connector
 * Conceptual Documentation Sidebar — single source of navigation
 *
 * Eight Parts, thirty-two chapters. The conceptual chapters in Parts 4–6 are
 * one-to-one with the external MQTT API Reference site's sub-tags, so readers
 * can pivot between conceptual prose (this site) and the API Reference (the
 * separate generated site) in a single click.
 *
 * The API Reference is NOT a sidebar of this site. It is a sibling site
 * generated from the schema corpus in api-schema-reference/.
 *
 * Authored from scratch — no prior sidebar content carried forward.
 */

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Part 1 — Orient',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'foundations/orient/about',
          label: '1.1 About this documentation',
        },
        {
          type: 'doc',
          id: 'foundations/mqtt/primer',
          label: '1.2 About MQTT 3.1.1',
        },
        {
          type: 'doc',
          id: 'foundations/orient/docs-and-api-ref',
          label: '1.3 Conceptual docs and the API Reference',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 2 — Foundations',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'foundations/introduction/about-iotc',
          label: '2.1 What the Zebra Handheld RFID IoT Connector is',
        },
        {
          type: 'doc',
          id: 'foundations/introduction/supported-hardware',
          label: '2.2 Hardware tiers and architecture paths',
        },
        {
          type: 'doc',
          id: 'foundations/architecture/components',
          label: '2.3 The four actors: Reader, Host, Broker, Application',
        },
        {
          type: 'doc',
          id: 'foundations/architecture/communication-flow',
          label: '2.4 The message lifecycle',
        },
        {
          type: 'doc',
          id: 'foundations/concepts/native-mqtt-vs-openapi',
          label: '2.5 Native MQTT payloads vs OpenAPI schema renderings',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 3 — Quick Start',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'getting-started/quick-start/overview',
          label: '3.1 Your first 30 minutes — from unboxing to your first tag read',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 4 — Management Concepts',
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
          label: '4.3 MQTT endpoint architecture — hybrid (MDM) vs split (CTRL + DATA)',
        },
        {
          type: 'doc',
          id: 'infrastructure/security/model',
          label: '4.4 Certificates and TLS trust',
        },
        {
          type: 'doc',
          id: 'infrastructure/management/config-document',
          label: '4.5 The configuration document and reconciliation',
        },
        {
          type: 'doc',
          id: 'infrastructure/management/system-operations',
          label: '4.6 System operations — OS updates, firmware, reboot',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 5 — Control Concepts',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'rfid/operating-mode/profiles',
          label: '5.1 Operating modes — the seven profiles',
        },
        {
          type: 'doc',
          id: 'rfid/operating-mode/start-stop',
          label: '5.2 The RFID inventory cycle — start, stop, trigger',
        },
        {
          type: 'doc',
          id: 'rfid/operating-mode/post-filters-about',
          label: '5.3 Tag filtering — pre-read (Select) vs post-read (Report)',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 6 — Events & Data Concepts',
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
          label: '6.5 Tag data events — the dataEVT lifecycle',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 7 — Operate & Scale',
      collapsible: true,
      collapsed: true,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'fleet/provisioning/models',
          label: '7.1 Fleet provisioning — 123RFID Desktop, SOTI Connect, 42Gears SureMDM',
        },
        {
          type: 'doc',
          id: 'fleet/management/about-bulk',
          label: '7.2 Bulk configuration and drift management',
        },
        {
          type: 'doc',
          id: 'fleet/reliability/retention-retry',
          label: '7.3 Reliability, retention, and retry',
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
      label: 'Part 8 — Diagnose & Reference Companion',
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
          label: '8.4 Common misconceptions',
        },
        {
          type: 'doc',
          id: 'foundations/introduction/glossary',
          label: '8.5 Reference companion',
        },
      ],
    },
  ],
};

export default sidebars;
