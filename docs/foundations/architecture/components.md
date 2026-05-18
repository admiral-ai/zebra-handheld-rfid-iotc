---
id: components
title: "Roles: Reader, Host, Broker, Application"
sidebar_label: "Roles: Reader, Host, Broker, Application"
---

> 📘 **EXPLANATION** · Audience: Solution Builder · Read time: ~5 min

An IOTC deployment is the cooperation of **five actors**. Knowing what each one owns is the first step toward designing a system you can debug. Get the ownership boundaries wrong and you will spend weeks chasing bugs in the wrong subsystem.

[DIAGRAM: D-2.3.A — five-actor block diagram with arrows annotated by what flows on each link]

### Reader Firmware (the IOTC Agent)

The firmware on the sled implements the MQTT client, manages the RFID radio, and exposes every IOTC operation as an MQTT message handler. It:

- Parses incoming commands on its CTRL and MGMT topics.
- Executes them against the radio (`control_operation`, `set_operating_mode`) or the management subsystems (`set_wifi`, `install_certificate`, `set_os`, `reboot`).
- Emits responses correlated by `requestId` and events asynchronously (heartbeats, alerts, dataEVT).
- Maintains the persistent MQTT connection, the LWT registration, and the retention buffer.

The reader is **authoritative**: it owns its state. Applications observe; they do not cache or substitute. If a `get_status` response says the radio is `ACTIVE`, it is — the application's last belief is wrong. This authority discipline simplifies failure recovery: on reconnect, the application re-queries; it never asserts.

### Host Device (Bipartite tier only) 🅑

On RFD40 Standard, the sled has no Wi-Fi. A **host device** — an Android phone, tablet, or PC running the IOTC bridge — provides the network path:

- The sled pairs to the host over Bluetooth 5.0 LE (eConnex profile).
- The host runs the MQTT client and bridges Bluetooth ↔ MQTT.
- Credentials, certificates, and topic subscriptions live on the host, not in the sled.
- The host emits `terminalConnection` events whenever the Bluetooth link transitions.

On Monolithic sleds (Premium / RFD90), there is **no host in the network path**. A host device may still be present as an operator UI, but the sled connects to Wi-Fi and the broker directly. Confusing the two cases is a frequent source of misconfiguration; see [Where things fail](/reference/diagnose/two-edges).

### MQTT Broker

The broker routes messages between readers and applications. It is not a participant in IOTC's command semantics — it forwards messages without interpretation.

- **Customer-provided** (Mosquitto, HiveMQ, EMQX, AWS IoT Core, Azure IoT Hub) is the typical production posture. The customer owns durability, scaling, and broker-side ACLs.
- **Zebra-hosted** brokers exist for evaluation and small deployments. Credentials are issued from the developer portal.

Brokers vary in their guarantees: not every broker offers durable QoS 1 across restarts; not every broker honors shared subscriptions; some impose maximum topic depth. [A practical guide to MQTT broker selection](https://www.hivemq.com) — included as anchor reading in `mqtt/a-practical-guide-to-mqtt-broker-selection.md` — is the right place to start when choosing. The broker enforces authentication, applies topic-level authorization, and (with TLS) defends the wire.

### Application Client

The customer's MQTT publisher/subscriber. It is responsible for:

- **Command correlation** — matching `requestId` in responses to outstanding requests, with timeouts.
- **Event handling** — subscribing to `MGMT_EVT` and `DATA*` topics, deduplicating tag observations, and reacting to alerts.
- **Persistence** — durable downstream storage (Kafka, S3, a warehouse), since IOTC's retention buffer is best-effort and bounded.
- **Reconcile-on-reconnect** — on `mqttConnEVT` reconnect, re-query the reader's state rather than trusting the last cached view.

Applications run anywhere with MQTT connectivity: backend services, cloud functions, mobile apps. The protocol is symmetric — the application and the reader are both *just MQTT clients*. Authority is conventional, not enforced by the protocol.

### MDM Platform (optional) 🅐🅑

For more than a handful of sleds, an MDM platform takes over the cold-start, configuration distribution, and firmware-rollout duties:

- **SOTI Connect** — Zebra's reference MDM partner. Receives `alert_short` (compact alerts) on the SOTI endpoint.
- **42Gears SureMDM** — alternative MDM with first-class IOTC support.

In MDM-managed deployments, **123RFID Desktop is used once** to set the region and seed the MDM endpoint. After that, the MDM platform owns provisioning, firmware, and policy. See [Going from one reader to a fleet](/fleet/provisioning/models) for the comparison matrix.

### Authority hierarchy

When the same fact disagrees across actors, this hierarchy resolves it:

1. **Reader firmware** is authoritative for runtime state (radio state, current operating mode, currently-connected endpoint).
2. **Saved configuration on the reader** is authoritative for what survives reboot.
3. **MDM-pushed canonical config** is authoritative for what *should* be on the reader at the next reconciliation.
4. **123RFID Desktop** is authoritative for region (no other actor can change it).
5. **Application caches** are advisory — discard on reconnect.

Disputes between (3) and (1) — between intended state and observed state — are *drift* and are addressed in [Keeping a fleet in sync](/fleet/management/about-bulk).

**Related:** 📘 [How commands and responses flow](/foundations/architecture/communication-flow) · 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📗 [Reader bootstrap with 123RFID Desktop](/getting-started/prerequisites/bootstrap) · 📘 [Going from one reader to a fleet](/fleet/provisioning/models)
