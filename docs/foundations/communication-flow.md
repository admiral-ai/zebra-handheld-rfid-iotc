---
id: communication-flow
title: How commands and responses flow
sidebar_label: How commands and responses flow
description: "End-to-end flow of an IOTC MQTT command: how the payload reaches the reader, how the reader publishes a response, and req/resp pairing."
---

> 📘 **EXPLANATION** · **Audience:** Solution Builder, API Consumer · **Read time:** ~6 min

Three communication flows occur between an IOTC reader and an application. **Every interaction in this documentation is one of them.** Knowing which is which is how you choose the right topic, the right QoS, and the right error-handling pattern.

### Flow 1: Command/Response (synchronous-feeling)

The application publishes a command on a **request topic**; the reader subscribes, processes, and publishes the response on the corresponding **response topic**. The correlation between request and response is a client-chosen `requestId` echoed unchanged in the response.

```bash
# Application publishes on:
#   zebra/MDM/clients/cmnd/RFD40-24190525100255
{
  "command": "get_status",
  "requestId": "status-001"
}

# Reader publishes on:
#   zebra/MDM/apps/RFD40-24190525100255/...  (or MDM/clients/resp per endpoint config)
{
  "command": "get_status",
  "requestId": "status-001",
  "apiVersion": "V1.1",
  "deviceStatus": {
    "powerSource": "USB",
    "radioActivity": "INACTIVE",
    "radioConnection": "CONNECTED",
    "temperature": 32,
    "batteryStatus": { "capacity": 6400, "chargePercentage": 100, "chargeStatus": 1 }
  },
  "response": { "code": 0, "description": "Success" }
}
```

```d2
shape: sequence_diagram
App: Application
B: MQTT Broker
R: Reader
App -> B: "publish .../cmnd\n{command, requestId}"
B -> R: deliver command
R -> R: "execute\n(query state)"
R -> B: "publish .../resp\n{requestId, response}"
B -> App: deliver response

```

Used for every operation in the Management and Control groups: [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status), [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version), [`get_current_region`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-current-region), [`get_eth`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-eth), [`get_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-wifi), [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi), [`delete_wifi_profile`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-wifi-profile), [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config), [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint), [`get_installed_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-installed-certificate), [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate), [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate), [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config), [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config), [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os), [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot), [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode), [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode), [`get_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-post-filter), [`set_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-post-filter), [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation), [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events).

**QoS choice:** typically **QoS 1** on both request and response. Duplicates are acceptable because every operation is idempotent on its `requestId`.

**Latency:** tens to hundreds of milliseconds for most operations. [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) is the exception, it acknowledges immediately but the actual firmware update may take many minutes; [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) is asynchronous and returns *before* the device actually reboots.

**Important:** "Synchronous-feeling" does not mean blocking. The application publishes, then waits — possibly with a timeout, possibly while doing other work. If the response never arrives, the application must decide: assume timeout, retry with the same `requestId`, or re-query. There is no protocol-level guarantee.

### Flow 2: Event Streaming (asynchronous)

The reader publishes events on event topics; one or more applications subscribe. The reader does this on its own initiative, the application has not asked anything.

```json
// Reader publishes on:  zebra/MGMT_EVT/apps/<serial>/heartbeat (or per endpoint config)
{
  "eventName": "heartbeat",
  "timestamp": "2026-05-19T14:23:11Z",
  "eventNumber": 120,
  "data": {
    "inventoryStatus": {
      "rfidStatus": "INPROGRESS",
      "tagCount": 45,
      "scanCount": 128
    },
    "batteryAlert": {
      "status": "HIGH",
      "stateOfHealth": "FULL",
      "chargePercentage": 85
    }
  }
}
```

```d2
direction: right
R: Reader
B: Broker { shape: queue }
subs: Subscribers (fan-out) {
  A1: Application 1
  A2: Application 2
  M: MDM Platform
}
R -> B: "heartbeatEVT (interval)"
R -> B: "alerts / alert_short"
R -> B: "mqttConnEVT (state change)"
B -> subs.A1
B -> subs.A2
B -> subs.M

```

Events do **not** use the `{response: {code, description}}` envelope that command responses use. Each event class has its own root shape:

- `heartbeatEVT`: `{eventName, timestamp, eventNumber, upTime, data: {...}}`. Cadence set by `eventConfiguration.heartbeatConfiguration.interval`.
- `alerts`: `{type, timestamp, state, id, priority, alertDetails: {...}}`. Verbose. Threshold-driven (battery, temperature, NETWORK_EVENT, FIRMWARE_UPDATE, POWER).
- `alert_short`: `{id, timestamp, type, priority, messageID, description}`. Compact. Same trigger conditions as `alerts` but optimised for MDM consumption.
- `mqttConnEVT`: `{connectionState, timestamp, deviceModel, deviceSerialNo, apiVersion, mqttVersion}`. CONNECTED/DISCONNECTED transitions only. **`timestamp` may be `HH:MM:SS`, not full ISO 8601** — applications must accept either.

