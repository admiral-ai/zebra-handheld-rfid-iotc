---
id: native-mqtt-vs-openapi
title: The OpenAPI Illusion
sidebar_label: The OpenAPI Illusion
---

> 📘 **EXPLANATION** · **Audience:** API Consumer, Solution Builder · **Read time:** ~5 min

A common mismatch in IOTC integration is between the **OpenAPI-rendered schema** and the **native MQTT payload contract**. Both exist. They look similar. **Only the native shape is what the sled accepts.** This chapter exists because every team that integrates IOTC by copying from the schema first, or by generating a client SDK without overriding the request body — produces payloads the sled rejects, then spends days searching for a bug that isn't there.

### The shape every IOTC command takes

Every native MQTT command on RFD40 / RFD90 has the same skeleton:

```json
{
  "command": "<operation_name>",
  "requestId": "<your-correlator>",
  "<namedPayload>": { /* parameters */ }
}
```

The `<namedPayload>` is operation-specific, and it is a **real, canonical field name** in the contract, not a documentation envelope:

| Command | Named payload object |
|---|---|
| [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) | `ctrlOprPayload` |
| [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) | `epConfig` |
| [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) | `operatingMode` *(wraps an inner `operatingModes`, the only command with this double nesting)* |
| [`set_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-post-filter) | `postFilterPayload` |
| [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) | `eventConfiguration` |
| [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) | `certificate` |
| [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) | `osPayload` |
| [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) | `wifi` |
| [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) | *(optional)* `endpointDetails` |

Simple read-only commands take **only** `{command, requestId}` — [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status), [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version), [`get_current_region`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-current-region), [`get_eth`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-eth), [`get_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-wifi), [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode), [`get_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-post-filter), [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) (without filter), [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot).

This is the **native MQTT shape**. The API Reference site (`mqtt-api-reference/`) renders every command in this shape as its primary example.

### Where the OpenAPI illusion lives

The OpenAPI rendering — produced by `docusaurus-plugin-openapi-docs` from the schema corpus in `api-schema-reference/` — can introduce **two kinds of drift** from the native form:

#### Drift A. Extra generic wrappers

Some renderings wrap the native named payload in additional generic envelopes — `params`, `payload`, `requestBody`. For example, a rendering might show [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) as:

```json
{
  "ctrlOprPayload": {
    "params": {
      "controlType": "RFID",
      "operation": "START"
    }
  }
}
```

The `params` envelope **does not exist in the native payload**. The native form is:

```json
{
  "command": "control_operation",
  "requestId": "start-001",
  "ctrlOprPayload": {
    "controlType": "RFID",
    "operation": "START"
  }
}
```

If you see `params`, strip it.

#### Drift B: REST-style framing on a non-REST surface

Earlier IOTC products (FX9600, FX7500, ATR7000 fixed readers) have a REST surface in addition to MQTT. The schema corpus was originally authored for both. The OpenAPI rendering inherits REST request-body conventions: nested `requestBody`, separate `operationId`, paths like `/api/v1/control` rather than topic-based addressing. **The handheld product has no REST surface.** The MQTT contract is flat command-name + requestId + named payload.

### Side-by-side comparisons

[`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) — OpenAPI-style rendering you might see:

```json
{
  "operatingModePayload": {
    "params": {
      "profile": "BALANCED_PERFORMANCE",
      "antennaConfiguration": [{ "antenna": 1, "transmitPower": 27 }]
    }
  }
}
```

The native MQTT payload:

```json
{
  "command": "set_operating_mode",
  "requestId": "set-mode-001",
  "operatingMode": {
    "operatingModes": {
      "profiles": "BALANCED_PERFORMANCE"
    }
  }
}
```

Three things changed: the wrapper is `operatingMode` (not `operatingModePayload`), there is no `params` envelope, and the inner field is `operatingModes.profiles` (the double nesting is unique to this command and the field name is plural).

### The rule

> **When the OpenAPI rendering and a field-validated MQTT example disagree, trust the field-validated example.** The MQTT API Reference site renders the native flat shape as its primary example for every operation. The schemas describe field names and types correctly; the schema-to-OpenAPI rendering is what drifts.

### In practice

- **Read the schemas to understand field names and types.** They are correct about which fields exist and what they mean.
- **Copy validated examples** from `mqtt-api-reference/<command>.md` to assemble payloads. Never hand-derive a payload from `oneOf` or nested `$ref` schemas.
- **Never paste an OpenAPI rendering directly into an MQTT publish.** If the example you copied contains a top-level field named `params`, `payload`, `requestBody`, or anything outside the per-command schema, strip it. The reader returns an unknown-field error otherwise.
- **Flatten generic wrappers; preserve named payloads.** `ctrlOprPayload`, `epConfig`, `operatingMode`, `postFilterPayload`, `eventConfiguration` stay. `params`, `payload`, `requestBody` go.

### When the gap matters most

- **First integration.** Schema-first developers hit this on day one. Tell them about this chapter before they start.
- **SDK generation.** If you generate a client SDK from the OpenAPI spec without overriding the request shape, every command will fail. Override the request body to the flat native form.
- **Code reviews.** If a code review shows a payload with `params`, `requestBody`, or `payload` at the top level (outside the named payload object), that code does not work. Reject it.

### A diagnostic snippet

If you suspect this is what's happening, log the exact JSON your client publishes. The reader's error response will name the offending field. Compare against the canonical example in `mqtt-api-reference/<command>.md`, the difference is the bug.

**Related:** 📘 [How commands and responses flow](/foundations/architecture/communication-flow) · 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📕 [Things people get wrong about IOTC](/reference/diagnose/misconceptions) — entry **MM-01** · MQTT API Reference (top nav)
