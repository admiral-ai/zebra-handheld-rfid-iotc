---
id: misconceptions
title: Things people get wrong about IOTC
sidebar_label: Things people get wrong about IOTC
description: "Common IOTC misconceptions (MM-NN): the OpenAPI illusion, FAST_READ unsupported, casing varies, reboot code 1 means success, region not MQTT-settable."
toc_min_heading_level: 3
toc_max_heading_level: 4
---

> 📘 **EXPLANATION** · **Audience:** All personas · **Read time:** ~6 min

Recurring misconceptions that produce wrong integration code. Each entry pairs the wrong belief with the right one, and points to the chapter that explains in more depth. **If you've recently spent more than an hour stuck on something, scan this list first**; your symptom probably has a familiar misconception underneath.

### Payload and schema

#### MM-01: The OpenAPI rendering is not the payload {#mm-01}

- *Wrong:* The schema corpus and OpenAPI rendering describe the runtime contract.
- *Right:* Each command has a named payload object (`ctrlOprPayload`, `epConfig`, `operatingMode`, `postFilterPayload`, `eventConfiguration`); generic wrappers like `params`, `payload`, `requestBody` are not part of the native MQTT shape. The OpenAPI rendering may add them. Always copy from `mqtt-api-reference/<command>.md`.
- *See:* [The OpenAPI Illusion](/foundations/native-mqtt-vs-openapi)

#### MM-02: `FAST_READ` is not a usable operating-mode profile {#mm-02}

- *Wrong:* The enum lists six profiles; `FAST_READ` is one of them and can be selected.
- *Right:* `FAST_READ` appears in the enum but is documented as **not currently supported**. Selecting it returns an error. Use one of the five supported profiles: `CYCLE_COUNT`, `DENSE_READERS`, `OPTIMAL_BATTERY`, `BALANCED_PERFORMANCE`, `ADVANCED`.
- *See:* [Choose how the reader reads tags](/rfid/operating-mode-profiles)

#### MM-03: Enum casing varies by command {#mm-03}

- *Wrong:* Send `start` to [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) and it will work.
- *Right:* `control_operation.ctrlOprPayload.operation` is uppercase: `START`, `STOP`. `controlType` is uppercase: `RFID`, `SCANNER`. `config_endpoint.epConfig.operation` is lowercase: `add`, `update`, `delete`. `set_post_filter.postFilterPayload.operation` is uppercase: `ADD`, `MODIFY`, `DELETE`. **Casing varies by command.** Trust the per-command schema.
- *See:* [Start, stop, and the trigger button](/rfid/start-stop-inventory)

#### MM-04: [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) returning code 1 is not a failure {#mm-04}

- *Wrong:* Only `0` is success; any other code means the reboot didn't happen.
- *Right:* The reboot API reference example shows code `1` ("Command payload is accepted") but the schema defines `0` and `5`. The example and schema disagree. Treat `0` and `1` as success-equivalents; treat `5` as the only documented failure.
- *See:* [Updating firmware and rebooting](/infrastructure/system-operations)

#### MM-05: `mqttConnEVT.timestamp` is not ISO 8601 {#mm-05}

