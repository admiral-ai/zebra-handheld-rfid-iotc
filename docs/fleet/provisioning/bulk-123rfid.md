---
id: bulk-123rfid
title: How to provision readers in bulk with 123RFID Desktop
sidebar_label: How to Provision Readers in Bulk with 123RFID Desktop
description: "Provision IOTC readers in bulk with 123RFID Desktop: connect each sled over USB-C, push a saved profile (Wi-Fi, region, MDM), verify with get_version."
---

> 📙 **HOW-TO** · **Audience:** Fleet Operator · **Time:** ~30 min for 10 readers

This guide shows you how to provision multiple handheld readers using 123RFID Desktop profiles.

### Create a configuration profile

1. Open 123RFID Desktop with one reference reader connected via USB.
2. Configure the reference reader fully (region, Wi-Fi, MDM endpoint).
3. Choose **File to Export Profile** and save the `.iotcprofile` file.

### Apply to a batch of readers

For each reader in the batch:

1. Connect via USB.
2. In 123RFID Desktop, choose **File to Import Profile** and select the saved profile.
3. Click **Apply to Device**.
4. Wait for confirmation; disconnect.

A practiced operator can process ~1 reader per minute.

### Export/import profiles

Profiles are portable: the same `.iotcprofile` file works across compatible firmware versions. Store profiles in version control alongside other deployment artefacts.

### Verify post-apply

After provisioning, power on each reader. It should connect to MQTT within seconds over its own Wi-Fi. Subscribe to `mqttConnEVT` with a wildcard to confirm all batch members are online.

```d2
direction: right
RC: "Reference Reader\n(configured manually)"
Exp: "Export profile\n(.iotcprofile)"
VC: Version control { shape: cylinder }
Imp: "Import profile\n(123RFID Desktop)"
fleet: Target Readers {
  R1: Reader 1
  R2: Reader 2
  Rn: Reader N
}
RC -> Exp
Exp -> VC
VC -> Imp
Imp -> fleet.R1
Imp -> fleet.R2
Imp -> fleet.Rn

```

**Related:** 📘 [Provisioning Models](/fleet/provisioning-models) · 📗 [Phase 2: Single-Reader Bootstrap with 123RFID Desktop](/quick-start/phase-2)
