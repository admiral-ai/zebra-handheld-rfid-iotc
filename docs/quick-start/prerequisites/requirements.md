---
id: requirements
title: Hardware and software requirements
sidebar_label: Hardware & software requirements
description: "Phase 0 prerequisites: hardware (RFD40 or RFD90 sled, tags), software (123RFID Desktop, MQTT client), firmware baseline (3.10.27+)."
---

> 📕 **REFERENCE** · **Audience:** New Integrator · **Use:** pre-flight checklist

### Required hardware and software

- **Reader sled:** RFD40 or RFD90 with firmware **3.10.27 or later**.
- **Bootstrap tool — 123RFID Desktop** (Windows 10/11) for the RFD40 Premium / Premium Plus / RFD90. Requires a USB-C cable for the first attach. Download from the Zebra developer portal. See [Bootstrapping with 123RFID Desktop](/foundations/bootstrap-tools) for the rationale.
- **MQTT client for testing:** `mosquitto_pub` / `mosquitto_sub`, MQTT Explorer, MQTTX, or any MQTT 3.1.1 client library.
- **Wi-Fi network** with outbound internet access to the broker (TCP/8883 for TLS, TCP/1883 for cleartext). The sled joins this network over its own Wi-Fi radio.
- **IOTC tenant credentials:** `tenantId`, MQTT username, MQTT password (see [How to Obtain IOTC Credentials & Tenant ID](/quick-start/prerequisites/credentials)).

### Firmware verification

Two verification surfaces exist:

- **Before bootstrap:** 123RFID Desktop displays the firmware version in its device pane when the sled is connected via USB.
- **After MQTT enrollment:** publish [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version). The response includes a `firmware` field.

If the reported version is below `3.10.27`, update via the firmware-update mechanism described in [Execute the migration](/fleet/migration/execute).

### Where to go next

Continue to [How to obtain IOTC credentials and tenant ID](/quick-start/prerequisites/credentials) (if you are using the Zebra-hosted broker). Then start [Phase 1: Prepare network and broker](/quick-start/phase-1).

**Related:** 📘 [Bootstrapping with 123RFID Desktop](/foundations/bootstrap-tools) · 📕 [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) · 📕 [Firmware history](/reference/appendices/firmware-history) · 📗 [Phase 2: Bootstrap the reader](/quick-start/phase-2)
