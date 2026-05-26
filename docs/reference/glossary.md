---
id: glossary
title: Glossary, limits, and cheat sheets
sidebar_label: Glossary, limits, and cheat sheets
---

> 📕 **REFERENCE** · **Audience:** All · **Use:** lookup while reading

The terminology, limits, and cheat sheets you'll want at your elbow while reading the rest of the documentation. **Authoritative when there's disagreement** — when an older corpus uses a term differently, this glossary wins.

### Glossary

| Term | Definition |
|---|---|
| **123RFID Desktop** | Windows 10/11 bootstrap tool. Used to first-light **Direct** sleds (Premium / Premium Plus / RFD90) over USB-C — sets region, Wi-Fi credentials, and MDM endpoint. Free download from `support.zebra.com`. Authoritative for region. |
| **123RFID Mobile** | Android 11+ bootstrap tool. Used to first-light **Bridged** sleds (RFD40 Standard) over Bluetooth (NFC tap, scan-and-pair, or manual MAC). Also bootstraps Direct sleds when no Windows laptop is available. Free download from Google Play. Authoritative for region. |
| **ADVANCED** | The operating-mode profile that unlocks manual `transmitPower`, `linkProfile`, `session`, `dynamicPower` via `advancedConfigurations`. |
| **`alert_short`** | Compact alert event with `id`, `priority`, `description`. MDM-facing. Broader `id` enum than `alerts`. |
| **`alerts`** | Verbose alert event with `alertDetails` block. Application-facing. **Five formal `id` enum values** (`BATTERY`, `FIRMWARE_UPDATE`, `NETWORK_EVENT`, `TEMPERATURE`, `POWER`); `GPI_EVENT` and `ANTENNA_EVENT` are described as trigger conditions but not in the published enum. **Four-value priority enum** (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`). |
| **Bridged** | Hardware tier whose sleds have no on-board Wi-Fi and reach the broker via a host device's Wi-Fi (RFD40 Standard). Two physical edges to the broker. Bootstrapped with 123RFID Mobile. The IoTC MQTT surface is identical to Direct after bootstrap. |
| **CTRL** | Endpoint type for RFID control commands ([`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode), [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation), [`set_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-post-filter)). |
| **`ctrlOprPayload`** | The named payload object inside [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation). Real canonical field name, not OpenAPI noise. |
| **DATA1 / DATA2** | Endpoint types for tag-data streams. Up to two concurrent data endpoints per reader. |
| **`dataEVT`** | The event a reader publishes for each (aggregated) tag read during inventory. |
| **`epConfig`** | The named payload object inside [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint). |
| **`epType`** | Endpoint role enum: MGMT, MGMT_EVT, CTRL, DATA1, DATA2, SOTI, MDM. |
| **`eventConfiguration`** | Either (a) the named payload of [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events), or (b) a sub-block within [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) controlling per-endpoint event flags. |
| **`FAST_READ`** | An operating-mode enum value listed in the schema but **not currently supported**. |
| **`heartbeatEVT`** | Periodic liveness event. Cadence and contents set by `eventConfiguration.heartbeatConfiguration`. Note the `eventName` in the payload is `"heartbeat"` (lowercase, no EVT suffix). |
| **IoTC** | IoT Connector. The in-firmware MQTT control and data plane on RFD40 / RFD90 sleds. |
| **MDM** | (1) An endpoint type; hybrid endpoint carrying MGMT + Control + Data on one topic family. Bootstrap default. (2) A class of platform — Mobile Device Management (SOTI Connect, 42Gears SureMDM) that uses the SOTI or MDM endpoint to manage fleets. |
| **MGMT / MGMT_EVT** | Endpoint types for management commands and management events respectively. |
| **Direct** | Hardware tier with native Wi-Fi 6 in firmware (RFD40 Premium, Premium Plus, RFD90). One physical edge to the broker. Bootstrapped with 123RFID Desktop (USB-C) or 123RFID Mobile (BT). |
| **`mqttConnEVT`** | Event published on CONNECTED/DISCONNECTED transitions. `timestamp` is `HH:MM:SS`, not ISO 8601. |
| **`stateOfHealth` (two enums)** | Battery health field uses two different enums by source: `get_status.batteryStatus.stateOfHealth` is `GOOD \| AVERAGE \| POOR`; `alerts.alertDetails.batteryAlert.stateOfHealth` and `heartbeatEVT.data.batteryAlert.stateOfHealth` are `LOW \| FULL \| CRITICAL \| HIGH \| CHARGING`. Don't conflate the two. |
| **`operatingMode`** | The named payload object inside [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode). Note: wraps an inner `operatingModes` (plural), the only command with this double nesting. |
| **`postFilterPayload`** | The named payload object inside [`set_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-post-filter). |
| **Pre-filter (`select`)** | Air-protocol filter applied via Gen2 SELECT before singulation. Configured inside `set_operating_mode.operatingModes.select`. Up to 32 entries. |
| **Post-filter** | Reader-side filter applied after singulation, before the event is published. Configured via [`set_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-post-filter) per data endpoint. |
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
| `publishTopics[]` per endpoint | 3 | [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) error code 25 |
| `subscribeTopics[]` per endpoint | 1 | [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) error code 26 |
| Pre-filter (`select`) entries | 32 | [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) error code 24 |
| `tagPattern` length | ≤ 64 hex characters | [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) error code 28 |
| Retention buffer size | 150,000 tag events | Canonical baseline (firmware-version dependent) |
| Retention flush rate | 500 TPS | Canonical baseline |
| `password` length (access ops) | Exactly 8 hex chars | EPC Gen2 spec |
| Heartbeat interval (default) | 60 seconds | Device default; configurable via [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) |
| Saved Wi-Fi profiles per device | 10 | [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) error code 19 (`IOT_ERROR_SSID_LIMIT_OVERFLOW`) |
| SSID length | ≤ 32 characters | IEEE 802.11 standard |
| Certificate file size | ≤ 4 KB (per cert component) | Device storage limit; applies to MQTT, Wi-Fi, and filestore certs |
| Certificate format | PEM only, RSA keys in PKCS#1 encoding | Device parser requirement |
| Device-side real-time clock | No on-device RTC backup battery | Time resets to default on factory reset; synced via SNTP when on a reachable network |

### Error-code quick reference

Each command has its own subset; codes are **not global**. Common ones across multiple commands:

| Code | Meaning | Commands |
|---|---|---|
| `0` | Success | All |
| `1` | Command payload accepted (async ack) | [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os), [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) (example only) |
| `3` | Not able to retrieve information | [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status), [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config), [`get_current_region`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-current-region), [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode) |
| `4` | Firmware update in progress | [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) |
| `5` | Can't reboot; inventory in progress | [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) |
| `8` | Insufficient flash | [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) |
| `9` | File not found | [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) |
| `10` | Configuration already exists | `config_endpoint add` |
| `11` | Inventory in progress | `control_operation START`, [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) |
| `12` | No radio operation in progress | `control_operation STOP` (idempotent) |
| `13` | Firmware update failed | [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) |
| `14` | Battery low | [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) |
| `15` | SSID not found | `set_wifi MODIFY` |
| `18` | ESSID already exists | `set_wifi CREATE` |
| `22` | Advanced configuration not set | `set_operating_mode ADVANCED` |
| `23` | Invalid enum value | Many |
| `24` | Max 32 prefilters exceeded | [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) |
| `25` | Max 3 publish topics exceeded | [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) |
| `26` | Max 1 subscribe topic exceeded | [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) |
| `27` | Invalid tenant ID length | [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) |
| `28` | Tag match pattern length exceeded | [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) |

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
| [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) | `ctrlOprPayload` |
| [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) | `epConfig` |
| [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) | `operatingMode` (wraps inner `operatingModes`) |
| [`set_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-post-filter) | `postFilterPayload` |
| [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) | `eventConfiguration` |
| [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) | `certDetails` |
| [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) | `OSUpdateDetails` |
| [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) | `wifiConfig` |
| [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) | `config` |
| [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) | *(optional)* `endpointDetails` |

Read-only commands (`get_*`, [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot)) take only `{command, requestId}`.

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

**Related:** 📘 [Things people get wrong about IOTC](/diagnose/misconceptions) · 📘 [Pairing the docs with the API Reference](/foundations/docs-and-api-reference) · 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📕 MQTT API Reference (top nav)
