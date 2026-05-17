---
id: config-schema
title: `get_config` Response Schema
sidebar_label: `get_config` Response Schema
---

> 📕 **REFERENCE**

The `get_config` response carries `currentConfig` with seven top-level objects: `readerVersion`, `deviceStatus`, `currentRegion`, `ethConfig`, `wifiConfig`, `installedCerts`, `epConfig`. Below is the canonical structure with each sub-object's field shape (drawn verbatim from `schemas/response/dev_mgmt/get_config.json` examples).

### `readerVersion`

```json
{
  "firmwareVersion": "PAAFKS00-007-D03",
  "model": "RFD40",
  "serialNumber": "212735201D0053",
  "sku": "RFD4031-G10B700-US",
  "detailedVersions": {
    "scannerFirmware": "PAAEOC20-003-R01",
    "radioFirmware": "2.0.42.0",
    "iotcVersion": "V1.1"
  }
}
```

### `deviceStatus`

```json
{
  "powerSource": "USB",
  "radioActivity": "INACTIVE",
  "radioConnection": "CONNECTED",
  "systemTime": "2024-02-26T17:46:06.138Z",
  "temperature": 32,
  "ntp": {"offset": 0, "reach": 0},
  "terminalConnection": {"status": "CONNECTED", "type": "USB"},
  "batteryStatus": {
    "capacity": 6400,
    "stateOfHealth": "GOOD",
    "chargePercentage": 100,
    "chargeStatus": 1
  }
}
```

### `currentRegion`

```json
{
  "frequencyHopping": true,
  "channelData": ["91575", "91525", "..."],
  "country": "United States",
  "lbtEnabled": false,
  "maxTxPowerSupported": 300,
  "minTxPowerSupported": 0,
  "regulatoryStandard": "FCC"
}
```

### `ethConfig` / `wifiConfig`

Per the schemas in [§16.2 get_eth](#chapter-16--mqtt-api-reference) and [§16.2 get_wifi](#chapter-16--mqtt-api-reference).

### `epConfig`

The active endpoint's full configuration, including `mqttParams`, `securityParams`, and the nested `eventConfiguration` (with `heartbeatConfiguration`).

### Writable subset

`set_config.configData` accepts only:

- `wifiConfig` (CREATE / MODIFY)
- `epConfig` (add / update / delete)
- `applyAfterReboot`

Domains not writable through `set_config`: `readerVersion`, `deviceStatus`, `currentRegion`, `ethConfig`, `installedCerts`. Each has its own dedicated command(s) or is read-only.
