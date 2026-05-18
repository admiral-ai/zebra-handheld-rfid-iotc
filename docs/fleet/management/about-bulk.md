---
id: about-bulk
title: Keeping a fleet in sync
sidebar_label: Keeping a fleet in sync
---

> 📘 **EXPLANATION** · Audience: Fleet Operator · Read time: ~5 min

IOTC provides two bulk-configuration endpoints with **asymmetric scope**: `get_config` returns a comprehensive device snapshot, while `set_config` writes back a narrow subset.

### What `get_config` returns

A complete state snapshot including:

- `readerVersion` — firmware, model, serial, SKU, scanner and radio firmware versions
- `deviceStatus` — power source, radio activity, temperature, NTP state, battery
- `currentRegion` — country, regulatory standard, max/min Tx power, channel list, LBT and frequency-hopping flags
- `ethConfig` — Ethernet interface state and IPv4 configuration
- `wifiConfig` — Wi-Fi interface state, active access point, IPv4 configuration
- `installedCerts` — installed certificate names and metadata
- `epConfig` — active endpoint configuration including `mqttParams`, `securityParams`, `eventConfiguration`

`get_config` is the canonical baseline-capture mechanism.

### What `set_config` writes

Only three top-level sub-objects:

- `configData.wifiConfig` — Wi-Fi profile create or modify
- `configData.epConfig` — endpoint add, update, or delete
- `configData.applyAfterReboot` — defers application until reboot

`set_config` does **not** write operating mode, post-filters, certificates, region, or system operations. Each of those is set via its own command (`set_operating_mode`, `set_post_filter`, `install_certificate`, region via 123RFID, etc.).

### Implication

You can capture a full baseline with `get_config`, but you cannot replay it with a single `set_config`. Replaying a baseline across a fleet involves a sequence of per-domain commands: `install_certificate` first, then `set_wifi`, then `config_endpoint`, then `set_operating_mode`, then `config_events`. The migration cluster in [§14.5–14.7](/fleet/migration/plan) shows the pattern.

### `applyAfterReboot`

When `applyAfterReboot: true`, Wi-Fi and endpoint changes are staged and take effect on the next reboot. When `false` or omitted, changes apply immediately. Use the deferred form for cases where the new endpoint configuration would otherwise disconnect the reader before subsequent commands could be processed.

**Related:** 📕 [§16.2 get_config / set_config](#chapter-16--mqtt-api-reference) · 📙 [§14.3 Apply Bulk Configuration](/fleet/management/apply-config) · 📕 [§20.1 Configuration Schema](/reference/appendices/config-schema)
