---
id: profiles
title: Choose how the reader reads tags
sidebar_label: Choose how the reader reads tags
---

> 📘 **EXPLANATION** · **Audience:** All · **Read time:** ~6 min · **Ties to:** Operating Mode sub-tag of the API Reference

> **See in the API Reference**
> Sub-tag: Operating Mode. Operations: [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode) · [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode).

The operating mode of an IOTC reader is configured around a **profile**, a named preset that selects how the radio behaves. Profile choice is the most consequential decision in how the reader reads. Get it wrong and the symptoms range from "no reads" through "battery dies in an hour" to "every neighbour reader interferes." Get it right and the rest of the operating-mode surface is parameter-level refinement.

### Five supported profiles

| Profile | What it optimises for |
|---|---|
| `CYCLE_COUNT` | Maximum unique tag reads per inventory cycle |
| `DENSE_READERS` | Multiple readers in close proximity (warehouse, factory floor) |
| `OPTIMAL_BATTERY` | Battery longevity above read performance |
| `BALANCED_PERFORMANCE` | The default. Even mix of read performance and battery life. |
| `ADVANCED` | Manual control of `transmitPower`, `linkProfile`, `session`, `dynamicPower` via `advancedConfigurations` |

A sixth enum value, **`FAST_READ`**, appears in the schema but is documented as **not currently supported**. Selecting it returns an error. The doc here lists five effective options.

### Setting a profile

A minimal [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) payload that selects a profile only:

```json
{
  "command": "set_operating_mode",
  "requestId": "set-mode-001",
  "operatingMode": {
    "operatingModes": {
      "profiles": "BALANCED_PERFORMANCE"
    }
  }
}
```

Note the **double nesting** — `operatingMode` wraps `operatingModes` wraps the actual configuration. This is unique to [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode); no other command nests like this. Inside `operatingModes` you can also set `radioStartConditions`, `radioStopConditions`, `query`, `select`, `accessOperations`, and `tagMetaDataToEnable` — covered in adjacent chapters.

### The read-rate ↔ battery ↔ density triangle

You cannot maximise all three. A reader at full duty cycle reads fast and exhausts its battery; a reader spaced out for battery slow-scans; a reader optimised for dense environments throttles to avoid interfering with peers. Each profile picks a point on this triangle.

| Profile | Read rate | Battery life | Behavior in dense fields |
|---|---|---|---|
| `CYCLE_COUNT` | Highest | Shortest | Aggressive; may collide with peer readers |
| `DENSE_READERS` | Modest | Modest | Optimised for coexistence |
| `OPTIMAL_BATTERY` | Lowest | Longest | Conservative; fewer rounds per minute |
| `BALANCED_PERFORMANCE` | Mid | Mid | Reasonable defaults; good first choice |
| `ADVANCED` | Whatever you configure | Whatever you configure | Whatever you configure |

The right profile is empirical: deploy with `BALANCED_PERFORMANCE`, measure read rate against your target, switch if needed.

### `ADVANCED`: manual radio control

`ADVANCED` unlocks the `advancedConfigurations` block:

```json
{
  "operatingMode": {
    "operatingModes": {
      "profiles": "ADVANCED",
      "advancedConfigurations": {
        "transmitPower": 300,
        "linkProfile": "M2_240K",
        "session": "SESSION_1",
        "dynamicPower": true
      }
    }
  }
}
```

The four fields:

- **`transmitPower`**: radio power in centi-dBm (e.g., `300` = 3.0 dBm × 100). Bounded by the region's `maxTxPowerSupported`.
- **`linkProfile`**: physical-layer encoding. Eleven values: `M4_256K`, `M2_240K`, `M2_256K`, `M2_320K`, `M4_240K`, `M4_320K`, `FM0_0K`, `FM0_320K`, `M8_240K`, `M8_256K`, `M8_320K`. The `Mn_*` notation refers to Miller-modulation factor `n`; lower numbers carry more redundancy (better range, slower).
- **`session`**: EPC Gen2 session: `SESSION_0`, `SESSION_1`, `SESSION_2`, `SESSION_3`. See "Sessions" below.
- **`dynamicPower`**: boolean. When true, the radio adjusts power per round.

`advancedConfigurations` is **required when `profiles` is `ADVANCED`**, and rejected with error code `22` (Advanced configuration not set) if missing.

### EPC Gen2 sessions, briefly

A Gen2 session is a flag in tag memory that tracks whether the tag has been read in the current inventory round. The four sessions differ in **how long the flag persists** after a tag leaves the radio's field:

| Session | Flag persistence | Use |
|---|---|---|
| `SESSION_0` | Immediately reset | Single-round inventories; one reader |
| `SESSION_1` | 500 ms – 5 s | Most multi-round inventories |
| `SESSION_2` | > 2 s, can be long | Multi-reader, long-cycle |
| `SESSION_3` | Indefinite until reader resets | Multi-reader with strict deduplication |

The default is typically `SESSION_1`. Tag-population dynamics drive the choice: small populations work with `SESSION_0`; large, mobile populations benefit from `SESSION_1` or higher; multi-reader deployments often need `SESSION_2`.

### Pre-condition: inventory must not be running

[`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) cannot be applied during active RFID inventory. If `radioActivity` is `ACTIVE`, the command returns error code `11` (Inventory in progress). Stop with `control_operation STOP` first.

Other error codes:

| Code | Meaning |
|---|---|
| `11` | Inventory in progress |
| `22` | Advanced configuration not set (`ADVANCED` profile selected without `advancedConfigurations`) |
| `23` | Invalid enum value |
| `24` | Max 32 prefilters limit exceeded |
| `28` | Tag match pattern length exceeded |

### Reading current state

[`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode) returns the active configuration in the same shape as the [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) payload:

```json
{
  "command": "get_operating_mode",
  "requestId": "mode-check-001"
}
```

Use this **before** any change to know the current baseline, and **after** any change to confirm it took.

### Where the other surfaces live

[`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) covers many fields. Each is explored in its own chapter:

- **Start/stop triggers and stop thresholds**: [Start, stop, and the trigger button](/rfid/operating-mode/start-stop).
- **Pre-filtering (Select) and post-filtering (Report)**: [Filter tags before vs after the read](/rfid/operating-mode/post-filters-about).
- **Access operations (read, write, lock, kill)**: covered as an advanced surface in `mqtt-api-reference/set_operating_mode.md`.
- **Tag metadata enable flags (RSSI, PHASE, CHANNEL, TID, USER, MAC, HOSTNAME, etc.)**, set in `tagMetaDataToEnable`; surfaces in `dataEVT` events as fields. See [Where tag reads come from](/rfid/tag-data/dataevt-schema).

**Related:** 📘 [Start, stop, and the trigger button](/rfid/operating-mode/start-stop) · 📘 [Filter tags before vs after the read](/rfid/operating-mode/post-filters-about) · 📘 [Where tag reads come from](/rfid/tag-data/dataevt-schema) · 📕 [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
