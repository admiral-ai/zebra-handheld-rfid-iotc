---
id: about
title: About this documentation
sidebar_label: About this documentation
---

> 📘 **EXPLANATION** · Audience: All personas · Read time: ~2 min

This documentation covers the **Zebra IoT Connector (IOTC)** for the handheld RFID reader sled family: **RFD40 Standard**, **RFD40 Premium**, **RFD40 Premium Plus**, **RFD90**, and **RFD9030**. The IOTC is an in-firmware MQTT control and data plane that turns the sled into a network-addressable RFID node.

### What you'll find here

These docs are the **conceptual** companion to the auto-generated MQTT API Reference. They cover:

- How IOTC is shaped and why it is the way it is
- The hardware-tier fork that decides every later choice (Monolithic vs Bipartite)
- The four MQTT interfaces (Management, Event, Control, Data) and how they fit together
- Working mental models for tag reads, event flows, configuration drift, fleet operations
- A symptom-first diagnostic surface for recovery

For exact command signatures, payload schemas, and error codes, the **MQTT API Reference** is the source of truth.

### Reading paths

| If you are a … | Start at |
|---|---|
| New integrator on a Premium/RFD90 sled | [Your first 30 minutes](/quick-start/first-30-minutes) (Setup Path A) |
| New integrator on a Standard sled | [Your first 30 minutes](/quick-start/first-30-minutes) (Setup Path B) |
| Solution builder shaping an integration | [What the IoT Connector is](/foundations/introduction/about-iotc) → [Hardware tiers](/foundations/introduction/supported-hardware) |
| Fleet operator | [Fleet provisioning paths](/fleet/provisioning/models) |
| API consumer (look-up only) | MQTT API Reference (see top nav) |

### Convention: tier badges

Chapters that depend on hardware tier carry a tier badge: 🅐 for Monolithic (Premium / Premium Plus / RFD90), 🅑 for Bipartite (RFD40 Standard), 🅐🅑 if both.

**Next:** New to MQTT? Read [MQTT in five minutes](/foundations/mqtt/primer). MQTT-literate? Skip to [How to use these docs alongside the API Reference](/foundations/orient/docs-and-api-ref).
