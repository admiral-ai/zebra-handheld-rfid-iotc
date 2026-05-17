---
id: step-2-discover
title: Step 2 — Discover the Reader
sidebar_label: Step 2. Discover
---

# Step 2: Discover the Reader

<div className="badge-tutorial">TUTORIAL</div>

In this step we will ask the reader to identify itself.

## Publish `get_version`

```bash
mosquitto_pub -h iotc-broker.zebra.com -p 8883 \
  -u "<MQTT_USERNAME>" -P "<MQTT_PASSWORD>" \
  --cafile zebra-broker-ca.pem \
  -t "<TENANT_ID>/MDM/clients/cmnd/<DEVICE_SERIAL>" \
  -m '{"command": "get_version", "requestId": "qs-1"}'
```

**You should see** a JSON response with `readerVersion.firmwareVersion`, `model`, `serialNumber`, `sku`, and `detailedVersions.iotcVersion`.
