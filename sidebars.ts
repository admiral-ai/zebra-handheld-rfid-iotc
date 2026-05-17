import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Zebra Handheld RFID — IoT Connector
 * Sidebar configuration aligned with IA v1.1
 *
 * Three sidebars are defined to mirror ConfigCat's multi-sidebar pattern:
 *   - docs        — the seven-Part product documentation
 *   - sdks        — language-specific tutorials and library reference
 *   - apiReference — MQTT API reference (Chapter 16)
 *
 * Tag-group icons are applied via className on category items.
 */

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Part I: Foundations',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'category',
          label: '1. Introduction',
          className: 'icon overview-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'foundations/introduction/about-iotc',
            'foundations/introduction/supported-hardware',
            'foundations/introduction/v1-1-features',
            'foundations/introduction/documentation-guide',
            'foundations/introduction/glossary',
          ],
        },
        {
          type: 'category',
          label: '2. System Architecture',
          className: 'icon basics-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'foundations/architecture/end-to-end',
            'foundations/architecture/components',
            'foundations/architecture/communication-flow',
            'foundations/architecture/interface-model',
            'foundations/architecture/handheld-considerations',
          ],
        },
        {
          type: 'category',
          label: '3. MQTT Core Concepts',
          className: 'icon api-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'foundations/mqtt/primer',
            'foundations/mqtt/topic-hierarchy',
            'foundations/mqtt/qos',
            'foundations/mqtt/connection-lifecycle',
            'foundations/mqtt/auth-model',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Part II: Getting Started',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'category',
          label: '4. Prerequisites & Bootstrap',
          className: 'icon tools-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'getting-started/prerequisites/requirements',
            'getting-started/prerequisites/credentials',
            'getting-started/prerequisites/bootstrap',
            'getting-started/prerequisites/bluetooth-pairing',
          ],
        },
        {
          type: 'category',
          label: '5. Quick Start Tutorial',
          className: 'icon guides-icon',
          collapsible: true,
          collapsed: false,
          items: [
            'getting-started/quick-start/overview',
            'getting-started/quick-start/step-1-connect',
            'getting-started/quick-start/step-2-discover',
            'getting-started/quick-start/step-3-subscribe',
            'getting-started/quick-start/step-4-start',
            'getting-started/quick-start/step-5-read',
            'getting-started/quick-start/step-6-stop',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Part III: Infrastructure',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'category',
          label: '6. Network Configuration',
          className: 'icon devops-icon',
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
          label: '7. Security & Certificates',
          className: 'icon status-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'infrastructure/security/model',
            'infrastructure/security/certificate-management',
            'infrastructure/security/rotation',
            'infrastructure/security/tls-setup',
          ],
        },
        {
          type: 'category',
          label: '8. MQTT Endpoint Routing',
          className: 'icon api-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'infrastructure/endpoints/about',
            'infrastructure/endpoints/view',
            'infrastructure/endpoints/configure',
            'infrastructure/endpoints/multi-endpoint',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Part IV: RFID Operations',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'category',
          label: '9. Operating Mode & RF Config',
          className: 'icon tools-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'rfid/operating-mode/profiles',
            'rfid/operating-mode/configure',
            'rfid/operating-mode/post-filters-about',
            'rfid/operating-mode/post-filters-configure',
            'rfid/operating-mode/start-stop',
            'rfid/operating-mode/trigger-composition',
          ],
        },
        {
          type: 'category',
          label: '10. Working with Tag Data',
          className: 'icon sdk-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'rfid/tag-data/architecture',
            'rfid/tag-data/dataevt-schema',
            'rfid/tag-data/interpret',
            'rfid/tag-data/dual-channels',
            'rfid/tag-data/process',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Part V: Observability & Events',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'category',
          label: '11. Event Architecture',
          className: 'icon news-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'observability/events/model',
            'observability/events/catalog',
            'observability/events/configure',
            'observability/events/heartbeat',
            'observability/events/alerts',
            'observability/events/mqtt-connection',
          ],
        },
        {
          type: 'category',
          label: '12. Monitoring & Diagnostics',
          className: 'icon analytics-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'observability/monitoring/device-health',
            'observability/monitoring/battery',
            'observability/monitoring/connection-quality',
            'observability/monitoring/fleet-dashboard',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Part VI: Fleet Operations',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'category',
          label: '13. Fleet Provisioning',
          className: 'icon team-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'fleet/provisioning/models',
            'fleet/provisioning/soti-connect',
            'fleet/provisioning/bulk-123rfid',
            'fleet/provisioning/automation',
          ],
        },
        {
          type: 'category',
          label: '14. Fleet Management & Bulk Config',
          className: 'icon project-management-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'fleet/management/about-bulk',
            'fleet/management/read-config',
            'fleet/management/apply-config',
            'fleet/management/drift',
            'fleet/migration/plan',
            'fleet/migration/execute',
            'fleet/migration/verify',
          ],
        },
        {
          type: 'category',
          label: '15. Cloud Integration',
          className: 'icon integrations-icon',
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
      label: 'Part VII: Reference & Troubleshooting',
      collapsible: true,
      collapsed: false,
      className: 'sidebar-section-header',
      items: [
        {
          type: 'category',
          label: '17. Error Codes',
          className: 'icon faq-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'reference/errors/format',
            'reference/errors/codes',
            'reference/errors/handling',
          ],
        },
        {
          type: 'category',
          label: '18. Troubleshooting',
          className: 'icon tools-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'reference/troubleshooting/approach',
            'reference/troubleshooting/connection',
            'reference/troubleshooting/rfid',
            'reference/troubleshooting/tag-data',
            'reference/troubleshooting/bluetooth',
            'reference/troubleshooting/battery',
          ],
        },
        {
          type: 'category',
          label: '19. FAQ',
          className: 'icon faq-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'reference/faq/general',
            'reference/faq/connectivity',
            'reference/faq/rfid',
            'reference/faq/fleet',
            'reference/faq/compatibility',
          ],
        },
        {
          type: 'category',
          label: '20. Appendices',
          className: 'icon legacy-icon',
          collapsible: true,
          collapsed: true,
          items: [
            'reference/appendices/config-schema',
            'reference/appendices/topic-quick-reference',
            'reference/appendices/firmware-history',
            'reference/appendices/tag-standards',
            'reference/appendices/regulatory',
            'reference/appendices/libraries',
          ],
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
