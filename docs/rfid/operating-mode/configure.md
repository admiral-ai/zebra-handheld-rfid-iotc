---
id: configure
title: How to Configure the Operating Mode
sidebar_label: How to Configure the Operating Mode
---

> 📙 **HOW-TO** · Audience: Solution Builder · Time: ~20 min

This guide shows you how to assemble the `operatingMode` payload for the use cases your application needs.

### View the current configuration

```json
{"command": "get_operating_mode", "requestId": "mode-1"}
```

### Set the simplest payload — profile only

```json
{
  "command": "set_operating_mode",
  "requestId": "mode-2",
  "operatingMode": {
    "profiles": "BALANCED_PERFORMANCE"
  }
}
```

Operating mode cannot be changed while an inventory is running — error code 11 (`IOT_ERROR_INVENTORY_IN_PROGRESS`). Issue `control_operation` STOP first.

### Configure radio start/stop conditions

Trigger compositions are built from `radioConditions.start.trigger` and `radioConditions.stop.trigger` independently:

```json
{
  "command": "set_operating_mode",
  "requestId": "mode-3",
  "operatingMode": {
    "profiles": "BALANCED_PERFORMANCE",
    "radioConditions": {
      "start": {"trigger": "PRESSED"},
      "stop":  {"trigger": "RELEASED"}
    }
  }
}
```

Common compositions:

| Behaviour | `start.trigger` | `stop.trigger` |
|---|---|---|
| Press-and-hold to read | `PRESSED` | `RELEASED` |
| Toggle (press to start, press to stop) | `PRESSED` | `PRESSED` |
| Pulse read (press to start, auto-stop) | `PRESSED` | `IMMEDIATE` + `stopTimeout: 2000` |
| Immediate auto-run | `IMMEDIATE` | `IMMEDIATE` + threshold |

When `stop.trigger` is `IMMEDIATE`, threshold fields control auto-stop:

- `tagCount` — stop after N unique tags
- `stopTimeout` — stop after N milliseconds
- `inventoryCount` — stop after N full inventory cycles

### Configure singulation tuning (query)

```json
{
  "operatingMode": {
    "profiles": "BALANCED_PERFORMANCE",
    "query": {
      "session": "SESSION_0",
      "inventoryState": "STATE_A",
      "slFlag": "ALL",
      "tagPopulation": 200
    }
  }
}
```

| `session` | Tag inventoried-flag persistence |
|---|---|
| `SESSION_0` | Forgets immediately after leaving field |
| `SESSION_1` | 500 ms – 5 s persistence |
| `SESSION_2` | >2 s, implementation-dependent |
| `SESSION_3` | Indefinite until changed |

### Configure SELECT pre-filters

SELECT is the Gen2 protocol-level pre-singulation filter. Up to **32 filters** are accepted (code 24 if exceeded). `offset` is in **bits**, `length` is in **bits**, `tagPattern` is hex (max 64 characters — code 28 if exceeded).

```json
{
  "operatingMode": {
    "select": [
      {
        "memoryBank": "EPC",
        "offset": 32,
        "length": 32,
        "tagPattern": "E2800011",
        "action": "INV_A_NOT_INV_B_OR_ASRT_SL_NOT_DSRT_SL"
      }
    ]
  }
}
```

The eight `action` values map matches and mismatches to inventory state and SL flag transitions — see [§16.3 set_operating_mode Reference](#chapter-16--mqtt-api-reference) for the complete action enum table.

### Configure access operations

Per-tag operations executed during inventory. `offset` for access operations is in **16-bit words** (different unit from SELECT).

```json
{
  "operatingMode": {
    "accessOperations": [
      {"type": "READ", "memoryBank": "TID", "offset": 0, "length": 4},
      {"type": "WRITE", "memoryBank": "USER", "offset": 0,
       "data": "0123456789ABCDEF", "password": "00000000"}
    ]
  }
}
```

**Critical constraints:**

- `password` is **8 hex characters** for ACCESS, LOCK, KILL.
- `data` for WRITE must be even-length hex, multiple of 16-bit words.
- KILL is **irreversible** — the tag never responds again.
- LOCK with `lockAction: PERMANENT_LOCK` is irreversible.

### Configure reporting aggregation

```json
{
  "operatingMode": {
    "reportFilter": {"duration": 0}
  }
}
```

`duration: 0` reports every tag read individually. `duration > 0` aggregates reads of the same EPC over that millisecond window and reports `peakRssi` rather than per-read RSSI.

**Related:** 📘 [§9.1 Operating Mode Profiles](/rfid/operating-mode/profiles) · 📕 [§16.3 set_operating_mode](#chapter-16--mqtt-api-reference) · 📙 [§9.4 Start/Stop Operations](/rfid/operating-mode/start-stop) · 📘 [§9.5 Trigger Composition](/rfid/operating-mode/trigger-composition)
