---
id: inventory-control
title: "Inventory Control (CTRL)"
sidebar_label: "Inventory Control (CTRL)"
---
> 📕 **REFERENCE**

#### `control_operation` (T3)

Start/stop the selected control type. Payload `ctrlOprPayload: {controlType: "RFID"|"SCANNER", operation: "START"|"STOP"}`.

**Errors:** 11 (already running), 12 (no operation in progress — informational), 23.

---
