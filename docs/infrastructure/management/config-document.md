---
id: config-document
title: The reader's configuration document
sidebar_label: The reader's configuration document
---

> 📘 **EXPLANATION** · Audience: Solution builder, Fleet operator · Read time: ~7 min · Ties to the Device Configuration sub-tag of the API Reference

> **See in the API Reference**
> Sub-tag: Device Configuration. Operations: `get_config`, `set_config`.

### One document, many subsystems

The reader's saved configuration is exposed as a single JSON document under the `currentConfig` object. It contains every persistent setting on the device:

- `readerVersion`: identity (read-only mirror of `get_version`).
- `deviceStatus`: last-known runtime status (read-only mirror).
- `currentRegion`: regulatory configuration.
- `ethConfig`: Ethernet (if present).
- `wifiConfig`: Wi-Fi profiles.
- `installedCerts`: installed certificate references.
- `epConfig`: every configured MQTT endpoint.

Read this document with `get_config`. Write to it with `set_config.configData`.

### Three configuration scopes

| Scope | What it is | How it changes |
|---|---|---|
| Factory | Boot-time defaults shipped with firmware. | Restored by reset, where supported. |
| Saved | What persists across reboots. | Written by `set_config` and `config_endpoint`. |
| Runtime | What is currently in effect. | Updated immediately for most fields. For reboot-required fields, runtime deviates from saved until the next reboot. |

### Reboot persistence rule

Per the `reboot` operation contract, all management endpoint configurations are restored after reboot. Only radio operation configurations from control endpoint operations (active operating mode, in-progress inventory) are lost on reboot.

Two consequences follow:

- A `set_config` followed by a `reboot` re-establishes the management plane in its new state.
- An active inventory does not survive a reboot. The `reboot` operation is rejected with error code 5 if an inventory is running.

### Reconcile on reconnect

Your application's view of `currentConfig` may drift from the sled's authoritative state. Drift sources:

- Network gaps during which `set_config` calls were issued by another agent, such as an MDM or a technician.
- Reader reboots.
- Out-of-band edits via 123RFID Desktop or SOTI Connect.

On every `mqttConnEVT.CONNECTED`, run the reconcile protocol. Call `get_status`, then `get_config`, then `get_operating_mode`, then `get_post_filter`. Update your local model before resuming normal operation.

### A note on `set_config.configData`

The `set_config` operation is unusual among IOTC operations: its request payload field is `configData`, not the generic `payload` field used by some other operations. This is documented behavior. Do not paste a generic envelope.

### Related

[What your reader knows about itself](/infrastructure/management/device-state) · [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · [Choose what the reader tells you](/observability/events/configure) · [Updating firmware and rebooting](/infrastructure/management/system-operations) · [Keeping a fleet in sync](/fleet/management/about-bulk).
