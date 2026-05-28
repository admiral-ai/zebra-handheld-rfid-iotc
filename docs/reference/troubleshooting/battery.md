---
id: battery
title: How to troubleshoot battery and power issues
sidebar_label: How to Troubleshoot Battery & Power Issues
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
title: "Battery drain over a shift (example)" { near: top-center; shape: text; style.font-size: 16; style.bold: true }
direction: right
H08: "08:00\n100%" { style: { fill: "#e8f5e8"; stroke: "#1b5e20"; font-color: "#1b5e20" } }
H10: "10:00\n84%" { style: { fill: "#e8f5e8"; stroke: "#1b5e20"; font-color: "#1b5e20" } }
H12: "12:00\n68%" { style: { fill: "#f1f8e9"; stroke: "#558b2f"; font-color: "#33691e" } }
H14: "14:00\n51%" { style: { fill: "#fffde7"; stroke: "#9e7d0a"; font-color: "#9e7d0a" } }
H16: "16:00\n33%" { style: { fill: "#fff3e0"; stroke: "#e65100"; font-color: "#e65100" } }
H18: "18:00\n12%" { style: { fill: "#fce4ec"; stroke: "#880e4f"; font-color: "#880e4f" } }
H08 -> H10 -> H12 -> H14 -> H16 -> H18
```

**Related:** 📙 [Battery Monitoring](/observability/monitoring/battery) · 📘 [Handheld Considerations](/foundations/architecture/handheld-considerations) · 📘 [Alert Events](/observability/alerts)

---

## Chapter 19. Frequently Asked Questions

> Every entry on every FAQ page follows the strict Q / A / Details format defined in IA v1.1 §19. Maximum four rendered lines per entry; no procedural answers; every entry links to its canonical chapter.
