---
id: libraries
title: Third-party MQTT client libraries
sidebar_label: Third-Party MQTT Client Libraries
description: "Recommended MQTT 3.1.1 client libraries for IOTC apps: paho-mqtt (Python), mqtt.js (Node), MQTTnet (C#), Eclipse Paho (Java/Android, iOS/Swift)."
---

> 📕 **REFERENCE** · Curated list of libraries tested with IOTC

| Language | Library | Min. version | IOTC compatibility note |
|---|---|---|---|
| Python | `paho-mqtt` | 1.6.1 | Fully supported |
| Node.js | `mqtt` (mqtt.js) | 5.0.0 | Fully supported |
| C# (.NET) | `MQTTnet` | 4.3.0 | Fully supported (.NET 6+) |
| Java | `org.eclipse.paho.client.mqttv3` | 1.2.5 | Fully supported |
| Go | `eclipse/paho.mqtt.golang` | 1.4.0 | Fully supported |
| C / C++ | `paho.mqtt.c` | 1.3.13 | Fully supported (embedded contexts) |
| Rust | `rumqttc` | 0.24 | Fully supported |
| Swift | `CocoaMQTT` | 2.1.0 | Fully supported (iOS host-side apps) |

**Notes:**

- Libraries supporting MQTT 3.1.1 are compatible. MQTT 5.0-only libraries can connect to the IOTC broker (which speaks both) but 5.0-specific features are not exposed by IOTC.
- For a richer comparison with per-library "choosing a library" guidance, see [Recommended MQTT client libraries](/sdks/libraries).

**Related:** 📕 [Recommended MQTT client libraries](/sdks/libraries) · 📗 [Quick Start tutorial](/quick-start/overview) · 📘 [About MQTT 3.1.1](/foundations/mqtt-primer)

---

## Closing. Phase 2 Status & Handoff to Phase 3

**Drafting complete.** This document carries first-draft prose for every page in IA v1.1:

| Part | Pages drafted |
|---|---:|
| Part I — Foundations | 15 |
| Part II — Getting Started | 14 |
| Part III — Infrastructure | 12 |
| Part IV — RFID Operations | 11 |
| Part V — Observability & Events | 11 |
| Part VI — Fleet Operations | 16 |
| Part VII — Reference & Troubleshooting | 20+ (incl. 28 endpoints, 6 events) |
| **Total** | **~99 page-level drafts** |

### Conformance assertions

For every page in this document:

- [x] Quadrant badge displayed and matches voice
- [x] Title follows Phase 1 outline title
- [x] Sections follow the Phase 1 outline section headers
- [x] Cross-references inline to complementary-quadrant pages
- [x] Forbidden content (per Phase 1) omitted or linked out
- [x] Diagrams referenced by ID for Info Designer hand-off

### Phase 3 handoff: per-section SME review queue

Per the org-structure brief's pipeline, the following SMEs receive these sections for technical-accuracy review:

| SME | Sections owned for accuracy review |
|---|---|
| MQTT SME | §2.x, §3.x, §6.1, §6.4, §7.1, §8.x, §10.1, §10.4, §11.1, §11.7, §13.4, §14.x, §15.x, §16.2 (MQTT-side fields), §16.6, §17.x, §18.2, §19.2 |
| RFID SME | §9.x, §10.1–10.5, §11.4, §11.5, §16.3, §16.4, §17.3 (RFID codes), §18.3, §18.4, §19.3, §20.4 |
| HW SME | §1.2, §2.5, §4.1, §4.3, §4.4, §6.1, §6.3, §12.2, §13.3, §18.5, §18.6, §20.5 |
| Sec SME | §3.5, §7.x, §15.5, §15.6 (TLS portion), §16.2 (cert endpoints), §17.x (cert codes), §18.2 (TLS) |
| Cloud SME | §13.1, §13.2, §13.4, §14.5–14.7, §15.1–15.6, §16.5, §17.4 (circuit breaker / fleet) |
| PM | §1.3, §1.4 (org), §14.5, §19.4, §19.5, §20.3 |
| Sup Liaison | §18.x (entire chapter), §19.x (entire chapter), §17.2 resolutions |

### Phase 3 inputs

Each SME receives:

1. This file (Phase 2 drafts)
2. The matching Phase 1 outline (`zebra-handheld-rfid-iotc-phase-1-outlines.md`)
3. The IA v1.1 (`zebra-handheld-rfid-iotc-information-architecture.md`) for quadrant discipline reference

### Phase 3 deliverable

Tracked changes confined to factual corrections (no rewrites for style). SME name attached to the technical-accuracy field in each page's front-matter. Returned to Editorial Core for Phase 4 (Editorial Review).

### Gate

Phase 4 begins on a page only when its SME(s) have signed off technical accuracy. The DRI tracks per-page SME signoff in the approval log inherited from Phase 1.

— *Editorial Core, May 2026*
