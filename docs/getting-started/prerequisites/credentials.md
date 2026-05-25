---
id: credentials
title: How to Obtain IOTC Credentials & Tenant ID
sidebar_label: "IOTC credentials & tenant ID"
---

> 📙 **HOW-TO** · **Audience:** New Integrator · **Time:** ~5 min

This guide shows you how to obtain the IOTC credentials needed to connect a handheld reader to the Zebra-hosted MQTT broker. If you are connecting to a customer-hosted broker, follow [§15.5 Custom MQTT Broker](/fleet/cloud-integration/custom-broker) instead.

### Prerequisites

A Zebra developer account. Sign up at [developer.zebra.com](https://developer.zebra.com) if you do not have one.

### Steps

1. **Sign in** at the Zebra developer portal.
2. **Navigate** to **My Account → IoT Connector → Tenants**.
3. **Create a tenant** if you do not yet have one. Provide a tenant name (descriptive; this is for your reference); the portal assigns the `tenantId`.
4. **Capture three values** from the tenant detail page: `tenantId`, MQTT username, MQTT password. Store them in your credentials vault.

[DIAGRAM: D-4.2.A. annotated screenshot of the tenant detail page with the three values circled]

### Verify

Confirm the credentials work by attempting an MQTT CONNECT:

```bash
mosquitto_sub -h iotc-broker.zebra.com -p 8883 \
  -u "<MQTT_USERNAME>" -P "<MQTT_PASSWORD>" \
  --cafile zebra-broker-ca.pem \
  -t "<TENANT_ID>/mgmt/clients/test/#" -v
```

If the command remains connected without error, the credentials are valid. If you receive `Connection refused`, double-check the username, password, and CA certificate path.

**Related:** 📘 [Auth Model](/foundations/mqtt/auth-model) · 📗 [Phase 1: Prepare network and broker](/getting-started/quick-start/step-1-connect) · 📕 [Custom MQTT broker (for non-Zebra-hosted)](/fleet/cloud-integration/custom-broker) · 📕 [API overview](/reference/api-overview)
