---
id: glossary
title: Glossary, limits, and cheat sheets
sidebar_label: Glossary, limits, and cheat sheets
---

> 📕 **REFERENCE** · Audience: All · Use: lookup while reading

The terminology, limits, and cheat sheets you'll want at your elbow while reading the rest of the documentation. **Authoritative when there's disagreement** — when an older corpus uses a term differently, this glossary wins.

### Glossary

| Term | Definition |
|---|---|
| **ADVANCED** | The operating-mode profile that unlocks manual `transmitPower`, `linkProfile`, `session`, `dynamicPower` via `advancedConfigurations`. |
| **`alert_short`** | Compact alert event with `id`, `priority`, `description`. MDM-facing. Broader `id` enum than `alerts`. |
| **`alerts`** | Verbose alert event with `alertDetails` block. Application-facing. Seven `id` values. |
| **Bridged** | Hardware tier with Bluetooth bridge to a host device — RFD40 Standard. Two physical edges to the broker. |
| **CTRL** | Endpoint type for RFID control commands (`set_operating_mode`, `control_operation`, `set_post_filter`). |
| **`ctrlOprPayload`** | The named payload object inside `control_operation`. Real canonical field name, not OpenAPI noise. |
| **DATA1 / DATA2** | Endpoint types for tag-data streams. Up to two concurrent data endpoints per reader. |
| **`dataEVT`** | The event a reader publishes for each (aggregated) tag read during inventory. |
| **`epConfig`** | The named payload object inside `config_endpoint`. |
| **`epType`** | Endpoint role enum: MGMT, MGMT_EVT, CTRL, DATA1, DATA2, SOTI, MDM. |
| **`eventConfiguration`** | Either (a) the named payload of `config_events`, or (b) a sub-block within `config_endpoint` controlling per-endpoint event flags. |
| **`FAST_READ`** | An operating-mode enum value listed in the schema but **not currently supported**. |
| **`heartbeatEVT`** | Periodic liveness event. Cadence and contents set by `eventConfiguration.heartbeatConfiguration`. Note the `eventName` in the payload is `"heartbeat"` (lowercase, no EVT suffix). |
| **IoTC** | IoT Connector. The in-firmware MQTT control and data plane on RFD40 / RFD90 sleds. |
| **MDM** | (1) An endpoint type; hybrid endpoint carrying MGMT + Control + Data on one topic family. Bootstrap default. (2) A class of platform — Mobile Device Management (SOTI Connect, 42Gears SureMDM) that uses the SOTI or MDM endpoint to manage fleets. |
| **MGMT / MGMT_EVT** | Endpoint types for management commands and management events respectively. |
| **Direct** | Hardware tier with native Wi-Fi in firmware — RFD40 Premium, Premium Plus, RFD90. One physical edge to the broker. |
| **`mqttConnEVT`** | Event published on CONNECTED/DISCONNECTED transitions. `timestamp` is `HH:MM:SS`, not ISO 8601. |
| **`operatingMode`** | The named payload object inside `set_operating_mode`. Note: wraps an inner `operatingModes` (plural), the only command with this double nesting. |
| **`postFilterPayload`** | The named payload object inside `set_post_filter`. |
| **Pre-filter (`select`)** | Air-protocol filter applied via Gen2 SELECT before singulation. Configured inside `set_operating_mode.operatingModes.select`. Up to 32 entries. |
| **Post-filter** | Reader-side filter applied after singulation, before the event is published. Configured via `set_post_filter` per data endpoint. |
| **`reportFilter duration`** | Operating-mode parameter that determines whether each tag read is reported separately (when 0) or aggregated (when > 0). Affects `channel`, `phase`, `seenCount` fields in `dataEVT`. |
| **`requestId`** | Client-chosen correlator echoed by the reader in the response. The only command-response correlation tool. |
| **Retention buffer** | Reader-side flash buffer for `dataEVT` events when broker is unreachable. Canonical baseline 150,000 events at 500 TPS flush rate. |
| **Session (Gen2)** | `SESSION_0`, `SESSION_1`, `SESSION_2`, `SESSION_3`. EPC Gen2 protocol session for tag flag persistence. |
| **SOTI** | Endpoint type for SOTI MobiControl integration. Also a platform — SOTI Connect; that uses this endpoint. |
| **`tenantId`** | The first segment of every IOTC topic. Canonical default `zebra` (lowercase). Bounded length. |
| **Verification type** | TLS verification mode: NONE, VERIFY_PEER, VERIFY_HOST, VERIFY_HOST_PEER. Required even for plain MQTT. |

### Capacity and limits

