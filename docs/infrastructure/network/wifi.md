---
id: wifi
title: How to configure Wi-Fi profiles
sidebar_label: How to Configure Wi-Fi Profiles
description: "Configure Wi-Fi profiles on a Direct-tier IOTC reader via set_wifi: SSID, security mode (Open/WPA2/WPA3), credentials, multi-SSID fallback."
---

> 📙 **HOW-TO** · **Audience:** Solution Builder, Fleet Operator · **Time:** ~5 min · **Ties to:** Network Configuration sub-tag of the API Reference

This guide shows you how to configure Wi-Fi profiles on a handheld reader over MQTT.

### View the current configuration

```json
{"command": "get_wifi", "requestId": "wifi-1"}
```

The response lists configured profiles with their ESSIDs, security types, and connection status.

### Create a new Wi-Fi profile: WPA2Personal

```json
{
  "command": "set_wifi",
  "requestId": "wifi-2",
  "wifiConfig": {
    "operation": "CREATE",
    "essid": "WarehouseWiFi",
    "security": {
      "securityType": "WPA2Personal",
      "passphrase": "<wifi-password>"
    },
    "isPreferred": true,
    "connect": true,
    "ipv4Configuration": {"enableDhcp": true}
  }
}
```

**Security types:** `WPA2Personal`, `WPA3Personal`, `WPA2Enterprise`, `WPA3Enterprise`.

### Create a new profile: WPA2Enterprise (EAP-TLS)

Certificates must already be installed via [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) (see [Certificate management](/infrastructure/security/certificate-management)) — reference them by logical `name`:

```json
{
  "command": "set_wifi",
  "requestId": "wifi-3",
  "wifiConfig": {
    "operation": "CREATE",
    "essid": "EnterpriseWiFi",
    "security": {
      "securityType": "WPA2Enterprise",
      "authentication": "tls",
      "identity": "<eap-identity>",
      "certificate": [
        {"role": "ca_cert", "name": "enterprise-ca"},
        {"role": "client_cert", "name": "enterprise-client"},
        {"role": "client_key", "name": "enterprise-client-key"}
      ]
    },
    "isPreferred": true,
    "connect": false
  }
}
```

**Enterprise authentication methods:** `tls`, `ttls`, `peap`.

### Modify an existing profile

```json
{
  "command": "set_wifi",
  "requestId": "wifi-4",
  "wifiConfig": {
    "operation": "MODIFY",
    "essid": "WarehouseWiFi",
    "security": {"securityType": "WPA2Personal", "passphrase": "<new-password>"}
  }
}
```

`MODIFY` fails with error code 15 (`IOT_ERROR_SSID_NOT_FOUND`) if the ESSID does not exist.

### Delete a profile

```json
{
  "command": "delete_wifi_profile",
  "requestId": "wifi-5",
  "wifiProfileInfo": {"essid": "OldWiFi"}
}
```

Cannot delete the currently active SSID (returns code 16 — `IOT_ERROR_DELETE_ACTIVE_SSID`).

### Limits

- **Maximum 10 saved Wi-Fi profiles** per reader. Exceeding returns code 19 (`IOT_ERROR_SSID_LIMIT_OVERFLOW`).
- **ESSID is case-sensitive.** A mismatch on `MODIFY` triggers code 15.

**Related:** 📘 [Network Architecture](/infrastructure/network/architecture) · 📕 [Wi-Fi endpoints](/reference/api-overview) · 📙 [Certificate Management](/infrastructure/security/certificate-management) (for EAP-TLS prerequisites)
