---
id: primer
title: MQTT in five minutes
sidebar_label: MQTT in five minutes
---

> 📘 **EXPLANATION** · **Audience:** New Integrator (no prior MQTT) · **Read time:** ~5 min

MQTT is a **publish/subscribe** messaging protocol. It is *not* a request/response protocol. Coming from HTTP, this distinction matters more than any syntactic difference, it changes how you reason about state, errors, ordering, and timeouts.

### The shift from HTTP

In HTTP, a client sends a request and blocks until a response. The connection is short-lived. State lives in headers and bodies that the server interprets right now.

In MQTT, a client publishes a message to a **topic**, a string like `acme/mgmt/clients/app/SN12345`, and a **broker** delivers that message to every other client that has subscribed to a matching topic. Publishers don't know who (if anyone) is subscribed. Subscribers don't know who is publishing. **Time, identity, and addressing are all decoupled.**

The MQTT broker is the post office in this analogy: it routes by topic, not by recipient. The reader publishes; the broker fans out to subscribers.

[DIAGRAM: D-1.2.A. request/response vs publish/subscribe side by side]

This decoupling fits IoT well. An IOTC reader can publish tag data at full speed without caring whether the application is processing in real time, queueing in Kafka, or batching to S3. The reader's job ends at `publish`.

### The four primitives

- **Broker**, the central message router. The customer brings the broker (HiveMQ, Mosquitto, AWS IoT Core, Azure IoT Hub). Zebra hosts a managed broker option for evaluation.
- **Client**: anything that connects to the broker. Both readers *and* applications are clients. There is no client/server asymmetry at the protocol layer.
- **Topic**, a hierarchical string identifying a message stream. IOTC topics follow the pattern `<tenantId>/<userTopic>/<serialNumber>` — e.g. `acme/mgmt/clients/app/SN1234567890`.
- **Message**, a binary payload (in IOTC, JSON) published to a topic. MQTT itself imposes no schema; IOTC defines the JSON schemas for each operation and event.

[DIAGRAM: D-1.2.B. broker, client, topic, message]

### Subscribe-before-publish

A subscriber must subscribe to a topic *before* a message is published, or the broker has no record that the subscriber wanted it. This is opposite to REST, where a server holds state for any future caller. **A late subscriber sees nothing.**

Two exceptions soften this rule for slowly-changing state:

- **Retained messages.** A publisher can mark a message *retained*; the broker stores the most recent retained message per topic and delivers it to every new subscriber on that topic. IOTC uses retained messages sparingly — chiefly for terminal-connection state.
- **Persistent sessions.** A client can request a *persistent* session at connect time (`cleanSession=false`). The broker then remembers the client's subscriptions and queues messages that arrive while the client is offline. IOTC readers use persistent sessions to survive transient Wi-Fi loss without dropping events.

### QoS, a delivery-effort dial, not a guarantee

MQTT defines three Quality of Service levels:

| Level | Meaning | Network cost | Used by IOTC for |
|---|---|---|---|
| **QoS 0** | Fire-and-forget. The broker accepts or doesn't; no acknowledgment. | 1 packet | High-volume `dataEVT` (tag reads), when retention compensates for loss |
| **QoS 1** | At-least-once. Broker acks; publisher retries until acked. **Duplicates possible.** | 2 packets, possibly more | Commands and responses on Management and Control |
| **QoS 2** | Exactly-once. Four-way handshake. **No duplicates.** | 4 packets | Rarely; almost never worth the cost |

QoS is per-message, not per-connection. The publisher chooses the QoS at publish time; the subscriber's *maximum* QoS is set at subscribe time. The effective QoS is `min(publisher, subscriber)`.

**Important:** QoS is a *protocol-layer* delivery effort. It says nothing about whether the reader actually emitted the message, whether the broker persisted it durably, or whether the downstream consumer processed it. End-to-end reliability is the application's responsibility. IOTC layers retention buffers (150,000 events at 500 TPS flush) above QoS for exactly this reason. See [What happens when the network drops](/fleet/reliability/retention-retry).

### Last Will and Testament

A client may register a **Last Will and Testament (LWT)** at connect time, a message the broker publishes *on the client's behalf* when the client disconnects ungracefully (TCP timeout, power loss). IOTC readers register an LWT so the application sees a `mqttConnEVT` with `state=DISCONNECTED` even when the reader couldn't publish one itself.

LWT is the only mechanism in MQTT that surfaces unexpected offline state. Without it, a missing reader looks identical to a quiet reader.

### Topic design at a glance

IOTC topics encode three facts in their hierarchy:

```
acme           / mgmt    / clients/app / SN1234567890
└── tenantId   └── role  └── direction └── serial
```

- `tenantId` isolates tenants on a shared broker.
- `role` (`mgmt`, `mgmtEvt`, `ctrl`, `data1`, `data2`, `mdm`, `soti`) names the interface.
- `direction` reverses for commands (`clients/app/<serial>`) versus responses (`apps/<serial>/...`).
- `serialNumber` pins the message to one device.

This is convention, not a protocol requirement; MQTT topics are bare strings. But because every IOTC reader publishes and subscribes on this pattern, the cross-cutting topic taxonomy is predictable enough to wildcard-subscribe an entire fleet's events with `+/+/+/+`.

### Why MQTT 3.1.1 specifically

IOTC targets MQTT 3.1.1 because:

- Universal client-library support across Python, Node.js, C#, Java, Go, embedded C, the languages Zebra customers actually deploy with.
- Simpler semantics than 5.0. MQTT 5.0 adds reason codes, request/response correlation, shared subscriptions, and user properties — features IOTC implements above the protocol layer in JSON payloads (e.g., `requestId` correlation in payload, not in MQTT 5 correlation data).
- 3.1.1 has no breaking gap to 5.0; the topic taxonomy and JSON contract are 5.0-compatible.

A future IOTC version may adopt 5.0; today, every example in these docs is 3.1.1.

### Where this goes from here

- For the IOTC-specific topic taxonomy and QoS choices: [How the MQTT plumbing fits together](/infrastructure/endpoints/about).
- For the `mqttConnEVT` event that surfaces connection state: [Knowing when you're connected](/observability/events/mqtt-connection).
- For the protocol itself, the standard reference is the MQTT 3.1.1 OASIS standard at [docs.oasis-open.org/mqtt](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/mqtt-v3.1.1.html).

**Related:** 📘 [Roles: Reader, Host, Broker, Application](/foundations/architecture/components) · 📘 [How commands and responses flow](/foundations/architecture/communication-flow)
