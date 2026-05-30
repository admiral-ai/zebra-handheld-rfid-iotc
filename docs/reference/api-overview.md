---
id: api-overview
title: MQTT API Reference
sidebar_label: MQTT API Reference
description: "Index of the IOTC MQTT API surface: 22 commands and 5 events across MGMT, CTRL, EVT, DATA, MDM. Each operation links to the external API Reference site."
---

> 📕 **REFERENCE** · **Audience:** API Consumer · **Use:** directory of all 27 commands and events

The IOTC MQTT API surface is **22 commands and 5 events**, organised into 4 top-level tag groups and 14 sub-tags. Every operation listed here is fully documented — payload schema, response schema, field-by-field descriptions, error codes, and worked examples — on the canonical **[MQTT API Reference site](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)**. Click any operation in the tables below to jump straight to its section there.

## How every command works

Every command request uses the same envelope:

```json
{
  "command": "<command_name>",
  "requestId": "<client-supplied id>",
  "<commandPayloadKey>": { /* command-specific payload, if any */ }
}
```

Read-only commands (`get_*`, [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot)) take only `command` and `requestId`. Commands with parameters add a single named payload object whose key is operation-specific (`ctrlOprPayload`, `epConfig`, `operatingMode`, etc.). See [The OpenAPI Illusion](/foundations/native-mqtt-vs-openapi) for the canonical shape, and [How commands and responses flow](/foundations/communication-flow) for the request/response and event flows.

Responses echo `command` and `requestId` and add `apiVersion` and a `response` object:

```json
{
  "command": "<command_name>",
  "requestId": "<echo>",
  "apiVersion": "V1.1",
  "<responsePayloadKey>": { /* result, when the command returns data */ },
  "response": { "code": 0, "description": "Success" }
}
```

Error codes appear in `response.code`; see [Error Response Format](/reference/errors/format) and [Command Response Error Codes](/reference/errors/codes).

## Command payload keys

| Command | Required payload key |
|---|---|
| All `get_*` commands · [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) | (none beyond `command` and `requestId`) |
| [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) · [`delete_wifi_profile`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-wifi-profile) | `wifiConfig` |
| [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) | `epConfig` |
| [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) · [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate) | `certDetails` |
| [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) | `OSUpdateDetails` |
| [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) | `operatingMode` (wraps an inner `operatingModes`) |
| [`set_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-post-filter) | `postFilterPayload` |
| [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) | `ctrlOprPayload` |
| [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) | `eventConfiguration` |

## Topic format

Every IOTC topic is constructed at runtime as three segments:

```
<tenantId> / <topic> / <deviceSerialNumber>
```

You configure only the **middle segment** in `publishTopics[].topic` and `subscribeTopics[].topic`. The reader prepends `tenantId` and appends `deviceSerialNumber` automatically. See [How the MQTT plumbing fits together](/infrastructure/endpoints/about).

---

## Management

The **Management** tag group covers device identity, network setup, MQTT endpoints, certificates, configuration, and system operations. Sixteen operations across six sub-tags.

### Device Status

Live identity, runtime health, and regulatory region. See [What your reader knows about itself](/infrastructure/device-state).

| API | Type | Description |
|---|---|---|
| [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status) | Command | Live health snapshot: power source, radio activity, battery, NTP, temperature. |
| [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) | Command | Identity and software versions: model, serial number, SKU, firmware, IoTC version. |
| [`get_current_region`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-current-region) | Command | Active regulatory region, channel set, power limits, LBT, frequency hopping. |

### Network Configuration

Ethernet status and Wi-Fi profile management. See [Getting on the network (Wi-Fi & Ethernet)](/infrastructure/network/architecture).

| API | Type | Description |
|---|---|---|
| [`get_eth`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-eth) | Command | Ethernet interface state, link, and IP address. |
| [`get_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-wifi) | Command | List configured Wi-Fi profiles and connection status. |
| [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) | Command | Create or modify a Wi-Fi profile. Personal (WPA2/WPA3) and Enterprise (EAP-TLS/TTLS/PEAP). |
| [`delete_wifi_profile`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-wifi-profile) | Command | Remove a saved Wi-Fi profile by SSID. |

### MQTT Endpoint Configuration

Add, update, delete, and inspect MQTT broker endpoints. See [How the MQTT plumbing fits together](/infrastructure/endpoints/about).

| API | Type | Description |
|---|---|---|
| [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) | Command | Retrieve active endpoint configurations and the list of saved endpoint names. |
| [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) | Command | Add, update, or delete an endpoint. Supports MGMT, MGMT_EVT, CTRL, DATA1, DATA2, SOTI, MDM. |

### Certificate Management

Install, inspect, and remove TLS certificates for MQTT, Wi-Fi, and the file store. See [Securing the connection (TLS & certificates)](/infrastructure/security/model).

