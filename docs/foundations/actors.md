---
id: actors
title: "Roles: Reader, Broker, Application"
sidebar_label: "Roles: Reader, Broker, Application"
description: "The four actors in an IOTC deployment: reader, MQTT broker, application, and MDM. How they connect, who owns what state, and where each piece lives."
---

> 📘 **EXPLANATION** · **Audience:** Solution Builder · **Read time:** ~5 min

An IOTC deployment is the cooperation of **four actors**. Knowing what each one owns is the first step toward designing a system you can debug. Get the ownership boundaries wrong and you will spend weeks chasing bugs in the wrong subsystem.

```d2
direction: right
R: "Reader Firmware\n(IOTC Agent)"
B: MQTT Broker { shape: queue }
A: Application Client
M: "MDM Platform\n(SOTI / SureMDM)"
R -> B: Wi-Fi 6 (native MQTT)
B <-> A: "commands - responses - events"
M -> B: "policy - firmware - config" { style.stroke-dash: 4 }
```

### Reader Firmware (the IOTC Agent)

The firmware on the sled implements the MQTT client, manages the RFID radio, and exposes every IOTC operation as an MQTT message handler. It:

- Parses incoming commands on its CTRL and MGMT topics.
- Executes them against the radio ([`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation), [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode)) or the management subsystems ([`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi), [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate), [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os), [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot)).
- Emits responses correlated by `requestId` and events asynchronously (heartbeats, alerts, dataEVT).
- Maintains the persistent MQTT connection, the LWT registration, and the retention buffer.

The reader connects to Wi-Fi directly and speaks MQTT to the broker over its own radio — there is one edge between the reader and the broker. The reader is **authoritative**: it owns its state. Applications observe; they do not cache or substitute. If a [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status) response says the radio is `ACTIVE`, it is, and the application's last belief is wrong. This authority discipline simplifies failure recovery: on reconnect, the application re-queries; it never asserts.

### MQTT Broker

The broker routes messages between readers and applications. It is not a participant in IOTC's command semantics; it forwards messages without interpretation.

- **Customer-provided** (Mosquitto, HiveMQ, EMQX, AWS IoT Core, Azure IoT Hub) is the typical production posture. The customer owns durability, scaling, and broker-side ACLs.
- **Zebra-hosted** brokers exist for evaluation and small deployments. Credentials are issued from the developer portal.

Brokers vary in their guarantees: not every broker offers durable QoS 1 across restarts; not every broker honors shared subscriptions; some impose maximum topic depth. The broker enforces authentication, applies topic-level authorization, and (with TLS) defends the wire.

### Application Client

The customer's MQTT publisher/subscriber. It is responsible for:

- **Command correlation**: matching `requestId` in responses to outstanding requests, with timeouts.
- **Event handling**: subscribing to `MGMT_EVT` and `DATA*` topics, deduplicating tag observations, and reacting to alerts.
- **Persistence**: durable downstream storage (Kafka, S3, a warehouse), since IOTC's retention buffer is best-effort and bounded.
- **Reconcile-on-reconnect**: on `mqttConnEVT` reconnect, re-query the reader's state rather than trusting the last cached view.

Applications run anywhere with MQTT connectivity: backend services, cloud functions, mobile apps. The protocol is symmetric — the application and the reader are both *just MQTT clients*. Authority is conventional, not enforced by the protocol.

### MDM Platform (optional)

For more than a handful of sleds, an MDM platform takes over the cold-start, configuration distribution, and firmware-rollout duties:

- **SOTI Connect**: Zebra's reference MDM partner.
- **42Gears SureMDM**: alternative MDM with first-class IOTC support.

In MDM-managed deployments, **123RFID Desktop** is used once to set the region and seed the MDM endpoint. After that, the MDM platform owns provisioning, firmware, and policy. See [Bootstrapping with 123RFID Desktop](/foundations/bootstrap-tools) and [Going from one reader to a fleet](/fleet/provisioning-models) for the comparison matrix.

### Authority hierarchy

When the same fact disagrees across actors, this hierarchy resolves it:

1. **Reader firmware** is authoritative for runtime state (radio state, current operating mode, currently-connected endpoint).
2. **Saved configuration on the reader** is authoritative for what survives reboot.
3. **MDM-pushed canonical config** is authoritative for what *should* be on the reader at the next reconciliation.
4. **123RFID Desktop** is authoritative for region at bootstrap (no other actor can change it).
5. **Application caches** are advisory (discard on reconnect).

Disputes between (3) and (1) — between intended state and observed state — are *drift* and are addressed in [Keeping a fleet in sync](/fleet/bulk-management).

**Related:** 📘 [How commands and responses flow](/foundations/communication-flow) · 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📘 [Bootstrapping with 123RFID Desktop](/foundations/bootstrap-tools) · 📗 [Phase 2: Bootstrap with 123RFID Desktop](/quick-start/phase-2) · 📘 [Going from one reader to a fleet](/fleet/provisioning-models)
