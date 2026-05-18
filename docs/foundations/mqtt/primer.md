---
id: primer
title: MQTT in five minutes
sidebar_label: MQTT in five minutes
---

> 📘 **EXPLANATION** · Audience: New Integrator (no prior MQTT) · Read time: ~6 min

MQTT is a publish/subscribe protocol. It is not a request/response protocol. Coming from HTTP, this distinction matters more than the syntax.

### Publish/subscribe vs request/response

In HTTP, a client sends a request and waits for a response. In MQTT, a client publishes a message to a **topic** — a string like `acme/mgmt/clients/app/SN12345` — and a **broker** delivers that message to every other client that has subscribed to a matching topic. Publishers do not know who (if anyone) is subscribed. Subscribers do not know who is publishing. Communication is decoupled in time and identity.

[DIAGRAM: D-3.1.A — pub/sub and req/res side by side]

This decoupling fits IoT well. A reader can publish tag data at full speed without caring whether the application is processing it in real time, in a queue, or via a delayed batch consumer.

### The four primitives

- **Broker** — the central message router (Zebra-hosted by default, customer-hosted optionally).
- **Client** — anything that connects to the broker. Both readers and applications are clients.
- **Topic** — a hierarchical string identifying a message stream. Readers publish to and subscribe from specific topics following IOTC's pattern.
- **Message** — a binary payload (in IOTC, almost always JSON) published to a topic.

[DIAGRAM: D-3.1.B — the four primitives illustrated]

### Retained messages and Last Will & Testament

MQTT lets a publisher mark a message as **retained**: the broker stores it and delivers it to every new subscriber on that topic. IOTC uses retained messages for slowly-changing state. A client may also register a **Last Will and Testament (LWT)**: a message the broker publishes on the client's behalf if the client disconnects ungracefully. IOTC readers use LWT to signal unexpected offline state — the application sees a `mqttConnEVT` disconnect event without the reader having to publish it.

### Why MQTT 3.1.1 specifically

The IOTC product currently targets MQTT 3.1.1 because it is universally supported by client libraries across the languages Zebra customers use (Python, Node.js, C#, Java, Go, embedded C), and because its semantics are simpler than MQTT 5.0's. MQTT 5.0 adds features (request/response correlation, user properties, reason codes) that IOTC implements above the protocol layer in JSON payloads. A future product version may adopt 5.0; the topic taxonomy and JSON payload model are designed to be 5.0-compatible.

### Where to go for protocol-level depth

The MQTT 3.1.1 specification is at [oasis-open.org](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/mqtt-v3.1.1.html). For IOTC-specific MQTT semantics, continue to [§3.2 Topic Hierarchy](/foundations/mqtt/topic-hierarchy).

**Related:** 📘 [§3.2 Topic Hierarchy](/foundations/mqtt/topic-hierarchy) · 📘 [§3.3 QoS Levels](/foundations/mqtt/qos) · 📘 [§3.4 Connection Lifecycle](/foundations/mqtt/connection-lifecycle)
