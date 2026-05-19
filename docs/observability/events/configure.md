---
id: configure
title: Choose what the reader tells you
sidebar_label: Choose what the reader tells you
---

> 📙 **HOW-TO** · Audience: Solution Builder · Time: ~10 min · Ties to the Event Configuration sub-tag of the API Reference

> **See in the API Reference**
> Sub-tag: Event Configuration. Operation: `config_events`.

A sled can emit a wide range of operational events — heartbeats, alerts, exceptions, NTP transitions, network state changes, firmware update progress, GPI state, antenna health. **You decide which.** `config_events` is the operation that switches each event class on or off and sets thresholds for the alerts that need them.

### Sixteen event flags

Each boolean flag in `eventConfiguration` controls one event stream:

| Flag | Stream |
|---|---|
| `antenna` | Antenna connection / disconnection events |
| `terminalConnection` | Terminal (BT bridge / USB) state changes |
| `firmwareUpdate` | Firmware-update progress events |
| `gpi` | General Purpose Input state changes |
| `network` | Network interface state and IP changes |
| `exceptions` | Runtime exceptions from the device |
| `ntp` | NTP synchronisation transitions |
| `userApp` | User-application lifecycle events |
| `heartbeat` | Periodic heartbeat; needs `heartbeatConfiguration` |
| `power` | Power-source changes (battery → external, etc.) |
| `battery` | Battery state; low, critical, full |
| `temperature` | Temperature crossing `temperatureThreshold` |
| `fileDownload` | File-download progress (firmware, certificates) |
| `cpuUsage` | CPU above `cpuThreshold` |
| `flashUsage` | Flash above `flashThreshold` |
| `ramUsage` | RAM above `ramThreshold` |

Omitting a flag from the payload leaves its current device-side state unchanged. Setting it to `false` switches the stream off.

### Four thresholds

Four flags require companion threshold values:

- **`cpuThreshold`**: CPU percent that triggers a CPU usage alert.
- **`ramThreshold`**: RAM percent that triggers a RAM usage alert.
- **`flashThreshold`**: flash percent that triggers a flash usage alert.
- **`temperatureThreshold`**: temperature in °C that triggers a temperature alert.

These are *thresholds*, not poll rates. The reader checks against them internally and emits an alert when the value crosses. The alert is `alerts` (verbose) or `alert_short` (compact), depending on the consumer.

### `heartbeatConfiguration`: what the heartbeat carries

When `heartbeat: true`, three companion fields shape the heartbeat:

```json
"heartbeatConfiguration": {
  "interval": 100,
  "inventoryStatus": true,
  "batteryStatus": true,
  "userApps": true
}
```

- **`interval`**: seconds between heartbeats. Lower = more frequent telemetry, higher battery cost.
- **`inventoryStatus`**: include `data.inventoryStatus` block (rfidStatus, tagCount, scanCount).
- **`batteryStatus`**: include `data.batteryAlert` block.
- **`userApps`**: include user-application status.

Heartbeat is the "the reader is alive" signal. Disabling it loses your liveness detection. See [Watch your reader's pulse](/observability/events/heartbeat).

### Enable everything (initial development)

```json
{
  "command": "config_events",
  "requestId": "events-all",
  "eventConfiguration": {
    "antenna": true, "terminalConnection": true, "firmwareUpdate": true,
    "gpi": true, "network": true, "exceptions": true, "ntp": true,
    "userApp": true, "heartbeat": true, "power": true, "battery": true,
    "temperature": true, "fileDownload": true, "cpuUsage": true,
    "flashUsage": true, "ramUsage": true,
    "heartbeatConfiguration": {
      "interval": 100, "inventoryStatus": true, "batteryStatus": true
    },
    "cpuThreshold": 80, "ramThreshold": 80, "flashThreshold": 80,
    "temperatureThreshold": 55
  }
}
```

Useful while you map your application to the event stream. Turn off what you don't consume once you know.

### Selective production payload

```json
{
  "command": "config_events",
  "requestId": "events-prod",
  "eventConfiguration": {
    "antenna": false, "terminalConnection": true, "firmwareUpdate": true,
    "gpi": false, "network": true, "exceptions": false, "ntp": false,
    "userApp": false, "heartbeat": false, "power": true, "battery": true,
    "temperature": true, "fileDownload": true, "cpuUsage": false,
    "flashUsage": false, "ramUsage": false
  }
}
```

A typical production posture for a single-reader retail use case: keep alerts (power, battery, temperature) and operational events (terminal, network, firmware, file download); drop the noisy ones (antenna, GPI, exceptions, NTP, user-app, heartbeat, CPU/RAM/flash) unless you have a use for them.

### `config_events` vs `config_endpoint.eventConfiguration`

There is a second place that event flags appear: inside `config_endpoint.configuration.eventConfiguration`. That nested form controls which events the **specific endpoint** publishes. It is per-endpoint, not device-wide.

The relationship: the device-wide `config_events` says *which events exist*; the per-endpoint `eventConfiguration` says *which of those go to this specific endpoint*. In practice, most deployments configure both to match — `config_events` enables battery alerts globally, then the MGMT_EVT endpoint's `eventConfiguration.battery: true` routes them there.

### Where the events actually go

Each enabled event publishes on the publish topic family of whichever endpoint is configured to carry it. The MDM hybrid endpoint at bootstrap carries everything; a split deployment routes management events on the MGMT_EVT endpoint. See [How the MQTT plumbing fits together](/infrastructure/endpoints/about) for the routing model.

### Pre-condition

`config_events` has no documented pre-condition on radio state; you can change event configuration mid-inventory. It returns a generic-shape response with `apiVersion`, `response.code`, `response.description`.

### Out of scope

- **The shape of each event payload**: covered per-event: [Watch your reader's pulse](/observability/events/heartbeat), [When the reader needs to interrupt you](/observability/events/alerts), [Knowing when you're connected](/observability/events/mqtt-connection), [Where tag reads come from](/rfid/tag-data/dataevt-schema).
- **Routing events to multiple endpoints**, by configuring two endpoints with overlapping `eventConfiguration` flags. Covered in [How the MQTT plumbing fits together](/infrastructure/endpoints/about).

**Related:** 📘 [Watch your reader's pulse](/observability/events/heartbeat) · 📘 [When the reader needs to interrupt you](/observability/events/alerts) · 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📕 [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
