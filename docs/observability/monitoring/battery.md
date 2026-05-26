---
id: battery
title: How to Monitor Battery Lifecycle
sidebar_label: How to Monitor Battery Lifecycle
---

> 📙 **HOW-TO** · Audience: Fleet Operator · Time: ~10 min

### Subscribe to battery state

Watch `heartbeatEVT.data.batteryAlert`:

```json
{
  "data": {
    "batteryAlert": {
      "status": "DISCHARGING",
      "stateOfHealth": "GOOD",
      "chargePercentage": 78
    }
  }
}
```

### React to battery alerts

Watch the `alerts` event with `id: BATTERY`:

```json
{
  "id": "BATTERY",
  "state": "ONESHOT",
  "priority": "LOW",
  "alertDetails": {"batteryAlert": {"status": "CHARGING", "stateOfHealth": "FULL", "chargePercentage": 100}}
}
```

For SOTI-connected fleets, `alert_short` with predefined `id` values surfaces battery thresholds: `BATTERY_LOW_SET`, `BATTERY_LOW_CLEAR`, `BATTERY_CRITICAL_SET`, `BATTERY_FULL`.

### Interpret `stateOfHealth`

| Value | Meaning |
|---|---|
| `GOOD` | Battery is operating within nominal capacity |
| `AVERAGE` | Capacity has degraded measurably; monitor for replacement |
| `POOR` | Replacement recommended |

### Drain characterisation

Per-mode drain figures are deployment-specific. Measure drain over a representative shift in your environment. The canonical telemetry field is `heartbeatEVT.data.batteryAlert.chargePercentage` over time. Operational recommendations for battery-constrained deployments include increasing the heartbeat interval and stopping inventory between active scans.

**Related:** 📘 [Alert Events](/observability/alerts) · 📕 [alerts schema](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#tag-alerts) · 📙 [Battery Troubleshooting](/reference/troubleshooting/battery)

---

# Part VI: Fleet Operations (corrected)