| Limit | Value | Source |
|---|---|---|
| Endpoints per reader | 10 | Canonical IOTC limits |
| Active DATA pipes | 2 (DATA1 + DATA2) | Canonical IOTC limits |
| `publishTopics[]` per endpoint | 3 | `config_endpoint` error code 25 |
| `subscribeTopics[]` per endpoint | 1 | `config_endpoint` error code 26 |
| Pre-filter (`select`) entries | 32 | `set_operating_mode` error code 24 |
| `tagPattern` length | ≤ 64 hex characters | `set_operating_mode` error code 28 |
| Retention buffer size | 150,000 tag events | Canonical baseline (firmware-version dependent) |
| Retention flush rate | 500 TPS | Canonical baseline |
| `password` length (access ops) | Exactly 8 hex chars | EPC Gen2 spec |
| Heartbeat interval (default) | 60 seconds | Device default; configurable via `config_events` |
| Saved Wi-Fi profiles per device | 10 | `set_wifi` error code 19 (`IOT_ERROR_SSID_LIMIT_OVERFLOW`) |
| SSID length | ≤ 32 characters | IEEE 802.11 standard |
| Certificate file size | ≤ 4 KB (per cert component) | Device storage limit; applies to MQTT, Wi-Fi, and filestore certs |
| Certificate format | PEM only, RSA keys in PKCS#1 encoding | Device parser requirement |
| Device-side real-time clock | No on-device RTC backup battery | Time resets to default on factory reset; synced via SNTP when on a reachable network |

### Error-code quick reference

Each command has its own subset; codes are **not global**. Common ones across multiple commands:

| Code | Meaning | Commands |
|---|---|---|
| `0` | Success | All |
| `1` | Command payload accepted (async ack) | `set_os`, `reboot` (example only) |
| `3` | Not able to retrieve information | `get_status`, `get_endpoint_config`, `get_current_region`, `get_operating_mode` |
| `4` | Firmware update in progress | `set_os` |
| `5` | Can't reboot; inventory in progress | `reboot` |
| `8` | Insufficient flash | `set_os` |
| `9` | File not found | `set_os` |
| `10` | Configuration already exists | `config_endpoint add` |
| `11` | Inventory in progress | `control_operation START`, `set_operating_mode` |
| `12` | No radio operation in progress | `control_operation STOP` (idempotent) |
| `13` | Firmware update failed | `set_os` |
| `14` | Battery low | `set_os` |
| `15` | SSID not found | `set_wifi MODIFY` |
| `18` | ESSID already exists | `set_wifi CREATE` |
| `22` | Advanced configuration not set | `set_operating_mode ADVANCED` |
| `23` | Invalid enum value | Many |
| `24` | Max 32 prefilters exceeded | `set_operating_mode` |
| `25` | Max 3 publish topics exceeded | `config_endpoint` |
| `26` | Max 1 subscribe topic exceeded | `config_endpoint` |
| `27` | Invalid tenant ID length | `config_endpoint` |
| `28` | Tag match pattern length exceeded | `set_operating_mode` |

For the full per-command list, see `mqtt-api-reference/<command>.md`.

### Topic format cheat sheet

```
<tenantId>  /  <topic>  /  <deviceSerialNumber>
```

- **You configure** the middle segment in `publishTopics[].topic` and `subscribeTopics[].topic`.
- **The reader prepends** the tenant ID (e.g., `zebra`) at runtime.
- **The reader appends** its serial number (e.g., `RFD40-24190525100255`) at runtime.

Example wire topic: `zebra/CTRL/clients/cmnd/RFD40-24190525100255`

### Payload shape cheat sheet

```
{
  "command": "<operation_name>",
  "requestId": "<your-correlator>",
  "<namedPayload>": { /* parameters specific to this operation */ }
}
```

Named-payload map (memorise these):

| Command | Named payload |
|---|---|
| `control_operation` | `ctrlOprPayload` |
| `config_endpoint` | `epConfig` |
| `set_operating_mode` | `operatingMode` (wraps inner `operatingModes`) |
| `set_post_filter` | `postFilterPayload` |
| `config_events` | `eventConfiguration` |
| `install_certificate` | `certDetails` |
| `set_os` | `OSUpdateDetails` |
| `set_wifi` | `wifiConfig` |
| `set_config` | `config` |
| `get_endpoint_config` | *(optional)* `endpointDetails` |

Read-only commands (`get_*`, `reboot`) take only `{command, requestId}`.

### Response shape cheat sheet

```
{
  "command": "<operation_name>",
  "requestId": "<your-correlator>",
  "apiVersion": "V1.1",
  "<namedResponseObject>": { /* if the command returns data */ },
  "response": {
    "code": <integer>,
    "description": "<string>"
  }
}
```

Events do **not** use this shape, they have their own root structures. See per-event chapters and `mqtt-api-reference/<event>.md`.

### Where this glossary disagrees with older corpora

Treat this file as the **single internal source of truth** for terminology when the documentation set itself is referenced. Where the user's `zebra-handheld-rfid-iotc-content.md` working draft or older Zebra documentation disagrees, this glossary holds. For the field-level API contract, the `mqtt-api-reference/` corpus wins over everything.

**Related:** 📘 [Things people get wrong about IOTC](/reference/diagnose/misconceptions) · 📘 [Pairing the docs with the API Reference](/foundations/orient/docs-and-api-ref) · 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📕 MQTT API Reference (top nav)
