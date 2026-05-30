---
id: interpret
title: How to interpret tag-data fields
sidebar_label: How to interpret tag-data fields
description: "Interpret IOTC dataEVT fields: EPC encoding (hex / GS1), RSSI in dBm, antenna ID (always 1 on handhelds), timestamp, optional embedded user-memory."
---

> 📙 **HOW-TO** · **Audience:** Solution Builder, API Consumer · **Time:** ~15 min

This guide shows you how to interpret the fields in a `dataEVT` payload for application logic.

### Decode EPC

The EPC is a hex string. To interpret it:

1. **Convert to binary**, each hex character represents 4 bits.
2. **Parse per GS1 encoding**, the leading bits encode the EPC scheme (SGTIN-96, GIAI-96, etc.). The GS1 EPC Tag Data Standard defines the rest.

For most applications, the EPC is opaque — applications use it as an identifier looked up in a database. Decoding to GS1 components matters when the application reasons about company prefix, item reference, or serial number.

```d2
direction: right
EPC: "EPC hex\n96 bits"
Bin: Binary
H: "Header\n(8 bits)"
F: "Filter value\n(3 bits)"
P: "Partition\n(3 bits)"
CG: Company prefix
IR: Item reference
SN: Serial number
H2: = SGTIN-96 marker
EPC -> Bin
Bin -> H
Bin -> F
Bin -> P
Bin -> CG
Bin -> IR
Bin -> SN
H -> H2 { style.stroke-dash: 4 }

```

### Interpret RSSI

RSSI is signed integer dBm. Typical values:

| RSSI | Approximate distance |
|---|---|
| −30 to −45 dBm | Very close (≤ 0.5 m) |
| −45 to −60 dBm | Near (0.5–2 m) |
| −60 to −75 dBm | Mid-range (2–6 m) |
| Below −75 dBm | Edge of range |

:::caution[Caveat]
RSSI-to-distance is not linear. It is affected by tag orientation, antenna polarisation, and environment. Use RSSI for relative comparison and rank ordering, not absolute distance.
:::

### Read TID memory bank

TID is a hex string with the tag's manufacturer-assigned identifier. The first 12 bits identify the IC manufacturer; subsequent bits identify the model and serial. The TID is unique per tag and cannot be rewritten, use it for tag authentication.

### Use phase angle data

In `locationing` mode, `phase` reports the angle in radians at which the tag's response arrived. Combined with multiple reads at varying RF parameters, phase can be used for fine-grained spatial estimation. Implementation is application-specific.

### Use seen-count and timestamps

In coalesced mode, `seen_count` indicates how many reads of this EPC occurred in the window. `first_seen` and `last_seen` bound the window. Together they give a presence-duration estimate.

**Related:** 📕 [dataEVT Schema](/rfid/dataevt-schema) · 📕 [DATA Interface](/reference/api-overview) · 📕 [RFID Standards](/reference/appendices/tag-standards)
