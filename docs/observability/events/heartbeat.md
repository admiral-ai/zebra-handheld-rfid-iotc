---
id: heartbeat
title: About Heartbeat Events
sidebar_label: About Heartbeat Events
---

> 📘 **EXPLANATION** · Audience: Solution Builder, Fleet Operator · Read time: ~4 min

A `heartBeatEVT` is a periodic liveness beacon emitted by the reader at the interval set in `heartbeatConfiguration.interval`. The event carries device uptime, an event sequence number, and optional sub-payloads describing inventory progress and battery state.

### Payload shape

| Field | Description |
|---|---|
| `eventName` | `"heartbeat"` |
| `timestamp` | ISO 8601 |
| `eventNumber` | Monotonic sequence |
| `upTime` | Human-readable uptime (e.g., `"5 days 4hr 3min"`) |
| `data.inventoryStatus` | When `inventoryStatus: true` in heartbeatConfiguration — `rfidStatus`, `tagCount`, `scanCount` |
| `data.batteryAlert` | When `batteryStatus: true` — `status`, `stateOfHealth` (`GOOD`/`AVERAGE`/`POOR`), `chargePercentage` |

### Interval choice

Short intervals (10–30 s) detect outages quickly and provide fine-grained telemetry; cost is battery and traffic. Long intervals (60–300 s) conserve both; cost is detection latency. Reasonable defaults sit at 60 s for warehouse fleets, longer for battery-constrained deployments.

### Correlating with other events

A reader emitting normal heartbeats while `alerts` and `mqttConnEVT` flow normally is healthy. Heartbeats stopping without an accompanying `mqttConnEVT: DISCONNECTED` indicates a broker- or network-side issue. Heartbeats with rising `batteryAlert.chargePercentage` drop predict imminent low-battery alerts.

**Related:** 📕 [§16.6 heartBeatEVT schema](#chapter-16--mqtt-api-reference) · 📙 [§11.3 Configure Events](/observability/events/configure) · 📙 [§12.1 Check Health](/observability/monitoring/device-health)
