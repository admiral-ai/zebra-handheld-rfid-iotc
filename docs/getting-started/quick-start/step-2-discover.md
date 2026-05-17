---
id: step-2-discover
title: "Step 2: Discover the Reader"
sidebar_label: "Step 2: Discover the Reader"
---

> 📗 **TUTORIAL** · Time: ~3 min

In this step we will ask the reader to identify itself.

### Publish `get_version`

Open a second terminal:

```bash
mosquitto_pub -h iotc-broker.zebra.com -p 8883 \
  -u "<MQTT_USERNAME>" -P "<MQTT_PASSWORD>" \
  --cafile zebra-broker-ca.pem \
  -t "<TENANT_ID>/MDM/clients/cmnd/<DEVICE_SERIAL>" \
  -m '{"command": "get_version", "requestId": "qs-1"}'
```

### Watch the response arrive

Switch back to the subscriber terminal from §5.2.

**You should see** a JSON response like:

```json
{
  "command": "get_version",
  "requestId": "qs-1",
  "apiVersion": "V1.1",
  "readerVersion": {
    "firmwareVersion": "PAAFKS00-007-D03",
    "model": "RFD40",
    "serialNumber": "212735201D0053",
    "sku": "RFD4031-G10B700-US",
    "detailedVersions": {
      "scannerFirmware": "PAAEOC20-003-R01",
      "radioFirmware": "2.0.42.0",
      "iotcVersion": "V1.1"
    }
  },
  "response": {"code": 0, "description": "Success"}
}
```

### Notice

The `requestId` in the response matches the one we sent — that is how the application correlates responses to requests. The `response.code` of `0` indicates success per the [§17.2 error code table](/reference/errors/codes).

**Related:** 📕 [§16.2 `get_version`](#chapter-16--mqtt-api-reference) · 📕 [§17.2 Error Codes](/reference/errors/codes) · 📗 [§5.4 Subscribe to Tag Data](/getting-started/quick-start/step-3-subscribe)
