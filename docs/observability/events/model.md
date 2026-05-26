---
id: model
title: About the Event Model
sidebar_label: About the Event Model
---

> 📘 **EXPLANATION** · Audience: All · Read time: ~5 min

IOTC defines **five** events emitted by the reader:

| Event | Purpose |
|---|---|
| `dataEVT` | Tag-data stream during inventory |
| `heartbeatEVT` | Periodic liveness beacon |
| `alerts` | Threshold-driven full alert payload |
| `alert_short` | Compact alert format primarily consumed by MDM platforms |
| `mqttConnEVT` | MQTT connection state transitions |

### What is not currently emitted

Per the `alerts` schema description, the following event categories are configured in [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) but are **not currently emitted** by the firmware: antenna events, exception events, CPU usage alerts, GPI events, user-app info. Setting these flags has no effect on V1.1 firmware.

### How events are routed

Each event flows on the **publish topics of the endpoint(s) configured to emit it**. An endpoint's `eventConfiguration` flags control which events that endpoint emits. The same physical event (e.g., a heartbeat) can be emitted on multiple endpoints if each is configured to enable it.

### Configuration paths

Event configuration is reachable through two equivalent paths:

- [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events): shortcut that applies to the **currently active** endpoint's event configuration.
- [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint): full per-endpoint control via the `eventConfiguration` sub-object of `epConfig`.

[`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) is the convenient default; [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) is the full surface for fleet-scale per-endpoint configuration.

**Related:** 📕 [Event Catalog](/observability/events/catalog) · 📕 [Events Reference](/reference/api-overview) · 📘 [Heartbeats](/observability/heartbeat) · 📘 [Alerts](/observability/alerts) · 📘 [MQTT Connection](/observability/mqtt-connection)
