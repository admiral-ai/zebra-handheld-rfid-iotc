---
id: device-configuration
title: Device configuration (MGMT endpoint)
sidebar_label: "Device Configuration (MGMT)"
description: "Reference for the MGMT device-configuration surface: set_config, get_config, set_logging_level. What each writes to or reads from the config document."
---
> 📕 **REFERENCE**

#### [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) (T4)

Returns full device snapshot (see [Config schema](/reference/appendices/config-schema)).

#### [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) (T1)

Narrow write surface. Payload key `configData`. Sub-objects: `wifiConfig`, `epConfig`, `applyAfterReboot`.

**Errors:** 2, 10, 17, 18, 23, 25, 26, 27 (see [Error codes](/reference/errors/codes)).
