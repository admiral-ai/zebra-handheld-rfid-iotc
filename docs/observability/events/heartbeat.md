---
id: heartbeat
title: Watch your reader's pulse
sidebar_label: Watch your reader's pulse
---

> 📘 **EXPLANATION** · **Audience:** Solution Builder, Fleet Operator · **Read time:** ~4 min · **Ties to:** Device Health sub-tag of the API Reference

:::tip[See in the API Reference]
Sub-tag: Device Health. Event: `heartbeatEVT`.
:::

The heartbeat is the "this reader is alive" signal. A reader publishes `heartbeatEVT` at the interval set in `eventConfiguration.heartbeatConfiguration.interval`. Each event carries uptime and a sequence number; optionally, the current inventory status and battery state.

### The shape

```json
{
  "eventName": "heartbeat",
  "timestamp": "2026-05-19T14:23:11Z",
  "eventNumber": 120,
  "upTime": "5d 12h 47m",
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

Fields:

- **`eventName`**, always `"heartbeat"`. Note: it's not `"heartBeatEVT"` or `"heartbeatEVT"` — just `heartbeat`.
- **`timestamp`**: ISO 8601.
- **`eventNumber`**, a monotonic sequence number. Useful for gap detection (missing heartbeats imply lost connection).
- **`upTime`**: how long since the last reboot.
- **`data.inventoryStatus`**: present only when `heartbeatConfiguration.inventoryStatus: true`.
- **`data.batteryAlert`**: present only when `heartbeatConfiguration.batteryStatus: true`.

Both `data.*` sub-blocks are optional. The skeleton (`eventName`, `timestamp`, `eventNumber`, `upTime`) is always present.

### Interval, cost, and what to pick

The `interval` value (seconds) trades off telemetry resolution against battery and bandwidth. **The device default is 60 seconds** when the heartbeat is enabled without an explicit interval.

| Interval | Use |
|---|---|
| 10 s | Test / debugging; high cost; you'll see every flap |
| 60 s | Device default; typical for actively managed fleets |
| 300 s | Periodic check-in; good for relatively static deployments |
| 3600 s | Light-touch monitoring; only confirms hourly liveness |

Each heartbeat costs an MQTT publish (~200 bytes) plus the CPU work of building it. At 60 s intervals across 1,000 readers, that's 1,000 publishes per minute on the broker. Provisioned-throughput brokers (AWS IoT Core, paid HiveMQ tiers) charge per million messages (watch the math).

### Gap detection: heartbeat absence is informative

The most important use of heartbeats is **noticing when they stop.** A reader that was emitting heartbeats every 60 s and then misses three in a row is offline, regardless of what the broker says. Application-side detection logic:

```
expected_next = last_heartbeat.timestamp + heartbeat_interval
if now() > expected_next + grace_period:
    raise OfflineAlert(serial)
```

Pair this with `mqttConnEVT` (which fires on protocol-layer disconnect via LWT) for two-source confirmation. Heartbeat absence catches the silent cases where the broker thinks the reader is connected but the device has soft-failed.

### Inventory progress without the data stream

When `heartbeatConfiguration.inventoryStatus: true`, the heartbeat carries `data.inventoryStatus` with `rfidStatus`, `tagCount` (unique tags so far in this inventory), and `scanCount` (total reads, including duplicates). This is useful for dashboards that show "scan in progress, 45 tags read" without consuming the full `dataEVT` stream.

`rfidStatus` here uses values `INPROGRESS` and `STOPPED` — different from `get_status.deviceStatus.radioActivity` which uses `ACTIVE` and `INACTIVE`. The enums describe the same physical state from two slightly different perspectives; expect to map between them.

### Battery in the heartbeat

`data.batteryAlert` shows the current battery posture:

- **`status`**: `LOW`, `CRITICAL`, `CHARGING`, `FULL`, `HIGH`.
- **`stateOfHealth`**: long-term capacity: `LOW`, `CRITICAL`, `HIGH`, `FULL`, or `CHARGING` (transitional).
- **`chargePercentage`**, 0–100.

Note that `status: LOW` and `status: CRITICAL` here are heartbeat *snapshots*. The `alerts` event with `id: BATTERY` fires on **transitions**, the difference matters when designing a dashboard vs an alerting pipeline. See [When the reader needs to interrupt you](/observability/events/alerts).

### Tuning verbosity by use case

| Use case | `interval` | `inventoryStatus` | `batteryStatus` |
|---|---|---|---|
| Active inventory session monitoring | 30 s | `true` | `true` |
| Quiet fleet liveness | 300 s | `false` | `true` |
| Battery-conscious deployment | 600 s | `false` | `true` |
| Debug only | 10 s | `true` | `true` |

### Out of scope

- **Threshold-driven alerts**, those are `alerts` and `alert_short`, not heartbeats. See [When the reader needs to interrupt you](/observability/events/alerts).
- **Configuring which events the reader emits**, see [Choose what the reader tells you](/observability/events/configure).
- **Connection-state transitions (`mqttConnEVT`)**, see [Knowing when you're connected](/observability/events/mqtt-connection).

**Related:** 📘 [Choose what the reader tells you](/observability/events/configure) · 📘 [When the reader needs to interrupt you](/observability/events/alerts) · 📘 [Knowing when you're connected](/observability/events/mqtt-connection) · 📕 [`heartbeatEVT`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
