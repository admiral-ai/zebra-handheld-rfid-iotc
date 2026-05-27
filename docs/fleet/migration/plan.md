---
id: plan
title: How to plan an IOTC migration
sidebar_label: How to Plan a Migration
description: "Plan a migration to (or within) IOTC: inventory readers, choose target firmware and config, define cohorts and rollout rings, set verification gates."
---

> 📙 **HOW-TO** · **Audience:** Fleet Operator, Solution Builder · **Time:** ~2 hours planning

A handheld-reader migration is firmware-version-based. The IOTC V1.0 and V1.1 API surfaces are both accepted on firmware 3.10.27+; "migration" therefore means rolling firmware forward and confirming the deployment continues to function.

### Pre-migration baseline

For each reader in scope, issue [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) and store the response as the baseline. This captures the full state including endpoints, Wi-Fi profiles, certificates (by reference), and the active operating-mode configuration.

### Risk register

- Firmware revert is not supported on handheld readers — plan migration as a one-way operation.
- A canary cohort (1–5%) must validate the new firmware before fleet-wide rollout.
- [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) accepts the firmware URL and authentication; the reader downloads and reboots.

### Go/no-go checklist

- [ ] Baseline [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) captured for every reader
- [ ] Canary cohort identified
- [ ] Firmware URL reachable from the reader's network
- [ ] Sufficient battery (else error code 14) and flash (else code 8) on canary devices
- [ ] Rollback playbook (re-bootstrap via 123RFID) documented
