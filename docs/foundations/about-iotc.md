---
id: about-iotc
title: What the IoT Connector is
sidebar_label: What the IoT Connector is
description: The Zebra IoT Connector (IOTC) is the in-firmware MQTT control and data plane for RFD40 / RFD90 handheld RFID sleds. What it does, scope, and how it differs.
---

> 📘 **EXPLANATION** · **Audience:** All personas · **Read time:** ~5 min

The Zebra IoT Connector (IOTC) for Handheld RFID is **the MQTT-based management and data plane for RFD40 and RFD90 reader sleds**. It lets applications configure readers, run RFID inventory, stream tag data, and monitor fleets — over a single persistent MQTT connection rather than the request/response HTTP pattern used by fixed Zebra readers.

In one sentence: IOTC turns a handheld sled into a network-addressable RFID node that speaks MQTT.

### The handheld product surface

Handheld reader sleds are accessory devices that attach to a host mobile device (typically an Android phone or tablet) via Bluetooth, *or*, on Premium and RFD90 — connect directly to Wi-Fi from in-firmware IOTC. The sled provides the RFID radio, a single internal antenna, the trigger button, and (on Premium/Premium Plus) an integrated barcode scanner. The sled is **not** a general-purpose computer: it runs no user applications, has no display, exposes no GPIO, and has one fixed antenna with no port-selection knob.

This shape is what every later chapter inherits. Battery-powered. Bluetooth- or Wi-Fi-attached. One antenna. MQTT-only. Region-locked at first-boot via 123RFID Desktop.

For the supported-hardware specifics and the Direct ↔ Bridged fork: [Which sled do you have?](/foundations/hardware-tiers).

### The four MQTT interfaces

IOTC organises a reader's surface into **four logical interfaces**, each carried on its own MQTT topic family:

| Interface | epType code | What flows on it | Voice |
|---|---|---|---|
| **Management** | `MGMT` | Identity, network, security, configuration, firmware. [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status), [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi), [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate), [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config), [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os), [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot). | Synchronous command/response |
| **Management Events** | `MGMT_EVT` | Heartbeats, alerts, exceptions, NTP, network and firmware-update events. | Asynchronous event |
| **Control** | `CTRL` | RFID operations: [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode), `control_operation start/stop`, [`set_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-post-filter). | Synchronous command/response |
| **Data** | `DATA1`, `DATA2` | High-throughput `dataEVT` tag streams. Up to two concurrent data pipes per sled. | Asynchronous event |

Two further endpoint types act as combinations of these:

- **`MDM`**, a *hybrid* endpoint that carries Management + Control + Data on a single topic family. Bootstrap default on every Premium/RFD90 sled. The reader you just connected via 123RFID Desktop is already publishing here.
- **`SOTI`**, a vendor-specific variant of MDM used by SOTI Connect for fleet management.

The capability is named in the schema's `tag_config.json` and grouped on the API Reference into four top-level tag groups (Management, Control, Events, Data) totalling fourteen sub-tags and twenty-three documented operations and events. See [Pairing the docs with the API Reference](/foundations/docs-and-api-reference).

```d2
classes: {
  mgmt:  { style: { fill: "#1f3a5f"; stroke: "#11243b"; font-color: "#ffffff" } }
  event: { style: { fill: "#8a5a00"; stroke: "#5e3d00"; font-color: "#ffffff" } }
  ctrl:  { style: { fill: "#0b6e6e"; stroke: "#064d4d"; font-color: "#ffffff" } }
  data:  { style: { fill: "#2a5d9f"; stroke: "#1b3e6b"; font-color: "#ffffff" } }
}
grid-rows: 3
grid-columns: 2
M: "Management - MGMT" {
  class: mgmt
  m1: "get_status\nget_version\nget_current_region"
  m2: "config_endpoint\nset_wifi\nset_config"
  m3: "install_certificate\nset_os\nreboot"
}
E: "Events - MGMT_EVT" {
  class: event
  e1: "heartbeatEVT\nalerts\nalert_short"
  e2: "mqttConnEVT\nexceptionEVT"
}
C: "Control - CTRL" {
  class: ctrl
  c1: set_operating_mode
  c2: "control_operation\nset_post_filter"
}
Dta: "Data - DATA1 / DATA2" {
  class: data
  d1: "dataEVT tag reads\n(up to 2 channels)"
}
H: "Hybrid - MDM" {
  class: mgmt
  h1: "Management + Control + Data\non one topic family\n(bootstrap default)"
}
S: "Vendor - SOTI" {
  class: ctrl
  s1: "MDM variant consumed\nby SOTI Connect"
}

```

### Retention, batching, and reliability built into Data

The Data interface is special because tag-read volume is bursty and can be high (hundreds of TPS during an inventory sweep). Two features mitigate this without involving the broker:

- **Retention buffer.** The sled buffers up to **150,000 tag events** locally when the broker is unreachable, and replays them at up to **500 TPS** when the connection returns. Configurable via [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config).
- **Batching.** Multiple tag events can be grouped into one MQTT message, reducing network and CPU cost.

Retention is enabled by default. See [What happens when the network drops](/fleet/retention-and-retry).

### How handheld IOTC differs from fixed-reader IOTC

The fixed-reader IOTC product (FX9600, FX7500, ATR7000) and the handheld product share the name and the spirit, but the architectures diverge on every axis that matters:

| Axis | Fixed IOTC | Handheld IOTC |
|---|---|---|
| Transport surfaces | MQTT · REST · HTTP POST · WebSocket · TCP/IP · keyboard emulation | **MQTT 3.1.1 only** |
| Antennas | Up to 8 external; cable-loss compensation; directionality | **1 internal**; no port selection |
| User applications | Yes — Python and Node.js DA apps on-reader | **No** |
| Network attach | Built-in Ethernet/Wi-Fi | Bluetooth-bridged (Standard) **or** native Wi-Fi 6 in firmware (Premium / RFD90) |
| Bootstrap | Web console; in-band MQTT | 123RFID Desktop (Windows, USB); out-of-band, one-time |
| Region setting | In-band | **Out-of-band only via 123RFID Desktop** |

These differences are not stylistic. They follow from the physics of a battery-powered, accessory-class device. A reader who arrives here assuming the fixed-reader REST surface will fail at the first command. A reader who assumes external antennas will look for ports that don't exist.

### Where to go next

- New to MQTT? Start at [MQTT in five minutes](/foundations/mqtt-primer).
- Want a tag read in the next hour? Skip to [Your first 30 minutes](/quick-start/overview).
- Architecting a fleet? Read [Roles: Reader, Host, Broker, Application](/foundations/actors) to [Going from one reader to a fleet](/fleet/provisioning-models).
- Coming from a fixed reader? Jump to [The OpenAPI Illusion](/foundations/native-mqtt-vs-openapi) before writing any code.

**Related:** 📘 [Which sled do you have?](/foundations/hardware-tiers) · 📘 [Roles: Reader, Host, Broker, Application](/foundations/actors) · 📘 [How commands and responses flow](/foundations/communication-flow) · 📕 MQTT API Reference (top nav)
