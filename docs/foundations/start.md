---
id: start
title: Start here
sidebar_label: Start here
description: Where to start with the Zebra IoT Connector (IOTC) docs for handheld RFID. Covers what IOTC is, what's in scope (RFD40 / RFD90 sleds), and where to go next.
---

> 📘 **EXPLANATION** · **Audience:** All personas · **Read time:** ~3 min

This documentation covers the **Zebra IoT Connector (IOTC) for handheld RFID**, the in-firmware MQTT control and data plane that turns an RFD40 or RFD90 sled into a network-addressable RFID node. It is the conceptual companion to the auto-generated MQTT API Reference.

### Scope

| In scope | Out of scope |
|---|---|
| RFD40 Premium, RFD40 Premium Plus, RFD90, RFD9030 | FX9600 · FX7500 · ATR7000 fixed readers (see [zebradevs.github.io/rfid-ziotc-docs](https://zebradevs.github.io/rfid-ziotc-docs)) |
| MQTT 3.1.1 native payloads (the field-validated transport) | OpenAPI-rendered REST shapes; see [The OpenAPI Illusion](/foundations/native-mqtt-vs-openapi) |
| Bootstrap via **123RFID Desktop** (Windows / USB-C) | The Android Service SDK and standalone barcode-only flows |
| SOTI Connect and 42Gears SureMDM fleet management | Generic Android MDM scenarios where IOTC is not enabled |

### What you'll find here

These chapters explain how IOTC is shaped, and why:

- The **four MQTT interfaces** — Management, Event, Control, Data, and the seven endpoint types that carry them (MGMT, MGMT_EVT, CTRL, DATA1, DATA2, MDM, SOTI).
- The **five supported operating-mode profiles** (a sixth, `FAST_READ`, is in the enum but not currently supported) and the read-rate ↔ battery ↔ interference triangle they navigate.
- Working mental models for tag observation, event flows, configuration drift, and fleet operations.
- A **symptom-first** diagnostic surface in Part 8, organized for incident response rather than topic browsing.

For exact command signatures, payload schemas, and the full error-code table, the MQTT API Reference is the source of truth.

### Reading paths

| Who you are | Where to start |
|---|---|
| New integrator on a Premium or RFD90 sled (Windows laptop) | [Your first 30 minutes](/quick-start/overview) |
| Coming from a fixed reader (FX9600 / FX7500 / ATR7000) | [What the IoT Connector is](/foundations/about-iotc) → [Which sled do you have?](/foundations/hardware-tiers) → [The OpenAPI Illusion](/foundations/native-mqtt-vs-openapi) |
| Coming from REST/HTTP, no MQTT exposure | [MQTT in five minutes](/foundations/mqtt-primer) first |
| Solution builder shaping an integration | [Roles: Reader, Broker, Application](/foundations/actors) → [How commands and responses flow](/foundations/communication-flow) |
| Fleet operator | [Going from one reader to a fleet](/fleet/provisioning-models) |
| In an incident right now | [Something's broken?](/diagnose/symptoms) |
| API consumer (look-up only) | MQTT API Reference (top nav) |

### A word on voice

Conceptual chapters explain *why* and *what*. The API Reference explains *how to call it*. If you find yourself looking for a command signature, you are on the wrong site — jump to the API Reference via the "See in the API Reference" callout at the top of each Part 4–6 chapter.

### Where to go next

New to MQTT? Read [MQTT in five minutes](/foundations/mqtt-primer). Already comfortable with MQTT? Skip to [Pairing the docs with the API Reference](/foundations/docs-and-api-reference).
