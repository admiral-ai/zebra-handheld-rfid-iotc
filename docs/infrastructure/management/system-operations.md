---
id: system-operations
title: Updating firmware and rebooting
sidebar_label: Updating firmware and rebooting
---

> 📘 **EXPLANATION** · Audience: Fleet operator, Solution builder · Read time: ~7 min · Ties to the System Operations sub-tag of the API Reference

> **See in the API Reference**
> Sub-tag: System Operations. Operations: `set_os`, `reboot`.

### Two high-impact operations

The System Operations sub-tag contains the two highest-impact commands in the IOTC. Both interrupt normal operation. Both warrant scheduled maintenance windows in production fleets.

| Operation | What it does | Persistence effect |
|---|---|---|
| `set_os` | Starts a firmware update workflow: download, verify, apply, reboot. | Replaces firmware. Preserves saved configuration. Loses runtime state. |
| `reboot` | Warm reset of the device. | Preserves saved configuration. Loses radio operation state from control endpoint. |

### The firmware update lifecycle (`set_os`)

The `set_os` command is how firmware updates start on the handheld IOTC. It supersedes the older `firmware_update` naming. The reader downloads from a provided URL using the chosen authentication, verifies the image, applies it, and then reboots into the new firmware.

| Phase | Reader behavior | Event emitted |
|---|---|---|
| Validate request | Checks battery (rejects on low battery with error code 14) and flash availability (rejects on insufficient flash with error code 8). | None. |
| Download | Pulls firmware from the source URL using the selected `authenticationType` and `verificationType`. | File download events. |
| Verify | Validates the firmware signature. | None. |
| Apply | Writes the new image. | None. |
| Reboot | Restarts. Comes back on the new firmware. | `mqttConnEVT` reconnect. |

The `authenticationType` field is `NONE` or `CERTIFICATE`. The `verificationType` field is `NONE`, `VERIFY_PEER`, `VERIFY_HOST`, or `VERIFY_HOST_PEER`. In production, use `VERIFY_HOST_PEER`.

### The inventory-state constraint on `reboot`

The `reboot` command is rejected with error code 5 if an RFID inventory is in progress. The protocol is to stop the inventory first.

```json
// Step 1: stop the inventory
{ "command": "control_operation", "operation": "stop", "requestId": "stop-pre-reboot" }

// Step 2: reboot
{ "command": "reboot", "requestId": "reboot-001" }
```

After a successful reboot, the reader automatically reconnects to its previously configured server. No manual reconnection is required.

### What reboot preserves and what it loses

A reboot preserves every management endpoint configuration, all saved Wi-Fi profiles, installed certificates, and the `currentConfig` document.

A reboot loses the current radio operation, including an active inventory and any in-flight access operations. These come from control endpoint commands and are runtime-only.

### Operational guidance

For a production firmware rollout, canary 5 to 10 percent first. Observe `mqttConnEVT` reconnects and post-update `get_version`. Then roll out in cohorts.

For a rollback, point `set_os` at the previous firmware image. The same operation rolls forward and back.

For a scheduled reboot, stop the inventory, wait for the operator's shift gap, issue `reboot`, wait for `mqttConnEVT.CONNECTED`, then run the reconcile protocol.

### Related

[What your reader knows about itself](/infrastructure/management/device-state) · [The reader's configuration document](/infrastructure/management/config-document) · [Playbooks for getting back online](/reference/diagnose/recovery-playbooks).
