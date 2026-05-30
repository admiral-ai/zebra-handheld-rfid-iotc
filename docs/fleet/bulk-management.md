---
id: bulk-management
title: Keeping a fleet in sync
sidebar_label: Keeping a fleet in sync
description: "Bulk fleet management for IOTC readers: read each configuration surface, diff against desired state, and reconcile drift with per-domain commands."
---

> 📘 **EXPLANATION** · **Audience:** Fleet Operator · **Read time:** ~5 min

A reader's configuration drifts. Operators tweak settings locally. Failed configuration pushes leave devices in mixed states. Firmware updates reset radio-operation state. **Keeping a fleet in sync is the operational pattern that catches drift and reconciles it.** IOTC gives you the primitives; you (or your MDM) implement the loop.

### Reconcile each surface independently

IOTC has no single device-wide read/write. Instead, each configuration surface has its own read and write operations, and you reconcile each one against its target:

| Surface | Read | Write |
|---|---|---|
| MQTT endpoints | [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) | [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) |
| Wi-Fi profiles | [`get_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-wifi) | [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) · [`delete_wifi_profile`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-wifi-profile) |
| Operating mode | [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode) | [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) |
| Certificates | [`get_installed_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-installed-certificate) | [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) · [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate) |
| Event configuration | per active endpoint's `eventConfiguration` | [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) |

Read each surface, compare it with the canonical target for that device class, and push the difference. The difference is the diff; pushing the diff is reconciliation.

### The reconciliation loop

```
                                ┌───────────────────────┐
   Per device, on schedule:     │                       │
                                ▼                       │
   read each surface  →  current_state                  │
                              ↓                          │
   canonical_for(device)  →   target_state              │
                              ↓                          │
                   diff = target - current              │
                              ↓                          │
        if diff:  write the affected surface(s)         │
                              ↓                          │
   re-read affected surfaces  →  verify_state           │
                              ↓                          │
              if verify_state ≠ target_state:           │
                   alert("reconcile failed")            │
                              │                          │
                              └─────  next interval ────┘
```

Three knobs:

- **Cadence.** Hourly is common; per-heartbeat is aggressive; daily is light-touch. Cadence trades freshness against broker load.
- **Definition of "canonical"** — typically per device class (RFD40-Premium-EU, RFD90-US-warehouse), stored in your MDM or configuration system.
- **Failure handling** — what happens when a write returns an error or the verify step disagrees. Most MDM platforms expose this as a "drift alert" the operator triages.

### Persistence and reboot

Persistence is uneven across surfaces:

- **All management endpoint configuration survives [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot)**: Wi-Fi profiles, endpoints, certificates, event configuration.
- **Operating mode (radio operation) does NOT survive [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot)**: re-apply [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) on every boot if you need a specific mode.

This asymmetry has two implications for sync:

1. **Don't try to "sync operating mode" via reboot-resilient means.** Apply it on every boot, possibly triggered by the `mqttConnEVT CONNECTED` reconnect signal.
2. **Treat operating-mode drift differently from endpoint/Wi-Fi drift.** Endpoint or Wi-Fi drift suggests local tampering or partial failure; operating-mode drift suggests a recent reboot.

### Failure modes the loop catches

- **Partial write.** Some fields applied, others didn't. The verify step catches this.
- **Local operator edits via 123RFID Desktop.** Drift appears at the next cadence tick.
- **Stale canonical configs.** When the canonical is out of date relative to the actual fleet, the diff produces nonsense. Mitigate with a "canonical confidence" review at the policy-management layer.
- **Failed firmware rollback to old config.** Catches the case where a firmware update reset something it shouldn't have.

### Bulk patterns

You can run the reconciliation loop:

- **Pull model** — your controller iterates through serial numbers, running the loop per device. Simple, sequential, slow.
- **Push model** — your controller sends the same write to many devices in parallel (one publish per device, the broker fans out the responses). Faster but harder to observe success per device.
- **MDM model** — your MDM does both, on a schedule, with built-in drift surfacing.

For fleets above ~50 devices, the manual pull model is impractical. Either build push tooling or use MDM.

### Bandwidth and broker cost

Reading every surface per device has a cost. [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) responses are typically a few KB each; reading all surfaces hourly across 1,000 readers adds up. Most brokers handle this comfortably; bandwidth-constrained deployments (cellular-backhauled industrial sites) should reconcile less frequently, or read only the surfaces whose drift classes matter.

### Out of scope

- **MDM tooling**: covered in [Going from one reader to a fleet](/fleet/provisioning-models).
- **Retry and retention under intermittent connectivity**: see [What happens when the network drops](/fleet/retention-and-retry).

**Related:** 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📘 [Going from one reader to a fleet](/fleet/provisioning-models) · 📘 [What happens when the network drops](/fleet/retention-and-retry)
