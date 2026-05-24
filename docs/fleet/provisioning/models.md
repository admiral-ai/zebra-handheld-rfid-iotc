---
id: models
title: Going from one reader to a fleet
sidebar_label: Going from one reader to a fleet
---

> 📘 **EXPLANATION** · **Audience:** Solution Builder, Fleet Operator · **Read time:** ~5 min

A single reader provisioned through 123RFID Desktop is the Quick Start. A hundred readers, or a thousand, is a different problem. **Three provisioning paths cover the spectrum.** Choose by fleet size and operational policy, not by technical capability.

### Three paths

| Path | Fleet size | Effort per reader | Best for |
|---|---|---|---|
| **123RFID Desktop** | 1 – ~10 | High (manual, physically present) | Evaluation, single-reader deployments, pilot studies |
| **Bulk-123RFID** | 10 – 100 | Medium (semi-automated, batch via Desktop) | Single-site deployments, controlled rollouts |
| **MDM (SOTI Connect or 42Gears SureMDM)** | 100+ | Low (fully managed, policy-driven) | Production fleets, multi-site, regulated environments |

These are additive, not exclusive. A typical lifecycle uses 123RFID Desktop for the first reader (to validate the pipeline end-to-end), bulk for the initial wave, and MDM for steady-state and growth.

### 123RFID Desktop, the bootstrap reality

For every reader, regardless of path, **the first MDM endpoint is provisioned through 123RFID Desktop.** This is non-negotiable: regulatory region and Wi-Fi credentials cannot be set over MQTT, only over the local Bluetooth or USB management session.

For a single reader, that's it, 123RFID Desktop also handles broker URL, MDM endpoint creation, and certificate install if needed.

### Bulk-123RFID, the same tool, multiple devices

For 10–100 readers, an operator can run 123RFID Desktop in a batch mode that applies the same configuration profile to each connected reader in sequence. The reader-side effect is identical to the single-device flow; the operator-side effect is "press button, attach reader, press button" rather than "configure from scratch."

This path scales linearly with operator time. Above ~100 readers it stops being economical.

### MDM, the production path

For 100+ readers, an MDM platform takes over after the initial 123RFID Desktop bootstrap. The handoff is:

1. **123RFID Desktop** sets region, Wi-Fi, and **the MDM endpoint pointing at the MDM platform's broker** (not the application broker).
2. **The MDM platform** receives the reader's first connection on its broker, applies the policy bundle (additional endpoints, certificates, operating mode, event configuration, firmware version) via [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint), [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate), [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config), [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode), [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os).
3. **Steady state**: MDM owns provisioning, firmware rollout, configuration drift detection, and the `alert_short` consumption pipeline.

Two MDM platforms have first-class IOTC support:

- **SOTI Connect**: Zebra's reference MDM partner. The `epType: SOTI` endpoint type exists specifically for SOTI integration. SOTI consumes `alert_short` for fleet health.
- **42Gears SureMDM**: alternative MDM with parallel IOTC support.

Both consume the same MQTT API surface; there is no MDM-specific command set. They differ in policy management, reporting, and integration with broader fleet management functions (kiosk mode, app deployment, etc.).

### What MDM does that you cannot easily do alone

- **Certificate rotation at scale.** Push a new CA cert to a fleet, reconfigure endpoints to use it, retire the old cert, all from a console.
- **Firmware rollout staging.** Roll firmware to 50 readers, watch for `FIRMWARE_UPDATE_FAIL` alert_short events, halt if failure rate exceeds threshold.
- **Drift detection.** Periodic [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) per reader, diff against canonical, surface drift to operators.
- **Provisioning new readers from a template.** A reader powers on, connects to the MDM endpoint, gets its policy bundle, no per-device manual configuration.

You can build all of this yourself on top of the MQTT API. MDM is the off-the-shelf version.

### The region constraint

**Region is still set via 123RFID Desktop, even with MDM.** MDM cannot set the regulatory region over MQTT. For a brand-new sled, somebody with a Windows laptop physically meets the device once to set the region and the initial MDM endpoint. After that, MDM owns it.

There are deployment patterns that minimise this friction:

- **Pre-configured shipping**: Zebra (or a configured-receiving partner) ships readers with region and MDM endpoint already set. Operator unboxes and powers on; no laptop required.
- **Centralised provisioning**: readers arrive at a central depot, get bootstrapped, ship to sites.
- **Region-pinned bulk**: operator uses Bulk-123RFID to set region across a batch in one session.

### Choosing: decision matrix

| If you have… | And you want… | Use |
|---|---|---|
| 1–5 readers | To start tomorrow | 123RFID Desktop, single-reader flow |
| 10–50 readers, single site | To start this week | Bulk-123RFID |
| 50+ readers, multi-site | Steady-state operational control | SOTI Connect or SureMDM |
| Existing MDM investment (SOTI / 42Gears) | Reader fleet integrated with the rest | The MDM you already use |
| Strict compliance / audit requirements | Verified configuration state | MDM with drift detection |

### Out of scope

- **The mechanics of [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint), [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config), etc.**: covered in Part 4 (Manage your reader).
- **Bulk configuration patterns over MQTT**: covered in [Keeping a fleet in sync](/fleet/management/about-bulk).
- **Reliability under intermittent connectivity**: covered in [What happens when the network drops](/fleet/reliability/retention-retry).

**Related:** 📘 [Bootstrap with 123RFID Desktop](/getting-started/quick-start/step-2-discover) · 📘 [Keeping a fleet in sync](/fleet/management/about-bulk) · 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📘 [Updating firmware and rebooting](/infrastructure/management/system-operations)
