---
id: step-4-start
title: "Step 4: Start an RFID Read Operation"
sidebar_label: "Step 4: Start an RFID Read Operation"
---

> 📗 **TUTORIAL** · Time: ~3 min

In this step we will configure the simplest operating mode and start a read.

### Configure the operating mode

Back in the publisher terminal:

```bash
mosquitto_pub -h iotc-broker.zebra.com -p 8883 \
  -u "<MQTT_USERNAME>" -P "<MQTT_PASSWORD>" \
  --cafile zebra-broker-ca.pem \
  -t "<TENANT_ID>/MDM/clients/cmnd/<DEVICE_SERIAL>" \
  -m '{
    "command": "set_operating_mode",
    "requestId": "qs-2",
    "operatingMode": {
      "profiles": "BALANCED_PERFORMANCE"
    }
  }'
```

In the MGMT subscriber, **you should see** a response with `response.code: 0`.

### Start the operation

```bash
mosquitto_pub -h iotc-broker.zebra.com -p 8883 \
  -u "<MQTT_USERNAME>" -P "<MQTT_PASSWORD>" \
  --cafile zebra-broker-ca.pem \
  -t "<TENANT_ID>/MDM/clients/cmnd/<DEVICE_SERIAL>" \
  -m '{
    "command": "control_operation",
    "requestId": "qs-3",
    "ctrlOprPayload": {
      "controlType": "RFID",
      "operation": "START"
    }
  }'
```

In the MGMT subscriber, **you should see** another `response.code: 0` response. The reader is now scanning.

**Related:** 📘 [§9.1 Operating Mode Profiles](/rfid/operating-mode/profiles) · 📕 [§16.3 set_operating_mode](#chapter-16--mqtt-api-reference) · 📗 [§5.6 Read Tags](/getting-started/quick-start/step-5-read)
