---
id: verify
title: How to verify a successful migration
sidebar_label: How to verify a successful migration
description: "Verify a successful IOTC migration: per-cohort smoke tests (get_version, get_status, control_operation), fleet drift check, SLO-anchored criteria."
---

> 📙 **HOW-TO** · **Audience:** Fleet Operator · **Time:** ~30 min

1. [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) on every reader — confirm `firmwareVersion` matches target.
2. Per-domain reads ([`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config)) on every reader — diff against pre-migration baseline.
3. Watch `alerts` rates over a representative shift, no firmware-related elevations.
4. Define "migration complete" exit criteria: 100% on target firmware; configuration drift score nominal; alert rates within baseline.
