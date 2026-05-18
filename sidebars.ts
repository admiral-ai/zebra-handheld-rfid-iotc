import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Zebra Handheld RFID — IoT Connector
 * Conceptual Documentation Sidebar
 *
 * Voice stance: outcome- / scent-phrased labels throughout.
 *
 * Every chapter label predicts the experience a reader will have on
 * the page — what they will know, what they will do, what they will
 * avoid. Labels are warm and second-person where natural.
 *
 * This stance is a deliberate choice over the strict Diátaxis rule
 * (which would topic-phrase Explanation chapters). Diátaxis content
 * discipline still applies to the page bodies (Tutorials remain
 * narrative; Explanations remain discursive; etc.); only the LABEL
 * STYLE is unified for navigation warmth.
 *
 * Eight Parts, thirty-two chapters. Parts 4–6 still map one-to-one
 * to the external MQTT API Reference site's sub-tags.
 */

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Part 1 — Get oriented',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'foundations/orient/about',
          label: '1.1 Start here',
        },
        {
          type: 'doc',
          id: 'foundations/mqtt/primer',
          label: '1.2 MQTT in five minutes',
        },
        {
          type: 'doc',
          id: 'foundations/orient/docs-and-api-ref',
          label: '1.3 Where these docs end and the API Reference begins',
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
          label: '2.1 What the IoT Connector actually is',
        },
        {
          type: 'doc',
          id: 'foundations/introduction/supported-hardware',
          label: '2.2 Which sled do you have? (Monolithic vs Bipartite)',
        },
        {
          type: 'doc',
          id: 'foundations/architecture/components',
          label: '2.3 Reader, Host, Broker, Application — who does what',
        },
        {
          type: 'doc',
          id: 'foundations/architecture/communication-flow',
          label: '2.4 How a command travels from your app to a tag and back',
        },
        {
          type: 'doc',
          id: 'foundations/concepts/native-mqtt-vs-openapi',
          label: '2.5 The OpenAPI Illusion (and how to avoid it)',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 3 — Quick start',
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
      label: 'Part 4 — Manage your reader',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'infrastructure/management/device-state',
          label: '4.1 What your reader knows about itself',
        },
        {
          type: 'doc',
          id: 'infrastructure/network/architecture',
          label: '4.2 Getting on the network (Wi-Fi & Ethernet)',
        },
        {
          type: 'doc',
          id: 'infrastructure/endpoints/about',
          label: '4.3 How the MQTT plumbing fits together',
        },
        {
          type: 'doc',
          id: 'infrastructure/security/model',
          label: '4.4 Securing the connection (TLS & certificates)',
        },
        {
          type: 'doc',
          id: 'infrastructure/management/config-document',
          label: '4.5 The one big config document',
        },
        {
          type: 'doc',
          id: 'infrastructure/management/system-operations',
          label: '4.6 Updating firmware and rebooting safely',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 5 — Read tags',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'rfid/operating-mode/profiles',
          label: '5.1 Choose how the reader reads tags',
        },
        {
          type: 'doc',
          id: 'rfid/operating-mode/start-stop',
          label: '5.2 Start, stop, and the trigger button',
        },
        {
          type: 'doc',
          id: 'rfid/operating-mode/post-filters-about',
          label: '5.3 Filter tags before vs after the read',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 6 — Observe & monitor',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'observability/events/configure',
          label: '6.1 Choose what the reader tells you',
        },
        {
          type: 'doc',
          id: 'observability/events/heartbeat',
          label: '6.2 Watch your reader’s pulse',
        },
        {
          type: 'doc',
          id: 'observability/events/alerts',
          label: '6.3 When the reader needs to interrupt you',
        },
        {
          type: 'doc',
          id: 'observability/events/mqtt-connection',
          label: '6.4 Knowing when you’re connected',
        },
        {
          type: 'doc',
          id: 'rfid/tag-data/dataevt-schema',
          label: '6.5 Where tag reads actually come from',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 7 — Scale to a fleet',
      collapsible: true,
      collapsed: true,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'fleet/provisioning/models',
          label: '7.1 Going from one reader to a fleet',
        },
        {
          type: 'doc',
          id: 'fleet/management/about-bulk',
          label: '7.2 Keeping a fleet in sync',
        },
        {
          type: 'doc',
          id: 'fleet/reliability/retention-retry',
          label: '7.3 What happens when the network drops',
        },
        {
          type: 'doc',
          id: 'fleet/reliability/ai-rag',
          label: '7.4 Built for AI agents to read',
        },
      ],
    },
    {
      type: 'category',
      label: 'Part 8 — Diagnose & reference',
      collapsible: true,
      collapsed: true,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'doc',
          id: 'reference/diagnose/symptom-index',
          label: '8.1 Something’s broken — start here',
        },
        {
          type: 'doc',
          id: 'reference/diagnose/two-edges',
          label: '8.2 Where things actually fail',
        },
        {
          type: 'doc',
          id: 'reference/diagnose/recovery-playbooks',
          label: '8.3 Playbooks for getting back online',
        },
        {
          type: 'doc',
          id: 'reference/diagnose/misconceptions',
          label: '8.4 Things people get wrong about IOTC',
        },
        {
          type: 'doc',
          id: 'foundations/introduction/glossary',
          label: '8.5 Glossary, limits, and cheat sheets',
        },
      ],
    },
  ],
};

export default sidebars;
