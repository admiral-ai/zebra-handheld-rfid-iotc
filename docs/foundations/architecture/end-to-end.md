---
id: end-to-end
title: End-to-end IOTC system architecture
sidebar_label: About the End-to-End System
description: "End-to-end architecture of an IOTC deployment: sled, host, broker, application, MDM, and the four edges between them. Data and control paths covered."
---

> 📘 **EXPLANATION** · **Audience:** All · **Read time:** ~5 min

An RFID tag, the reader sled that detects it, and the application that acts on the resulting data are separated by five hops. Understanding those hops is the foundation for every operational decision in IOTC — where to put the broker, what QoS to use, how to monitor fleet health.

### The end-to-end flow at a glance

```
RFID Tag → Reader Sled → Bluetooth → Host Device → Wi-Fi/Cellular → MQTT Broker → Application
```

Each arrow is a distinct medium with its own failure modes, latency characteristics, and capacity. None of them is optional, and three of them (Bluetooth, host device, Wi-Fi) are outside the reader's direct control.

```d2
direction: right
T: RFID Tag
R: Reader Sled
H: Host Device
B: MQTT Broker { shape: oval }
A: Application
T -> R: "air\n~µs"
R -> H: "BT 5.0 LE\n~10-50ms"
H -> B: "Wi-Fi / Cellular\n~5-200ms"
B -> A: "network\n~1-50ms"
```

### The role of each link

- **RFID tag to sled:** Air protocol, microsecond timescale, Gen2 singulation.
- **Sled → Bluetooth → host:** Bluetooth 5.0 LE link from sled to host device. Tens of milliseconds typical; can drop under interference.
- **Host → Wi-Fi/Cellular → internet:** The host's network. The reader has no direct knowledge of this layer.
- **Internet to broker:** MQTT 3.1.1 over TCP, typically TLS-encrypted.
- **Broker to application:** MQTT pub/sub. The application subscribes to topics; the broker delivers matching messages.

### Why the host device is on the path

A fixed Zebra reader (FXR90) is a standalone network device, it has its own Wi-Fi or Ethernet, its own IP stack, and connects to the broker directly. A handheld sled does not. It connects to the host device via Bluetooth, and the host device's network connection carries traffic to and from the broker. The sled is, in network terms, an accessory of the host. This has consequences for every layer above: when the host moves out of Wi-Fi range, the sled's MQTT connection drops; when the host application is suspended, the sled's traffic stops.

### What this implies

The five-hop topology means IOTC documentation must address failure modes at each hop separately. [Network Configuration](/infrastructure/network/architecture) covers the Wi-Fi link. [Bluetooth Troubleshooting](/reference/troubleshooting/bluetooth) covers the BT link. [Connection Troubleshooting](/reference/troubleshooting/connection) covers the MQTT link. Treating "the connection" as a single entity is the most common operational mistake; there are five.

**Related:** 📘 [Component Architecture](/foundations/actors) · 📘 [Network Architecture](/infrastructure/network/architecture) · 📘 [Handheld-Specific Considerations](/foundations/architecture/handheld-considerations)
