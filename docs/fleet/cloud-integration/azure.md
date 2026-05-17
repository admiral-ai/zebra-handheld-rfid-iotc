---
id: azure
title: How to Integrate with Azure IoT Hub
sidebar_label: How to Integrate with Azure IoT Hub
---

> 📙 **HOW-TO** · Audience: Solution Builder · Time: ~60 min

This guide shows you how to connect a handheld reader to Azure IoT Hub as the MQTT broker.

### Prerequisites

An Azure subscription with an IoT Hub instance, sufficient permissions to register devices, and Azure CLI installed (or use the portal).

### Step 1: Register the device

```bash
az iot hub device-identity create \
  --hub-name <iot-hub-name> \
  --device-id <reader-serial> \
  --auth-method x509_ca
```

Generate a device certificate signed by your IoT Hub-uploaded CA. Export as PKCS12.

### Step 2: Install certificates on the reader

Per [§7.2](/infrastructure/security/certificate-management), install the DigiCert Global Root G2 (Azure's TLS CA) and the device client certificate.

### Step 3: Configure the reader's endpoint

```json
{
  "command": "config_endpoint",
  "command_id": "azure-1",
  "data": {
    "interface": "data",
    "host": "<iot-hub-name>.azure-devices.net",
    "port": 8883,
    "tls": true,
    "username": "<iot-hub-name>.azure-devices.net/<reader-serial>/?api-version=2021-04-12",
    "ca_alias": "azure-ca",
    "client_cert_alias": "azure-client-<serial>"
  }
}
```

Azure IoT Hub requires a specific username format encoding the device identity.

### Step 4: Topic mapping

Azure IoT Hub uses its own MQTT topic convention (`devices/{deviceId}/messages/events/...`). For most use cases, you'll consume IoT Hub's native message ingestion (Event Hubs, IoT Hub built-in endpoint) rather than subscribing to topics directly.

### Step 5: Verify

Use `az iot hub monitor-events --hub-name <iot-hub-name>` to watch incoming messages. Start an inventory on the reader. Events should appear in the CLI output.

[DIAGRAM: D-15.3.A — IOTC reader ↔ Azure IoT Hub topology]

**Related:** 📘 [§15.1 Integration Patterns](/fleet/cloud-integration/patterns) · 📙 [§7.4 TLS Setup](/infrastructure/security/tls-setup) · 📙 [§8.3 Endpoint Configuration](/infrastructure/endpoints/configure)
