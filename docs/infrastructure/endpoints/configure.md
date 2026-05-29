---
id: configure
title: How to configure MQTT endpoints
sidebar_label: How to Configure MQTT Endpoints
description: "Configure IOTC MQTT endpoints with config_endpoint: add, update, delete operations for the seven endpoint types (MDM, MGMT, CTRL, EVT, DATA1, DATA2, ALERT)."
---

> 📙 **HOW-TO** · **Audience:** Solution Builder · **Time:** ~10 min

This guide shows you how to set the broker target for one or more MQTT interfaces.

### Decide: single or separate brokers

If you have no specific reason to separate, **use a single broker for all interfaces**. Separate brokers are an architectural choice with operational cost; see [Multi-endpoint architectures](/infrastructure/endpoints/multi-endpoint).

### Configure an interface

```json
{
  "command": "config_endpoint",
  "command_id": "ep-set-1",
  "data": {
    "interface": "ctrl",
    "host": "iotc-broker.zebra.com",
    "port": 8883,
    "tls": true,
    "username": "<user>",
    "password": "<password>",
    "ca_alias": "broker-ca"
  }
}
```

Repeat for `mgmt`, `data`, `mdm` as needed.

### Validate the change

Watch `mqttConnEVT` for the affected interface, you should see a disconnect from the old endpoint followed by a connect to the new one within seconds.

### Rollback if connectivity is lost

If the new endpoint configuration causes loss of MQTT connectivity:

1. Dock the reader in a cradle with USB access to 123RFID Desktop.
2. Restore the previous endpoint configuration.
3. Reapply and verify.

This is why endpoint changes should be canaried on a single device before fleet rollout.

```d2
S: Choose endpoint topology
Q1: "Tag volume\n> 100 TPS sustained?" { shape: diamond }
Q2: "MDM platform\nrequired?" { shape: diamond }
SEP: Separate DATA broker
SINGLE: Single broker
MDMG: MDM-managed endpoint
S -> Q1
Q1 -> Q2: No
Q1 -> SEP: Yes
Q2 -> SINGLE: No
Q2 -> MDMG: Yes

```

**Related:** 📘 [Multi-Endpoint Architectures](/infrastructure/endpoints/multi-endpoint) · 📙 [TLS Setup](/infrastructure/security/tls-setup) · 📕 [config_endpoint](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) · 📕 [mqttConnEVT](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#tag-mqttconnevt)
