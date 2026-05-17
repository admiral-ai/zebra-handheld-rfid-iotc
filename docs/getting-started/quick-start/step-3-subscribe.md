---
id: step-3-subscribe
title: "Step 3: Subscribe to Tag Data Events"
sidebar_label: "Step 3: Subscribe to Tag Data Events"
---

> 📗 **TUTORIAL** · Time: ~2 min

In this step we will subscribe to the topic where tag data will arrive once an inventory is running.

For the MDM endpoint, the publish topic for RFID data follows the source convention `MDM/clients/rfid`. (For production deployments with dedicated `DATA1` endpoints, the topic would differ — but for this tutorial we use the MDM endpoint's combined topics.)

### Open a third terminal

```bash
mosquitto_sub -h iotc-broker.zebra.com -p 8883 \
  -u "<MQTT_USERNAME>" -P "<MQTT_PASSWORD>" \
  --cafile zebra-broker-ca.pem \
  -t "<TENANT_ID>/MDM/clients/rfid/<DEVICE_SERIAL>" -v
```

**You should see** the terminal pause without printing anything. The subscription is active; no tag data yet, because we have not started an inventory.

**Related:** 📘 [§10.1 Tag Data Architecture](/rfid/tag-data/architecture) · 📕 [§10.2 dataEVT Schema](/rfid/tag-data/dataevt-schema) · 📗 [§5.5 Start Read](/getting-started/quick-start/step-4-start)
