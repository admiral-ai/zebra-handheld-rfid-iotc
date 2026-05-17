---
id: step-5-read
title: "Step 5: Read Your First Tags"
sidebar_label: "Step 5: Read Your First Tags"
---

> 📗 **TUTORIAL** · Time: ~2 min

### Present a tag

Hold an RFID tag (any Gen2 UHF tag) in front of the reader's antenna.

### Watch tag data arrive

Switch to the DATA subscriber terminal.

**You should see** a stream of JSON `dataEVT` payloads:

```json
{
  "type": "BALANCED_PERFORMANCE",
  "timestamp": "2026-05-17T12:34:56.789Z",
  "data": {
    "tagData": [
      {
        "EPC": "BEDD11112222333344445555",
        "EPCid": "BEDD11112222333344445555",
        "channel": 911.75,
        "eventNum": 1,
        "peakRssi": -39,
        "phase": 0,
        "seenCount": 1
      }
    ]
  }
}
```

You are reading RFID tags over MQTT. The hard part is done.

**Related:** 📕 [§10.2 dataEVT Schema](/rfid/tag-data/dataevt-schema) · 📙 [§10.3 Interpret Tag Data Fields](/rfid/tag-data/interpret) · 📗 [§5.7 Stop the Operation](/getting-started/quick-start/step-6-stop)
