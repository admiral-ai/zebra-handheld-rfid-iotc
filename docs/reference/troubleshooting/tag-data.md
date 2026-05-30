---
id: tag-data
title: How to troubleshoot tag-data issues
sidebar_label: How to troubleshoot tag-data issues
description: "Troubleshoot IOTC tag-data issues: duplicate reads, missing reads, dataEVT not arriving, channel mismatch (data1event/data2event), QoS, dedup strategies."
---

> 📙 **HOW-TO** · **Audience:** All · **Time:** ~10 min per symptom

This guide shows you how to troubleshoot tag-data anomalies on handheld readers.

#### Symptom: no tag data events received

- Verify subscription topic matches the configured channel (`data1event` vs `data2event`).
- Verify the wildcard pattern includes the right serial number.
- Verify the reader is actually running an operation — [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status) should show `operating_state: running`.

#### Symptom: events arrive but payloads are empty or partial

- Check the operating mode — `inventory` mode does not include RSSI even if your application expects it.
- Check the verbosity setting in [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) — compact mode omits default-value fields.

#### Symptom: duplicate tag reads

- Expected behaviour for raw (non-coalesced) reporting.
- Application should deduplicate per [Process tag data](/rfid/tag-data/process).

#### Symptom: timestamp drift

- The reader's clock has drifted beyond NTP correction range; check `exceptionEVT` for code `5010 clock_drift_detected`.
- Reboot to force NTP sync.

```d2
classes: {
  good: { style: { fill: "#e6f4ea"; stroke: "#1e8e3e"; font-color: "#137333" } }
  bad:  { style: { fill: "#fce8e6"; stroke: "#d93025"; font-color: "#c5221f" } }
}
S: Tag-data symptom
Q1: Events arriving? { shape: diamond }
RFID: See RFID-symptom tree
Q2: "Timestamps\ncorrect?" { shape: diamond }
Clock: "Clock drift;\ncheck NTP, exceptionEVT 5010" { class: bad }
Q3: "Duplicates\nexcessive?" { shape: diamond }
Dedupe: "Enable Unique-Tag\nreporting / app-side dedupe" { class: bad }
Q4: "Expected fields\npresent?" { shape: diamond }
Meta: "Update tagMetaDataToEnable\nvia set_operating_mode" { class: bad }
OK: Data flowing OK { class: good }
S -> Q1
Q1 -> RFID: No
Q1 -> Q2: Yes
Q2 -> Clock: No
Q2 -> Q3: Yes
Q3 -> Dedupe: Yes
Q3 -> Q4: No
Q4 -> Meta: No
Q4 -> OK: Yes

```

**Related:** 📙 [Configure Events](/observability/configure-events) · 📕 [dataEVT Schema](/rfid/dataevt-schema) · 📙 [Processing Tag Data](/rfid/tag-data/process) · 📘 [QoS Levels](/foundations/mqtt/qos)
