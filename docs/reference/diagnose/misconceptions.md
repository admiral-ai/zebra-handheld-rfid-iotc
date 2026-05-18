---
id: misconceptions
title: Things people get wrong about IOTC
sidebar_label: Things people get wrong about IOTC
---

> 📘 **EXPLANATION** · Audience: All personas · Read time: ~6 min

Recurring misconceptions that produce wrong integration code. Each row pairs the wrong belief with the right one, and points to the chapter that explains in more depth. **If you've recently spent more than an hour stuck on something, scan this list first** — your symptom probably has a familiar misconception underneath.

### Payload and schema

**MM-01 — "The OpenAPI rendering is the canonical payload."**

- *Wrong:* The schema corpus and OpenAPI rendering describe the runtime contract.
- *Right:* Each command has a named payload object (`ctrlOprPayload`, `epConfig`, `operatingMode`, `postFilterPayload`, `eventConfiguration`); generic wrappers like `params`, `payload`, `requestBody` are not part of the native MQTT shape. The OpenAPI rendering may add them. Always copy from `mqtt-api-reference/<command>.md`.
- *See:* [The OpenAPI Illusion](/foundations/concepts/native-mqtt-vs-openapi)

**MM-02 — "`FAST_READ` is one of the operating-mode profiles."**

- *Wrong:* The enum lists six profiles; `FAST_READ` is one of them and can be selected.
- *Right:* `FAST_READ` appears in the enum but is documented as **currently not supported**. Selecting it returns an error. Use one of the five supported profiles: `CYCLE_COUNT`, `DENSE_READERS`, `OPTIMAL_BATTERY`, `BALANCED_PERFORMANCE`, `ADVANCED`.
- *See:* [Choose how the reader reads tags](/rfid/operating-mode/profiles)

**MM-03 — "Enum casing doesn't matter."**

- *Wrong:* Send `start` to `control_operation` and it will work.
- *Right:* `control_operation.ctrlOprPayload.operation` is uppercase: `START`, `STOP`. `controlType` is uppercase: `RFID`, `SCANNER`. `config_endpoint.epConfig.operation` is lowercase: `add`, `update`, `delete`. `set_post_filter.postFilterPayload.operation` is uppercase: `ADD`, `MODIFY`, `DELETE`. **Casing varies by command** — trust the per-command schema.
- *See:* [Start, stop, and the trigger button](/rfid/operating-mode/start-stop)

**MM-04 — "`reboot` returning code 1 is a failure."**

- *Wrong:* Only `0` is success; any other code means the reboot didn't happen.
- *Right:* The reboot API reference example shows code `1` ("Command payload is accepted") but the schema defines `0` and `5`. The example and schema disagree; treat `0` and `1` as success-equivalents; treat `5` as the only documented failure.
- *See:* [Updating firmware and rebooting](/infrastructure/management/system-operations)

**MM-05 — "`mqttConnEVT.timestamp` is ISO 8601."**

