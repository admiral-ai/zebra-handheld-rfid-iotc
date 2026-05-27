---
id: requirements
title: Hardware and software requirements
sidebar_label: Hardware & Software Requirements
description: "Phase 0 prerequisites: hardware (RFD40 or RFD90 sled, host, tags), software (123RFID tool, MQTT client), firmware baseline (3.10.27+)."
---

> 📕 **REFERENCE** · **Audience:** New Integrator · **Use:** pre-flight checklist

### Required hardware and software

- **Reader sled:** RFD40 or RFD90 with firmware **3.10.27 or later**.
- **Host mobile device** (required for Bridged 🅑 RFD40 Standard, optional for Direct 🅓): Android 11 or later. Supported models are listed at the Zebra developer portal under "Compatible Hosts" for the selected sled.
- **Bootstrap tool** — pick one based on your sled's tier:
  - **123RFID Desktop** (Windows 10/11) for Direct sleds (RFD40 Premium, Premium Plus, RFD90). Requires a USB-C cable for the first attach. Download from the Zebra developer portal.
  - **123RFID Mobile** (Android 7+ Nougat per the *123RFID Mobile User Guide*; Android 11+ recommended) for Bridged sleds (RFD40 Standard) — and optionally for Direct sleds when no Windows laptop is available. Pairs over Bluetooth via one of five methods (NFC tap, host-scans-sled, sled-scans-mobile, camera, or manual). Download free from the Google Play Store. See [How to pair the reader sled with a host](/quick-start/prerequisites/bluetooth-pairing) for the pairing-method availability matrix.
  - See [Two bootstrap tools: 123RFID Desktop and 123RFID Mobile](/foundations/bootstrap-tools) for the choice rationale.
- **MQTT client for testing:** `mosquitto_pub` / `mosquitto_sub`, MQTT Explorer, MQTTX, or any MQTT 3.1.1 client library.
- **Wi-Fi network** with outbound internet access to the broker (TCP/8883 for TLS, TCP/1883 for cleartext). On Direct sleds the sled itself joins this network; on Bridged sleds the **host device's Wi-Fi** carries the traffic (the Standard sled has no on-board Wi-Fi radio).
- **IOTC tenant credentials:** `tenantId`, MQTT username, MQTT password (see [How to Obtain IOTC Credentials & Tenant ID](/quick-start/prerequisites/credentials)).

### Firmware verification

Three verification surfaces exist:

- **Before bootstrap (Desktop):** 123RFID Desktop displays the firmware version in its device pane when the sled is connected via USB.
- **Before bootstrap (Mobile):** 123RFID Mobile shows firmware in the device-info screen after a successful Bluetooth pair.
- **After MQTT enrollment:** publish [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version). The response includes a `firmware` field and is identical across tiers.

If the reported version is below `3.10.27`, update via the firmware-update mechanism described in [Execute the migration](/fleet/migration/execute).

### Where to go next

Continue to [How to Obtain IOTC Credentials & Tenant ID](/quick-start/prerequisites/credentials) (if you are using the Zebra-hosted broker) and [How to Pair the Reader Sled with a Host](/quick-start/prerequisites/bluetooth-pairing) (Bridged sleds only). Then start [Phase 1: Prepare network and broker](/quick-start/phase-1).

**Related:** 📘 [Two bootstrap tools: 123RFID Desktop and 123RFID Mobile](/foundations/bootstrap-tools) · 📕 [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) · 📕 [Firmware history](/reference/appendices/firmware-history) · 📗 [Phase 2: Bootstrap (Direct or Bridged)](/quick-start/phase-2)
