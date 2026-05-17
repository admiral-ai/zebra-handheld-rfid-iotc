---
id: verify
title: How to Verify a Successful Migration
sidebar_label: How to Verify a Successful Migration
---

1. `get_version` on every reader — confirm `firmwareVersion` matches target.
2. `get_config` on every reader — diff against pre-migration baseline.
3. Watch `alerts` rates over a representative shift — no firmware-related elevations.
4. Define "migration complete" exit criteria: 100% on target firmware; configuration drift score nominal; alert rates within baseline.
