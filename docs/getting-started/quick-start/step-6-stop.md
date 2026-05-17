---
id: step-6-stop
title: "Step 6: Stop the Operation"
sidebar_label: "Step 6: Stop the Operation"
---

> 📗 **TUTORIAL** · Time: ~2 min

### Publish stop

```bash
mosquitto_pub -h iotc-broker.zebra.com -p 8883 \
  -u "<MQTT_USERNAME>" -P "<MQTT_PASSWORD>" \
  --cafile zebra-broker-ca.pem \
  -t "<TENANT_ID>/MDM/clients/cmnd/<DEVICE_SERIAL>" \
  -m '{
    "command": "control_operation",
    "requestId": "qs-4",
    "ctrlOprPayload": {
      "controlType": "RFID",
      "operation": "STOP"
    }
  }'
```

**You should see** `response.code: 0` in the MGMT subscriber, and the DATA subscriber stops receiving new events. The reader is back to idle.

> If the reader was already idle when you sent the STOP, you will see `response.code: 12` (`IOT_ERROR_NO_RADIO_OP_IN_PROGRESS`). This is informational, not a failure — the radio is already in the desired state.

### Recap

You have just connected to the broker, discovered the reader, subscribed to a data stream, configured an operating mode profile, started a read, observed live tag data, and stopped cleanly. Every other workflow in this documentation is built on this pattern.

**Related:** 📕 [§16.3 control_operation](#chapter-16--mqtt-api-reference) · 📗 [§5.8 Python tutorial](/sdks/python) · 📙 [Part III Infrastructure](#part-iii-infrastructure)
