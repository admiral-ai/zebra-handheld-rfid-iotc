---
id: config-document
title: The one big config document
sidebar_label: The one big config document
---

> 📘 **EXPLANATION** · Audience: Solution builder, Fleet operator · Read time: ~7 min · Ties to: **Device Configuration** sub-tag of the API Reference

> **See in the API Reference**
> Sub-tag: Device Configuration
> Operations: `get_config` · `set_config`

### One document, many subsystems

The reader's saved configuration is exposed as a single JSON document under the `currentConfig` object. It contains every persistent setting on the device:

- `readerVersion` — identity (read-only mirror of `get_version`)
- `deviceStatus` — last-known runtime status (read-only mirror)
- `currentRegion` — regulatory configuration
- `ethConfig` — Ethernet (if present)
- `wifiConfig` — Wi-Fi profiles
- `installedCerts` — installed certificate references
- `epConfig` — every configured MQTT endpoint

You read this document with `get_config`. You write to it with `set_config.configData`.

### Three configuration scopes

| Scope | What it is | How it changes |
|---|---|---|
| **Factory** | Boot-time defaults shipped with firmware | Restored by reset (where supported) |
| **Saved** | What persists across reboots | Written by `set_config` and `config_endpoint` |
| **Runtime** | What is currently in effect | Updated immediately for most fields; for reboot-required fields, deviates from saved until the next reboot |

### Reboot persistence rule

Important: per the `reboot` operation contract — **all management endpoint configurations are restored after reboot.** Only radio operation configurations from control endpoint operations (e.g., active operating mode, in-progress inventory) are lost on reboot. This means:

- A `set_config` followed by a `reboot` re-establishes the management plane in its new state.
- An active inventory does **not** survive a reboot — and `reboot` is rejected with error code 5 if an inventory is running.

### Reconcile on reconnect

Your application's view of `currentConfig` may drift from the sled's authoritative state. Drift sources:

- Network gaps during which `set_config` calls were issued by another agent (MDM, technician)
- Reader reboots
- Out-of-band edits via 123RFID Desktop or SOTI Connect

On every `mqttConnEVT.CONNECTED`, run the reconcile protocol: `get_status` → `get_config` → `get_operating_mode` → `get_post_filter`. Update your local model before resuming normal operation.

### A note on `set_config.configData`

`set_config` is unusual among IOTC operations: its request payload field is `configData`, not the generic `payload` field used by some other operations. This is documented; do not paste a generic envelope.

**Related:** [Device state and identity](/infrastructure/management/device-state) · [MQTT endpoint architecture](/infrastructure/endpoints/about) · [Event configuration](/observability/events/configure) · [System operations](/infrastructure/management/system-operations) · [Bulk configuration and drift](/fleet/management/about-bulk).
