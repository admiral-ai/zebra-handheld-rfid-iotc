---
id: phase-7
title: "Phase 7: Reboot when needed"
sidebar_label: "Phase 7: Reboot when needed"
description: "Phase 7 of the IOTC Quick Start: when and how to reboot the reader. Covers what survives a reboot (most config) vs what is reset (active inventory state)."
---

> 📗 **TUTORIAL** · **Phase:** 7 of 7 · **Audience:** Integrator / Fleet Operator · **Time:** ~3 min

**Artifact this phase produces:** a clean warm reset of the sled that preserves all management endpoint configuration. You finish the Quick Start knowing how, when, and **when not**, to reboot.

### Why this phase exists

[`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) is a small operation with one big rule: **it cannot run during active RFID inventory.** Get this wrong and you either lose nothing (the command is rejected) or you interrupt an inventory and have to clean up state. Knowing the pre-conditions is the whole content of this phase.

### What [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) does

A warm reset of the device. After a successful reboot:

- The reader automatically reconnects to its previously connected broker.
- **All management endpoint configurations are restored**: MGMT, MGMT_EVT, CTRL endpoints, certificate installs, Wi-Fi profiles, region.
- **Only radio operation configurations from the control endpoint are lost.** If you set an operating mode that wasn't persisted, you'll need to re-apply it.

Use [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) when you need to:

- Apply changes that require a restart.
- Recover from a stuck or inconsistent state.
- Reinitialize device connections (e.g., after broker change).

### What must happen before reboot

- Stop any active RFID inventory using `control_operation STOP`.
- Confirm inventory is not running (you saw the stop response).
- Confirm the device can safely restart (no firmware download in progress, etc.).

If inventory is active when you send [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot), the reader returns error code 5 ("Can't reboot device, inventory in progress") and the command is a no-op.

### What to do

#### 1. Confirm inventory is stopped

If you ran Phase 6 to completion, you already sent `STOP`. To be sure:

```bash
mosquitto_pub -h <broker-host> -p 1883 \
  -t 'zebra/MDM/clients/cmnd/RFD40-24190525100255' \
  -m '{"command":"get_status","requestId":"status-001"}'
```

The response's `deviceStatus.radioActivity` should be `INACTIVE`. If it's `ACTIVE`, send `control_operation STOP` first (Phase 6).

#### 2. Send [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot)

The payload is the minimal two-field form:

```bash
mosquitto_pub -h <broker-host> -p 1883 \
  -t 'zebra/MDM/clients/cmnd/RFD40-24190525100255' \
  -m '{"command":"reboot","requestId":"reboot-001"}'
```

#### 3. Read the response

The canonical schema defines two response codes: `0` (Success) and `5` (Can't reboot device, inventory in progress).

```json
{
  "command": "reboot",
  "requestId": "reboot-001",
  "apiVersion": "V1.1",
  "response": { "code": 0, "description": "Success" }
}
```

:::caution[A documented discrepancy]
The reboot API reference also shows an example response with `code: 1` and the description "Command payload is accepted." The schema and error table only define `0` and `5`. **Trust the schema.** If you receive `1`, treat it as a successful acceptance equivalent to `0`, but write your client to handle `0` and `5` as the canonical contract.
:::

#### 4. Wait for reconnection

The sled will go offline briefly (typically 10–30 seconds) and come back online. You'll see a `mqttConnEVT` with `connectionState: "DISCONNECTED"` followed by `connectionState: "CONNECTED"` once it returns:

```json
{
  "connectionState": "CONNECTED",
  "timestamp": "14:32:18",
  "deviceModel": "RFD40",
  "deviceSerialNo": "RFD40-24190525100255",
  "apiVersion": "1.0",
  "mqttVersion": "3.1.1"
}
```

:::caution[Note on mqttConnEVT timestamp]
The canonical schema specifies an `HH:MM:SS` format, not a full ISO 8601 string. This is documented in the API reference and matches the example above. Applications that try to parse a full date will fail on this field.
:::

#### 5. Confirm management config survived

Re-run [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) from Phase 4. You should see the same MDM, CTRL, and DATA1 endpoints active. The reboot preserved them.

### Error codes

| Code | Meaning | Action |
|---|---|---|
| `0` | Success | Reader is rebooting; await reconnect. |
| `5` | Can't reboot device, inventory in progress | Send `control_operation STOP` first, then retry [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot). |

### Success check

- [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) returns `response.code: 0`.
- Sled goes offline and comes back within ~30 seconds.
- `mqttConnEVT` shows a CONNECTED state after the disconnect.
- [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) shows the same endpoint set you had before reboot.

### You've completed the Quick Start

Seven phases. Seven artifacts. From an unboxed sled to a managed reader you can configure, run, observe, and recover. The rest of the documentation is the long version of what you just did.

Recommended next reads based on what you need:

- **Production hardening.** [What happens when the network drops](/fleet/retention-and-retry) for retention and retry; [Securing the connection (TLS & certificates)](/infrastructure/security/model) to promote from plain MQTT to TLS.
- **Tuning tag reads.** [Choose how the reader reads tags](/rfid/operating-mode-profiles) for the five supported profiles; [Filter tags before vs after the read](/rfid/post-filters) for pre-filters and post-filters.
- **Observing fleet health.** [Watch your reader's pulse](/observability/heartbeat) for heartbeats; [When the reader needs to interrupt you](/observability/alerts) for alerts; [Knowing when you're connected](/observability/mqtt-connection) for `mqttConnEVT`.
- **Going to many sleds.** [Going from one reader to a fleet](/fleet/provisioning-models).
- **Things people get wrong.** [Things people get wrong about IOTC](/diagnose/misconceptions), the misconception inventory pays for itself in production.

