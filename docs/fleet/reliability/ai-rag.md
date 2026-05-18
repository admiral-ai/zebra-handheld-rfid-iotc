---
id: ai-rag
title: Built for AI agents to read
sidebar_label: Built for AI agents to read
---

> 📘 **EXPLANATION** · Audience: Architect, Documentation owner · Read time: ~5 min

Technical documentation in 2026 is consumed by humans and by AI agents: copilots, RAG systems, MCP-driven assistants. The IOTC documentation surface is designed to perform well for both.

### What makes IOTC documentation AI-friendly

| Property | What it does for retrieval |
|---|---|
| Schema-faithful reference cards (on the API Reference site) | One operation per page, atomic, with stable headings. High RAG retrieval precision. |
| Stable semantic headings such as `### Request payload`, `### Response payload`, and `### Error codes` | Agents identify content type from heading text. |
| Embedded YAML front-matter | Machine-consumable metadata: bounded context, operation tags, related operations. |
| Native MQTT examples as the canonical form | Agents that copy code snippets get code that runs. |
| One-to-one concept to API mapping | Agents traverse from "what is X" (concept) to "how do I call X" (reference) deterministically. |

### What downstream AI integrators should know

If you are building an agent that consumes IOTC documentation or IOTC events, three facts matter.

Schemas are discoverable. The `api-schema-reference/` corpus, comprising JSON Schema, OpenAPI, and per-tag descriptions, is the authoritative source. Pull from it directly. Do not scrape rendered pages.

Topic names are stable and human-readable. The pattern is `<tenantId>/<userPath>/<role>/<serial>`. RAG retrieval on event streams benefits from this structure, since a topic string carries discriminating tokens.

Schema errata are documented in band. Where the schema deviates from the runtime contract (for example, `mqttConnEVT.timestamp` is `HH:MM:SS` rather than ISO-8601, and native MQTT payloads are flattened rather than nested), the conceptual docs say so explicitly. Agents that read both the schema and the conceptual docs will not be misled.

### Patterns to avoid in agent consumption

Do not copy nested OpenAPI envelopes into MQTT publishes. The sled rejects them. See [The OpenAPI Illusion](/foundations/concepts/native-mqtt-vs-openapi).

Do not assume `mqttConnEVT.timestamp` parses as ISO-8601. It is time-only, in `HH:MM:SS` format. Special-case this one event.

Do not assume command responses pair automatically. Correlate by `requestId`.

Do not assume retained messages give history. The IOTC does not retain most events.

### Anticipated agent workloads

| Workload | Recommended retrieval pattern |
|---|---|
| "What does operation X do?" | Retrieve the API Reference page for X (atomic). |
| "How do I do Y in IOTC?" | Retrieve the concept chapter for Y plus the linked API Reference pages. |
| "My reader returned error code 11. What do I do?" | Retrieve the [Symptom Index](/reference/diagnose/symptom-index) entry, then the linked FM page, then the linked recovery playbook. |
| "Plan a firmware rollout across the fleet." | Retrieve [Fleet provisioning](/fleet/provisioning/models), [Updating firmware and rebooting](/infrastructure/management/system-operations), and [What happens when the network drops](/fleet/reliability/retention-retry). |

### Related

[What happens when the network drops](/fleet/reliability/retention-retry) · [How commands and responses flow](/foundations/architecture/communication-flow) · MQTT API Reference (see top nav).