**QoS choice:** typically **QoS 1**. Heartbeats can drop to QoS 0 if cadence is short and loss is tolerable.

The application's job is to subscribe at startup and react, never to *poll* for events. Polling defeats the model and burns battery.

### Flow 3: Tag-Data Streaming (high-throughput asynchronous)

A specialised event-streaming case with much higher throughput. While an inventory operation is running, the reader emits a `dataEVT` per tag read, or per aggregated read, depending on the `reportFilter duration` setting in the operating-mode configuration.

```json
// Reader publishes on:  zebra/DATA1/event (or per DATA1 endpoint config)
{
  "type": "BALANCED_PERFORMANCE",
  "timestamp": "2026-05-19T14:23:11Z",
  "data": {
    "tagData": [
      {
        "EPCid": "E2003411B802011533ABCD12",
        "EPC": "E2003411B802011533ABCD12",
        "peakRssi": -52,
        "seenCount": 14,
        "eventNum": 1,
        "channel": 911.75,
        "phase": 0
      }
    ]
  }
}
```

```d2
direction: right
T: Tag reads
R: Reader
B: Broker { shape: queue }
RB: "Retention\nBuffer" { shape: cylinder }
A: Application
T -> R
R -> B: "normal flow\nup to ~500 TPS"
R -> RB: "broker down:\nbuffer up to 150K events" { style.stroke-dash: 4 }
RB -> B: "on reconnect:\nflush ~500 TPS" { style.stroke-dash: 4 }
B -> A

```

Notice that `dataEVT` does not include the `command`/`requestId`/`response` envelope. Its `type` field carries the active profile name (`CYCLE_COUNT`, `DENSE_READERS`, `OPTIMAL_BATTERY`, `BALANCED_PERFORMANCE`, `ADVANCED`). Telemetry fields (`channel`, `phase`, `seenCount`) appear conditionally. `channel` and `phase` only when `reportFilter duration` is `0` (every read reported separately); when greater than `0`, reads are aggregated and `peakRssi` reflects the peak since the last report.

Volumes range from tens to many hundreds of events per second. The DATA1 and DATA2 topic families exist so this traffic can be subscribed to separately (or routed to a dedicated broker or cloud destination) from control traffic on MGMT and CTRL.

**QoS choice:** typically **QoS 0** for high-volume streams. The retention buffer absorbs transient loss. Move to QoS 1 only when each individual tag read must not be lost (uncommon).

**Caveat: FAST_READ.** The `FAST_READ` profile exists in the [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) enum but is documented as **not currently supported**. Setting it will fail. Use one of the five supported profiles (`CYCLE_COUNT`, `DENSE_READERS`, `OPTIMAL_BATTERY`, `BALANCED_PERFORMANCE`, `ADVANCED`).

### Topic-direction conventions

| Direction | Application | Reader |
|---|---|---|
| Commands (request) | publishes | subscribes |
| Responses | subscribes | publishes |
| Events | subscribes | publishes |
| Tag data | subscribes | publishes |

Topic structure is always three parts: `<tenantId>/<topic>/<deviceSerialNumber>`. The reader prepends `tenantId` and appends `deviceSerialNumber` at runtime; the `topic` field in [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) carries only the middle segment.

For the full topic taxonomy: [How the MQTT plumbing fits together](/infrastructure/endpoints/about). For per-flow QoS guidance: [What happens when the network drops](/fleet/retention-and-retry).

### For application design

- **Use one MQTT client per application instance.** A single client subscribes to all relevant topics; correlation is by `requestId`, not by connection.
- **Treat commands as idempotent.** [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) with the same payload twice should produce the same result. Build retry around `requestId` reuse.
- **Subscribe before publishing.** A subscriber that joins late misses non-retained messages; most events do not retain.
- **Don't conflate retention with delivery.** Retention buffers tag data when the broker is unreachable, not when the application is. If your application is slow, the broker still holds messages (subject to its own retention); if the broker is down, the reader holds them — up to its configured retention buffer.

**Related:** 📘 [MQTT in five minutes](/foundations/mqtt-primer) · 📘 [The OpenAPI Illusion](/foundations/native-mqtt-vs-openapi) · 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📘 [Knowing when you're connected](/observability/mqtt-connection) · 📕 MQTT API Reference (top nav)
