---
id: custom-broker
title: How to Integrate with a Custom MQTT Broker
sidebar_label: How to Integrate with a Custom MQTT Broker
---

> 📙 **HOW-TO** · Audience: Solution Builder · Time: ~60 min

This guide shows you how to connect a handheld reader to a customer-hosted MQTT broker (Mosquitto, HiveMQ, EMQX, VerneMQ).

### Step 1: Broker preparation

The broker must support MQTT 3.1.1 over TLS on TCP/8883. Verify the broker version supports persistent sessions and QoS 0 and 1. For high-tag-volume deployments, size the broker for the expected message rate (events/second × average message size).

### Step 2: TLS configuration on the broker

- Provision a server certificate signed by a CA the reader trusts.
- If using mutual TLS, issue device client certificates and configure the broker to require them.
- Disable cleartext (TCP/1883) for production deployments.

### Step 3: Credential management

For username/password auth: provision per-tenant or per-device credentials in the broker's auth backend. For mutual TLS: device identity is the certificate subject; no additional credentials needed.

### Step 4: Topic ACLs

Configure broker ACLs to enforce tenant isolation: a credential for `tenantId=acme` may publish and subscribe only on `acme/...`. Each broker's ACL syntax differs (consult vendor docs); the policy is the same.

### Step 5: Reader endpoint configuration

```json
{
  "command": "config_endpoint",
  "command_id": "custom-1",
  "data": {
    "interface": "data",
    "host": "broker.example.com",
    "port": 8883,
    "tls": true,
    "username": "<user>",
    "password": "<password>",
    "ca_alias": "custom-broker-ca"
  }
}
```

### Step 6: Verify

From a test machine, subscribe to the tenant's wildcard topic with the same credentials:

```bash
mosquitto_sub -h broker.example.com -p 8883 \
  -u <user> -P <password> --cafile broker-ca.pem \
  -t "<tenantId>/#" -v
```

Start an inventory on the reader; events should arrive in the subscriber output.

[DIAGRAM: D-15.5.A. IOTC ↔ customer-hosted broker topology]

**Related:** 📘 [§15.1 Integration Patterns](/fleet/cloud-integration/patterns) · 📘 [§3.5 Auth Model](/foundations/mqtt/auth-model) · 📙 [§7.4 TLS Setup](/infrastructure/security/tls-setup) · 📕 [§16.2 config_endpoint](#chapter-16--mqtt-api-reference)
