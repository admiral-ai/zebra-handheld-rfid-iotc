---
id: libraries
title: Recommended MQTT client libraries
sidebar_label: Recommended MQTT Client Libraries
description: "Recommended MQTT 3.1.1 client libraries for IOTC apps: paho-mqtt (Python), mqtt.js (Node), MQTTnet (C#), Eclipse Paho (Java/Android, iOS/Swift)."
---

> 📕 **REFERENCE** · Audience: New Integrator · Use: pick a library before you start coding

Curated list of MQTT 3.1.1 client libraries tested against the Zebra Handheld RFID IOTC. The Quick Start tutorials in [Python](/sdks/python), [Node.js](/sdks/nodejs), and [C#](/sdks/csharp) use the libraries marked **(used in tutorial)**.

| Language | Library | Min. version | Notes |
|---|---|---|---|
| Python | `paho-mqtt` | 1.6.1 | **Used in tutorial.** Reference implementation; well-supported on Linux, macOS, Windows. |
| Node.js | `mqtt` (mqtt.js) | 5.0.0 | **Used in tutorial.** Native TLS support via Node.js TLS module. |
| C# / .NET | `MQTTnet` | 4.3.0 | **Used in tutorial.** Async/await native. Works on .NET 6+ including .NET 8. |
| Java | `org.eclipse.paho.client.mqttv3` | 1.2.5 | Battle-tested on Android and JVM backends. |
| Go | `eclipse/paho.mqtt.golang` | 1.4.0 | Idiomatic Go API with goroutine-friendly callbacks. |
| C / C++ | `paho.mqtt.c` | 1.3.13 | Suitable for embedded systems and high-performance backends. |
| Rust | `rumqttc` | 0.24 | Async (tokio-based) Rust client. |
| Swift | `CocoaMQTT` | 2.1.0 | For iOS host-side applications consuming tag data. |

## Compatibility notes

- Libraries supporting **MQTT 3.1.1** are compatible with IOTC. MQTT 5.0-only libraries can connect to the IOTC broker (which speaks both) but 5.0-specific features are not exposed by the IOTC API.
- All listed libraries support **TLS** with custom CA certificate validation. See [How to Secure the MQTT Connection with TLS](/infrastructure/security/tls-setup) for the broker-side configuration.
- Persistent sessions (`clean_session: false` or equivalent) are required to receive queued QoS 1 messages after a reconnect.

## Choosing a library for your application

- **Backend service consuming tag data at scale:** Go or Rust for throughput; Java or C# for enterprise integration.
- **Mobile host-side app:** Swift (iOS) or the Android Paho Java client.
- **Embedded gateway or bridge:** Paho C, or Rust with `rumqttc`.
- **CLI tooling and quick prototypes:** `mosquitto_pub` / `mosquitto_sub` from the [Mosquitto project](https://mosquitto.org/) — used throughout the [Quick Start Tutorial](/quick-start/overview).

**Related:** 📗 [Python tutorial](/sdks/python) · 📗 [Node.js tutorial](/sdks/nodejs) · 📗 [C# tutorial](/sdks/csharp) · 📘 [About MQTT 3.1.1](/foundations/mqtt-primer)
