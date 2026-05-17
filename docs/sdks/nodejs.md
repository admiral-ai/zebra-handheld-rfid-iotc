---
id: nodejs
title: "Tutorial: Read Your First Tag with Node.js"
sidebar_label: "Tutorial: Read Your First Tag with Node.js"
---

> 📗 **TUTORIAL** · Audience: Node.js developer · Time: ~15 min

Same pattern as §5.8 with `mqtt.js`. Full source omitted here for brevity; the corrected envelope and payload shapes are identical:

- `requestId` (not `command_id`)
- `operatingMode: {profiles: "BALANCED_PERFORMANCE"}`
- `ctrlOprPayload: {controlType: "RFID", operation: "START" | "STOP"}`
- `dataEVT` payload parsed for `payload.data.tagData[].EPC` etc.
