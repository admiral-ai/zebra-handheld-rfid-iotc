---
id: configure
title: Event configuration
sidebar_label: Event configuration
---

> 📙 **HOW-TO** · Audience: Solution Builder · Time: ~10 min

### Path 1: `config_events` (shortcut for the active endpoint)

```json
{
  "command": "config_events",
  "requestId": "ev-1",
  "eventConfiguration": {
    "heartbeat": true,
    "battery": true,
    "power": true,
    "network": true,
    "firmwareUpdate": true,
    "ntp": true,
    "terminalConnection": true,
    "heartbeatConfiguration": {
      "interval": 60,
      "inventoryStatus": true,
      "batteryStatus": true
    }
  }
}
```

### Path 2: `config_endpoint` (per-endpoint full control)

```json
{
  "command": "config_endpoint",
  "requestId": "ev-2",
  "epConfig": {
    "operation": "update",
    "endpointName": "main-event",
    "configuration": {
      "epType": "MGMT_EVT",
      "eventConfiguration": {
        "heartbeat": true,
        "battery": true,
        "heartbeatConfiguration": {
          "interval": 30,
          "inventoryStatus": true,
          "batteryStatus": true
        }
      }
    }
  }
}
```

### Documented event flags

All flags from `config_events.md` are accepted in `eventConfiguration`:
`antenna`, `terminalConnection`, `firmwareUpdate`, `gpi`, `network`, `exceptions`, `ntp`, `userApp`, `heartbeat`, `power`, `battery`, `temperature`, `fileDownload`, `cpuUsage`, `flashUsage`, `ramUsage`.

> Flags `antenna`, `exceptions`, `gpi`, `cpuUsage`, `userApp` are accepted but do not currently emit events on V1.1 firmware.

### Threshold fields

For threshold-based alerts, set the relevant threshold:
- `cpuThreshold`, `ramThreshold`, `flashThreshold`, `temperatureThreshold`

**Related:** 📘 [§11.1 Event Model](/observability/events/model) · 📕 [§16.2 config_events](#chapter-16--mqtt-api-reference) · 📕 [§16.6 events](#chapter-16--mqtt-api-reference)
