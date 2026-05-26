---
id: about
title: Start here
sidebar_label: Start here
---

> 📘 **EXPLANATION** · **Audience:** All personas · **Read time:** ~3 min

This documentation covers the **Zebra IoT Connector (IOTC) for handheld RFID**, the in-firmware MQTT control and data plane that turns an RFD40 or RFD90 sled into a network-addressable RFID node. It is the conceptual companion to the auto-generated MQTT API Reference.

### Scope

| In scope | Out of scope |
|---|---|
| RFD40 Standard, RFD40 Premium, RFD40 Premium Plus, RFD90, RFD9030 | FX9600 · FX7500 · ATR7000 fixed readers (see [zebradevs.github.io/rfid-ziotc-docs](https://zebradevs.github.io/rfid-ziotc-docs)) |
| MQTT 3.1.1 native payloads (the field-validated transport) | OpenAPI-rendered REST shapes; see [The OpenAPI Illusion](/foundations/native-mqtt-vs-openapi) |
| Bootstrap via **123RFID Desktop** (Windows / USB-C, Direct sleds) and **123RFID Mobile** (Android / Bluetooth, Bridged sleds) | The Android Service SDK and standalone barcode-only flows |
| SOTI Connect and 42Gears SureMDM fleet management | Generic Android MDM scenarios where IOTC is not enabled |

### What you'll find here

These chapters explain how IOTC is shaped, and why:

- The **hardware-tier fork** that decides every later choice: Direct (Premium / Premium Plus / RFD90) versus Bridged (RFD40 Standard).
- The **four MQTT interfaces** — Management, Event, Control, Data, and the seven endpoint types that carry them (MGMT, MGMT_EVT, CTRL, DATA1, DATA2, MDM, SOTI).
- The **five supported operating-mode profiles** (a sixth, `FAST_READ`, is in the enum but not currently supported) and the read-rate ↔ battery ↔ interference triangle they navigate.
- Working mental models for tag observation, event flows, configuration drift, and fleet operations.
- A **symptom-first** diagnostic surface in Part 8, organized for incident response rather than topic browsing.

For exact command signatures, payload schemas, and the full error-code table, the MQTT API Reference is the source of truth.

### Reading paths

| Who you are | Where to start |
|---|---|
| New integrator on a Premium or RFD90 sled (Windows laptop) | [Your first 30 minutes](/getting-started/quick-start/overview), Setup Path A (Direct, 123RFID Desktop) |
| New integrator on a Standard sled (Android host) | [Two bootstrap tools](/foundations/bootstrap-tools) → pair via [Bluetooth pairing](/getting-started/prerequisites/bluetooth-pairing) → bootstrap with 123RFID Mobile |
| New integrator on Premium / RFD90 without a Windows laptop | [Two bootstrap tools](/foundations/bootstrap-tools) — use 123RFID Mobile over Bluetooth |
| Coming from a fixed reader (FX9600 / FX7500 / ATR7000) | [What the IoT Connector is](/foundations/about-iotc) → [Which sled do you have?](/foundations/hardware-tiers) → [The OpenAPI Illusion](/foundations/native-mqtt-vs-openapi) |
| Coming from REST/HTTP, no MQTT exposure | [MQTT in five minutes](/foundations/mqtt/primer) first |
| Solution builder shaping an integration | [Roles: Reader, Host, Broker, Application](/foundations/actors) → [How commands and responses flow](/foundations/architecture/communication-flow) |
| Fleet operator | [Going from one reader to a fleet](/fleet/provisioning/models) |
| In an incident right now | [Something's broken?](/reference/diagnose/symptom-index) |
| API consumer (look-up only) | MQTT API Reference (top nav) |

### Tier badges

Chapters that depend on hardware tier carry a badge. **🅓** marks Direct (Premium, Premium Plus, RFD90 — native Wi-Fi 6, USB-C bootstrap via 123RFID Desktop). **🅑** marks Bridged (RFD40 Standard: no on-sled Wi-Fi; reaches the broker through the host's Wi-Fi over a Bluetooth bridge; bootstrap via 123RFID Mobile). **🅓🅑** marks both. The IoTC MQTT surface is identical across tiers once bootstrap completes; the badge tells you only about first-light and network topology. Look for it before reading; your wrong-tier reading wastes time. See [Two bootstrap tools](/foundations/bootstrap-tools) for the rationale.

### A word on voice

Conceptual chapters explain *why* and *what*. The API Reference explains *how to call it*. If you find yourself looking for a command signature, you are on the wrong site — jump to the API Reference via the "See in the API Reference" callout at the top of each Part 4–6 chapter.

### Where to go next

New to MQTT? Read [MQTT in five minutes](/foundations/mqtt/primer). Already comfortable with MQTT? Skip to [Pairing the docs with the API Reference](/foundations/docs-and-api-reference).
