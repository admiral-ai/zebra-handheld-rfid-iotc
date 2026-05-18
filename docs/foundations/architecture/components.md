---
id: components
title: Reader, Host, Broker, Application — who does what
sidebar_label: Reader, Host, Broker, Application — who does what
---

> 📘 **EXPLANATION** · Audience: Solution Builder · Read time: ~5 min

The IOTC deployment is the cooperation of five components. Knowing what each one is responsible for is the first step toward designing a system you can debug.

[DIAGRAM: D-2.2.A — component block diagram with responsibility ownership arrows]

### Reader Firmware (IOTC Agent)

The firmware running on the sled implements the MQTT client, manages the RFID radio, and exposes every IOTC endpoint as an MQTT message handler. It is responsible for: parsing incoming commands, executing them against the RFID and management subsystems, emitting responses and events, and maintaining the MQTT connection through the host device. From the application's perspective, the firmware *is* the reader.

### MQTT Broker

The broker routes messages between readers and applications. It can be Zebra-hosted (the default, with credentials issued from the developer portal) or customer-provided (Mosquitto, HiveMQ, EMQX, AWS IoT Core, Azure IoT Hub, etc.). The broker enforces authentication and topic-level authorization. It is not a participant in IOTC's command semantics — it forwards messages without interpretation.

### Application Client

The customer's MQTT publisher/subscriber — the code that sends commands and consumes events. The application is responsible for command correlation (matching responses to requests), tag-data processing, deduplication, and integration with downstream systems. Applications can run anywhere with MQTT connectivity to the broker — on a backend server, in a cloud function, or in a mobile app.

### 123RFID Desktop

A Windows-only utility used **once** in a reader's life to set the regulatory region (which cannot be changed over MQTT), configure an initial Wi-Fi profile, and point the reader at its MDM endpoint. After this initial bootstrap, the reader is managed entirely via MQTT.

### MDM Platform (SOTI Connect)

Optional. Provides zero-touch provisioning, configuration profile distribution, firmware-update orchestration, and consumes the `alert_short` event. For deployments of more than a handful of readers, SOTI Connect (or a comparable MDM) is the recommended fleet management layer. See [§13.2 Zero-Touch Provisioning with SOTI Connect](/fleet/provisioning/soti-connect).

**Related:** 📘 [§3 MQTT Core Concepts](#chapter-3--mqtt-core-concepts) · 📘 [§13.1 Provisioning Models](/fleet/provisioning/models) · 📗 [§4.3 Reader Bootstrap with 123RFID Desktop](/getting-started/prerequisites/bootstrap) · 📕 [§16 API Reference](#chapter-16--mqtt-api-reference)
