---
id: communication-flow
title: How commands and responses flow
sidebar_label: How commands and responses flow
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

[DIAGRAM: D-2.4.A. command/response sequence with publish/subscribe arrows]

Used for every operation in the Management and Control groups: `get_status`, `get_version`, `get_current_region`, `get_eth`, `get_wifi`, `set_wifi`, `delete_wifi_profile`, `get_endpoint_config`, `config_endpoint`, `get_installed_certificate`, `install_certificate`, `delete_certificate`, `get_config`, `set_config`, `set_os`, `reboot`, `get_operating_mode`, `set_operating_mode`, `get_post_filter`, `set_post_filter`, `control_operation`, `config_events`.

**QoS choice:** typically **QoS 1** on both request and response. Duplicates are acceptable because every operation is idempotent on its `requestId`.

**Latency:** tens to hundreds of milliseconds for most operations. `set_os` is the exception, it acknowledges immediately but the actual firmware update may take many minutes; `reboot` is asynchronous and returns *before* the device actually reboots.

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

[DIAGRAM: D-2.4.B. event-streaming pattern; reader → broker fan-out]

Events do **not** use the `{response: {code, description}}` envelope that command responses use. Each event class has its own root shape:

- `heartbeatEVT`: `{eventName, timestamp, eventNumber, upTime, data: {...}}`. Cadence set by `eventConfiguration.heartbeatConfiguration.interval`.
- `alerts`: `{type, timestamp, state, id, priority, alertDetails: {...}}`. Verbose. Threshold-driven (battery, temperature, NETWORK_EVENT, FIRMWARE_UPDATE, POWER, GPI_EVENT, ANTENNA_EVENT).
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

[DIAGRAM: D-2.4.C. tag-data streaming with burst-rate annotation and retention-buffer fallback]

Notice that `dataEVT` does not include the `command`/`requestId`/`response` envelope. Its `type` field carries the active profile name (`CYCLE_COUNT`, `DENSE_READERS`, `OPTIMAL_BATTERY`, `BALANCED_PERFORMANCE`, `ADVANCED`). Telemetry fields (`channel`, `phase`, `seenCount`) appear conditionally. `channel` and `phase` only when `reportFilter duration` is `0` (every read reported separately); when greater than `0`, reads are aggregated and `peakRssi` reflects the peak since the last report.

Volumes range from tens to many hundreds of events per second. The DATA1 and DATA2 topic families exist so this traffic can be subscribed to separately (or routed to a dedicated broker or cloud destination) from control traffic on MGMT and CTRL.

**QoS choice:** typically **QoS 0** for high-volume streams. The retention buffer absorbs transient loss. Move to QoS 1 only when each individual tag read must not be lost (uncommon).

**Caveat: FAST_READ.** The `FAST_READ` profile exists in the `set_operating_mode` enum but is documented as **not currently supported**. Setting it will fail. Use one of the five supported profiles (`CYCLE_COUNT`, `DENSE_READERS`, `OPTIMAL_BATTERY`, `BALANCED_PERFORMANCE`, `ADVANCED`).

### Topic-direction conventions

| Direction | Application | Reader |
|---|---|---|
| Commands (request) | publishes | subscribes |
| Responses | subscribes | publishes |
| Events | subscribes | publishes |
| Tag data | subscribes | publishes |

Topic structure is always three parts: `<tenantId>/<topic>/<deviceSerialNumber>`. The reader prepends `tenantId` and appends `deviceSerialNumber` at runtime; the `topic` field in `config_endpoint` carries only the middle segment.

For the full topic taxonomy: [How the MQTT plumbing fits together](/infrastructure/endpoints/about). For per-flow QoS guidance: [What happens when the network drops](/fleet/reliability/retention-retry).

### For application design

- **Use one MQTT client per application instance.** A single client subscribes to all relevant topics; correlation is by `requestId`, not by connection.
- **Treat commands as idempotent.** `set_config` with the same payload twice should produce the same result. Build retry around `requestId` reuse.
- **Subscribe before publishing.** A subscriber that joins late misses non-retained messages; most events do not retain.
- **Don't conflate retention with delivery.** Retention buffers tag data when the broker is unreachable, not when the application is. If your application is slow, the broker still holds messages (subject to its own retention); if the broker is down, the reader holds them — up to its configured retention buffer.

**Related:** 📘 [MQTT in five minutes](/foundations/mqtt/primer) · 📘 [The OpenAPI Illusion](/foundations/concepts/native-mqtt-vs-openapi) · 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📘 [Knowing when you're connected](/observability/events/mqtt-connection) · 📕 MQTT API Reference (top nav)
