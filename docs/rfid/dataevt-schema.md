---
id: dataevt-schema
title: Where tag reads come from
sidebar_label: Where tag reads come from
description: "The dataEVT schema: the IOTC event carrying singulated tag reads (EPC, RSSI, antenna, timestamp). Dual-channel split (data1event / data2event)."
---

> 📕 **REFERENCE** · **Audience:** API Consumer · **Use:** field-level schema lookup · **Ties to:** Tag Data Event sub-tag of the API Reference

:::tip[See in the API Reference]
Sub-tag: Tag Data Event. Event: `dataEVT`.
:::

`dataEVT` is the event that carries tag reads. The reader emits one (or one aggregated event covering several reads, depending on operating mode) on the publish topic of whichever data endpoint owns the active stream, typically `DATA1`, sometimes `DATA2`, on a hybrid bootstrap deployment the `MDM` endpoint. This chapter is the field-level reference for the payload.

### The skeleton

```json
{
  "type": "BALANCED_PERFORMANCE",
  "timestamp": "2026-05-19T14:23:11Z",
  "data": {
    "tagData": [ /* ... per-tag entries ... */ ],
    "barcodeData": [ /* ... per-barcode entries, Premium / Premium Plus only ... */ ]
  }
}
```

Three top-level fields:

- **`type`**, the active operating-mode profile when the event was generated. Values match the `profiles` enum (`CYCLE_COUNT`, `DENSE_READERS`, `OPTIMAL_BATTERY`, `BALANCED_PERFORMANCE`, `ADVANCED`, or `FAST_READ`, though `FAST_READ` is not currently supported in [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode)).
- **`timestamp`**: ISO 8601 event timestamp.
- **`data`**: wrapper for `tagData` and `barcodeData` arrays.

There is no `command`, `requestId`, `apiVersion`, or `response.code` wrapper here. Events do not use the command-response envelope. Treat `dataEVT` as a streaming record, not a response.

### Per-tag fields in `tagData[]`

| Field | Type | When it appears |
|---|---|---|
| `EPCid` | string (hex) | Always. The EPC identifier; primary key for the tag. |
| `EPC` | string (hex) | When `tagMetaDataToEnable.EPC: true`. The EPC memory bank content (typically identical to `EPCid`). |
| `TID` | string (hex) | When `tagMetaDataToEnable.TID: true`. Factory-programmed unique identifier. |
| `USER` | string (hex) | When `tagMetaDataToEnable.USER: true`. User memory bank content. |
| `RESERVED` | string (hex) | When reserved bank is accessed. Passwords; typically restricted. |
| `PC` | string (hex) | When `tagMetaDataToEnable.PC: true`. Protocol Control word. |
| `XPC` | string (hex) | When `tagMetaDataToEnable.XPC: true`. Extended PC bits, if present on the tag. |
| `CRC` | string (hex) | When `tagMetaDataToEnable.CRC: true`. The tag's CRC bits. |
| `channel` | number | When `tagMetaDataToEnable.CHANNEL: true` **AND** `reportFilter duration` is `0`. The channel in MHz used to read this tag. |
| `peakRssi` | number | When `tagMetaDataToEnable.RSSI: true`. RSSI in dBm. With `reportFilter duration > 0`, this is the peak across aggregated reads. |
| `phase` | number | When `tagMetaDataToEnable.PHASE: true` **AND** `reportFilter duration` is `0`. Phase angle in degrees. |
| `seenCount` | number | When `tagMetaDataToEnable.SEENCOUNT: true`. Number of times this tag was inventoried since the previous report. With `reportFilter duration: 0`, always `1`. |
| `eventNum` | number | Always. Per-event sequence number. |
| `firstSeenTime` | number | When `tagMetaDataToEnable.FIRST_SEEN_TIME: true`. Milliseconds since epoch when the tag was first seen. |
| `lastSeenTime` | number | When `tagMetaDataToEnable.LAST_SEEN_TIME: true`. Milliseconds since epoch when the tag was last seen. |
| `MAC` | string | When `tagMetaDataToEnable.MAC: true`. MAC address of the reader that inventoried the tag. |
| `HOSTNAME` | string | When `tagMetaDataToEnable.HOSTNAME: true`. Hostname of the reader. |
| `accessResults` | array of string | Always present (may be empty). Per-access-operation results, one entry per operation configured in `set_operating_mode.operatingModes.accessOperations`. |
| `userDefined` | string | When configured. Application-supplied string included on every event. |

