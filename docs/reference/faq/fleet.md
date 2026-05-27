---
id: fleet
title: Fleet management FAQs
sidebar_label: Fleet Management FAQs
description: "Frequently asked questions about IOTC fleet management: bulk configuration, drift detection, MDM (SOTI / 42Gears), rolling out firmware across readers."
---

> 📕 **REFERENCE**

**Q:** Does IOTC support SOTI Connect?
**A:** Yes. SOTI Connect is the recommended MDM platform for handheld IOTC fleets.
**Details:** [How to Set Up Zero-Touch Provisioning with SOTI Connect](/fleet/provisioning/soti-connect)

---

**Q:** How do I update firmware across a fleet?
**A:** Issue [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) to each reader, ideally orchestrated through SOTI Connect or your automation pipeline.
**Details:** [How to Execute a Phased Fleet Migration](/fleet/migration/execute)

---

**Q:** Can I roll back firmware on handheld readers?
**A:** No. Firmware revert is not supported on this hardware family.
**Details:** [How to Plan a V1.0 to V1.1 Migration](/fleet/migration/plan)

---

**Q:** How do I monitor fleet health?
**A:** Subscribe to fleet-wide `heartbeatEVT` and `mqttConnEVT` with wildcard topics.
**Details:** [How to Build a Fleet Health Dashboard](/observability/monitoring/fleet-dashboard)
