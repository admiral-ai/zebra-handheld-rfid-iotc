---
id: tls-setup
title: How to Secure the MQTT Connection with TLS
sidebar_label: How to Secure the MQTT Connection with TLS
---

> 📙 **HOW-TO** · Audience: Solution Builder · Time: ~15 min

This guide shows you how to configure an endpoint to use TLS.

### Step 1: Install the broker CA

Follow [Install via HTTP](/infrastructure/security/certificate-management) or [Install via DIRECT](/infrastructure/security/certificate-management) with `type: mqtt` and a meaningful `name` (e.g., `broker-ca`).

### Step 2: Configure the endpoint for TLS

```json
{
  "command": "config_endpoint",
  "requestId": "tls-1",
  "epConfig": {
    "operation": "update",
    "configuration": {
      "endpointName": "main-mgmt",
      "epType": "MGMT",
      "protocol": "MQTT_TLS",
      "url": "iotc-broker.zebra.com",
      "port": 8883,
      "qosCommon": 1,
      "verificationType": "VERIFY_HOST_PEER",
      "tenantId": "<TENANT_ID>",
      "activate": true,
      "mqttParams": {
        "username": "<MQTT_USERNAME>",
        "password": "<MQTT_PASSWORD>",
        "keepAlive": 60,
        "publishTopics": [{"topic": "MGMT/clients/resp", "qos": 0, "retain": false}],
        "subscribeTopics": [{"topic": "MGMT/clients/cmnd", "qos": 0, "retain": false}]
      },
      "securityParams": {
        "caCertificateFile": "broker-ca",
        "clientCert": "broker-client-cert",
        "clientKey": "broker-client-key",
        "format": "PEM"
      }
    }
  }
}
```

### Step 3: Verify

Watch `mqttConnEVT` arriving on the endpoint's event topic, you should see `connectionState: CONNECTED` and `mqttVersion: 3.1.1` once the secure connection is established.

### Verification levels

| `verificationType` | Behaviour |
|---|---|
| `NONE` | No TLS verification; use only on trusted networks |
| `VERIFY_PEER` | Server certificate validates against the installed CA |
| `VERIFY_HOST` | Hostname matches the certificate |
| `VERIFY_HOST_PEER` | Both — **recommended for production** |

**Related:** 📘 [Security Model](/infrastructure/security/model) · 📙 [Certificate Management](/infrastructure/security/certificate-management) · 📕 [config_endpoint](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) · 📕 [mqttConnEVT](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#tag-mqttconnevt)

---

## Endpoint configuration (corrections summary)

[Interface model](/foundations/architecture/interface-model) describes the seven endpoint types and the MDM-as-bootstrap pattern.

[Configure endpoints](/infrastructure/endpoints/configure) uses the `epConfig` envelope with `add` / `update` / `delete` operations. Sample payload identical in structure to the TLS configuration above. Topic limits (3 publish / 1 subscribe) surface as error codes 25 and 26.

---

# Part IV: RFID Operations (rewritten)
