---
id: start-stop
title: Start, stop, and the trigger button
sidebar_label: Start, stop, and the trigger button
---

> 📙 **HOW-TO** · Audience: All · Time: ~5 min

### Start an RFID inventory

```json
{
  "command": "control_operation",
  "requestId": "op-1",
  "ctrlOprPayload": {"controlType": "RFID", "operation": "START"}
}
```

If a `set_operating_mode` has not been issued, the reader uses its current configuration. If an inventory is already running, the response carries code 11 (`IOT_ERROR_INVENTORY_IN_PROGRESS`).

### Stop an RFID inventory

```json
{
  "command": "control_operation",
  "requestId": "op-2",
  "ctrlOprPayload": {"controlType": "RFID", "operation": "STOP"}
}
```

If no inventory is running, the response carries code 12 (`IOT_ERROR_NO_RADIO_OP_IN_PROGRESS`). **This is informational, not a failure** — the reader is already in the desired idle state.

### Control the barcode scanner

For models with a barcode scanner, `controlType: SCANNER` starts and stops the barcode subsystem analogously.

**Related:** 📘 [§9.5 Trigger Composition](/rfid/operating-mode/trigger-composition) · 📕 [§16.3 control_operation](#chapter-16--mqtt-api-reference) · 📕 [§17.2 Error Codes](/reference/errors/codes)
