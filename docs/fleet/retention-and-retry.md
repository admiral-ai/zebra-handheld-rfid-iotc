---
id: retention-and-retry
title: What happens when the network drops
sidebar_label: What happens when the network drops
description: "How IOTC readers survive network outages: the four-layer reliability model (QoS, retention buffer, application retry, dead-letter) and when each kicks in."
---

> 📘 **EXPLANATION** · **Audience:** Solution Builder, Fleet Operator · **Read time:** ~7 min

Networks fail. Brokers restart. Wi-Fi drops. A reader that buffers nothing loses tag reads during outages; a broker that holds nothing loses commands in flight; an application that retries nothing loses idempotency. IOTC layers four reliability mechanisms — **MQTT QoS, persistent sessions, reader-side retention, application-layer retry**, that together absorb most disruption classes without operator intervention.

### Four reliability layers

| Layer | Where it lives | Mechanism | Defends against |
|---|---|---|---|
| **MQTT QoS** | Protocol | Per-message delivery effort (0/1/2) | Single packet loss in transit |
| **Persistent session** | Broker | Broker buffers messages for an offline subscriber | Subscriber temporarily down |
| **Reader-side retention** | Reader | Reader buffers tag data when broker unreachable | Broker temporarily down |
| **Application-layer retry** | Application | Resend command with same `requestId` | Response lost |

The layers are not redundant, each defends against a different failure class. A production deployment configures all four.

### Layer 1: MQTT QoS

QoS is the protocol-layer delivery guarantee:

| QoS | Meaning | Use in IOTC |
|---|---|---|
| `0` | Fire-and-forget; no acknowledgment | High-volume tag data (`dataEVT`) where the retention buffer compensates |
| `1` | At-least-once; broker acks, publisher retries until acked. **Duplicates possible.** | Commands and responses on MGMT / CTRL |
| `2` | Exactly-once; four-way handshake. **No duplicates.** | Rarely worth the cost in IOTC |

QoS is per-message, not per-endpoint. The endpoint's `qosCommon` sets the default; individual `publishTopics[]` entries can override.

**QoS is not end-to-end reliability.** It guarantees protocol-layer delivery effort to the broker. It says nothing about whether the application processed the message, whether the broker durably persisted it, or whether a downstream pipeline received it.

### Layer 2: Persistent session

Both the reader (publishing) and the application (subscribing) negotiate **session persistence** at connect time:

- **`cleanSession: true`**: fresh session every connect. The broker forgets subscriptions on disconnect and drops queued messages.
- **`cleanSession: false`**: persistent session. The broker remembers the subscriber's subscriptions and queues messages while the subscriber is offline. On reconnect, the queue drains.

The MQTT endpoint configuration on the reader includes `cleanSession`, defaulting to `true`. **For production application clients, set `cleanSession: false`** so QoS 1 messages survive subscriber outages.

The broker's session-retention behavior varies by implementation. Mosquitto persists in-memory and loses sessions on broker restart; AWS IoT Core retains sessions across broker upgrades; HiveMQ Cloud configurable. Read your broker's documentation.

### Layer 3: Reader-side retention buffer

The most IOTC-specific reliability mechanism. When the **broker** is unreachable, the reader buffers `dataEVT` tag reads in flash. Capacity and flush rate are documented in `mqtt-api-reference/set_config.md` and configurable via `set_config.dataConfiguration`:

- **Retention buffer size**: number of tag events the reader holds. Default values are firmware-version specific; the canonical baseline cited in the conceptual TOC corpus is **150,000 events**.
- **Flush rate on reconnect**: events per second when broker comes back. Canonical baseline **500 TPS**.
- **Retention overflow**: when full, oldest events are dropped first (FIFO).

The retention buffer is enabled by default. Disabling it (`retention: false`) trades reconnect simplicity for outage tolerance, only do this when the application's broker-side durability is guaranteed.

### Layer 4: Application-layer retry

Application code that retries failed commands closes the last gap:

