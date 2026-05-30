---
id: hardware-tiers
title: "Which sled do you have?"
sidebar_label: "Which sled do you have?"
description: "Zebra RFD40 / RFD90 sleds run IOTC in firmware and connect to your MQTT broker over their own Wi-Fi 6 radio. Tell the models apart by SKU and capability."
---

> 📘 **EXPLANATION** · **Audience:** New Integrator, Solution Builder · **Read time:** ~4 min

Every IOTC sled runs the IoT Connector **in its own firmware** and connects to your MQTT broker over its **own Wi-Fi 6 radio**. There is a single network edge between the reader and the broker — **Reader ↔ Wi-Fi ↔ Broker** — and the sled itself is the MQTT client. Credentials, certificates, and topic subscriptions all live in the sled's firmware.

```d2
direction: right
R: "Reader\n(Wi-Fi 6, IOTC in firmware)"
B: Broker { shape: queue }
A: Application
R -> B: native MQTT
B -> A
```

### One product line, three models

| Model | Read range (typical) | Barcode scanner | Battery (typical) |
|---|---|---|---|
| **RFD40 Premium** | ~6 m | Yes (1D/2D) | 2,400 mAh |
| **RFD40 Premium Plus** | ~6 m | Yes (1D/2D) | 2,400 mAh |
| **RFD90 / RFD9030** | **~21 m** | Yes | 3,000 mAh |

All models share the same IOTC surface: UHF Gen2 RFID (region-set at first boot), native Wi-Fi 6, a single forward-facing internal antenna, a trigger button, and USB-C / cradle charging. **Premium Plus** differs from **Premium** primarily in mechanical ruggedization and battery accessories; the IOTC surface is identical.

### How to identify your model in seconds

- Powered off, look at the model label:
  - `RFD40NP-…` or `RFD40HP-…` → RFD40 Premium / Premium Plus
  - `RFD9030-…` → RFD90
- From an existing deployment, the [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) response names the model, SKU, firmware version, and the in-firmware IOTC version.

### Minimum firmware

All chapters assume firmware **3.10.27 or later**. Earlier firmware lacks [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events), the [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) HTTP source, and several event flags. Older deployments will need a [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) update before the docs apply cleanly. See [Updating firmware and rebooting](/infrastructure/system-operations).

### What this implies for scope

Because every sled has one internal antenna, this documentation does **not** cover external-antenna selection, cable-loss compensation, or directionality settings; those exist only on fixed readers. Because every sled is battery-powered, the docs give sustained attention to battery lifecycle, the OPTIMAL_BATTERY profile, and heartbeat-emission cost. These are not caveats; they shape every chapter.

**Related:** 📘 [Roles: Reader, Broker, Application](/foundations/actors) · 📘 [Bootstrapping with 123RFID Desktop](/foundations/bootstrap-tools) · 📘 [How commands and responses flow](/foundations/communication-flow) · 📕 [Capacity and limits](/reference/glossary) · 📕 [Regulatory & regional information](/reference/appendices/regulatory)