- *Wrong:* Parse it like every other timestamp in IOTC.
- *Right:* The canonical schema uses `HH:MM:SS` format. Applications must accept both forms.
- *See:* [Knowing when you're connected](/observability/mqtt-connection)

### Persistence and lifecycle

#### MM-06: Not all configuration survives reboot {#mm-06}

- *Wrong:* Everything I set with `set_*` is persistent.
- *Right:* **All management endpoint configurations survive reboot** (Wi-Fi, endpoints, certs, event config, device-wide config). **Only radio operation configurations from the control endpoint are lost.** Re-apply [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) after every reboot if you need a specific mode.
- *See:* [The reader's configuration document](/infrastructure/config-document)

#### MM-07: Region cannot be set or changed over MQTT {#mm-07}

- *Wrong:* [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) includes region somewhere.
- *Right:* **Region cannot be set over MQTT.** It is locked at first boot via 123RFID Desktop. To change region, factory-reset and re-bootstrap. [`get_current_region`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-current-region) reads it; nothing writes it remotely.
- *See:* [What your reader knows about itself](/infrastructure/device-state)

#### MM-08: The MDM endpoint is the bootstrap default, not just one of seven {#mm-08}

- *Wrong:* MDM is structurally equivalent to MGMT or CTRL; just a different `epType`.
- *Right:* The MDM endpoint is the **bootstrap default**, the only endpoint 123RFID Desktop creates, and the path through which every other endpoint is added remotely. You cannot run any MQTT command before the MDM endpoint is active.
- *See:* [How the MQTT plumbing fits together](/infrastructure/endpoints/about) and [Bootstrap with 123RFID Desktop](/quick-start/phase-2/direct)

### Topics and routing

#### MM-09: The `topic` field you configure is only the middle segment {#mm-09}

- *Wrong:* `publishTopics: [{ "topic": "zebra/MDM/clients/resp/RFD40-..." }]` is the path the reader publishes on.
- *Right:* The reader prepends `tenantId` and appends `deviceSerialNumber` at runtime. You configure only the **middle segment**. The wire topic is `<tenantId>/<topic>/<deviceSerialNumber>`.
- *See:* [How the MQTT plumbing fits together](/infrastructure/endpoints/about)

#### MM-10: QoS is not end-to-end {#mm-10}

- *Wrong:* QoS 1 guarantees my application sees every message.
- *Right:* QoS is protocol-layer between adjacent hops (publisher ↔ broker, broker ↔ subscriber). It does not guarantee end-to-end durability. The reader's retention buffer (Layer 3) compensates for broker-side outages; application-layer retry (Layer 4) compensates for downstream failures. Build your reliability on all four layers, not just QoS.
- *See:* [What happens when the network drops](/fleet/retention-and-retry)

#### MM-11: Tag data should not be QoS 1 {#mm-11}

- *Wrong:* I want every tag read; QoS 1 ensures it.
- *Right:* `dataEVT` is typically QoS 0 because high-volume tag data plus QoS 1 swamps broker resources for marginal reliability benefit. The retention buffer absorbs broker outages; QoS 1 on top is double-paying.
- *See:* [What happens when the network drops](/fleet/retention-and-retry)

### Event semantics

#### MM-12: `alerts` and `alert_short` are not duplicates {#mm-12}

- *Wrong:* I can consume either one and get the same information.
- *Right:* `alert_short` has a much broader `id` enum (every certificate operation, both Wi-Fi and Ethernet config outcomes, multiple firmware lifecycle states), but it does NOT carry an `alertDetails` block. `alerts` has only five formal `id` enum values (`BATTERY`, `FIRMWARE_UPDATE`, `NETWORK_EVENT`, `TEMPERATURE`, `POWER`) per the canonical schema (the canonical reference also describes `GPI_EVENT` and `ANTENNA_EVENT` as trigger conditions, but they are not in the published enum), and it DOES carry a structured `alertDetails` block. They are different surfaces, typically `alerts` to applications and `alert_short` to MDM.
- *See:* [When the reader needs to interrupt you](/observability/alerts)

#### MM-13: Heartbeat battery snapshot is not the same as a battery alert {#mm-13}

- *Wrong:* Same battery condition, same field.
- *Right:* The heartbeat is a **snapshot**; it reports current state each interval. The `alerts` event is a **transition**; it fires when state changes (`status: LOW` set, then later `CLEAR`). Pipelines designed for transitions cannot rely on heartbeat-snapshot fields.
- *See:* [Watch your reader's pulse](/observability/heartbeat)

### Inventory and operating mode

#### MM-14: [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) does not configure the inventory {#mm-14}

- *Wrong:* I can specify profile or session inside [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation).
- *Right:* [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) is a switch (START / STOP) on a pre-configured radio. Operating mode is configured with [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) separately and **before** `START`. The two operations have non-overlapping responsibilities.
- *See:* [Start, stop, and the trigger button](/rfid/start-stop-inventory)

#### MM-15: [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) cannot run during active inventory {#mm-15}

- *Wrong:* It's a configuration command, so it should always succeed.
- *Right:* It is rejected with error code 11 during active inventory. Stop the inventory with `control_operation STOP`, apply the new mode, then restart.
- *See:* [Choose how the reader reads tags](/rfid/operating-mode-profiles)

### Tiers and bootstrap

#### MM-16: The Direct/Bridged tier names describe the bootstrap and network topology, not the MQTT API surface {#mm-16}

- *Wrong:* Bridged sleds run a different IoTC API, or the host translates between two protocols, or [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) behaves differently across tiers.
- *Right:* The tier name reflects (a) which **bootstrap tool** you use for first-light (123RFID Desktop on Direct, 123RFID Mobile on Bridged) and (b) the **network topology** (sled-owns-Wi-Fi on Direct, host-owns-Wi-Fi-and-carries-BT-bridge on Bridged). **Once the MDM endpoint is active, every IoTC MQTT command, response, event, topic, retention behavior, and TLS behavior is identical across tiers.** The only operational asymmetries are: (i) Bridged sleds emit `terminalConnection` events because there's a host link to report on; (ii) [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) is a no-op surface on Bridged because there's no on-sled Wi-Fi radio to configure. Build your application against the API contract, not the tier.
- *See:* [Two bootstrap tools: 123RFID Desktop and 123RFID Mobile](/foundations/bootstrap-tools) and [Which sled do you have?](/foundations/hardware-tiers)

---

### Reading this list

Misconceptions cluster around **defaults you assumed** (region, persistence, FAST_READ) and **field shapes you generalised wrong** (envelopes, casing). The fix in every case is to **read `mqtt-api-reference/<command>.md`** for the exact contract.

If you encounter a recurring wrong belief not on this list, add it. The MM-N identifiers are stable; new entries get new numbers.

**Related:** 📘 [Something's broken?](/diagnose/symptoms) · 📘 [Where things fail](/diagnose/where-things-fail) · 📙 [Playbooks for getting back online](/diagnose/recovery-playbooks) · 🩺 [Failure modes](/diagnose/failure-modes) · 📕 [Glossary, limits, and cheat sheets](/reference/glossary)
