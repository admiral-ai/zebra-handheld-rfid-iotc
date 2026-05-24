---
id: requirements
title: Hardware & Software Requirements
sidebar_label: Hardware & Software Requirements
---

> 📕 **REFERENCE** · **Audience:** New Integrator · **Use:** pre-flight checklist

### Required hardware and software

- **Reader sled:** RFD40 or RFD90 with firmware **3.10.27 or later**.
- **Host mobile device** (required for Bridged 🅑 RFD40 Standard, optional for Direct 🅓): Android 11 or later. Supported models are listed at the Zebra developer portal under "Compatible Hosts" for the selected sled.
- **Bootstrap tool** — pick one based on your sled's tier:
  - **123RFID Desktop** (Windows 10/11) for Direct sleds (RFD40 Premium, Premium Plus, RFD90). Requires a USB-C cable for the first attach. Download from the Zebra developer portal.
  - **123RFID Mobile** (Android 7+ Nougat per the *123RFID Mobile User Guide*; Android 11+ recommended) for Bridged sleds (RFD40 Standard) — and optionally for Direct sleds when no Windows laptop is available. Pairs over Bluetooth via one of five methods (NFC tap, host-scans-sled, sled-scans-mobile, camera, or manual). Download free from the Google Play Store. See [How to pair the reader sled with a host](/getting-started/prerequisites/bluetooth-pairing) for the pairing-method availability matrix.
  - See [Two bootstrap tools: 123RFID Desktop and 123RFID Mobile](/foundations/introduction/bootstrap-tools) for the choice rationale.
- **MQTT client for testing:** `mosquitto_pub` / `mosquitto_sub`, MQTT Explorer, MQTTX, or any MQTT 3.1.1 client library.
- **Wi-Fi network** with outbound internet access to the broker (TCP/8883 for TLS, TCP/1883 for cleartext). On Direct sleds the sled itself joins this network; on Bridged sleds the **host device's Wi-Fi** carries the traffic (the Standard sled has no on-board Wi-Fi radio).
- **IOTC tenant credentials:** `tenantId`, MQTT username, MQTT password (see [§4.2](/getting-started/prerequisites/credentials)).

### Firmware verification

Three verification surfaces exist:

- **Before bootstrap (Desktop):** 123RFID Desktop displays the firmware version in its device pane when the sled is connected via USB.
- **Before bootstrap (Mobile):** 123RFID Mobile shows firmware in the device-info screen after a successful Bluetooth pair.
- **After MQTT enrollment:** publish [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) (see [§16.2](#chapter-16--mqtt-api-reference)). The response includes a `firmware` field and is identical across tiers.

If the reported version is below `3.10.27`, update via the firmware-update mechanism described in [§14.6](/fleet/migration/execute).

**Related:** 📘 [Two bootstrap tools: 123RFID Desktop and 123RFID Mobile](/foundations/introduction/bootstrap-tools) · 📕 [§16.2 get_version](#chapter-16--mqtt-api-reference) · 📕 [§20.3 Firmware History](/reference/appendices/firmware-history) · 📗 [Phase 2: Bootstrap with 123RFID Desktop](/getting-started/quick-start/step-2-discover)
