---
id: qos
title: MQTT QoS levels and delivery guarantees
sidebar_label: About QoS Levels & Delivery Guarantees
description: "MQTT 3.1.1 QoS 0, 1, 2 explained: what each guarantees, what each costs in latency, and which QoS IOTC uses for commands, events, and tag data."
---

> 📘 **EXPLANATION** · **Audience:** Solution Builder · **Read time:** ~5 min

MQTT defines three Quality-of-Service levels. IOTC uses two: QoS 0 (fire-and-forget) and QoS 1 (at-least-once). Understanding the trade-off between them is a foundation for sound application design.

### QoS 0, at most once

The publisher sends the message and forgets it. The broker may deliver it; it may not. There is no acknowledgement. Latency is lowest. Loss is possible — if the network drops the packet, the message is gone.

```d2
shape: sequence_diagram
P: Publisher
B: Broker
qos0: QoS 0 - at most once {
  P -> B: PUBLISH (no ack)
}
qos1: QoS 1 - at least once {
  P -> B: PUBLISH (dup=0)
  B -> P: PUBACK
  P -> B: "PUBLISH (dup=1)\nresend on PUBACK timeout"
  B -> P: PUBACK
}

```

### QoS 1, at least once

The publisher sends and waits for an acknowledgement (PUBACK). If it does not arrive within the timeout, the publisher resends. The subscriber may therefore receive the same message more than once — duplicates are guaranteed-eventually, not deduplicated. Latency is slightly higher. Loss is unlikely.

### QoS 2: exactly once (not used by IOTC)

MQTT defines a four-step handshake for guaranteed exactly-once delivery. IOTC does not use QoS 2: its overhead is large, and at-least-once with application-level deduplication is more flexible than at-most-once with no recourse.

### Which IOTC traffic uses which QoS

| Traffic | QoS | Why |
|---|---:|---|
| Command requests | 1 | Lost commands cannot be recovered; duplicates are recoverable |
| Command responses | 1 | Same reasoning |
| `heartbeatEVT`, `mqttConnEVT` | 0 | Heartbeats are by definition redundant; loss of one is harmless |
| `alerts`, `exceptionEVT` | 1 | Loss of an alert is operationally serious |
| `dataEVT` (tag data) | Configurable; default 0 | High-volume; application typically tolerates loss in favour of throughput |

### Implications for application design

Because QoS 1 commands can be delivered twice, **command handlers must be idempotent**, a [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) applied twice must leave the system in the same state as [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) applied once. Because `dataEVT` defaults to QoS 0, **tag-data applications should accept loss** as a normal condition, not an exceptional one. Where duplicate detection matters (e.g., for inventory accuracy), [How to Process Tag Data](/rfid/tag-data/process) details windowed deduplication strategies.

**Related:** 📘 [Tag Data Architecture](/rfid/tag-data/architecture) · 📙 [Processing Tag Data](/rfid/tag-data/process) · 📕 [API Reference](/reference/api-overview)
