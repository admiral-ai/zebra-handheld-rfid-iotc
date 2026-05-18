---
id: ai-rag
title: Built for AI agents to read
sidebar_label: Built for AI agents to read
---

> 📘 **EXPLANATION** · Audience: Architect, Documentation owner · Read time: ~5 min

In 2026, technical documentation is consumed by humans **and** by AI agents — copilots, RAG systems, MCP-driven assistants. The IOTC's documentation surface is designed to perform well for both.

### What makes IOTC documentation AI-friendly

| Property | What it does for retrieval |
|---|---|
| **Schema-faithful reference cards** (API Reference site) | One operation per page, atomic, stable headings → high RAG retrieval precision |
| **Stable semantic headings** (`### Request payload`, `### Response payload`, `### Error codes`) | Agents can identify content type from heading text |
| **Embedded YAML front-matter** | Machine-consumable metadata: bounded context, operation tags, related operations |
| **Native MQTT examples** as the canonical form | Agents that copy code snippets get code that actually runs |
| **One-to-one concept ↔ API mapping** | Agents can traverse from "what is X" (concept) to "how do I call X" (reference) deterministically |

### What downstream AI integrators should know

If you are building an agent that consumes IOTC documentation or IOTC events, three facts matter.

- **Schemas are discoverable.** The `api-schema-reference/` corpus (JSON Schema + OpenAPI + per-tag descriptions) is the authoritative source. Pull from it directly; do not scrape rendered pages.
- **Topic names are stable and human-readable.** Pattern: `<tenantId>/<userPath>/<role>/<serial>`. RAG retrieval on event streams benefits from this structure (a topic string carries discriminating tokens).
- **Schema errata are documented in band.** Where the schema deviates from the runtime contract (e.g., `mqttConnEVT.timestamp` is `HH:MM:SS` not ISO-8601; native MQTT payloads are flattened, not nested), the conceptual docs say so explicitly. Agents that read both the schema and the conceptual docs will not be misled.

### Patterns to avoid in agent consumption

- **Do not copy nested OpenAPI envelopes into MQTT publishes.** The sled rejects them. See [Native MQTT vs OpenAPI](/foundations/concepts/native-mqtt-vs-openapi).
- **Do not assume `mqttConnEVT.timestamp` parses as ISO-8601.** It is time-only (`HH:MM:SS`). Special-case this one event.
- **Do not assume command responses pair automatically.** Correlate by `requestId`.
- **Do not assume retained messages give history.** The IOTC does not retain most events.

### Anticipated agent workloads

| Workload | Recommended retrieval pattern |
|---|---|
| "What does operation X do?" | Retrieve the API Reference page for X (atomic) |
| "How do I do Y in IOTC?" | Retrieve the concept chapter for Y + linked API Reference page(s) |
| "My reader returned error code 11. What do I do?" | Retrieve [Symptom Index](/reference/diagnose/symptom-index) entry → linked FM page → linked recovery playbook |
| "Plan a firmware rollout across the fleet." | Retrieve [Fleet provisioning](/fleet/provisioning/models) + [System operations](/infrastructure/management/system-operations) + [Reliability and retry](/fleet/reliability/retention-retry) |

**Related:** [Reliability, retention, and retry](/fleet/reliability/retention-retry) · [The message lifecycle](/foundations/architecture/communication-flow) · MQTT API Reference (see top nav).
