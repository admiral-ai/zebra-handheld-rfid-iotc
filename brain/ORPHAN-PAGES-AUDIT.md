# Orphan-page audit

This audit identifies every doc page in `/docs/**` that is **not** linked
from the left-sidebar TOC, then classifies each as **intentional** (deep
reference reachable via in-page cross-links or the symptom index) or
**accidental** (genuinely orphaned, no path in via the sidebar or any
sidebar-surfaced page).

The classification is anchored to the design note in `sidebars.ts`:

> Eight Parts, ~46 curated entries (~120 total docs in /docs/**; the
> rest are reachable via in-page cross-links and the symptom index, by
> design).

So the *expectation* is that most non-sidebar docs are intentional. The
question for each is: **does the design hold up?** A page is
**intentional** if at least one sidebar-surfaced page (or another deep
reference reachable from sidebar) links to it. A page is **accidental**
if its only incoming links are from other non-surfaced docs, OR it has
no incoming links at all *and* doesn't belong to a coherent reachable
cluster.

## Numbers

| | Count |
|---|---|
| Total docs in `/docs/**` | 129 |
| Surfaced in sidebar | 45 |
| Not surfaced (orphans) | 84 |
| ↳ Reachable from sidebar-surfaced (direct in-link) | 8 |
| ↳ Reachable via a cluster (in a coherent deep-ref group) | 72 |
| ↳ Truly accidental orphans (no path in) | 4 |

## Reachable from a sidebar-surfaced page (intentional)

These 8 orphans have ≥ 1 incoming link from a sidebar-surfaced page.
They are the canonical "deep reference reachable via cross-link" cases.

| Page | Incoming from surfaced | Intentional? |
|---|---|---|
| `/fleet/cloud-integration/custom-broker` | `/quick-start/prerequisites/credentials` | ✅ Yes — credentials chapter explicitly references custom-broker options |
| `/infrastructure/security/certificate-management` | `/infrastructure/network/wifi` | ✅ Yes — wifi chapter cross-links to cert-management for TLS setup |
| `/reference/api-overview` | `/quick-start/prerequisites/credentials`, `/infrastructure/network/wifi` | ✅ Yes — but worth surfacing too (see "promoted" below) |
| `/reference/errors/codes` | `/diagnose/failure-modes` | ✅ Yes — failure-modes catalogue points at the error-codes reference |
| `/fleet/migration/execute` | `/quick-start/prerequisites/requirements` | ✅ Yes — requirements section references migration |
| `/foundations/mqtt/auth-model` | `/quick-start/prerequisites/credentials` | ✅ Yes — credentials chapter references the auth model |
| `/reference/appendices/firmware-history` | `/quick-start/prerequisites/requirements` | ✅ Yes — requirements references firmware versioning |
| `/reference/appendices/regulatory` | `/foundations/hardware-tiers` | ✅ Yes — hardware tiers chapter references region/regulatory info |

## Reachable via a cluster (intentional deep reference)

These 72 orphans form coherent clusters that are reached via:
(a) one of the 8 directly-reachable pages above,
(b) the symptom index in `/diagnose/symptoms` (Part 8), or
(c) the external API reference site.

Each cluster has a designated entry point in the sidebar; the deeper
pages spread from there via in-page links.

### `/reference/troubleshooting/*` cluster (6 pages) — superseded but kept

| Page | Intentional? | Notes |
|---|---|---|
| `/reference/troubleshooting/approach` | ✅ Intentional (legacy) | Pre-Diagnose IA refactor; content overlaps `/diagnose/symptoms` |
| `/reference/troubleshooting/battery` | ✅ Intentional (legacy) | Linked from `/observability/monitoring/battery` |
| `/reference/troubleshooting/bluetooth` | ✅ Intentional (legacy) | Linked from foundations architecture pages |
| `/reference/troubleshooting/connection` | ✅ Intentional (legacy) | 4 in-links, including infra/network and foundations |
| `/reference/troubleshooting/rfid` | ✅ Intentional (legacy) | Linked from approach |
| `/reference/troubleshooting/tag-data` | ✅ Intentional (legacy) | Linked from approach |

> **Note.** This cluster predates the `/diagnose/*` IA refactor. The new
> diagnose pages are the canonical surface; these remain as deep
> reference that the symptom index can link to. Not surfaced in sidebar
> by design — would create two "where do I diagnose?" entry points.

### `/reference/mgmt/*` cluster (7 pages) — API-reference mirror

| Page | Intentional? |
|---|---|
| `/reference/mgmt/certificates` | ✅ Intentional — mirrors external API ref §3.x |
| `/reference/mgmt/device-configuration` | ✅ Intentional |
| `/reference/mgmt/device-status` | ✅ Intentional |
| `/reference/mgmt/endpoint` | ✅ Intentional |
| `/reference/mgmt/event-configuration` | ✅ Intentional |
| `/reference/mgmt/network` | ✅ Intentional |
| `/reference/mgmt/system-operations` | ✅ Intentional |

> **Note.** These are docs-side mirrors of the external MQTT API
> reference's MGMT sub-tags. They duplicate concept content from Part 4
> (Manage your reader) and are reached from the external API ref pages,
> not from the sidebar. Surfacing them would create competing entry
> points with the same content surface.

### `/reference/ctrl/*` cluster (3 pages) — API-reference mirror

| Page | Intentional? |
|---|---|
| `/reference/ctrl/inventory-control` | ✅ Intentional — mirrors external API ref CTRL sub-tag |
| `/reference/ctrl/operating-mode` | ✅ Intentional |
| `/reference/ctrl/tag-filtering` | ✅ Intentional |

> Same rationale as `/reference/mgmt/*`.

### `/reference/faq/*` cluster (5 pages) — search-driven reference

| Page | Intentional? |
|---|---|
| `/reference/faq/compatibility` | ✅ Intentional |
| `/reference/faq/connectivity` | ✅ Intentional |
| `/reference/faq/fleet` | ✅ Intentional |
| `/reference/faq/general` | ✅ Intentional |
| `/reference/faq/rfid` | ✅ Intentional |

> **Note.** FAQ pages are designed to be reached via search (Algolia
> indexes them) and via Q-shaped queries from search engines. Surfacing
> them in the sidebar adds noise without improving discoverability.

### `/reference/appendices/*` cluster (4 pages) — reference appendices

| Page | Intentional? | Notes |
|---|---|---|
| `/reference/appendices/config-schema` | ✅ Intentional | Linked from fleet management pages |
| `/reference/appendices/libraries` | ✅ Intentional | Linked from `/sdks/python` |
| `/reference/appendices/tag-standards` | ✅ Intentional | Linked from `/rfid/tag-data/interpret` |
| `/reference/appendices/topic-quick-reference` | ✅ Intentional | Linked from `/foundations/mqtt/topic-hierarchy` |

### `/reference/data/*`, `/reference/events/*`, `/reference/errors/*`, `/reference/mdm/*` clusters (5 pages) — API-reference mirrors

| Page | Intentional? |
|---|---|
| `/reference/data/tag-data-event` | ✅ Intentional — mirrors external API ref DATA sub-tag |
| `/reference/events/all-events` | ✅ Intentional — mirrors external API ref Events sub-tag |
| `/reference/errors/format` | ✅ Intentional — mirrors error-response shape ref |
| `/reference/errors/handling` | ✅ Intentional — how-to for error handling |
| `/reference/mdm/about` | ✅ Intentional — MDM/SOTI interface ref |

### `/sdks/*` cluster (5 pages) — language tutorials

| Page | Intentional? |
|---|---|
| `/sdks/csharp` | ✅ Intentional — language-specific Quick Start |
| `/sdks/nodejs` | ✅ Intentional |
| `/sdks/python` | ✅ Intentional |
| `/sdks/libraries` | ✅ Intentional — landing list |
| `/sdks/overview` | ⚠️ **Accidental orphan** (see below) |

> **Note.** Language-specific quick-starts duplicate the canonical
> Part-3 Quick Start in each language. The navbar's "Developer Portal"
> link goes to developer.zebra.com which is the primary SDK surface.
> The `/sdks/overview` page acts as a landing within the docs and *is*
> orphaned — see "promoted" below.

### `/fleet/cloud-integration/*` cluster (5 pages) — cloud-broker how-tos

| Page | Intentional? |
|---|---|
| `/fleet/cloud-integration/aws` | ✅ Intentional |
| `/fleet/cloud-integration/azure` | ✅ Intentional |
| `/fleet/cloud-integration/gcp` | ✅ Intentional |
| `/fleet/cloud-integration/patterns` | ✅ Intentional — cluster hub |
| `/fleet/cloud-integration/tutorial-fleet` | ✅ Intentional |

> **Note.** Reached via `/fleet/cloud-integration/custom-broker` (which is
> linked from prerequisites/credentials) and via the cluster hub
> `patterns.md`. Cloud-broker selection is out-of-scope of the canonical
> reading path; surfacing it would suggest endorsement of specific
> clouds.

### `/fleet/management/*` cluster (3 pages) — fleet ops how-tos

| Page | Intentional? |
|---|---|
| `/fleet/management/apply-config` | ✅ Intentional — linked from drift, read-config, provisioning/automation |
| `/fleet/management/drift` | ✅ Intentional |
| `/fleet/management/read-config` | ✅ Intentional |

> **Note.** Reached via `/fleet/bulk-management` (sidebar-surfaced) which
> is the concept entry; these are the how-to extensions.

### `/fleet/migration/*` cluster (3 pages) — migration how-tos

| Page | Intentional? |
|---|---|
| `/fleet/migration/plan` | ✅ Intentional — 5 in-links incl. compatibility FAQ |
| `/fleet/migration/execute` | ✅ Intentional — linked from prerequisites |
| `/fleet/migration/verify` | ✅ Intentional |

### `/fleet/provisioning/*` cluster (3 pages) — provisioning how-tos

| Page | Intentional? |
|---|---|
| `/fleet/provisioning/automation` | ✅ Intentional |
| `/fleet/provisioning/bulk-123rfid` | ✅ Intentional |
| `/fleet/provisioning/soti-connect` | ✅ Intentional — 4 in-links |

> **Note.** Reached via `/fleet/provisioning-models` (sidebar-surfaced)
> which is the concept entry.

### `/foundations/architecture/*` cluster (3 pages) — deep architecture

| Page | Intentional? |
|---|---|
| `/foundations/architecture/end-to-end` | ✅ Intentional |
| `/foundations/architecture/handheld-considerations` | ✅ Intentional — 5 in-links |
| `/foundations/architecture/interface-model` | ✅ Intentional |

> **Note.** `/foundations/communication-flow` is the sidebar-surfaced
> concept entry to architecture topics. These three deeper pages spread
> from it (e.g., `interface-model` links from `topic-hierarchy`,
> `handheld-considerations` from multiple pages).

### `/foundations/mqtt/*` cluster (4 pages) — deep MQTT

| Page | Intentional? |
|---|---|
| `/foundations/mqtt/auth-model` | ✅ Intentional — linked from prereqs/credentials |
| `/foundations/mqtt/connection-lifecycle` | ✅ Intentional |
| `/foundations/mqtt/qos` | ✅ Intentional — 4 in-links |
| `/foundations/mqtt/topic-hierarchy` | ✅ Intentional |

> **Note.** `/foundations/mqtt-primer` is the sidebar-surfaced entry;
> these deeper MQTT pages spread from it and from prereqs/credentials.

### `/infrastructure/endpoints/*` cluster (3 pages) — endpoint how-tos

| Page | Intentional? |
|---|---|
| `/infrastructure/endpoints/configure` | ✅ Intentional — 7 in-links |
| `/infrastructure/endpoints/multi-endpoint` | ✅ Intentional |
| `/infrastructure/endpoints/view` | ✅ Intentional |

> **Note.** `/infrastructure/endpoints/about` is the sidebar-surfaced
> concept entry; these spread from it via in-page links.

### `/infrastructure/network/*` cluster (2 pages) — network ops

| Page | Intentional? |
|---|---|
| `/infrastructure/network/ethernet` | ✅ Intentional |
| `/infrastructure/network/troubleshooting` | ✅ Intentional |

> **Note.** Sidebar surfaces `/infrastructure/network/{architecture, wifi}`;
> ethernet and troubleshooting are deeper.

### `/infrastructure/security/*` cluster (3 pages) — TLS ops

| Page | Intentional? |
|---|---|
| `/infrastructure/security/tls-setup` | ✅ Intentional — 11 in-links |
| `/infrastructure/security/certificate-management` | ✅ Intentional — linked from wifi |
| `/infrastructure/security/rotation` | ✅ Intentional |

### `/observability/events/{catalog, model}` and `/observability/monitoring/*` cluster (6 pages)

| Page | Intentional? |
|---|---|
| `/observability/events/catalog` | ✅ Intentional — linked from events/model |
| `/observability/events/model` | ✅ Intentional |
| `/observability/monitoring/battery` | ✅ Intentional — 3 in-links |
| `/observability/monitoring/connection-quality` | ✅ Intentional |
| `/observability/monitoring/device-health` | ✅ Intentional |
| `/observability/monitoring/fleet-dashboard` | ✅ Intentional |

> **Note.** Part 6 sidebar covers the event-family chapters; the
> catalog/model and monitoring how-tos extend from there.

### `/rfid/operating-mode/*` cluster (3 pages) — operating-mode how-tos

| Page | Intentional? |
|---|---|
| `/rfid/operating-mode/configure` | ✅ Intentional |
| `/rfid/operating-mode/post-filters-configure` | ✅ Intentional |
| `/rfid/operating-mode/trigger-composition` | ✅ Intentional |

> **Note.** The flattened sidebar exposes `/rfid/operating-mode-profiles`,
> `/rfid/start-stop-inventory`, `/rfid/post-filters` as concept pages;
> these deeper how-tos extend each.

### `/rfid/tag-data/*` cluster (4 pages) — tag-data deep dives

| Page | Intentional? |
|---|---|
| `/rfid/tag-data/architecture` | ✅ Intentional |
| `/rfid/tag-data/dual-channels` | ✅ Intentional |
| `/rfid/tag-data/interpret` | ✅ Intentional |
| `/rfid/tag-data/process` | ✅ Intentional |

> **Note.** Sidebar surfaces `/rfid/dataevt-schema`; these deeper pages
> spread from it.

## Truly accidental orphans — promoted to sidebar

These 4 pages have no incoming links and don't belong to a coherent
reachable cluster. They are promoted to the sidebar.

| Page | H1 | Best placement |
|---|---|---|
| `/foundations/documentation-guide` | "About the Structure of This Documentation" | Part 1 (Get oriented) — between `start` and `mqtt-primer`. This *is* the docs reading guide; a reader who can't find it can't find the docs. |
| `/foundations/v1-1-features` | "About IOTC V1.1 Features" | Part 8 (Diagnose and reference) — release notes belong with reference material |
| `/sdks/overview` | "SDKs & Language Tutorials" | Part 3 (Quick start) as a sibling of overview — code-sample alternatives to the mosquitto_pub/sub canonical quick-start |
| `/reference/api-overview` | "MQTT API Reference" | Part 8 (Diagnose and reference) — the canonical internal landing for the API reference (the navbar's "API Reference" goes to the *external* render; this internal page is the docs-side index) |

> The other 8 reachable-from-surfaced pages are kept as deep reference,
> consistent with the design philosophy. They are linked at the right
> moment in the canonical reading path; surfacing them would dilute the
> sidebar without adding discoverability.

## Re-audit cadence

Run `/tmp/check_reachability.py` whenever a page is added or moved. A
new doc that has no incoming links and doesn't belong to a cluster is
either (a) something to promote to the sidebar or (b) something to
cross-link from an existing surfaced page.
