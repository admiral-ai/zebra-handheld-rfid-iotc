---
id: system-operations
title: Updating firmware and rebooting
sidebar_label: Updating firmware and rebooting
---

> 📘 **EXPLANATION** · **Audience:** Fleet Operator, Solution Builder · **Read time:** ~5 min · **Ties to:** System Operations sub-tag of the API Reference

:::tip[See in the API Reference]
Sub-tag: System Operations. Operations: [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) · [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot).
:::

Two operations live on the system-operations surface. [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) starts a firmware update. [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) performs a warm reset. Both have one critical pre-condition in common: **inventory must not be running**.

### [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os), the firmware-update operation

The command is literally [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) (not `firmware_update` or `update_firmware`). It takes a `OSUpdateDetails` named payload with the firmware source URL and authentication settings.

Three install patterns are supported:

**No authentication (HTTP, dev/test environments):**

```json
{
  "command": "set_os",
  "requestId": "fw-001",
  "OSUpdateDetails": {
    "url": "https://192.168.29.39:8000/Build-3.10.27/Firmware",
    "authenticationType": "NONE"
  }
}
```

**Certificate auth with a pre-installed CA cert:**

```json
{
  "command": "set_os",
  "requestId": "fw-002",
  "OSUpdateDetails": {
    "url": "https://fwserver.example.com/firmware/PAAFKS00-013-R01E0.DAT",
    "authenticationType": "CERTIFICATE",
    "verificationType": "VERIFY_PEER",
    "caCertificateFile": "filestore_ca_cert"
  }
}
```

**Certificate auth with inline CA cert content:**

```json
{
  "command": "set_os",
  "requestId": "fw-003",
  "OSUpdateDetails": {
    "url": "https://fwserver.example.com/firmware/PAAFKS00-012-R02E0.DAT",
    "authenticationType": "CERTIFICATE",
    "verificationType": "VERIFY_PEER",
    "caCertificateFileContent": "-----BEGIN CERTIFICATE-----\nMIID...\n-----END CERTIFICATE-----"
  }
}
```

### Pre-conditions for [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os)

| Pre-condition | Error code if violated |
|---|---|
| No firmware update already running | `4` (Firmware update in progress) |
| Enough free flash storage | `8` (Insufficient flash size) |
| Firmware file exists at the URL | `9` (File not found) |
| Battery sufficiently charged | `14` (Battery is low, cannot update firmware) |

[`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) is **asynchronous**. The command may return code `0` (Success) or **`1` (Command payload is accepted)**, the device accepted the work and is processing in the background. Watch `alert_short` for `FIRMWARE_UPDATE_SUCCESS` or `FIRMWARE_UPDATE_FAIL`, and watch `alerts` for `id: "FIRMWARE_UPDATE"` with `state: "SET"` (in progress) followed by `state: "CLEAR"` (completed). The `firmwareUpdateEVT` event (when enabled in [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events)) carries progress percentages along the way.

`13` (Firmware update Failed) appears in a follow-up notification when the install itself fails after acceptance.

### [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot), the warm reset

[`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) is a minimal-payload command:

```json
{
  "command": "reboot",
  "requestId": "rb-001"
}
```

After a successful reboot:

- The reader automatically reconnects to its previously connected broker.
- **All management endpoint configurations are restored.** MGMT, MGMT_EVT, CTRL endpoints, certificate installs, Wi-Fi profiles, region, all survive.
- **Only radio operation configurations from the control endpoint are lost.** Any operating mode set at runtime and not persisted via [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) will need to be re-applied.

### Pre-condition for [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot)

| Pre-condition | Error code if violated |
|---|---|
| No active RFID inventory | `5` (Can't reboot device, inventory in progress) |

Stop inventory with `control_operation STOP` (and confirm with `get_status.deviceStatus.radioActivity == "INACTIVE"`) before [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot).

### A documented response-code discrepancy on [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot)

The reboot API reference example shows a response with `code: 1` and `description: "Command payload is accepted"`. The reboot **schema and error table** define only `0` (Success) and `5` (Inventory in progress). **Trust the schema.** Your client should accept `0` or `1` as success-equivalents and `5` as the only documented failure. If you observe other codes in practice, treat them as unexpected and log for follow-up, but write code that handles the canonical pair.

The discrepancy is recorded in the standard deployment guide §13.4.

### The firmware lifecycle

```
                  set_os
                    ↓
   downloading  →  verifying  →  applying  →  rebooting  →  reconnecting
   (HTTP fetch)    (signature)   (flashing)   (warm)       (mqttConnEVT
                                                            CONNECTED)
   ↓                ↓             ↓            ↓             ↓
 firmwareUpdateEVT progress events; alerts (FIRMWARE_UPDATE) state transitions
```

Each transition emits an event when event flags allow it. Subscribers consuming `alerts` and `firmwareUpdateEVT` see the full lifecycle.

### Operational guidance

- **Run [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) outside of inventory windows.** A reader that is rebooting is a reader that is not reading.
- **Pre-stage the firmware on a reachable HTTP server**, ideally on the same LAN as the readers. Cross-WAN downloads on hundreds of readers saturate the link.
- **Use `VERIFY_HOST_PEER` for production firmware servers.** Trusting `NONE` opens the door to a malicious firmware push.
- **Stagger fleet rollouts.** A simultaneous [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) to a thousand readers crushes both the firmware server and the broker (concurrent `firmwareUpdateEVT` traffic). Roll in waves of 50–100.
- **Verify the new version with [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) after reconnect.** Don't trust the `alert_short` alone.

### Out of scope

- **Firmware certificate management**, see [Securing the connection (TLS & certificates)](/infrastructure/security/model).
- **Fleet-scale rollout strategies**, see [Going from one reader to a fleet](/fleet/provisioning/models) and [Keeping a fleet in sync](/fleet/management/about-bulk).
- **Recovery from failed firmware update**, see [Playbooks for getting back online](/reference/diagnose/recovery-playbooks).

**Related:** 📘 [What your reader knows about itself](/infrastructure/management/device-state) · 📘 [Securing the connection (TLS & certificates)](/infrastructure/security/model) · 📘 [When the reader needs to interrupt you](/observability/events/alerts) · 📕 [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
