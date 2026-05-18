---
id: two-edges
title: The two physical edges
sidebar_label: The two physical edges
---

> 📘 **EXPLANATION** · Audience: All personas in incident response · Read time: ~4 min

Diagnose any IOTC failure by first identifying **which physical edge** is broken. The number of edges depends on hardware tier.

### Path A (Monolithic) — one edge

RFD40 Premium, RFD40 Premium Plus, RFD90, and RFD9030 connect directly to the broker over Wi-Fi. There is one edge that can fail:

```
┌─────────────┐   Wi-Fi 6 (TLS)   ┌─────────┐         ┌──────────────┐
│ Reader sled │ ─────────────────→│ Broker  │────────→│ Application  │
└─────────────┘                   └─────────┘         └──────────────┘
                ↑ Edge 1 (Wi-Fi)
```

Failure on Edge 1 surfaces as:

- `mqttConnEVT` with `connectionState: DISCONNECTED` (if the sled was connected)
- Radio silence on the event topic (if it never came up)
- Wi-Fi association failure in 123RFID Desktop's Communication panel

### Path B (Bipartite) — two edges

RFD40 Standard pairs to a Zebra mobile computer over Bluetooth/eConnex. There are two edges that can fail:

```
┌────────────┐  BT / eConnex  ┌─────────────────┐  Wi-Fi/Cellular  ┌─────────┐   ┌──────────────┐
│ Reader sled│ ──────────────→│ Host (TC52/TC73)│ ────────────────→│ Broker  │──→│ Application  │
└────────────┘                └─────────────────┘                  └─────────┘   └──────────────┘
              ↑ Edge 1 (Reader-Host)             ↑ Edge 2 (Host-Broker)
```

Failure on **Edge 1 (Reader-Host)** surfaces as:

- `get_status.terminalConnection.status: DISCONNECTED` (queried from the host's perspective)
- Host application reports Bluetooth pairing loss
- Operators see no LED feedback on the sled when triggering

Failure on **Edge 2 (Host-Broker)** surfaces as:

- `mqttConnEVT` from the host's connection
- Host's MQTT client logs show TLS errors, refused connection, or timeout
- The broker side sees no connection from this host

### Signal-to-edge mapping

| Observable signal | Says something about |
|---|---|
| `mqttConnEVT` | The MQTT edge (Wi-Fi on Path A; Host-Broker on Path B) |
| `terminalConnection.status` | The Bluetooth/eConnex edge on Path B; the peripheral link state on Path A (when a host is attached) |
| `batteryStatus.chargeStatus` | The sled hardware (independent of either edge) |
| Wi-Fi association fail in 123RFID Desktop | The Wi-Fi edge on Path A |
| Bluetooth pairing loss on host | Edge 1 on Path B |
| Broker logs (refused connect, auth failure) | Edge 2 on Path B (or Edge 1 on Path A) |

### Diagnostic stance

Always answer one question before going deeper: **which edge is broken?** Most failures are localized to one edge. The signal-to-edge mapping above is the cheapest way to find out.

**Related:** [Symptom Index](/reference/diagnose/symptom-index) · [Recovery playbooks](/reference/diagnose/recovery-playbooks) · [Common misconceptions](/reference/diagnose/misconceptions).