- *Wrong:* Parse it like every other timestamp in IOTC.
- *Right:* The canonical schema uses `HH:MM:SS` format. Applications must accept both forms.
- *See:* [Knowing when you're connected](/observability/events/mqtt-connection)

### Persistence and lifecycle

**MM-06 — "Configuration always survives reboot."**

- *Wrong:* Everything I set with `set_*` is persistent.
- *Right:* **All management endpoint configurations survive reboot** (Wi-Fi, endpoints, certs, event config, device-wide config). **Only radio operation configurations from the control endpoint are lost.** Re-apply `set_operating_mode` after every reboot if you need a specific mode.
- *See:* [The reader's configuration document](/infrastructure/management/config-document)

**MM-07 — "Region can be set or changed over MQTT."**

- *Wrong:* `set_config` includes region somewhere.
- *Right:* **Region cannot be set over MQTT.** It is locked at first boot via 123RFID Desktop. To change region, factory-reset and re-bootstrap. `get_current_region` reads it; nothing writes it remotely.
- *See:* [What your reader knows about itself](/infrastructure/management/device-state)

**MM-08 — "The MDM endpoint is just one of seven."**

- *Wrong:* MDM is structurally equivalent to MGMT or CTRL — just a different `epType`.
- *Right:* The MDM endpoint is the **bootstrap default** — the only endpoint 123RFID Desktop creates, and the path through which every other endpoint is added remotely. You cannot run any MQTT command before the MDM endpoint is active.
- *See:* [How the MQTT plumbing fits together](/infrastructure/endpoints/about) and [Bootstrap with 123RFID Desktop](/getting-started/quick-start/step-2-discover)

### Topics and routing

**MM-09 — "The `topic` field I configure is the wire topic."**

- *Wrong:* `publishTopics: [{ "topic": "zebra/MDM/clients/resp/RFD40-..." }]` is the path the reader publishes on.
- *Right:* The reader prepends `tenantId` and appends `deviceSerialNumber` at runtime. You configure only the **middle segment**. The wire topic is `<tenantId>/<topic>/<deviceSerialNumber>`.
- *See:* [How the MQTT plumbing fits together](/infrastructure/endpoints/about)

**MM-10 — "QoS is end-to-end."**

- *Wrong:* QoS 1 guarantees my application sees every message.
- *Right:* QoS is protocol-layer between adjacent hops (publisher↔broker, broker↔subscriber). It does not guarantee end-to-end durability. The reader's retention buffer (Layer 3) compensates for broker-side outages; application-layer retry (Layer 4) compensates for downstream failures. Build your reliability on all four layers, not just QoS.
- *See:* [What happens when the network drops](/fleet/reliability/retention-retry)

**MM-11 — "Tag data should be QoS 1."**

- *Wrong:* I want every tag read; QoS 1 ensures it.
- *Right:* `dataEVT` is typically QoS 0 because high-volume tag data plus QoS 1 swamps broker resources for marginal reliability benefit. The retention buffer absorbs broker outages; QoS 1 on top is double-paying.
- *See:* [What happens when the network drops](/fleet/reliability/retention-retry)

### Event semantics

**MM-12 — "`alerts` and `alert_short` are duplicates."**

- *Wrong:* I can consume either one and get the same information.
- *Right:* `alert_short` has a much broader `id` enum (every certificate operation, both Wi-Fi and Ethernet config outcomes, multiple firmware lifecycle states). `alerts` has only seven `id` values (`BATTERY`, `FIRMWARE_UPDATE`, `NETWORK_EVENT`, `TEMPERATURE`, `POWER`, `GPI_EVENT`, `ANTENNA_EVENT`) but carries `alertDetails`. They are different surfaces — typically `alerts` to applications, `alert_short` to MDM.
- *See:* [When the reader needs to interrupt you](/observability/events/alerts)

**MM-13 — "Heartbeat's `data.batteryAlert.status: LOW` and the `alerts` event with id `BATTERY` mean the same thing."**

- *Wrong:* Same battery condition, same field.
- *Right:* The heartbeat is a **snapshot** — it reports current state each interval. The `alerts` event is a **transition** — it fires when state changes (`status: LOW` set, then later `CLEAR`). Pipelines designed for transitions cannot rely on heartbeat-snapshot fields.
- *See:* [Watch your reader's pulse](/observability/events/heartbeat)

### Inventory and operating mode

**MM-14 — "`control_operation` configures the inventory."**

- *Wrong:* I can specify profile or session inside `control_operation`.
- *Right:* `control_operation` is a switch (START/STOP) on a pre-configured radio. Operating mode is configured with `set_operating_mode` separately and **before** `START`. The two operations have non-overlapping responsibilities.
- *See:* [Start, stop, and the trigger button](/rfid/operating-mode/start-stop)

**MM-15 — "`set_operating_mode` can be applied any time."**

- *Wrong:* It's a configuration command, so it should always succeed.
- *Right:* It is rejected with error code 11 during active inventory. Stop the inventory with `control_operation STOP`, apply the new mode, restart.
- *See:* [Choose how the reader reads tags](/rfid/operating-mode/profiles)

---

### Reading this list

Misconceptions cluster around **defaults you assumed** (region, persistence, FAST_READ) and **field shapes you generalised wrong** (envelopes, casing). The fix in every case is to **read `mqtt-api-reference/<command>.md`** for the exact contract.

If you encounter a recurring wrong belief not on this list, add it. The MM-N identifiers are stable; new entries get new numbers.

**Related:** 📘 [Something's broken?](/reference/diagnose/symptom-index) · 📘 [Where things fail](/reference/diagnose/two-edges) · 📙 [Playbooks for getting back online](/reference/diagnose/recovery-playbooks) · 📕 [Glossary, limits, and cheat sheets](/foundations/introduction/glossary)
