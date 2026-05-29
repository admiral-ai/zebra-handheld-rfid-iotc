---
id: connection-quality
title: How to monitor connection quality
sidebar_label: How to Monitor Connection Quality
description: "Monitor IOTC reader MQTT connection quality: mqttConnEVT reconnect counts, terminalConnection bounces (Bridged), Wi-Fi RSSI, broker drop signals."
---

> 📙 **HOW-TO** · **Audience:** Fleet Operator · **Time:** ~10 min

This guide shows you how to monitor the connection quality of a handheld reader continuously.

### Wi-Fi signal strength

The `heartbeatEVT.data.wifi_rssi` field reports the current Wi-Fi signal strength. Typical operational range: −40 to −70 dBm. Sustained values below −75 dBm indicate marginal Wi-Fi; the reader may roam between APs frequently.

### Bluetooth link quality

The `heartbeatEVT.data.bt_link_quality` field reports the BT link health (0–100 scale). Values below 40 indicate degraded BT — operator may be moving in and out of range or operating in an RF-noisy environment.

### MQTT connection stability

Maintain a count of `mqttConnEVT` transitions per reader over rolling windows. A reader with more than 10 reconnects per hour likely has a connectivity issue — Wi-Fi roaming, BT instability, or broker capacity.

```d2
classes: {
  good: { style: { fill: "#e6f4ea"; stroke: "#1e8e3e"; font-color: "#137333" } }
  warn: { style: { fill: "#fef7e0"; stroke: "#f9ab00"; font-color: "#b06000" } }
  bad:  { style: { fill: "#fce8e6"; stroke: "#d93025"; font-color: "#c5221f" } }
}
direction: right
T1: "t=0\nheartbeat" { class: good }
T2: "t=60\nheartbeat" { class: good }
T3: "t=90\nmqttConnEVT\nDISCONNECTED" { class: bad }
T4: "t=95\nmqttConnEVT\nCONNECTED" { class: good }
T5: "t=120\nheartbeat\n(gap detected)" { class: warn }
T1 -> T2 -> T3 -> T4 -> T5

```

### Correlating to environmental causes

| Pattern | Likely cause |
|---|---|
| Wi-Fi RSSI degrades during certain shift hours | RF interference from other equipment |
| BT link quality drops when operator walks far from host | Host should be carried, not stationary |
| Reconnects coincident with AP boundaries | Wi-Fi roaming; check AP placement and channels |
| Reconnects with no Wi-Fi/BT signal correlation | Investigate broker or upstream network |

**Related:** 📕 [heartbeatEVT and mqttConnEVT](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#tag-heartbeatevt) · 📘 [MQTT Connection Events](/observability/mqtt-connection) · 📙 [Connection Troubleshooting](/reference/troubleshooting/connection)
