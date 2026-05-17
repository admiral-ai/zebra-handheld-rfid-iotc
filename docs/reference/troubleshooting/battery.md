---
id: battery
title: How to Troubleshoot Battery & Power Issues
sidebar_label: How to Troubleshoot Battery & Power Issues
---

> 📙 **HOW-TO** · Audience: Fleet Operator · Time: ~10 min per symptom

This guide shows you how to troubleshoot battery and power issues on handheld readers.

#### Symptom: rapid battery drain during RFID operations

- Expected for `inventory_rssi`, `inventory_tid`, and continuous-operation patterns.
- If unexpectedly high, check `heartBeatEVT.data.battery_health` — degraded batteries drain faster.
- Consider switching to spot-scan rather than continuous-read patterns.

#### Symptom: reader shutting down unexpectedly

- Check the last `heartBeatEVT` before shutdown — was battery near critical threshold?
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

[DIAGRAM: D-18.6.A — drain patterns visualisation]

**Related:** 📙 [§12.2 Battery Monitoring](/observability/monitoring/battery) · 📘 [§2.5 Handheld Considerations](/foundations/architecture/handheld-considerations) · 📘 [§11.5 Alert Events](/observability/events/alerts)

---

## Chapter 19 — Frequently Asked Questions

> Every entry on every FAQ page follows the strict Q / A / Details format defined in IA v1.1 §19. Maximum four rendered lines per entry; no procedural answers; every entry links to its canonical chapter.
