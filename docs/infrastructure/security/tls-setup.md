---
id: tls-setup
title: How to Secure the MQTT Connection with TLS
sidebar_label: How to Secure the MQTT Connection with TLS
---

> 📙 **HOW-TO** · Audience: Solution Builder · Time: ~15 min

This guide shows you how to configure an endpoint to use TLS.

### Step 1: Install the broker CA

Follow [§7.2 Install via HTTP](/infrastructure/security/certificate-management) or [§7.2 Install via DIRECT](/infrastructure/security/certificate-management) with `type: mqtt` and a meaningful `name` (e.g., `broker-ca`).

### Step 2: Configure the endpoint for TLS

```json
{
  "command": "config_endpoint",
  "requestId": "tls-1",
  "epConfig": {
    "operation": "update",
    "endpointName": "main-mgmt",
    "configuration": {
      "epType": "MGMT",
      "protocol": "MQTT_TLS",
      "url": "iotc-broker.zebra.com",
      "port": 8883,
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
        "format": "PEM"
      }
    }
  }
}
```

### Step 3: Verify

Watch `mqttConnEVT` arriving on the endpoint's event topic — you should see `connectionState: CONNECTED` and `mqttVersion: 3.1.1` once the secure connection is established.

### Verification levels

| `verificationType` | Behaviour |
|---|---|
| `NONE` | No TLS verification — use only on trusted networks |
| `VERIFY_PEER` | Server certificate validates against the installed CA |
| `VERIFY_HOST` | Hostname matches the certificate |
| `VERIFY_HOST_PEER` | Both — **recommended for production** |

**Related:** 📘 [§7.1 Security Model](/infrastructure/security/model) · 📙 [§7.2 Certificate Management](/infrastructure/security/certificate-management) · 📕 [§16.2 config_endpoint](#chapter-16--mqtt-api-reference) · 📕 [§16.6 mqttConnEVT](#chapter-16--mqtt-api-reference)

---

## §8.1, §8.3 — Endpoint Configuration (corrections summary)

§8.1 rewritten per [§2.4 corrections](/foundations/architecture/interface-model) above (seven endpoint types; MDM-as-bootstrap pattern).

§8.3 rewritten with `epConfig` envelope and `add/update/delete` operations. Sample payload identical in structure to §7.4 above. Topic limits (3 publish / 1 subscribe) surfaced with error codes 25 and 26.

---

# Part IV — RFID Operations (rewritten)