| API | Type | Description |
|---|---|---|
| [`get_installed_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-installed-certificate) | Command | List installed certificates by logical name and type. |
| [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) | Command | Install a CA, client cert, or client key. Sources: `HTTP` (download) or `DIRECT` (inline). |
| [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate) | Command | Remove an installed certificate by logical name. |

### System Operations

Firmware update and warm reset. See [Updating firmware and rebooting](/infrastructure/system-operations).

| API | Type | Description |
|---|---|---|
| [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) | Command | Start a firmware update from a URL. Asynchronous; watch `alerts` for outcome. |
| [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) | Command | Warm reset. Rejected with code 5 if an inventory is active. |

---

## Control

The **Control** tag group covers the RFID radio: operating mode, tag filtering, and inventory start/stop. Five operations across three sub-tags.

### Operating Mode

Profile selection, query parameters, access operations, and metadata enablement. See [Choose how the reader reads tags](/rfid/operating-mode-profiles).

| API | Type | Description |
|---|---|---|
| [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode) | Command | Retrieve the active profile and all operating-mode parameters. |
| [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) | Command | Set profile, sessions, triggers, query, select prefilters, access operations, and tag metadata. |

### Tag Filtering

Post-read report filters scoped to a data endpoint. See [Filter tags before vs after the read](/rfid/post-filters).

| API | Type | Description |
|---|---|---|
| [`get_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-post-filter) | Command | Retrieve post-filter rules for each data endpoint. |
| [`set_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-post-filter) | Command | Add, modify, or delete a post-filter (PREFIX / SUFFIX / REGEX match, INCLUDE / EXCLUDE). |

### Inventory Control

Start and stop RFID inventory (or scanner) operations. See [Start, stop, and the trigger button](/rfid/start-stop-inventory).

| API | Type | Description |
|---|---|---|
| [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) | Command | START or STOP an `RFID` or `SCANNER` subsystem. |

---

## Events

The **Events** tag group covers the reader's asynchronous management-event surface. One command (event configuration) and four event types across five sub-tags.

### Event Configuration

Configure which events the reader emits and at what thresholds. See [Choose what the reader tells you](/observability/configure-events).

| API | Type | Description |
|---|---|---|
| [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) | Command | Enable / disable event flags. Set heartbeat interval, CPU / RAM / flash / temperature thresholds. |

### Device Health

Periodic liveness with optional inventory and battery sub-payloads. See [Watch your reader's pulse](/observability/heartbeat).

| API | Type | Description |
|---|---|---|
| [`heartbeatEVT`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-heartbeatevt) | Event | Periodic device heartbeat: uptime, sequence number, inventory status, battery alert. |

### Alerts

Threshold-driven and state-transition notifications. Two payload variants. See [When the reader needs to interrupt you](/observability/alerts).

| API | Type | Description |
|---|---|---|
| [`alerts`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-alerts) | Event | Verbose alert with category-specific `alertDetails` block. |

### MQTT Connectivity

Endpoint connection state transitions. See [Knowing when you're connected](/observability/mqtt-connection).

| API | Type | Description |
|---|---|---|
| [`mqttConnEVT`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-mqttconnevt) | Event | CONNECTED / DISCONNECTED transition with device identity and protocol-version context. |

---

## Data

The **Data** tag group covers tag-read events emitted during active inventory.

### Tag Data Event

Per-tag (or aggregated) inventory output. See [Where tag reads come from](/rfid/dataevt-schema).

| API | Type | Description |
|---|---|---|
| [`dataEVT`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-dataevt) | Event | Inventory event with EPC, TID, USER, telemetry (RSSI, phase, channel, seen count), and access-operation results. |

---

## Cross-walk: concept chapter ↔ API sub-tag

Every Part 4–6 chapter in these docs ties to one API sub-tag. The pairing is bidirectional.

| Concept chapter | API sub-tag |
|---|---|
| [What your reader knows about itself](/infrastructure/device-state) | Device Status |
| [Getting on the network (Wi-Fi & Ethernet)](/infrastructure/network/architecture) | Network Configuration |
| [How the MQTT plumbing fits together](/infrastructure/endpoints/about) | MQTT Endpoint Configuration |
| [Securing the connection (TLS & certificates)](/infrastructure/security/model) | Certificate Management |
| [Updating firmware and rebooting](/infrastructure/system-operations) | System Operations |
| [Choose how the reader reads tags](/rfid/operating-mode-profiles) | Operating Mode |
| [Filter tags before vs after the read](/rfid/post-filters) | Tag Filtering |
| [Start, stop, and the trigger button](/rfid/start-stop-inventory) | Inventory Control |
| [Choose what the reader tells you](/observability/configure-events) | Event Configuration |
| [Watch your reader's pulse](/observability/heartbeat) | Device Health |
| [When the reader needs to interrupt you](/observability/alerts) | Alerts |
| [Knowing when you're connected](/observability/mqtt-connection) | MQTT Connectivity |
| [Where tag reads come from](/rfid/dataevt-schema) | Tag Data Event |

## Related

- [The OpenAPI Illusion](/foundations/native-mqtt-vs-openapi) — why the on-the-wire MQTT shape differs from the OpenAPI rendering.
- [How commands and responses flow](/foundations/communication-flow) — the three flow types (command/response, event, tag data).
- [Error Response Format](/reference/errors/format) — the response envelope.
- [Command Response Error Codes](/reference/errors/codes) — the full list of 29 codes (0–28).
- [Things people get wrong about IOTC](/diagnose/misconceptions) — common integration mistakes and their fixes.
