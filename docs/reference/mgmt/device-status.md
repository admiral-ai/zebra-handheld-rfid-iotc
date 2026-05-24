---
id: device-status
title: "Device Status (MGMT)"
sidebar_label: "Device Status (MGMT)"
---
> 📕 **REFERENCE**

#### [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) (T4)

Returns reader identity and version metadata.

**Request:** `{"command": "get_version", "requestId": "<id>"}`

**Response fields:** `readerVersion.firmwareVersion`, `readerVersion.model`, `readerVersion.serialNumber`, `readerVersion.sku`, `readerVersion.detailedVersions.scannerFirmware`, `readerVersion.detailedVersions.radioFirmware`, `readerVersion.detailedVersions.iotcVersion`.

**See Also:** 📘 [§2.2](/foundations/architecture/components) · 📙 [§4.1](/getting-started/prerequisites/requirements)

#### [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status) (T4)

Returns operational snapshot.

**Response fields:** `deviceStatus.powerSource`, `radioActivity`, `radioConnection`, `systemTime`, `temperature`, `ntp.{offset,reach}`, `terminalConnection.{status,type}`, `batteryStatus.{capacity,stateOfHealth,chargePercentage,chargeStatus}`.

#### [`get_current_region`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-current-region) (T4)

Returns regulatory region settings.

**Response fields:** `currentRegion.country`, `regulatoryStandard`, `maxTxPowerSupported`, `minTxPowerSupported`, `lbtEnabled`, `frequencyHopping`, `channelData[]`.

Region is read-only over MQTT — configure via 123RFID Desktop. Code 6 (`IOT_STATUS_REGION_NOT_CONFIGURED`) is returned by the internal `cloud_connect` operation when no region is configured.
