---
id: connection-quality
title: How to monitor connection quality
sidebar_label: How to Monitor Connection Quality
description: "Monitor IOTC reader MQTT connection quality: mqttConnEVT reconnect counts, terminalConnection bounces (Bridged), Wi-Fi RSSI, broker drop signals."
---

> 📙 **HOW-TO** · Audience: Fleet Operator · Time: ~10 min

This guide shows you how to monitor the connection quality of a handheld reader continuously.

### Wi-Fi signal strength

The `heartbeatEVT.data.wifi_rssi` field reports the current Wi-Fi signal strength. Typical operational range: −40 to −70 dBm. Sustained values below −75 dBm indicate marginal Wi-Fi; the reader may roam between APs frequently.

### Bluetooth link quality

The `heartbeatEVT.data.bt_link_quality` field reports the BT link health (0–100 scale). Values below 40 indicate degraded BT — operator may be moving in and out of range or operating in an RF-noisy environment.

### MQTT connection stability

Maintain a count of `mqttConnEVT` transitions per reader over rolling windows. A reader with more than 10 reconnects per hour likely has a connectivity issue — Wi-Fi roaming, BT instability, or broker capacity.

```mermaid
flowchart LR
  T1["t=0<br/>heartbeat"] --> T2["t=60<br/>heartbeat"]
  T2 --> T3["t=90<br/>mqttConnEVT<br/>DISCONNECTED"]
  T3 --> T4["t=95<br/>mqttConnEVT<br/>CONNECTED"]
  T4 --> T5["t=120<br/>heartbeat<br/>(gap detected)"]
  classDef ok fill:#e8f5e8,stroke:#1b5e20,color:#1b5e20
  classDef warn fill:#fff3e0,stroke:#e65100,color:#e65100
  classDef err fill:#fce4ec,stroke:#880e4f,color:#880e4f
  class T1,T2,T4 ok
  class T3 err
  class T5 warn
```

### Correlating to environmental causes

| Pattern | Likely cause |
|---|---|
| Wi-Fi RSSI degrades during certain shift hours | RF interference from other equipment |
| BT link quality drops when operator walks far from host | Host should be carried, not stationary |
| Reconnects coincident with AP boundaries | Wi-Fi roaming; check AP placement and channels |
| Reconnects with no Wi-Fi/BT signal correlation | Investigate broker or upstream network |

**Related:** 📕 [heartbeatEVT and mqttConnEVT](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#tag-heartbeatevt) · 📘 [MQTT Connection Events](/observability/mqtt-connection) · 📙 [Connection Troubleshooting](/reference/troubleshooting/connection)
