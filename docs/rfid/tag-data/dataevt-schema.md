---
id: dataevt-schema
title: Where tag reads actually come from
sidebar_label: Where tag reads actually come from
---

> 📕 **REFERENCE** · Audience: API Consumer

The `dataEVT` event is published on the publish topic of the endpoint that owns the active data stream (typically a `DATA1` or `DATA2` endpoint; on a simple deployment, the `MDM` endpoint).

### Top-level fields

| Field | Type | Description |
|---|---|---|
| `type` | string | The operating mode profile active when the read occurred. Enum: `FAST_READ`, `CYCLE_COUNT`, `DENSE_READERS`, `OPTIMAL_BATTERY`, `BALANCED_PERFORMANCE`, `ADVANCED`. |
| `timestamp` | string (ISO 8601) | Time of the event. |
| `data` | object | Container for `tagData[]` and/or `barcodeData[]`. |

### `data.tagData[]` per-tag fields

| Field | Type | Description |
|---|---|---|
| `EPC` | string (hex) | Tag's EPC value. |
| `EPCid` | string (hex) | Tag's EPC value (alternate alias seen in source examples; treat `EPC` as canonical). |
| `TID` | string (hex) | TID memory bank content. Present when configured via `accessOperations`. |
| `USER` | string (hex) | USER memory bank content. Present when configured. |
| `channel` | number | RF channel frequency in MHz (e.g., `911.75`). Present when `reportFilter.duration == 0`. |
| `eventNum` | integer | Monotonic event sequence number. |
| `peakRssi` | integer (dBm) | Peak RSSI. With `reportFilter.duration > 0`, this is the peak over the aggregation window. |
| `phase` | number | RF phase angle (radians). Present when `reportFilter.duration == 0`. |
| `seenCount` | integer | Number of times this EPC was seen in this report's aggregation window. |
| `accessResults` | array of string | Outcomes of configured `accessOperations` (e.g., `"READ-EPC-SUCCESS"`, `"WRITE-USER-No Response from Tag"`). |

### `data.barcodeData[]`

Present when the operation was a SCANNER inventory. Carries decoded barcode strings and symbology.

### Field-presence dependencies

- `channel`, `phase` — present only when `reportFilter.duration == 0` (per-read mode).
- `TID`, `USER` — present only when `accessOperations` includes a READ targeting that bank.
- `accessResults` — present only when `accessOperations` are configured.

### Example payload

```json
{
  "type": "BALANCED_PERFORMANCE",
  "timestamp": "2019-08-24T14:15:22Z",
  "data": {
    "tagData": [
      {
        "EPCid": "BEDD11112222333344445555",
        "EPC": "BEDD11112222333344445555",
        "TID": "E2003412013BFD000B4E16D21D030143000D5FFBFFFFDC60",
        "USER": "12343333123456781234567812345678",
        "channel": 911.75,
        "eventNum": 1,
        "peakRssi": -39,
        "phase": 0,
        "seenCount": 1,
        "accessResults": ["READ-EPC-SUCCESS", "READ-TID-SUCCESS", "WRITE-USER-No Response from Tag"]
      }
    ]
  }
}
```

**Related:** 📘 [§9.1 Operating Mode Profiles](/rfid/operating-mode/profiles) · 📘 [§10.1 Tag Data Architecture](/rfid/tag-data/architecture) · 📙 [§10.3 Interpret Tag Data Fields](/rfid/tag-data/interpret)

---

# Part V — Observability & Events (corrected)
