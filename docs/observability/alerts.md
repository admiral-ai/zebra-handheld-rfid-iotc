---
id: alerts
title: When the reader needs to interrupt you
sidebar_label: When the reader needs to interrupt you
---

> 📘 **EXPLANATION** · **Audience:** Fleet Operator · **Read time:** ~5 min · **Ties to:** Alerts sub-tag of the API Reference

:::tip[See in the API Reference]
Sub-tag: Alerts (and Exceptions). Events: `alerts` · `alert_short`.
:::

When a sled crosses a threshold or its operational state changes meaningfully, it speaks. **Two event variants carry these signals:** `alerts` (verbose, application-facing) and `alert_short` (compact, MDM-facing). They cover overlapping but not identical triggers, and they share priority levels.

### Two variants, one signal class

| Variant | Voice | Used by |
|---|---|---|
| `alerts` | Verbose JSON with `alertDetails` per category | Application dashboards, observability pipelines, alerting systems |
| `alert_short` | Compact JSON with an `id` enum and a `description` string | MDM platforms (SOTI Connect, 42Gears SureMDM), log aggregators |

Both are real, both are emitted on appropriate events, and they are **not** duplicates of each other — `alert_short` has many more distinct `id` values (certificate install outcomes, Wi-Fi config success/fail, firmware download/install variants) than `alerts` does.

### `alerts`, the verbose form

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
- **`priority`**: `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW`. Four-value enum per the canonical schema. `alert_short` uses a 3-value variant without `MEDIUM`.
- **`alertDetails`**, a category-specific block (`fwUpdateStatus`, `batteryAlert`, `powerEvent`, `networkInfo`, `temperatueInfo`, `downloadInfo`).

### State semantics: SET, CLEAR, ONESHOT

The `state` field tells you whether to track or just log:

| `state` | Meaning | Use |
|---|---|---|
| `SET` | Condition is currently active | Open an incident; expect a `CLEAR` |
| `CLEAR` | Condition has been resolved | Close the corresponding `SET` |
| `ONESHOT` | One-time informational event | Log; no paired `CLEAR` to expect |

`FIRMWARE_UPDATE` and `TEMPERATURE` use SET/CLEAR (they have a persistent state). `BATTERY`, `POWER`, and `NETWORK_EVENT` use `ONESHOT` (they're transitions, not states).

### `alert_short`, the compact form

```json
{
  "id": "BATTERY_CRITICAL_SET",
  "timestamp": "14:30:15",
  "type": "ALERT",
  "priority": "CRITICAL",
  "messageID": "ZEBRA_RFID_HH_ALERTS",
  "description": "battery level is critically low"
}
```

Fields are minimal: `id`, `timestamp`, `type`, `priority`, `messageID`, `description`. No `alertDetails`. The information is encoded in the `id` enum value itself, which is much broader:

- **Battery transitions**: `BATTERY_LOW_SET`, `BATTERY_LOW_CLEAR`, `BATTERY_CRITICAL_SET`, `BATTERY_FULL`.
- **Temperature transitions**: `TEMPERATURE_HIGH_SET`, `TEMPERATURE_HIGH_CLEAR`, `TEMPERATURE_CRITICAL_SET`, `TEMPERATURE_CRITICAL_CLEAR`.
- **Firmware**: `FIRMWARE_DOWNLOAD_SUCCESS`, `FIRMWARE_DOWNLOAD_FAIL`, `FIRMWARE_UPDATE_SUCCESS`, `FIRMWARE_UPDATE_FAIL`.
- **Wi-Fi config**: `WIFI_CONFIG_SUCCESS`, `WIFI_CONFIG_FAIL`.
- **Ethernet config**: `ETH_CONFIG_SUCCESS`, `ETH_CONFIG_FAIL`.
- **Power**: `POWER_SOURCE_UPDATE`.
- **Network**: `NETWORK_INTERFACE_CHANGE`.
- **MQTT certificates**: `MQTT_INSTALL_CERTIFICATE_SUCCESS`/`FAIL`, plus `MQTT_ROOT_CERT_DOWNLOAD_SUCCESS`/`FAIL`, `MQTT_CLIENT_CERT_DOWNLOAD_SUCCESS`/`FAIL`, `MQTT_CLIENT_KEY_DOWNLOAD_SUCCESS`/`FAIL`, and install variants of each.
- **Wi-Fi certificates**: full set mirroring the MQTT cert lifecycle.
- **Filestore certificates**: same again.

The `id` value carries the operation, the certificate component, and the outcome in one enum slot. A pipeline that just maps `id` to a routing rule is straightforward to build.

**Note on `alert_short.timestamp`**, the example format is `HH:MM:SS`, not full ISO 8601. As with `mqttConnEVT.timestamp`, applications must accept either format.

### Priority: operational meaning

| Priority | Meaning | Pipeline action |
|---|---|---|
| `CRITICAL` | Immediate action required (battery critical, firmware update failed) | Page on-call |
| `HIGH` | Important state change (network interface change, cert success) | Notify operator |
| `MEDIUM` | Routine state change | Log |
| `LOW` | Informational (firmware download success, battery full) | Log, optional dashboard |

Priority is consistent across `alerts` and `alert_short` for the same trigger. Use it directly as a routing key.

### Choosing between them

- **Application dashboards and operational pipelines:** consume `alerts`. The `alertDetails` block carries actionable specifics (battery percentage, firmware update progress, network interface details).
- **MDM systems and log aggregators:** consume `alert_short`. Compact, indexable by `id`, easy to ingest at fleet scale.
- **Both:** route to different endpoints. The `MGMT_EVT` endpoint typically carries `alerts`; the `SOTI` or dedicated MDM endpoint typically carries `alert_short`.

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

**Related:** 📘 [Choose what the reader tells you](/observability/configure-events) · 📘 [Watch your reader's pulse](/observability/heartbeat) · 📘 [Knowing when you're connected](/observability/mqtt-connection) · 📕 [`alerts`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`alert_short`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
