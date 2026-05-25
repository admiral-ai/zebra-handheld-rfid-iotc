---
id: all-events
title: Events Reference — Full Schemas
sidebar_label: Events Reference — Full Schemas
---
> 📕 **REFERENCE**

Five events with canonical schemas drawn from `schemas/events/*.json`:

| Event | Top-level fields |
|---|---|
| `dataEVT` | `type`, `timestamp`, `data.tagData[]`, `data.barcodeData[]` (see [dataEVT schema](/rfid/tag-data/dataevt-schema)) |
| `heartBeatEVT` | `eventName`, `timestamp`, `eventNumber`, `upTime`, `data.inventoryStatus`, `data.batteryAlert` |
| `alerts` | `type`, `timestamp`, `state` (SET/CLEAR/ONESHOT), `id` (BATTERY/FIRMWARE_UPDATE/NETWORK_EVENT/TEMPERATURE/POWER), `priority` (CRITICAL/HIGH/MEDIUM/LOW), `alertDetails` |
| `alert_short` | `id` (~50-entry enum), `timestamp`, `type` (NOTIFICATION/ALERT), `priority` (CRITICAL/HIGH/LOW), `messageID`, `description` |
| `mqttConnEVT` | `connectionState` (CONNECTED/DISCONNECTED), `timestamp`, `deviceModel`, `deviceSerialNo`, `apiVersion`, `mqttVersion` |

`exceptionEVT` is **not currently a documented event**.
