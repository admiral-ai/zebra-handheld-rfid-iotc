---
id: device-state
title: What your reader knows about itself
sidebar_label: What your reader knows about itself
---

> 📘 **EXPLANATION** · Audience: All personas · Read time: ~5 min · Ties to: **Device Status** sub-tag of the API Reference

> **See in the API Reference**
> Sub-tag: Device Status
> Operations: `get_status` · `get_version` · `get_current_region`

### What these three operations actually return

The Device Status sub-tag exposes three read-only operations. Each answers a different question.

| Operation | Question | Returns |
|---|---|---|
| `get_status` | "What is the reader doing right now?" | Runtime status: `powerSource`, `radioActivity`, `radioConnection`, `systemTime`, `temperature`, NTP, `terminalConnection`, `batteryStatus` |
| `get_version` | "Who is this reader and what software does it run?" | Identity: `firmwareVersion`, `model`, `serialNumber`, `sku`, `companyName`, detailed component versions |
| `get_current_region` | "Which regulatory region is this reader transmitting under?" | Region: regulatory standard (FCC, ETSI, IC), allowed channels, max/min transmit power, country, frequency hopping setting |

### The three things readers most often confuse

- **`get_status` does not return firmware version.** That is `get_version`.
- **`get_current_region` is read-only over MQTT.** Region is set out-of-band via 123RFID Desktop over USB. There is no `set_region` MQTT command.
- **`get_status.terminalConnection` is only meaningful on Bipartite sleds (RFD40 Standard).** On Monolithic sleds (Premium/Premium Plus/RFD90) it reports the Bluetooth/eConnex peripheral link only when a host is attached.

### When to call each

- **At application startup, after every `mqttConnEVT.CONNECTED`:** call `get_status` and `get_version`. Use the result to populate or refresh your model of each reader.
- **On reader reboot:** the management endpoint configuration persists, but runtime state is reset. Re-query.
- **Before a firmware update (`set_os`):** call `get_version` to record the current firmware so a rollback target is known.

### Schema reference

Field-by-field detail for each response payload lives in the API Reference under the **Device Status** sub-tag.

**Related:** [Network configuration](/infrastructure/network/architecture) · [The configuration document](/infrastructure/management/config-document) · [System operations](/infrastructure/management/system-operations) · [Device health and heartbeats](/observability/events/heartbeat).
