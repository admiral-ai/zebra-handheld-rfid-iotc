---
id: bulk-management
title: Keeping a fleet in sync
sidebar_label: Keeping a fleet in sync
description: "Bulk fleet management for IOTC readers: apply config across many readers, detect and remediate drift, and read current state via get_config."
---

> 📘 **EXPLANATION** · **Audience:** Fleet Operator · **Read time:** ~5 min

A reader's configuration drifts. Operators tweak settings locally. Failed configuration pushes leave devices in mixed states. Firmware updates reset radio-operation state. **Keeping a fleet in sync is the operational pattern that catches drift and reconciles it.** IOTC gives you the primitives; you (or your MDM) implement the loop.

### The asymmetric pair: [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) vs [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config)

The configuration document's two operations have asymmetric scope by design:

- **[`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config)**, a comprehensive read. Returns every adjustable field.
- **[`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config)**, a narrow write. Updates only the fields you supply. Omitted fields retain their value.

This pair *is* the reconciliation primitive. [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) tells you what is; [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) tells the reader what should be. The difference is the diff; pushing the diff is reconciliation.

### The reconciliation loop

```
                                ┌───────────────────────┐
   Per device, on schedule:    │                       │
                                ▼                       │
         get_config  →  current_state                   │
                              ↓                         │
   canonical_for(device)  →   target_state              │
                              ↓                         │
                   diff = target - current              │
                              ↓                         │
                  if diff:  set_config(diff)            │
                              ↓                         │
                   get_config  →  verify_state          │
                              ↓                         │
              if verify_state ≠ target_state:           │
                   alert("set_config failed")           │
                              │                         │
                              └─────  next interval ────┘
```

Three knobs:

- **Cadence.** Hourly is common; per-heartbeat is aggressive; daily is light-touch. Cadence trades freshness against broker load.
- **Definition of "canonical"**, typically per device class (RFD40-Premium-EU, RFD90-US-warehouse), stored in your MDM or configuration system.
- **Failure handling**: what happens when [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) returns an error or the verify step disagrees. Most MDM platforms expose this as a "drift alert" the operator triages.

### What lives elsewhere

[`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) / [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) are for **device-wide adjustable state** — batching, retention, NTP, daylight saving, default operating-mode profile. They are **not** for:

- **Endpoints**: [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) is its own surface. See [How the MQTT plumbing fits together](/infrastructure/endpoints/about).
- **Operating mode**: [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) is its own surface. See [Choose how the reader reads tags](/rfid/operating-mode-profiles).
- **Event configuration**: [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) is its own surface. See [Choose what the reader tells you](/observability/configure-events).
- **Certificates**: [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) / [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate). See [Securing the connection](/infrastructure/security/model).

A complete sync strategy reads all five surfaces and reconciles each against its target. The pattern is the same; the operation differs per surface.

### Persistence and reboot

Persistence is uneven across surfaces:

- **All management endpoint configuration survives [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot)**: Wi-Fi profiles, endpoints, certificates, event configuration, device-wide configuration.
- **Operating mode (radio operation) does NOT survive [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot)**: re-apply [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) on every boot if you need a specific mode.

This asymmetry has two implications for sync:

1. **Don't try to "sync operating mode" via reboot-resilient means.** Apply it on every boot, possibly triggered by the `mqttConnEVT CONNECTED` reconnect signal.
2. **Treat operating-mode drift differently from config drift.** Config drift suggests local tampering or partial failure; operating-mode drift suggests a recent reboot.

### Failure modes the loop catches

- **Partial [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config).** Some fields applied, others didn't. Verify step catches this.
- **Local operator edits via 123RFID Desktop.** Drift appears at the next cadence tick.
- **Stale canonical configs.** When the canonical is out of date relative to the actual fleet, diff produces nonsense. Mitigate with a "canonical confidence" review at the policy-management layer.
- **Failed firmware rollback to old config.** Catches the case where a firmware update reset something it shouldn't have.

### Bulk patterns

You can run the reconciliation loop:

- **Pull model**, your controller iterates through serial numbers, runs the loop per device. Simple, sequential, slow.
- **Push model**, your controller sends the same [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) to many devices in parallel (one publish per device, broker fans out the responses). Faster but harder to observe success per device.
- **MDM model**, your MDM does both, on a schedule, with built-in drift surfacing.

For fleets above ~50 devices, the manual pull model is impractical. Either build push tooling or use MDM.

### Bandwidth and broker cost

[`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) returns a comprehensive snapshot, typically 5–20 KB per response. Running it hourly across 1,000 readers is ~17 MB / hour just for configuration reads. Most brokers handle this comfortably; bandwidth-constrained deployments (cellular-backhauled industrial sites) should consider less frequent cadence, or read smaller subsets via per-surface operations ([`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config), [`get_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-wifi)) when only specific drift classes matter.

### Out of scope

- **The detailed field schema of [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config)**, see `mqtt-api-reference/set_config.md`.
- **MDM tooling**: covered in [Going from one reader to a fleet](/fleet/provisioning-models).
- **Retry and retention under intermittent connectivity**, see [What happens when the network drops](/fleet/retention-and-retry).

**Related:** 📘 [The reader's configuration document](/infrastructure/config-document) · 📘 [Going from one reader to a fleet](/fleet/provisioning-models) · 📘 [What happens when the network drops](/fleet/retention-and-retry) · 📕 [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
