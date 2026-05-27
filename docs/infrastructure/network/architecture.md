---
id: architecture
title: Getting on the network (Wi-Fi and Ethernet)
sidebar_label: Getting on the network (Wi-Fi & Ethernet)
description: "How IOTC sleds get on the network: Direct-tier Wi-Fi 6 in firmware, Bridged-tier Bluetooth bridging via the host. Includes Ethernet cradle support."
---

> 📘 **EXPLANATION** · **Audience:** Solution Builder · **Read time:** ~5 min · **Ties to:** Network Configuration sub-tag of the API Reference

:::tip[See in the API Reference]
Sub-tag: Network Configuration. Operations: [`get_eth`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-eth) · [`get_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-wifi) · [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) · [`delete_wifi_profile`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-wifi-profile).
:::

A sled gets to the broker over **Wi-Fi** (Direct tier — Premium, Premium Plus, RFD90) or **Bluetooth bridged through a host** (Bridged tier — RFD40 Standard). Ethernet does not exist on the sled itself; [`get_eth`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-eth) reads the *broker-side* Ethernet posture when that is what's reachable. This chapter is the Wi-Fi-on-the-sled surface plus the read-only Ethernet view.

### What lives where

On a Direct sled, Wi-Fi credentials and IPv4 strategy live in firmware. They were provisioned by 123RFID Desktop during Phase 2 of the Quick Start. After that, you can:

- **Read** them with [`get_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-wifi) (lists configured profiles).
- **Add or modify** them with [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) (operation `CREATE` or `MODIFY`).
- **Remove** them with [`delete_wifi_profile`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-wifi-profile).

On a Bridged sled, there is no on-sled Wi-Fi. The host device runs the MQTT client and provides the network path. Wi-Fi configuration lives on the host, not on the sled.

### Wi-Fi limits on Direct sleds

| Constraint | Value | Returned as |
|---|---|---|
| Saved Wi-Fi profiles per device | **10** | [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) error code `19` (`IOT_ERROR_SSID_LIMIT_OVERFLOW`) when exceeded |
| SSID length | **≤ 32 characters** (IEEE 802.11 standard) | Longer SSIDs are rejected at save time |
| Wi-Fi certificate size (Enterprise modes) | **≤ 4 KB** per certificate file | Larger files fail to install via [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) |

Delete unused profiles with [`delete_wifi_profile`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-wifi-profile) before adding a new one if you are near the 10-profile cap.

### [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi): supported security types

The reader supports four `securityType` enum values:

| Value | Use | Required credentials |
|---|---|---|
| `WPA2Personal` | Pre-shared-key Wi-Fi (consumer-grade) | passphrase |
| `WPA3Personal` | Pre-shared-key with WPA3 SAE | passphrase |
| `WPA2Enterprise` | Corporate / 802.1X with WPA2 | identity, password, **plus** certificate references (`ca_cert`, `client_cert`, `client_key`) |
| `WPA3Enterprise` | Corporate / 802.1X with WPA3 | identity, password, **plus** certificate references |

Enterprise modes also take an `authProtocol`: `tls`, `ttls`, or `peap`. For `tls`, the three certificate logical names must already be installed via [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) (type `wifi`).

A minimal [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) payload for personal Wi-Fi:

```json
{
  "command": "set_wifi",
  "requestId": "wifi-001",
  "wifiConfig": {
    "operation": "CREATE",
    "interface": { "isEnabled": true, "isPreferred": true },
    "accessPoint": {
      "essid": "IoT-WiFi",
      "connect": true,
      "isPreferred": true,
      "security": {
        "securityType": "WPA2Personal",
        "passphrase": "<your-passphrase>"
      },
      "ipv4": { "enableDhcp": true }
    }
  }
}
```

Field-level shape, including the enterprise variant — is in `mqtt-api-reference/set_wifi.md`.

### Error codes that matter

| Code | Meaning |
|---|---|
| `15` | SSID not found (used by `MODIFY` against a profile that doesn't exist) |
| `18` | ESSID already exists (used by `CREATE` against a duplicate) |

Both indicate a precondition mismatch. `CREATE` requires the ESSID to be new; `MODIFY` requires it to exist. Inspect with [`get_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-wifi) first when in doubt.

### [`get_eth`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-eth): when it makes sense

[`get_eth`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-eth) returns the *broker-side* Ethernet status: whether an Ethernet interface is up, its IP, link speed. On a handheld sled the result is typically "no Ethernet interface present", the sled has no Ethernet port. The command remains useful when:

- The sled is in a cradle that exposes Ethernet through a host (rare).
- You are querying through a fixed-reader companion deployment.
- You want to confirm the reader has not unexpectedly grown an interface (it hasn't).

Most Quick Start integrations will never call [`get_eth`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-eth). It is documented for completeness and for parity with the fixed-reader IOTC product.

### IPv4: DHCP vs static

`set_wifi.wifiConfig.accessPoint.ipv4` carries the IPv4 strategy:

- `{"enableDhcp": true}`, most deployments. Let the AP / DHCP server hand out an address.
- `{"enableDhcp": false, "ipAddress": "...", "subnetMask": "...", "gateway": "...", "dns": "..."}`: static. Required for some industrial deployments where IP-to-device mapping must be deterministic.

Static IPv4 also requires the subnet to match what the AP serves; mismatches produce a connected radio that cannot route to the broker.

### Five-segment path mental model

From sled to broker:

```
Radio  →  Access Point  →  LAN  →  WAN / VPN  →  Broker
  ↑              ↑           ↑          ↑            ↑
  set_wifi    Wi-Fi env   IT-managed  IT-managed   broker config
```

Each segment has its own failure profile. The sled controls only the first; the rest are IT / network domain. See [Where things fail](/diagnose/where-things-fail) for the edge-isolation diagnostic frame.

### Out of scope

- **TLS over MQTT**, see [Securing the connection (TLS & certificates)](/infrastructure/security/model).
- **The full configuration of an MQTT endpoint**, see [How the MQTT plumbing fits together](/infrastructure/endpoints/about).
- **Network failure modes**, see [Where things fail](/diagnose/where-things-fail).
- **Bridged host-bridge configuration**: host-side configuration of the BT bridge is out of IOTC scope; it lives in the host application or SDK.

**Related:** 📘 [Securing the connection (TLS & certificates)](/infrastructure/security/model) · 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📕 [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`get_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
