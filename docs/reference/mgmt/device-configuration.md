---
id: device-configuration
title: "Device Configuration (MGMT)"
sidebar_label: "Device Configuration (MGMT)"
---
> 📕 **REFERENCE**

#### `get_config` (T4)

Returns full device snapshot (see [§20.1](/reference/appendices/config-schema)).

#### `set_config` (T1)

Narrow write surface. Payload key `configData`. Sub-objects: `wifiConfig`, `epConfig`, `applyAfterReboot`.

**Errors:** 2, 10, 17, 18, 23, 25, 26, 27 (see [§17.2](/reference/errors/codes)).
