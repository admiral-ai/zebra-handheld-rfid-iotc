---
id: requirements
title: Hardware & Software Requirements
sidebar_label: Hardware & Software Requirements
---

> 📕 **REFERENCE** · Audience: New Integrator · Use: pre-flight checklist

### Required hardware and software

- Reader sled: RFD40 or RFD90 with firmware **3.10.27 or later**
- Host mobile device: Android 11 or later. Supported models are listed at the Zebra developer portal under "Compatible Hosts" for the selected sled.
- 123RFID Desktop: Windows 10 or Windows 11; current version from the Zebra developer portal
- USB-C cable for the 123RFID Desktop bootstrap step
- MQTT client for testing: `mosquitto_pub` / `mosquitto_sub`, MQTT Explorer, or any MQTT 3.1.1 client library
- Wi-Fi network with outbound internet access to the broker (TCP/8883 for TLS, TCP/1883 for cleartext)
- IOTC tenant credentials: `tenantId`, MQTT username, MQTT password (see [§4.2](/getting-started/prerequisites/credentials))

### Firmware verification

Two verification surfaces exist:

- **Before bootstrap:** 123RFID Desktop displays the firmware version in its device pane when the sled is connected via USB.
- **After MQTT enrollment:** publish `get_version` (see [§16.2](#chapter-16--mqtt-api-reference)). The response includes a `firmware` field.

If the reported version is below `3.10.27`, update via the firmware-update mechanism described in [§14.6](/fleet/migration/execute).

**Related:** 📕 [§16.2 get_version](#chapter-16--mqtt-api-reference) · 📕 [§20.3 Firmware History](/reference/appendices/firmware-history) · 📗 [§4.3 Bootstrap](/getting-started/prerequisites/bootstrap)
