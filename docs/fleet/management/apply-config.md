---
id: apply-config
title: How to Apply Bulk Configuration
sidebar_label: How to Apply Bulk Configuration
---

> 📙 **HOW-TO** · Audience: Fleet Operator · Time: ~10 min

### Build the payload

```json
{
  "command": "set_config",
  "requestId": "sc-1",
  "configData": {
    "applyAfterReboot": false,
    "wifiConfig": {
      "operation": "CREATE",
      "essid": "MainWiFi",
      "security": {"securityType": "WPA2Personal", "passphrase": "..."}
    },
    "epConfig": {
      "operation": "add",
      "endpointName": "main-mgmt",
      "configuration": {
        "epType": "MGMT",
        "protocol": "MQTT_TLS",
        "url": "broker.example.com",
        "port": 8883,
        "tenantId": "<TENANT_ID>",
        "verificationType": "VERIFY_HOST_PEER",
        "activate": true,
        "mqttParams": { /* ... */ },
        "securityParams": {"caCertificateFile": "broker-ca", "format": "PEM"}
      }
    }
  }
}
```

### Validation error codes

| Code | Trigger |
|---|---|
| 2 | `IOT_ERROR_INVALID_PAYLOAD` |
| 10 | `IOT_ERROR_CONFIG_ALREADY_EXIST`; endpoint name in use |
| 17 | `IOT_ERROR_SSID_MISSED` — ESSID field missing |
| 18 | `IOT_ERROR_SSID_ALREADY_EXIST` — CREATE on existing ESSID |
| 23 | `IOT_ERROR_INVALID_ENUM`; unsupported enum value |
| 25 | `IOT_ERROR_PUBLISH_TOPICS_EXCEEDED`; more than 3 publish topics |
| 26 | `IOT_ERROR_SUBSCRIBE_TOPIC_EXCEEDED`; more than 1 subscribe topic |
| 27 | `IOT_ERROR_INVALID_TENANTID_LENGTH` |

### Recovery if connectivity is lost

If a [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) change disconnects the reader, the recovery path is 123RFID Desktop via cradle — reset the MDM endpoint, the reader comes back online, and you can re-issue the corrected [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config).

**Related:** 📘 [Bulk Configuration](/fleet/management/about-bulk) · 📕 [set_config](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) · 📙 [Read Config](/fleet/management/read-config)

---

## Migration Cluster (revised)
