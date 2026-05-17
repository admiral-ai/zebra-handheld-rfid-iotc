---
id: model
title: 11.1 About the Event Model
sidebar_label: 11.1 Event Model
---

# About the Event Model

<div className="badge-explanation">EXPLANATION</div>

IOTC defines **five** events emitted by the reader:

| Event | Purpose |
|---|---|
| `dataEVT` | Tag-data stream during inventory |
| `heartBeatEVT` | Periodic liveness beacon |
| `alerts` | Threshold-driven full alert payload |
| `alert_short` | Compact alert format primarily consumed by MDM platforms |
| `mqttConnEVT` | MQTT connection state transitions |

## What is not currently emitted

Per the `alerts` schema description, event categories such as antenna events, exception events, CPU usage, GPI, and user-app info are configured in `config_events` but are **not currently emitted** by the firmware.

## Configuration paths

Event configuration is reachable through two equivalent paths:
- `config_events` — shortcut applying to the active endpoint
- `config_endpoint` — full per-endpoint control via the `eventConfiguration` sub-object
