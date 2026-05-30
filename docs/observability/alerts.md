---
id: alerts
title: When the reader needs to interrupt you
sidebar_label: When the reader needs to interrupt you
description: "IOTC alerts: the async signal a reader sends on threshold crossings (battery, temperature, firmware, network). Fields, state semantics, and priority."
---

> 📘 **EXPLANATION** · **Audience:** Fleet Operator · **Read time:** ~5 min · **Ties to:** Alerts sub-tag of the API Reference

:::tip[See in the API Reference]
Sub-tag: Alerts (and Exceptions). Event: `alerts`.
:::

When a sled crosses a threshold or its operational state changes meaningfully, it speaks. The **`alerts`** event carries these signals — a verbose JSON message with a category-specific `alertDetails` block, consumed by application dashboards, observability pipelines, and alerting systems.

### The `alerts` event

```json
{
  "type": "ALERT",
  "timestamp": "2026-05-19T12:33:34.279Z",
  "state": "SET",
  "id": "FIRMWARE_UPDATE",
  "priority": "CRITICAL",
  "alertDetails": {
    "fwUpdateStatus": {
      "updateStatus": "updating",
      "overallProgress": 20,
      "stage": "updating scanner fw"
    }
  }
}
```

Fields:

- **`type`**: `EVENT`, `NOTIFICATION`, or `ALERT`.
- **`state`**: `SET` (condition active), `CLEAR` (condition resolved), or `ONESHOT` (one-time fire).
- **`id`**: alert category. The formal schema enum defines **five** values: `BATTERY`, `FIRMWARE_UPDATE`, `NETWORK_EVENT`, `TEMPERATURE`, `POWER`. The canonical reference also describes `GPI_EVENT` and `ANTENNA_EVENT` as trigger conditions, though they are not in the published `id` enum — treat those two as informational categories that fold into `NETWORK_EVENT` or vendor-specific extensions when seen on the wire.
- **`priority`**: `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW`. Four-value enum per the canonical schema.
- **`alertDetails`**, a category-specific block (`fwUpdateStatus`, `batteryAlert`, `powerEvent`, `networkInfo`, `temperatueInfo`, `downloadInfo`).

### State semantics: SET, CLEAR, ONESHOT

The `state` field tells you whether to track or just log:

| `state` | Meaning | Use |
|---|---|---|
| `SET` | Condition is currently active | Open an incident; expect a `CLEAR` |
| `CLEAR` | Condition has been resolved | Close the corresponding `SET` |
| `ONESHOT` | One-time informational event | Log; no paired `CLEAR` to expect |

`FIRMWARE_UPDATE` and `TEMPERATURE` use SET/CLEAR (they have a persistent state). `BATTERY`, `POWER`, and `NETWORK_EVENT` use `ONESHOT` (they're transitions, not states).

### Priority: operational meaning

| Priority | Meaning | Pipeline action |
|---|---|---|
| `CRITICAL` | Immediate action required (battery critical, firmware update failed) | Page on-call |
| `HIGH` | Important state change (network interface change, cert success) | Notify operator |
| `MEDIUM` | Routine state change | Log |
| `LOW` | Informational (firmware download success, battery full) | Log, optional dashboard |

Priority maps directly to a routing key — use it to decide paging versus logging for a given trigger.

### Thresholds drive emission

For `BATTERY`, `TEMPERATURE`, and the CPU/RAM/flash usage events, the firing rule is "value crosses a configured threshold." Configure with [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events):

```json
{
  "command": "config_events",
  "requestId": "thresh-001",
  "eventConfiguration": {
    "battery": true,
    "temperature": true,
    "temperatureThreshold": 55
  }
}
```

See [Choose what the reader tells you](/observability/configure-events).

### Out of scope

- **Configuring which alerts the reader emits**: covered in [Choose what the reader tells you](/observability/configure-events).
- **Heartbeat-embedded battery state**, that is point-in-time, not threshold-driven; see [Watch your reader's pulse](/observability/heartbeat).
- **Connection-state events (`mqttConnEVT`)**: separate surface; see [Knowing when you're connected](/observability/mqtt-connection).

**Related:** 📘 [Choose what the reader tells you](/observability/configure-events) · 📘 [Watch your reader's pulse](/observability/heartbeat) · 📘 [Knowing when you're connected](/observability/mqtt-connection) · 📕 [`alerts`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
