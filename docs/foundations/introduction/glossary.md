---
id: glossary
title: Glossary, limits, and cheat sheets
sidebar_label: Glossary, limits, and cheat sheets
---

> 📕 **REFERENCE** · Audience: All · Use: lookup while reading

| Term | Definition |
|---|---|
| **123RFID Desktop** | Windows utility used to bootstrap a reader (region, Wi-Fi, MDM endpoint) over USB. Required for initial setup; region setting is exclusively available through this tool. |
| **accessOperations** | Array of per-tag operations executed during inventory: `READ`, `WRITE`, `ACCESS`, `LOCK`, `KILL`. Set in `set_operating_mode`. |
| **ADVANCED** | Operating mode profile that unlocks manual control of transmit power, link profile, session, and dynamic power. Requires `advancedConfigurations`. |
| **alert_short** | Compact alert event format with predefined `id` enum (~50 values). Designed for MDM-platform consumers (chiefly SOTI). |
| **applyAfterReboot** | Boolean field in `set_config` that defers Wi-Fi and endpoint changes until the next reboot. |
| **BALANCED_PERFORMANCE** | Default operating mode profile. Balances read performance against battery longevity. |
| **broker** | The MQTT message broker through which readers and applications communicate. Can be Zebra-hosted or customer-provided. |
| **channel** | The client-identifier segment used in user-configured MQTT topic middle segments (e.g., `MGMT/clients/cmnd`). |
| **CLEAR** | Alert state indicating a previously-active condition has been resolved. |
| **cloud_connect** | Internal command invoked by the reader's bootstrap sequence to establish the initial cloud broker connection. Not invoked by application code. Consumes error codes 6 and 7. |
| **configData** | Top-level payload key for `set_config`. Contains `wifiConfig`, `epConfig`, `applyAfterReboot`. |
| **ctrlOprPayload** | Top-level payload key for `control_operation`. Contains `controlType` and `operation`. |
| **CTRL** | The Control interface — endpoint type for RFID radio operations. See [Interface Model](/foundations/architecture/interface-model). |
| **DATA1 / DATA2** | Endpoint type enum values for tag-data streaming. |
| **dataEVT** | The event payload emitted on a DATA endpoint for each tag read or aggregated batch. Schema in [dataEVT Payload Schema](/rfid/tag-data/dataevt-schema). |
| **deviceSerial** / **deviceSerialNumber** | The reader's unique serial number, appearing in every topic path. Returned by `get_version`. |
| **EAP-TLS** | The certificate-based Wi-Fi authentication method supported by IOTC for enterprise deployments (one of the `tls`/`ttls`/`peap` Enterprise auth methods). |
| **endpoint (API sense)** | A named MQTT command or event (e.g., `set_wifi`, `dataEVT`). |
| **endpoint (MQTT sense)** | The broker connection target configured per interface — see [About MQTT Endpoint Configuration](/infrastructure/endpoints/about). |
| **epConfig** | Top-level payload key for `config_endpoint`. Wraps the `configuration` object. |
| **epType** | Endpoint type enum: `MGMT`, `MGMT_EVT`, `CTRL`, `DATA1`, `DATA2`, `SOTI`, `MDM`. |
| **EPC** | Electronic Product Code — the primary identifier on a Gen2 RFID tag. |
| **ESSID** | Wi-Fi access-point network name. Equivalent to SSID; the API uses `ESSID` as the field name. |
| **eventConfiguration** | Per-endpoint event flag and threshold object. Contains `heartbeatConfiguration` sub-object. |
| **FAST_READ** | A sixth operating mode profile referenced in the `dataEVT.type` enum. Surfaces in tag data, not in `set_operating_mode.profiles`. |
| **heartBeatEVT** | Periodic event emitted on an endpoint with heartbeat enabled, carrying device status, battery, connection state. |
| **heartbeatConfiguration** | Sub-object inside `eventConfiguration` that controls heartbeat interval and which sub-payloads (`inventoryStatus`, `batteryStatus`, `userApps`) are included. |
| **host device** | The Android phone or tablet to which the reader sled is paired via Bluetooth. Provides network connectivity to the broker. |
| **IOT_STATUS_*** / **IOT_ERROR_*** | Symbolic names for the 29-entry numeric error code table (codes 0–28). See [Command Response Error Codes](/reference/errors/codes). |
| **LWT** | MQTT Last Will and Testament — a message the broker publishes on a client's behalf if the client disconnects ungracefully. |
| **MDM** | Mobile Device Management. In IOTC context, refers both to the protocol-level interface and the SOTI Connect platform. |
| **MGMT** / **MGMT_EVT** | Endpoint types: `MGMT` for command/response; `MGMT_EVT` for dedicated management events. |
| **mqttConnEVT** | Event emitted when an endpoint's MQTT connection state changes (`CONNECTED` or `DISCONNECTED`). |
| **mqttParams** | Sub-object inside endpoint configuration carrying broker-connection parameters (keepAlive, cleanSession, username, password, publishTopics, subscribeTopics). |
| **ONESHOT** | Alert state for one-time informational events with no companion `CLEAR`. |
| **operating mode** | The RFID read configuration profile selected via `operatingMode.profiles`. See [About RFID Operating Mode Profiles](/rfid/operating-mode/profiles). |
| **operatingMode** | Top-level payload key for `set_operating_mode`. |
| **OSUpdateDetails** | Top-level payload key for `set_os`. |
| **peakRssi** | RSSI value reported in `dataEVT` when reads are aggregated; reflects peak since last report. |
| **post-filter** | Reader-side string-pattern filter applied after Gen2 singulation, scoped per data endpoint. Distinct from Gen2 SELECT. See [About Post-Filters](/rfid/operating-mode/post-filters-about). |
| **postFilterPayload** | Top-level payload key for `set_post_filter`. |
| **PKCS12** | Container format for X.509 certificates plus their private keys. Accepted by `install_certificate` via the `certificateBundle` for the `DIRECT` source. |
| **Q-algorithm** | The dynamic algorithm a reader uses to select the slot count during Gen2 singulation. Set indirectly by the operating-mode profile (or by `advancedConfigurations` under the `ADVANCED` profile). |
| **QoS** | MQTT Quality of Service level. IOTC uses QoS 0 (fire-and-forget) and QoS 1 (at-least-once). |
| **requestId** | Required client-supplied correlation identifier on every command. Echoed in the response. |
| **retained message** | An MQTT message the broker stores and delivers to new subscribers on the topic. IOTC uses retained messages selectively. |
| **RSSI** | Received Signal Strength Indicator — per-tag-read value present in `dataEVT` payloads. |
| **securityParams** | Endpoint sub-object referencing installed certificates by logical name (e.g., `caCertificateFile`, `clientCert`, `clientKey`). |
| **SELECT** | Gen2 protocol-level pre-singulation filter (configured in `set_operating_mode.select[]`, bit-level offset, hex pattern up to 64 chars). |
| **SESSION_0 / SESSION_1 / SESSION_2 / SESSION_3** | Gen2 session values controlling tag-inventoried-flag persistence. |
| **SET** | Alert state indicating a condition is currently active. |
| **singulation** | The Gen2 protocol process by which a reader isolates and identifies a single tag among many. |
| **sled** | Colloquial name for a handheld RFID reader (RFD40 or RFD90 in this product family). |
| **SOTI** | Endpoint type for SOTI MobiControl MDM integration; distinct from `MDM`. |
| **SOTI Connect** | The MDM platform Zebra recommends for fleet management of handheld readers. |
| **tenantId** | The top-level segment in IOTC's topic pattern. Isolates customers from one another on a shared broker. |
| **TID** | Tag Identifier memory bank on a Gen2 tag. Contains tag manufacturer data; exposed via `accessOperations` configured to read it. |
| **wifiConfig** | Top-level payload key for `set_wifi`. |
