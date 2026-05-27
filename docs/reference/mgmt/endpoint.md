---
id: endpoint
title: MQTT endpoint configuration (MGMT)
sidebar_label: "MQTT Endpoint Configuration (MGMT)"
description: "Reference for the MGMT MQTT-endpoint configuration surface: config_endpoint (add/update/delete) and seven endpoint types (MDM, MGMT, CTRL, EVT, DATA, ALERT)."
---
> 📕 **REFERENCE**

#### [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) (T3)

Returns active endpoints (with full `configuration` blocks) and the list of saved endpoint names.

**Response fields:** `endpointResponse.activeEndpoints.epConfig[].configuration`, `endpointResponse.savedEndpoints.epNames[]`.

#### [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) (T2)

Operations: `add`, `update`, `delete`. Payload key `epConfig`. Endpoint types: `MGMT`, `MGMT_EVT`, `CTRL`, `DATA1`, `DATA2`, `SOTI`, `MDM`. Protocols: `MQTT`, `MQTT_TLS`. Verification: `NONE` / `VERIFY_PEER` / `VERIFY_HOST` / `VERIFY_HOST_PEER`.

**Errors:** 10 (config exists), 23 (invalid enum), 25 (publish topics > 3), 26 (subscribe topics > 1), 27 (tenantId length).
