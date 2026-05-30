---
id: end-to-end
title: End-to-end IOTC system architecture
sidebar_label: About the End-to-End System
description: "End-to-end architecture of an IOTC deployment: sled, broker, application, MDM, and the edges between them. Data and control paths covered."
---

> 📘 **EXPLANATION** · **Audience:** All · **Read time:** ~5 min

An RFID tag, the reader sled that detects it, and the application that acts on the resulting data are separated by a handful of hops. Understanding those hops is the foundation for every operational decision in IOTC — where to put the broker, what QoS to use, how to monitor fleet health.

### The end-to-end flow at a glance

```
RFID Tag → Reader Sled → Wi-Fi → MQTT Broker → Application
```

Each arrow is a distinct medium with its own failure modes, latency characteristics, and capacity. None of them is optional, and the Wi-Fi and broker links are outside the reader's direct control.

```d2
direction: right
T: RFID Tag
R: Reader Sled
B: MQTT Broker { shape: queue }
A: Application
T -> R: "air - ~µs"
R -> B: "Wi-Fi - ~5-200 ms"
B -> A: "network - ~1-50 ms"

```

### The role of each link

- **RFID tag to sled:** Air protocol, microsecond timescale, Gen2 singulation.
- **Sled → Wi-Fi → internet:** The sled's own Wi-Fi radio carries its MQTT traffic toward the broker. Can drop under interference or while roaming between access points.
- **Internet to broker:** MQTT 3.1.1 over TCP, typically TLS-encrypted.
- **Broker to application:** MQTT pub/sub. The application subscribes to topics; the broker delivers matching messages.

### What this implies

The multi-hop topology means IOTC documentation must address failure modes at each hop separately. [Network Configuration](/infrastructure/network/architecture) covers the Wi-Fi link. [Connection Troubleshooting](/reference/troubleshooting/connection) covers the MQTT link. Treating "the connection" as a single entity is a common operational mistake.

**Related:** 📘 [Component Architecture](/foundations/actors) · 📘 [Network Architecture](/infrastructure/network/architecture) · 📘 [Handheld-Specific Considerations](/foundations/architecture/handheld-considerations)
