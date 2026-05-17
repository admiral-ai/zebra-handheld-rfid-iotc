---
id: profiles
title: 9.1 About RFID Operating Mode Profiles
sidebar_label: 9.1 Profiles
---

# About RFID Operating Mode Profiles

<div className="badge-explanation">EXPLANATION</div>

The operating mode of an IOTC reader is configured around a **profile** — a named preset that selects how the radio behaves. Profile choice is the single most consequential decision in how the reader reads.

## The five configurable profiles

| `profiles` | Description |
|---|---|
| `BALANCED_PERFORMANCE` | Balances read performance with battery life. **Default.** |
| `CYCLE_COUNT` | Maximises unique tags read per inventory cycle. |
| `DENSE_READERS` | Optimised for environments with multiple readers in proximity. |
| `OPTIMAL_BATTERY` | Prioritises battery longevity over read performance. |
| `ADVANCED` | Unlocks manual control of `transmitPower`, `linkProfile`, `session`, `dynamicPower`. Requires `advancedConfigurations`. |

A sixth profile name — `FAST_READ` — appears in the `dataEVT.type` field. It is observed in event payloads as an operating mode descriptor but is not currently exposed as a settable `profiles` enum value.

## What lives outside `profiles`

A profile does not by itself control:
- **Access operations** — `accessOperations[]` (READ/WRITE/ACCESS/LOCK/KILL)
- **Start/stop triggers** — `radioConditions.start` and `radioConditions.stop`
- **Singulation tuning** — `query` (session, inventoryState, slFlag, tagPopulation)
- **Pre-singulation filtering (Gen2 SELECT)** — `select[]`
- **Reporting aggregation** — `reportFilter`
