---
id: battery
title: How to troubleshoot battery and power issues
sidebar_label: How to troubleshoot battery & power issues
description: "Troubleshoot IOTC reader battery and power: low-battery alerts, USB-C charging failures, cradle behaviour, OPTIMAL_BATTERY profile, drain diagnosis."
---

> 📙 **HOW-TO** · **Audience:** Fleet Operator · **Time:** ~10 min per symptom

This guide shows you how to troubleshoot battery and power issues on handheld readers.

#### Symptom: rapid battery drain during RFID operations

- Expected for `inventory_rssi`, `inventory_tid`, and continuous-operation patterns.
- If unexpectedly high, check `heartbeatEVT.data.battery_health` — degraded batteries drain faster.
- Consider switching to spot-scan rather than continuous-read patterns.

#### Symptom: reader shutting down unexpectedly

- Check the last `heartbeatEVT` before shutdown — was battery near critical threshold?
- Check `exceptionEVT` for any error codes preceding shutdown.
- If battery shows healthy but shutdown is unexpected, contact support — possible hardware fault.

#### Symptom: battery health degradation over time

- Normal: lithium-ion batteries degrade with cycle count. Plan to replace below 80% health.
- Accelerated degradation: investigate charging practices (high-temperature charging shortens life).

#### Symptom: optimal power-management configuration

- Increase MQTT keep-alive from 30 s to 60 or 120 s
- Increase heartbeat from 30 s to 60 or 300 s
- Stop inventory operations when not in active use
- Use cradle charging during operator breaks

```d2
classes: {
  good: { style: { fill: "#e6f4ea"; stroke: "#1e8e3e"; font-color: "#137333" } }
  warn: { style: { fill: "#fef7e0"; stroke: "#f9ab00"; font-color: "#b06000" } }
  bad:  { style: { fill: "#fce8e6"; stroke: "#d93025"; font-color: "#c5221f" } }
}
title: "Battery drain over a shift (example)" { near: top-center; shape: text; style.font-size: 18; style.bold: true }
direction: right
H08: "08:00 - 100%" { class: good }
H10: "10:00 - 84%" { class: good }
H12: "12:00 - 68%" { class: good }
H14: "14:00 - 51%" { class: warn }
H16: "16:00 - 33%" { class: warn }
H18: "18:00 - 12%" { class: bad }
H08 -> H10 -> H12 -> H14 -> H16 -> H18

```

**Related:** 📙 [Battery Monitoring](/observability/monitoring/battery) · 📘 [Handheld Considerations](/foundations/architecture/handheld-considerations) · 📘 [Alert Events](/observability/alerts)

---

## Chapter 19. Frequently Asked Questions

> Every entry on every FAQ page follows the strict Q / A / Details format defined in IA v1.1 §19. Maximum four rendered lines per entry; no procedural answers; every entry links to its canonical chapter.
