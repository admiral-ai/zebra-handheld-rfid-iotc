---
id: supported-hardware
title: "Which sled do you have? (Direct vs Bridged)"
sidebar_label: "Which sled do you have? (Direct vs Bridged)"
---

> 📘 **EXPLANATION** · **Audience:** New Integrator, Solution Builder · **Read time:** ~4 min

:::note Naming update
The two architecture tiers in this documentation are **Direct** and **Bridged**. Earlier drafts called them *Monolithic* and *Bipartite* respectively. If you have a bookmark or external reference using the older terms, this page is the canonical destination.
:::

The most consequential decision in IOTC is which **architecture tier** your sled belongs to. The same SKU label hides two very different network topologies. **Get the tier wrong and every later chapter mis-maps.**

### Two tiers, one product line

| Tier | Sleds | Network attach | Where IOTC runs |
|---|---|---|---|
| **🅓 Direct** | RFD40 Premium · RFD40 Premium Plus · RFD90 · RFD9030 | Native Wi-Fi 6 in firmware | Inside the sled |
| **🅑 Bridged** | RFD40 Standard | Bluetooth to a host device that bridges to MQTT | On the host (Android service / desktop bridge) |

The tier is a property of the SKU. You cannot upgrade a Standard sled to Direct, they ship different radios.

[DIAGRAM: D-2.2.A. side-by-side topology: Direct single-edge vs Bridged two-edge]

### How they differ in practice

**On a Direct sled** (Premium / Premium Plus / RFD90):

- The sled connects to Wi-Fi directly. The host mobile device is optional — useful for the operator UI, but not in the network path.
- One physical edge between the sled and the broker: **Reader ↔ Wi-Fi ↔ Broker**.
- The sled is the MQTT client. Credentials, certificates, and topic subscriptions all live in firmware.
- Reading the failure-mode chapter [Where things fail](/reference/diagnose/two-edges) requires considering **one** edge.

**On a Bridged sled** (RFD40 Standard):

- The sled has no Wi-Fi. It pairs to a host device over Bluetooth 5.0 LE; the host bridges to MQTT.
- Two physical edges: **Reader ↔ Host (BT/eConnex)** and **Host ↔ Broker**.
- The host is the MQTT client. Credentials, certificates, and topic subscriptions live on the host, not in the sled.
- Failure-mode diagnosis considers **two** edges; signals like `terminalConnection.status` are how you tell which edge is broken.

### Hardware capability matrix

| Capability | RFD40 Standard 🅑 | RFD40 Premium 🅓 | RFD40 Premium Plus 🅓 | RFD90 🅓 |
|---|---|---|---|---|
| RFID frequency | UHF Gen2 (region-set at first boot) | UHF Gen2 | UHF Gen2 | UHF Gen2 |
| Native Wi-Fi (on-sled radio) | **—** (depends on host's Wi-Fi) | Wi-Fi 6 | Wi-Fi 6 | Wi-Fi 6 |
| Bluetooth | 5.0 LE | 5.0 LE | 5.0 LE | 5.0 LE |
| Read range (typical) | ~6 m | ~6 m | ~6 m | **~21 m** |
| Internal antenna | Single, forward-facing | Single, forward-facing | Single, forward-facing | Single, higher-gain |
| Barcode scanner | — | **Yes** (1D/2D) | **Yes** (1D/2D) | Yes |
| Battery (typical) | 2,400 mAh | 2,400 mAh | 2,400 mAh | 3,000 mAh |
| Trigger button | Yes | Yes | Yes | Yes |
| Charging | USB-C · cradle | USB-C · cradle | USB-C · cradle | USB-C · cradle |
| External antenna ports | — | — | — | — |
| GPIO pins exposed via IOTC | — | — | — | — |
| Typical bootstrap tool | **123RFID Mobile** (Android, Bluetooth) | 123RFID Desktop (Windows, USB-C) | 123RFID Desktop (Windows, USB-C) | 123RFID Desktop (Windows, USB-C) |

**Note.** Premium Plus differs from Premium primarily in mechanical ruggedization and battery accessories; the IOTC surface is identical.

**On Wi-Fi for RFD40 Standard.** The Standard sled has no native Wi-Fi radio in firmware. The host device — typically a Zebra Enterprise mobile computer paired over Bluetooth — provides the network path to the broker. **Configuration of the host's Wi-Fi is out of IOTC scope** (it lives in the host's OS settings). Apart from this bootstrap-and-network difference, every IOTC command and event behaves identically on Bridged sleds; see [Two bootstrap tools: 123RFID Desktop and 123RFID Mobile](/foundations/introduction/bootstrap-tools).

[DIAGRAM: D-2.2.B. annotated sled illustration: antenna, trigger, USB-C, scanner window]

### How to identify your tier in seconds

- Powered off, look at the model label.
  - `RFD40SS-…` to Standard 🅑
  - `RFD40NP-…` or `RFD40HP-…` to Premium 🅓
  - `RFD9030-…` to RFD90 🅓
- Powered on, watch the LED behavior during bootstrap. On-sled Wi-Fi setup will only succeed on Direct tiers; Standard sleds show no Wi-Fi options because they have no Wi-Fi radio (the host provides the network path).
- From an existing deployment, the [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) response on Standard names the Bluetooth host bridge; on Direct, it names the in-firmware IOTC version.

### Minimum firmware

All chapters assume firmware **3.10.27 or later**. Earlier firmware lacks [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events), the [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) HTTP source, and several event flags. Older deployments will need a [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) update before the docs apply cleanly. See [Updating firmware and rebooting](/infrastructure/management/system-operations).

### What this implies for scope

Because every sled has one internal antenna, this documentation does **not** cover external-antenna selection, cable-loss compensation, or directionality settings; those exist only on fixed readers. Because every sled is battery-powered, the docs give sustained attention to battery lifecycle, the OPTIMAL_BATTERY profile, and heartbeat-emission cost. These are not caveats; they shape every chapter.

**Related:** 📘 [Roles: Reader, Host, Broker, Application](/foundations/architecture/components) · 📘 [Two bootstrap tools: 123RFID Desktop and 123RFID Mobile](/foundations/introduction/bootstrap-tools) · 📘 [How commands and responses flow](/foundations/architecture/communication-flow) · 📕 [Capacity and limits](/reference/diagnose/glossary) · 📕 [Regulatory & regional information](/reference/appendices/regulatory)
