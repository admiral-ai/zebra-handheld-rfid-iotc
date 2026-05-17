---
id: about-iotc
title: About Zebra IoT Connector for Handheld RFID
sidebar_label: About Zebra IoT Connector for Handheld RFID
---

> 📘 **EXPLANATION** · Audience: All personas · Read time: ~5 min

The Zebra IoT Connector (IOTC) for Handheld RFID is the MQTT-based management and data plane for RFD40 and RFD90 reader sleds. It lets applications configure readers, start and stop RFID operations, stream tag data, and monitor fleets — all over a single persistent MQTT connection rather than the request/response HTTP pattern used by fixed Zebra readers.

### The handheld product surface

Handheld reader sleds are accessory devices that attach to a host mobile device (typically an Android phone or tablet) via Bluetooth. The host device provides network connectivity; the sled provides the RFID radio, antenna, trigger button, and (on some models) a barcode scanner. This shape matters: the sled is **not** a standalone network device, and its battery-powered nature shapes every connectivity decision in IOTC.

For the full list of supported sleds and their capabilities, see [§1.2 About Supported Hardware](/foundations/introduction/supported-hardware).

### The three core interfaces

IOTC organises a reader's surface into three logical interfaces, each represented by a distinct MQTT topic family:

- **Management (MGMT)** — device identity, network, security, configuration, firmware
- **Control (CTRL)** — RFID radio operations: mode, filters, start/stop
- **Data (DATA)** — high-throughput tag-data event streams

A fourth interface, **MDM**, exists for enterprise mobile-device-management integration with platforms such as SOTI Connect.

[DIAGRAM: D-1.1.A — single-frame deployment: tags → sled → host device → broker → application]

### How handheld IOTC differs from fixed-reader IOTC

Fixed Zebra readers (FXR90, FX9600) expose REST, WebSocket, and HTTP POST surfaces, support multiple external antennas with cable-loss compensation, and run device-application frameworks. Handheld sleds do none of this. They communicate **only over MQTT 3.1.1**, have **one internal antenna**, run **no user applications**, and reach the network **only through the host device**. The differences are not stylistic — they follow from the physics of a battery-powered, Bluetooth-connected accessory.

### Where to go next

- New to MQTT? Read [§3.1 About MQTT 3.1.1](/foundations/mqtt/primer) first.
- Want to read a tag in the next hour? Skip to [§5 Quick Start Tutorial](#chapter-5--quick-start-tutorial).
- Looking up an endpoint? Go straight to [§16 API Reference](#chapter-16--mqtt-api-reference).
- Architecting a fleet deployment? Read [§2 System Architecture](#chapter-2--system-architecture) and then [§13 Fleet Provisioning](#chapter-13--fleet-provisioning).

**Related:** 📘 [§2.4 Interface Model](/foundations/architecture/interface-model) · 📘 [§3.1 About MQTT 3.1.1](/foundations/mqtt/primer) · 📗 [§5 Quick Start](#chapter-5--quick-start-tutorial) · 📕 [§16 API Reference](#chapter-16--mqtt-api-reference)
