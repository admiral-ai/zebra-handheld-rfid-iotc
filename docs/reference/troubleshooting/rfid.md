---
id: rfid
title: How to troubleshoot RFID operation issues
sidebar_label: How to Troubleshoot RFID Operation Issues
description: "Troubleshoot IOTC RFID operations: tags not reading, inventory not starting, dense-reader interference, antenna range, operating-mode behaviour."
---

> 📙 **HOW-TO** · **Audience:** All · **Time:** ~15 min per symptom

This guide shows you how to troubleshoot RFID read failures on handheld readers.

#### Symptom: operation start succeeds but no tags read

- Verify tags are present in the field — wave a known-good tag close to the sled.
- Check [`get_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-post-filter), an over-restrictive include filter drops everything.
- Check [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode) `rf_power` — too-low power reduces effective range.
- Check the regulatory region — wrong region can disable the radio entirely.

#### Symptom: very low read rate / poor performance

- Tag orientation: linear tags read poorly when oriented perpendicular to the antenna.
- Tag population density: very large populations may need session tuning (S0 vs S1).
- Mode choice: `inventory_tid` is inherently slower than `inventory` — consider switching if TID is not actually needed.

#### Symptom: unexpected tags in results

- Filter not working: re-check filter pattern, offset, and length.
- Wildcard subscription delivering tags from another reader: verify topic subscription uses the right serial number.

#### Symptom: operation stops unexpectedly

- Check `exceptionEVT` for code `1002 rfid_radio_fault`.
- Battery dropped below operational threshold: check `heartbeatEVT.data.battery_percent`.
- Trigger was released (in `press_to_start` mode): operator-initiated stop is normal.

```d2
S: RFID symptom
Q1: "control_operation\nSTART accepted?" { shape: diamond }
Stop: "Already running;\nsend STOP first"
Cfg: "Check operating-mode\nconfig"
Q2: "dataEVT events\narriving?" { shape: diamond }
Q3: "Post-filter\nexcluding tags?" { shape: diamond }
Filt: Adjust post-filter
Q4: "Tag in\nread range?" { shape: diamond }
Range: "Move tags into range;\ncheck antenna power"
Rad: "Radio / firmware fault;\ncheck exceptionEVT"
S -> Q1
Q1 -> Stop: "No, code 11"
Q1 -> Cfg: "No, other code"
Q1 -> Q2: Yes
Q2 -> Q3: No
Q3 -> Filt: Yes
Q3 -> Q4: No
Q4 -> Range: No
Q4 -> Rad: Yes
```

**Related:** 📙 [Configure Operating Mode](/rfid/operating-mode/configure) · 📙 [Configure Filters](/rfid/operating-mode/post-filters-configure) · 📕 [CTRL endpoints](/reference/api-overview) · 📕 [Exception Codes](/reference/api-overview)
