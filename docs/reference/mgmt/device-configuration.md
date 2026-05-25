---
id: device-configuration
title: "Device Configuration (MGMT)"
sidebar_label: "Device Configuration (MGMT)"
---
> 📕 **REFERENCE**

#### [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) (T4)

Returns full device snapshot (see [Config schema](/reference/appendices/config-schema)).

#### [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) (T1)

Narrow write surface. Payload key `configData`. Sub-objects: `wifiConfig`, `epConfig`, `applyAfterReboot`.

**Errors:** 2, 10, 17, 18, 23, 25, 26, 27 (see [Error codes](/reference/errors/codes)).
