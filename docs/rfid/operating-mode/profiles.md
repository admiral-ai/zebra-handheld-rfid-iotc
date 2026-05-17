---
id: profiles
title: About RFID Operating Mode Profiles
sidebar_label: About RFID Operating Mode Profiles
---

> 📘 **EXPLANATION** · Audience: All · Read time: ~6 min

The operating mode of an IOTC reader is configured around a **profile** — a named preset that selects how the radio behaves. Profile choice is the single most consequential decision in how the reader reads.

### The five configurable profiles

| `profiles` | Description |
|---|---|
| `BALANCED_PERFORMANCE` | Balances read performance with battery life. **Default.** |
| `CYCLE_COUNT` | Maximises unique tags read per inventory cycle. |
| `DENSE_READERS` | Optimised for environments with multiple readers in proximity. |
| `OPTIMAL_BATTERY` | Prioritises battery longevity over read performance. |
| `ADVANCED` | Unlocks manual control of `transmitPower`, `linkProfile`, `session`, `dynamicPower`. Requires `advancedConfigurations`. |

A sixth profile name — `FAST_READ` — appears in the `dataEVT.type` field. It is observed in event payloads as an operating mode descriptor but is not currently exposed as a settable `profiles` enum value. Treat it as a Zebra-internal mode reported in telemetry; do not attempt to set it.

### What the profile controls

Selecting a profile sets RF transmit power, link profile (data rate / modulation), Gen2 session, and dynamic power management to preset values appropriate for the named scenario. For most deployments, choosing the right profile and leaving the underlying RF parameters at their preset values is sufficient.

When a deployment needs manual control — to comply with a specific regulatory power ceiling, or to match a specific tag manufacturer's recommended link profile — set `profiles: ADVANCED` and supply `advancedConfigurations` with the desired `transmitPower`, `linkProfile` (e.g., `M4_256K`, `M8_320K`), `session` (`SESSION_0`–`SESSION_3`), and `dynamicPower` values.

### What lives outside `profiles`

A profile does not by itself control:

- **Access operations** (READ/WRITE/ACCESS/LOCK/KILL on tag memory) — configured in `accessOperations[]`
- **Start/stop triggers** — configured in `radioConditions.start` and `radioConditions.stop`
- **Singulation tuning** — configured in `query` (session, inventoryState, slFlag, tagPopulation)
- **Pre-singulation filtering (Gen2 SELECT)** — configured in `select[]`
- **Reporting aggregation** — configured in `reportFilter`

Each of these is an orthogonal sub-object inside the `operatingMode` payload. [§9.2](/rfid/operating-mode/configure) shows how to compose them.

[DIAGRAM: D-9.1.A — Profile decision tree (operational requirement → recommended profile)]

[DIAGRAM: D-9.1.B — Operating mode sub-object map]

**Related:** 📙 [§9.2 Configure Operating Mode](/rfid/operating-mode/configure) · 📕 [§16.3 set_operating_mode](#chapter-16--mqtt-api-reference) · 📕 [§10.2 dataEVT Schema](/rfid/tag-data/dataevt-schema)
