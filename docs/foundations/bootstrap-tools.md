---
id: bootstrap-tools
title: "Bootstrapping with 123RFID Desktop"
sidebar_label: "Bootstrapping with 123RFID Desktop"
description: "123RFID Desktop (Windows, USB-C) is the IOTC first-light tool: set the regulatory region, Wi-Fi, and the MDM endpoint before the reader can speak MQTT."
---

> 📘 **EXPLANATION** · **Audience:** New Integrator, Solution Builder · **Read time:** ~4 min

A sled out of the box has no regulatory region, no Wi-Fi credentials, and no broker target. **None of these can be set over MQTT** — they have to be delivered over the very connection they enable. Zebra ships **123RFID Desktop** (Windows 10 / 11, free from `support.zebra.com`) to close that gap over a direct USB-C attach.

### Why a bootstrap tool exists

The reader cannot accept MQTT commands until it has joined Wi-Fi and has an active MDM endpoint pointing at your broker. That is a chicken-and-egg problem: you cannot configure the MQTT path *over* MQTT. 123RFID Desktop solves it out-of-band — you connect the sled to a Windows laptop with a USB-C cable, set the essentials, and the sled comes online on its own Wi-Fi radio. After that the laptop is no longer in the path.

### What it does

| Bootstrap step | 123RFID Desktop |
|---|---|
| Discover and attach the sled | Click **FIND READERS**, connect over USB-C |
| Set the regulatory region | **Region** tab → choose country → **Apply** |
| Configure Wi-Fi | Communication → Wi-Fi → Scan and Choose Network |
| Configure the MDM endpoint | Communication → **End Point** → **New** |
| Activate and verify the bootstrap connection | End Point Status → **Activate** → **Refresh** |

The full step-by-step walkthrough with screenshots is [Phase 2: Bootstrap with 123RFID Desktop](/quick-start/phase-2).

### What doesn't change after bootstrap

Once the MDM endpoint is active and the sled is talking to your broker, the bootstrap tool is out of the loop. Everything you do from then on is plain MQTT:

- The full MQTT command surface is identical across every sled.
- Event semantics (`heartbeatEVT`, `alerts`, `mqttConnEVT`, `dataEVT`) are identical.
- Topic structure (`<tenantId>/<topic>/<deviceSerialNumber>`) is identical.
- Endpoint types (MGMT, MGMT_EVT, CTRL, DATA1, DATA2, MDM) are identical.
- The retention buffer, QoS settings, TLS handshake, and certificate management are identical.

### Out of scope

- **The full bootstrap walkthrough (with screenshots)**: see [Phase 2: Bootstrap with 123RFID Desktop](/quick-start/phase-2).
- **Model identification by SKU label**: see [Which sled do you have?](/foundations/hardware-tiers).

**Related:** 📘 [Which sled do you have?](/foundations/hardware-tiers) · 📘 [Roles: Reader, Broker, Application](/foundations/actors) · 📗 [Phase 2: Bootstrap with 123RFID Desktop](/quick-start/phase-2) · 📘 [Going from one reader to a fleet](/fleet/provisioning-models)
