---
id: fleet
title: Fleet Management FAQs
sidebar_label: Fleet Management FAQs
---

> 📕 **REFERENCE**

**Q:** Does IOTC support SOTI Connect?
**A:** Yes — SOTI Connect is the recommended MDM platform for handheld IOTC fleets.
**Details:** [§13.2 How to Set Up Zero-Touch Provisioning with SOTI Connect](/fleet/provisioning/soti-connect)

---

**Q:** How do I update firmware across a fleet?
**A:** Issue `set_os` to each reader, ideally orchestrated through SOTI Connect or your automation pipeline.
**Details:** [§14.6 How to Execute a Phased Fleet Migration](/fleet/migration/execute)

---

**Q:** Can I roll back firmware on handheld readers?
**A:** No. Firmware revert is not supported on this hardware family.
**Details:** [§14.5 How to Plan a V1.0 → V1.1 Migration](/fleet/migration/plan)

---

**Q:** How do I monitor fleet health?
**A:** Subscribe to fleet-wide `heartBeatEVT` and `mqttConnEVT` with wildcard topics.
**Details:** [§12.4 How to Build a Fleet Health Dashboard](/observability/monitoring/fleet-dashboard)
