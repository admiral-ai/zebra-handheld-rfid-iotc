---
id: mqtt-connection
title: About MQTT Connection Events
sidebar_label: About MQTT Connection Events
---

> 📘 **EXPLANATION** · Audience: Fleet Operator · Read time: ~3 min

`mqttConnEVT` events surface MQTT connection state transitions. The schema enum supports **two states only**: `CONNECTED` and `DISCONNECTED`.

### Payload

| Field | Description |
|---|---|
| `connectionState` | `CONNECTED` or `DISCONNECTED` |
| `timestamp` | Time of the transition |
| `deviceModel` | `RFD40` or `RFD90` |
| `deviceSerialNo` | Reader serial |
| `apiVersion` | `1.0` or `1.1` |
| `mqttVersion` | `3.1.1` |

### How reconnects appear

A reconnect after a drop appears as a fresh `CONNECTED` event following an earlier `DISCONNECTED`. There is no separate "RECONNECTING" or "CONNECTING" state in the schema.

### Operational use

Combined with `heartBeatEVT`, this event answers the operational question "is this reader online right now?" A reader whose last `mqttConnEVT` was `CONNECTED` and whose `heartBeatEVT` arrived within the last 3× heartbeat interval is online; anything else is suspect.

**Related:** 📕 [§16.6 mqttConnEVT schema](#chapter-16--mqtt-api-reference) · 📘 [§3.4 Connection Lifecycle](/foundations/mqtt/connection-lifecycle) · 📙 [§12.3 Connection Quality](/observability/monitoring/connection-quality)
