---
id: two-edges
title: Where things fail
sidebar_label: Where things fail
---

> 📘 **EXPLANATION** · Audience: All personas in incident response · Read time: ~4 min

Diagnose any IOTC failure by first identifying which physical edge is broken. The number of edges depends on hardware tier.

### Path A (Monolithic): one edge

RFD40 Premium, RFD40 Premium Plus, RFD90, and RFD9030 connect directly to the broker over Wi-Fi. There is one edge that can fail.

```
┌─────────────┐   Wi-Fi 6 (TLS)   ┌─────────┐         ┌──────────────┐
│ Reader sled │ ─────────────────>│ Broker  │────────>│ Application  │
└─────────────┘                   └─────────┘         └──────────────┘
                ↑ Edge 1 (Wi-Fi)
```

A failure on Edge 1 surfaces in one of three ways:

- `mqttConnEVT` with `connectionState: DISCONNECTED`, if the sled was previously connected.
- Radio silence on the event topic, if the sled never came up.
- A Wi-Fi association failure in the 123RFID Desktop Communication panel.

### Path B (Bipartite): two edges

RFD40 Standard pairs to a Zebra mobile computer over Bluetooth or eConnex. There are two edges that can fail.

```
┌────────────┐  BT / eConnex  ┌─────────────────┐  Wi-Fi/Cellular  ┌─────────┐   ┌──────────────┐
│ Reader sled│ ──────────────>│ Host (TC52/TC73)│ ────────────────>│ Broker  │──>│ Application  │
└────────────┘                └─────────────────┘                  └─────────┘   └──────────────┘
              ↑ Edge 1 (Reader-Host)             ↑ Edge 2 (Host-Broker)
```

A failure on Edge 1 (Reader-Host) surfaces in one of three ways:

- `get_status.terminalConnection.status: DISCONNECTED`, queried from the host's perspective.
- The host application reports Bluetooth pairing loss.
- Operators see no LED feedback on the sled when triggering.

A failure on Edge 2 (Host-Broker) surfaces in one of three ways:

- `mqttConnEVT` from the host's connection.
- The host's MQTT client logs show TLS errors, refused connection, or timeout.
- The broker side sees no connection from this host.

### Signal-to-edge mapping

| Observable signal | What it says about |
|---|---|
| `mqttConnEVT` | The MQTT edge: Wi-Fi on Path A; Host-Broker on Path B. |
| `terminalConnection.status` | The Bluetooth or eConnex edge on Path B. On Path A, the peripheral link state when a host is attached. |
| `batteryStatus.chargeStatus` | The sled hardware, independent of either edge. |
| Wi-Fi association failure in 123RFID Desktop | The Wi-Fi edge on Path A. |
| Bluetooth pairing loss on the host | Edge 1 on Path B. |
| Broker logs (refused connect, auth failure) | Edge 2 on Path B, or Edge 1 on Path A. |

### Diagnostic stance

Always answer one question before going deeper: which edge is broken? Most failures are localized to a single edge. The signal-to-edge mapping above is the cheapest way to find out.

### Related

[Something's broken?](/reference/diagnose/symptom-index) · [Playbooks for getting back online](/reference/diagnose/recovery-playbooks) · [Common misconceptions](/reference/diagnose/misconceptions).
