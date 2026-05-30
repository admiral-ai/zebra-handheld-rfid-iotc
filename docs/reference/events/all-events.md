---
id: all-events
title: Events reference | full schemas
sidebar_label: Events reference | full schemas
description: "Reference for every IOTC event schema in one place: heartbeatEVT, alerts, mqttConnEVT, dataEVT. Field-by-field schemas."
---
> 📕 **REFERENCE**

Five events with canonical schemas drawn from `schemas/events/*.json`:

| Event | Top-level fields |
|---|---|
| `dataEVT` | `type`, `timestamp`, `data.tagData[]`, `data.barcodeData[]` (see [dataEVT schema](/rfid/dataevt-schema)) |
| `heartbeatEVT` | `eventName`, `timestamp`, `eventNumber`, `upTime`, `data.inventoryStatus`, `data.batteryAlert` |
| `alerts` | `type`, `timestamp`, `state` (SET/CLEAR/ONESHOT), `id` (BATTERY/FIRMWARE_UPDATE/NETWORK_EVENT/TEMPERATURE/POWER), `priority` (CRITICAL/HIGH/MEDIUM/LOW), `alertDetails` |
| `mqttConnEVT` | `connectionState` (CONNECTED/DISCONNECTED), `timestamp`, `deviceModel`, `deviceSerialNo`, `apiVersion`, `mqttVersion` |

`exceptionEVT` is **not currently a documented event**.
