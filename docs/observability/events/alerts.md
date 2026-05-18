---
id: alerts
title: When the reader needs to interrupt you
sidebar_label: When the reader needs to interrupt you
---

> 📘 **EXPLANATION** · Audience: Fleet Operator · Read time: ~5 min

`alerts` events are threshold-driven notifications a reader emits when monitored state transitions occur. Two payload formats coexist: `alerts` (full payload, application-facing) and `alert_short` (compact payload, MDM-facing).

### Alert IDs

The documented `alerts.id` enum (per `schemas/events/alerts.json`):

| `id` | Trigger |
|---|---|
| `BATTERY` | Battery charge or health state change |
| `POWER` | Power source change (USB ↔ battery, etc.) |
| `NETWORK_EVENT` | Wi-Fi or Ethernet interface state change |
| `FIRMWARE_UPDATE` | Update started, progress, completed |
| `TEMPERATURE` | Threshold crossed |

(The `alerts.md` description lists additional categories — `GPI_EVENT`, `ANTENNA_EVENT` — but the schema enum is the authoritative current set.)

### State semantics

| `state` | Meaning |
|---|---|
| `SET` | Condition is currently active. Paired with a later `CLEAR` when resolved. |
| `CLEAR` | Previously-set condition has resolved. |
| `ONESHOT` | One-time event, no `CLEAR` companion. |

### Priority levels

`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`. Used to route the alert in the application: route `CRITICAL` to PagerDuty/Opsgenie immediately; collect `LOW` into batch dashboards.

### `alerts` vs `alert_short`

`alerts` carries structured `alertDetails` — for example, a `BATTERY` alert includes `batteryAlert.status`, `stateOfHealth`, `chargePercentage`. `alert_short` carries a predefined `id` from a ~50-entry enum (`BATTERY_LOW_SET`, `BATTERY_CRITICAL_SET`, `FIRMWARE_DOWNLOAD_SUCCESS`, `WIFI_CONFIG_FAIL`, `MQTT_ROOT_CERT_INSTALL_SUCCESS`, etc.) with a one-line `description` — designed for the SOTI MobiControl dashboard's row format.

**Related:** 📕 [§16.6 alerts / alert_short schemas](#chapter-16--mqtt-api-reference) · 📙 [§11.3 Configure Events](/observability/events/configure) · 📙 [§13.2 SOTI Provisioning](/fleet/provisioning/soti-connect)
