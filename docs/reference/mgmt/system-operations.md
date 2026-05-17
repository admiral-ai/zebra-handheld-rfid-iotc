---
id: system-operations
title: "System Operations (MGMT)"
sidebar_label: "System Operations (MGMT)"
---
> 📕 **REFERENCE**

#### `set_os` (T2)

Initiates firmware update. Payload key `OSUpdateDetails` with `url`, `authenticationType`, `verificationType`, optional cert reference.

**Errors:** 1 (accepted, async), 4 (in progress), 8 (low flash), 9 (file not found), 13 (failed), 14 (battery low).

> Firmware revert is not supported on handheld readers.

#### `reboot` (T4)

Restarts the reader. **Errors:** 5 (inventory in progress — stop first).
