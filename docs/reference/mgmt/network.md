---
id: network
title: "Network Configuration (MGMT)"
sidebar_label: "Network Configuration (MGMT)"
---
> 📕 **REFERENCE**

#### [`get_eth`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-eth) (T4)

Returns Ethernet interface status.

**Response fields:** `ethConfig.interfaceDetails.{interfaceName, status, hostName, macAddress, linkStatus, ipv4Configuration}`. When disabled, only `interfaceName` and `status: Disabled`.

#### `set_eth` (T2)

Configures Ethernet (where supported). Refer to source schema for payload shape; documentation slot pending HW SME completion.

#### [`get_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-wifi) (T3)

Returns Wi-Fi configuration and connection state.

#### [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) (T2)

Operations: `CREATE`, `MODIFY`. Payload key `wifiConfig`. See [§6.2 How-to](/infrastructure/network/wifi) for examples.

**Errors:** 15 (SSID not found), 17 (SSID missed), 18 (SSID already exists), 19 (profile limit), 20 (Wi-Fi not supported), 23 (invalid enum), 2 (invalid payload).

#### [`delete_wifi_profile`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-wifi-profile) (T3)

Removes a saved Wi-Fi profile by ESSID. **Errors:** 15, 16 (active SSID), 17.