```
publish(command, requestId="x")
start_timer(response, timeout=5s)
on_response: cancel_timer; done.
on_timeout: publish(command, requestId="x")  # same requestId
```

Reusing the same `requestId` lets the reader treat the retry idempotently. Two identical [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) payloads with the same `requestId` produce the same result; the reader doesn't apply the change twice.

**Idempotence by operation:**

| Operation | Safe to retry with same requestId? |
|---|---|
| `get_*` (any read) | Yes; pure reads |
| [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) | Yes; same payload, same result |
| [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) | Yes; same payload, same result |
| `config_endpoint add` | **No** — second attempt returns error 10 (already exists) |
| `config_endpoint update` | Yes |
| `config_endpoint delete` | Idempotent on the second attempt: nothing to delete |
| `control_operation START` | Returns error 11 if already started |
| `control_operation STOP` | Returns error 12 if already stopped; idempotent semantically |
| [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) | Depends on name uniqueness |
| [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) | **No** — error 4 (firmware update in progress) |
| [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) | If running, error 5; if idle, reboots; be careful |

For non-idempotent operations, retry must be conditional on the error response. Treat error 10, 11, 12 as "already in target state" (log and proceed).

### Connection events drive the loop

The reader publishes `mqttConnEVT` on every CONNECTED/DISCONNECTED transition (see [Knowing when you're connected](/observability/mqtt-connection)). The application can use these to:

- Detect when retention is filling (DISCONNECTED state lasting too long).
- Re-query reader state on reconnect (positions cached state).
- Trigger reconciliation jobs after reconnect.

A robust application subscribes to `mqttConnEVT` and treats the CONNECTED event as a trigger to refresh its model of the reader rather than trusting whatever cached state it had.

### What happens during a broker outage

Step by step, when a broker becomes unreachable mid-inventory:

1. **t+0** Broker goes down. Reader's MQTT connection times out at the keep-alive interval (typically 5 min by default; 300 s in the canonical config).
2. **t+keepAlive** Reader detects connection loss. Begins reconnect attempts on `reconnectDelayMin` to `reconnectDelayMax` exponential backoff.
3. **t+ε onward** Reader continues inventory. Each `dataEVT` is buffered to flash. Battery and CPU are consumed at slightly elevated rates.
4. **t+outage** Broker returns. Reader's next reconnect attempt succeeds. `mqttConnEVT CONNECTED` fires.
5. **t+outage+1** Reader drains the retention buffer at the configured flush rate. Old events are tagged with their original `timestamp` so downstream analytics can place them correctly.
6. **t+outage+drain_time** Buffer empty; reader resumes real-time publishing.

The application sees one DISCONNECTED event, one CONNECTED event, and a burst of `dataEVT` with old timestamps. The dashboard "lags catches up" view is correct.

### Failure beyond retention

Three classes of failure are not covered by retention:

- **Outage longer than retention can hold.** A 24-hour broker outage at 200 reads/min exceeds 150,000 events. Older events are dropped.
- **Reader power loss.** If the reader loses power during an outage, the in-memory portion of the retention buffer is lost (the on-flash portion survives).
- **Configuration changes that invalidate buffered events.** Rare, but if the data endpoint is deleted while buffering, the buffer is dropped.

For deployments where any of these failure modes is unacceptable, the application must consume `dataEVT` to durable storage (Kafka, S3, a warehouse) and treat the broker as a high-throughput-but-lossy hop. IOTC's retention is *best-effort with strong defaults*, not *guaranteed*.

### Out of scope

- **Configuring retention parameters**: covered in [The reader's configuration document](/infrastructure/config-document).
- **Broker selection for durability**, see the broker selection guide in the MQTT knowledge folder.
- **End-to-end pipeline reliability**, by definition outside IOTC.

**Related:** 📘 [Knowing when you're connected](/observability/mqtt-connection) · 📘 [The reader's configuration document](/infrastructure/config-document) · 📘 [How commands and responses flow](/foundations/communication-flow) · 📕 [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