`accessResults` is the result channel for read/write/lock/kill access operations performed during inventory. Each entry is a string like `"READ-EPC-SUCCESS"`, `"READ-TID-SUCCESS"`, or `"WRITE-USER-No Response from Tag"`. The format is `"<operation>-<memoryBank>-<result>"`.

### The `reportFilter duration` conditional

Three fields (`channel`, `phase`, `seenCount`)behave differently based on the operating-mode's `reportFilter duration`:

| `reportFilter duration` | Behavior |
|---|---|
| `0` | Each individual tag read is reported. `seenCount` is always `1`. `channel` and `phase` are populated. |
| `> 0` | Reads are aggregated across the duration. `seenCount` accumulates. `channel` and `phase` are omitted. `peakRssi` is the peak across the aggregation window. |

Applications that need per-read fidelity must set `reportFilter duration: 0` (the default). Applications that want aggregation for bandwidth reasons increase the duration; expect to lose `channel`/`phase` resolution.

### Per-barcode fields in `barcodeData[]`

When `controlType: SCANNER` operations are run (Premium / Premium Plus only. RFD90 has a scanner; RFD40 Standard doesn't):

| Field | Type | Description |
|---|---|---|
| `symbology` | enum | Barcode symbology (currently only `CODE_39`). |
| `decodedBarcode` | string | The decoded string value. |

A `dataEVT` can carry both `tagData` and `barcodeData` if both subsystems are active in the same event window.

### Worked example

A fully-populated `dataEVT` for a single tag with all metadata enabled and access operations configured:

```json
{
  "type": "BALANCED_PERFORMANCE",
  "timestamp": "2026-05-19T14:15:22Z",
  "data": {
    "tagData": [
      {
        "EPCid": "BEDD11112222333344445555",
        "EPC": "BEDD11112222333344445555",
        "TID": "E2003412013BFD000B4E16D21D030143000D5FFBFFFFDC60",
        "USER": "12343333123456781234567812345678123456781234567812345678",
        "channel": 911.75,
        "eventNum": 1,
        "peakRssi": -39,
        "phase": 0,
        "seenCount": 1,
        "accessResults": [
          "READ-EPC-SUCCESS",
          "READ-TID-SUCCESS",
          "WRITE-USER-No Response from Tag"
        ]
      }
    ]
  }
}
```

### Where `dataEVT` does *not* fire

- **When `FAST_READ` is the active profile.** `FAST_READ` is not currently supported by [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode), so this case does not arise in normal operation, but if it did, `dataEVT` would not be emitted.
- **When a post-filter excludes every tag.** A [`set_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-post-filter) with `reportOperation: EXCLUDE` matching everything will run inventory but emit nothing. Inspect with [`get_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-post-filter).
- **When the data endpoint is inactive.** The endpoint that owns the data stream must have `activate: true`. Inspect with [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config).

### Topic routing

`dataEVT` publishes on the publish topic configured for the active data endpoint. With a DATA1 endpoint configured with `publishTopics: [{topic: "DATA1/event"}]`, the wire topic is `<tenantId>/DATA1/event/<deviceSerialNumber>`. Two parallel data streams (DATA1 and DATA2) allow you to route different filters' output to different consumers.

### Out of scope

- **Configuring which metadata fields are enabled**: `set_operating_mode.operatingModes.tagMetaDataToEnable`. See [Choose how the reader reads tags](/rfid/operating-mode-profiles).
- **Pre-filtering and post-filtering**, see [Filter tags before vs after the read](/rfid/post-filters).
- **Routing tag data to multiple destinations**: covered as a downstream-pipeline concern.

**Related:** 📘 [Choose how the reader reads tags](/rfid/operating-mode-profiles) · 📘 [Filter tags before vs after the read](/rfid/post-filters) · 📘 [Start, stop, and the trigger button](/rfid/start-stop-inventory) · 📕 [`dataEVT`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
