---
id: catalog
title: "Event Types Catalog (Index)"
sidebar_label: "Event Types Catalog (Index)"
---

> 📕 **REFERENCE** · Use: navigation index

| Event | Default endpoint convention | Direction | Trigger | Consumer | Full schema |
|---|---|---|---|---|---|
| `dataEVT` | DATA1 / DATA2 publish topic (e.g., `<topic>/clients/rfid`) | Reader → App | Tag read during inventory | Application backend | [dataEVT schema](/rfid/tag-data/dataevt-schema), [API Reference](/reference/api-overview) |
| `heartBeatEVT` | MGMT_EVT publish topic (e.g., `<topic>/clients/event`) | Reader → App | Periodic per `heartbeatConfiguration.interval` | Fleet monitoring | [API Reference](/reference/api-overview) |
| `alerts` | MGMT_EVT publish topic | Reader → App | Condition state transition; `id` enum: BATTERY, FIRMWARE_UPDATE, NETWORK_EVENT, TEMPERATURE, POWER | Operations | [API Reference](/reference/api-overview) |
| `alert_short` | SOTI/MDM publish topic | Reader → MDM | Same conditions as `alerts`, compact payload | MDM platform | [API Reference](/reference/api-overview) |
| `mqttConnEVT` | MGMT_EVT publish topic | Reader → App | Connection state change (CONNECTED / DISCONNECTED) | Fleet monitoring | [API Reference](/reference/api-overview) |
