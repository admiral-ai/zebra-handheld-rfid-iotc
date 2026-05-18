---
id: device-state
title: What your reader knows about itself
sidebar_label: What your reader knows about itself
---

> 📘 **EXPLANATION** · Audience: All personas · Read time: ~5 min · Ties to the Device Status sub-tag of the API Reference

> **See in the API Reference**
> Sub-tag: Device Status. Operations: `get_status`, `get_version`, `get_current_region`.

### What the three operations return

The Device Status sub-tag exposes three read-only operations. Each answers a different question.

| Operation | Question | Returns |
|---|---|---|
| `get_status` | What is the reader doing right now? | Runtime status: `powerSource`, `radioActivity`, `radioConnection`, `systemTime`, `temperature`, NTP, `terminalConnection`, `batteryStatus`. |
| `get_version` | Who is this reader and what software does it run? | Identity: `firmwareVersion`, `model`, `serialNumber`, `sku`, `companyName`, and detailed component versions. |
| `get_current_region` | Which regulatory region is this reader transmitting under? | Region: regulatory standard (FCC, ETSI, IC), allowed channels, max and min transmit power, country, and frequency hopping setting. |

### Three points readers often confuse

`get_status` does not return firmware version. That information is in `get_version`.

`get_current_region` is read-only over MQTT. The region is set out-of-band via 123RFID Desktop over USB. There is no `set_region` MQTT command.

`get_status.terminalConnection` is only meaningful on Bipartite sleds (RFD40 Standard). On Monolithic sleds (Premium, Premium Plus, RFD90) it reports the Bluetooth or eConnex peripheral link only when a host is attached.

### When to call each

Call `get_status` and `get_version` at application startup, and on every `mqttConnEVT.CONNECTED`. Use the result to populate or refresh your model of each reader.

On reader reboot, the management endpoint configuration persists, but runtime state is reset. Re-query.

Before a firmware update via `set_os`, call `get_version` to record the current firmware so a rollback target is known.

### Schema reference

Field-by-field detail for each response payload lives in the API Reference under the Device Status sub-tag.

### Related

[Getting on the network (Wi-Fi and Ethernet)](/infrastructure/network/architecture) · [The reader's configuration document](/infrastructure/management/config-document) · [Updating firmware and rebooting](/infrastructure/management/system-operations) · [Watch your reader's pulse](/observability/events/heartbeat).
