---
id: system-operations
title: Updating firmware and rebooting safely
sidebar_label: Updating firmware and rebooting safely
---

> 📘 **EXPLANATION** · Audience: Fleet operator, Solution builder · Read time: ~7 min · Ties to: **System Operations** sub-tag of the API Reference

> **See in the API Reference**
> Sub-tag: System Operations
> Operations: `set_os` · `reboot`

### Two operations, two very different blast radii

The System Operations sub-tag contains the two highest-impact commands in the IOTC. Both interrupt normal operation; both warrant scheduled maintenance windows in production fleets.

| Operation | What it does | Persistence effect |
|---|---|---|
| `set_os` | Starts a firmware update workflow: download → verify → apply → reboot | Replaces firmware; preserves saved configuration; loses runtime state |
| `reboot` | Warm reset of the device | Preserves saved configuration; loses radio operation state from control endpoint |

### `set_os` — the firmware update lifecycle

`set_os` is how firmware updates start on the handheld IOTC. It supersedes the older `firmware_update` naming. The reader downloads from a provided URL with chosen authentication, verifies the image, applies it, then reboots into the new firmware.

| Phase | Reader behavior | Event emitted |
|---|---|---|
| Validate request | Checks battery (rejects on low battery: error code 14) and flash availability (rejects on insufficient: error code 8) | — |
| Download | Pulls firmware from the source URL with selected `authenticationType` and `verificationType` | (file download events) |
| Verify | Validates the firmware signature | — |
| Apply | Writes the new image | — |
| Reboot | Restarts; comes back on the new firmware | `mqttConnEVT` reconnect |

`authenticationType` is `NONE` or `CERTIFICATE`. `verificationType` is `NONE`, `VERIFY_PEER`, `VERIFY_HOST`, or `VERIFY_HOST_PEER`. In production, use `VERIFY_HOST_PEER`.

### `reboot` — the inventory-state constraint

`reboot` is rejected with **error code 5** if an RFID inventory is in progress. The protocol: stop the inventory first.

```json
// Step 1: stop the inventory
{ "command": "control_operation", "operation": "stop", "requestId": "stop-pre-reboot" }

// Step 2: reboot
{ "command": "reboot", "requestId": "reboot-001" }
```

After a successful reboot, the reader automatically reconnects to its previously configured server. No manual reconnection is required.

### What reboot preserves and what it loses

- **Preserves:** every management endpoint configuration, all saved Wi-Fi profiles, installed certificates, and `currentConfig`.
- **Loses:** the current radio operation (active inventory, in-flight access operations). These come from control endpoint commands and are runtime-only.

### Operational guidance

- **Production firmware rollout.** Canary 5–10% first; observe `mqttConnEVT` reconnects and post-update `get_version`; then roll out in cohorts.
- **Rollback.** If a `set_os` update fails or behaves badly, point `set_os` at the previous firmware image. The same operation rolls forward and back.
- **Scheduled reboot.** Stop inventory → wait for the operator's shift gap → issue `reboot` → wait for `mqttConnEVT.CONNECTED` → run the reconcile protocol.

**Related:** [Device state and identity](/infrastructure/management/device-state) · [The configuration document](/infrastructure/management/config-document) · [Recovery playbooks](/reference/diagnose/recovery-playbooks).
