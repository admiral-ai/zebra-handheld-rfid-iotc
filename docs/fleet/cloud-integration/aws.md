---
id: aws
title: How to Integrate with AWS IoT Core
sidebar_label: How to Integrate with AWS IoT Core
---

> 📙 **HOW-TO** · Audience: Solution Builder · Time: ~60 min

This guide shows you how to connect a handheld reader to AWS IoT Core as the MQTT broker.

### Prerequisites

An AWS account with IoT Core enabled, IAM permissions to create things and policies, and access to the AWS Console.

### Step 1: Create a Thing and certificate in AWS

In AWS IoT Core: **Manage → Things → Create**. Create a Thing named after the reader's serial number. Generate and download a device certificate and key. Activate the certificate. Attach an IoT policy granting `iot:Connect`, `iot:Publish`, `iot:Subscribe`, and `iot:Receive` on the appropriate topic ARNs.

### Step 2: Install the AWS CA and client cert on the reader

Per [§7.2](/infrastructure/security/certificate-management), install:

- The Amazon Root CA (`AmazonRootCA1.pem`) as a CA certificate, alias `aws-ca`.
- The Thing-specific client certificate + key (as PKCS12), alias `aws-client-<serial>`.

### Step 3: Configure the reader's endpoints to point at AWS

```json
{
  "command": "config_endpoint",
  "command_id": "aws-1",
  "data": {
    "interface": "data",
    "host": "<account-id>-ats.iot.<region>.amazonaws.com",
    "port": 8883,
    "tls": true,
    "ca_alias": "aws-ca",
    "client_cert_alias": "aws-client-<serial>"
  }
}
```

Repeat for `ctrl` and `mgmt` if you want full integration; or keep them on the Zebra-hosted broker and use AWS only for DATA (separate-data-broker pattern, see [§8.4](/infrastructure/endpoints/multi-endpoint)).

### Step 4: Topic mapping

AWS IoT Core does not impose a topic convention; you choose. A common pattern is to mirror the IOTC topic structure under a top-level prefix you control. The reader continues to publish to `{tenantId}/data1event/...` — AWS receives those exactly. Downstream AWS rules can route to Kinesis, Lambda, or DynamoDB.

### Step 5: Verify

In AWS IoT Core's **Test to MQTT test client**, subscribe to `<tenantId>/data1event/clients/#`. Start an inventory on the reader. Tag-data events should appear in the AWS test client.

[DIAGRAM: D-15.2.A. IOTC reader ↔ AWS IoT Core topology]

**Related:** 📘 [§15.1 Integration Patterns](/fleet/cloud-integration/patterns) · 📙 [§7.4 TLS Setup](/infrastructure/security/tls-setup) · 📙 [§8.3 Endpoint Configuration](/infrastructure/endpoints/configure) · 📕 [§16.2 config_endpoint](#chapter-16--mqtt-api-reference)
