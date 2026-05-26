---
id: format
title: Error Response Format
sidebar_label: Error Response Format
---

> 📕 **REFERENCE** · Audience: API Consumer · Use: parse error responses

Every IOTC command response carries a standard envelope. Errors are reported in the `response` object, never via MQTT-level mechanisms such as Last Will. The envelope is identical across all 22 commands.

## Response envelope

```json
{
  "command": "<command_name>",
  "requestId": "<echo of the request id>",
  "apiVersion": "V1.1",
  "<responsePayloadKey>": { /* result, when the command returns data */ },
  "response": {
    "code": <integer 0..28>,
    "description": "<human-readable description>"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `command` | string | The command being responded to. Matches the request's `command`. |
| `requestId` | string | Echoes the client-supplied `requestId` from the request. Use this to correlate. |
| `apiVersion` | enum | `V1.0` or `V1.1`. |
| `response.code` | integer (0–28) | Status code. `0` is success; other values indicate specific conditions. |
| `response.description` | string | Verbatim from `error_codes.json` on the device. |
| `<responsePayloadKey>` | object | Operation-specific result block. Present only on success and only for commands that return data. |

## What the envelope looks like in success vs failure

**Success.** `response.code` is `0`. The operation-specific payload (e.g., `readerVersion`, `deviceStatus`, `endpointResponse`) is present and populated.

```json
{
  "command": "get_version",
  "requestId": "abc123",
  "apiVersion": "V1.1",
  "readerVersion": {
    "model": "RFD40",
    "serialNumber": "23053520102096",
    "firmwareVersion": "SAAFKS00-006-R02",
    "detailedVersions": { "iotcVersion": "V1.1" }
  },
  "response": { "code": 0, "description": "Success" }
}
```

**Failure.** `response.code` is non-zero. The operation-specific payload is typically absent or empty; trust `response.description` and the [code table](/reference/errors/codes) instead.

```json
{
  "command": "set_operating_mode",
  "requestId": "set-mode-001",
  "apiVersion": "V1.1",
  "response": { "code": 11, "description": "Inventory in progress" }
}
```

## Asynchronous acceptance — code 1

Two commands — [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) and [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) — are asynchronous. They acknowledge the request immediately with `response.code: 1` ("Command payload is accepted") and continue processing in the background. The terminal outcome arrives later as an event:

| Command | Acknowledgement | Terminal outcome |
|---|---|---|
| [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) | `code: 1` | `alert_short` with id `FIRMWARE_UPDATE_SUCCESS` / `FIRMWARE_UPDATE_FAIL`, plus optional `alerts` events with id `FIRMWARE_UPDATE` showing progress |
| [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) | `code: 1` | `alert_short` with `<TYPE>_CERT_INSTALL_SUCCESS` / `<TYPE>_CERT_INSTALL_FAIL` |

Treat `code: 1` as a successful submission, not as a final result. Your application should subscribe to `alert_short` (and `alerts`, if you want progress detail) before sending either command.

## A documented schema discrepancy

The [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) API reference example shows a response with `code: 1` and the description `Command payload is accepted`. The canonical schema and error table define only `code: 0` (Success) and `code: 5` (Inventory in progress) for [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot). **Trust the schema.** Your client should accept `0` and `1` as success-equivalents for [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) (defensive coding) and treat `5` as the only documented failure.

## Correlating responses

`requestId` is the only correlation mechanism. MQTT itself does not pair requests with responses at the protocol layer; IOTC implements correlation in the JSON payload. Choose `requestId` values that are:

- **Unique within your application's session** to avoid collisions during concurrent requests.
- **Stable across retries** — reuse the same `requestId` if you retry a command. The reader treats this idempotently.
- **Readable in logs** — prefixed counters (`set-mode-001`, `cfg-042`) are easier to trace than UUIDs.

## Where to look up a code

Every non-zero `response.code` is documented in [Command Response Error Codes](/reference/errors/codes), with cause, recommended action, and the list of commands that can return it. The table is generated from `error_codes.json` in the canonical API schema reference.

For per-command error details, including the subset of codes a specific command can return, see the operation's page on the [MQTT API Reference](/reference/api-overview).

## Events do not use this envelope

`heartbeatEVT`, `alerts`, `alert_short`, `mqttConnEVT`, and `dataEVT` are reader-initiated events and do **not** use the command-response envelope. They have their own root shapes. See the per-event chapters in Part 6 and the [MQTT API Reference](/reference/api-overview).

## Related

- [Command Response Error Codes](/reference/errors/codes) — the full 0–28 table.
- [MQTT API Reference](/reference/api-overview) — directory of all 27 operations and events.
- [How commands and responses flow](/foundations/communication-flow) — the three flow types.
- [Things people get wrong about IOTC](/diagnose/misconceptions) — payload-shape gotchas, including the [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) code discrepancy.
