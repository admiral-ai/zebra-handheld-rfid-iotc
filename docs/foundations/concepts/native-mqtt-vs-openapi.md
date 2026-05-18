---
id: native-mqtt-vs-openapi
title: Native MQTT payloads vs OpenAPI schema renderings
sidebar_label: Native MQTT vs OpenAPI schema
---

> 📘 **EXPLANATION** · Audience: API consumer, Solution builder · Read time: ~5 min

The most damaging mismatch in IOTC integration is between the OpenAPI-rendered schema and the native MQTT payload contract. Both exist. Only one is what the sled actually accepts.

### The mismatch in one paragraph

The `api-schema-reference/` corpus contains JSON Schema and OpenAPI specifications generated for the IOTC. The OpenAPI rendering shows commands with nested REST-style envelopes — `ctrlOprPayload`, `params`, deeply-nested objects. These are correct for the REST surface on **fixed readers** (FX7500, FX9600, ATR7000). Handheld readers do not have a REST surface. They have an **MQTT surface**, and the MQTT surface accepts a **flattened** payload.

### Two side-by-side examples

**Schema-rendered** (OpenAPI / REST-style; not what the sled accepts over MQTT):

```json
{
  "ctrlOprPayload": {
    "params": { "operation": "start" }
  }
}
```

**Native MQTT** (what the sled actually accepts):

```json
{
  "command": "start",
  "requestId": "start_inventory_001"
}
```

### The rule

When the OpenAPI rendering and a field-validated MQTT example disagree, **trust the field-validated example**. The MQTT API Reference site renders the native MQTT payload as its primary example for every operation.

### Why both exist

The schema layer originated with REST-on-fixed in mind and was adapted to MQTT-on-handheld without flattening. The flattened MQTT contract is the validated runtime behavior. A future schema revision is expected to render flattened payloads natively; until then, the field-validated examples are canonical.

### What this means for you

- Read schemas to understand *fields and types*.
- Copy validated examples to assemble *payloads*.
- Never paste an OpenAPI rendering directly into an MQTT publish.
- When in doubt, consult the corresponding MQTT API Reference page — it shows the native flattened form.

**Related:** [The message lifecycle](/foundations/architecture/communication-flow) · [MQTT endpoint architecture](/infrastructure/endpoints/about) · MQTT API Reference (see top nav).
