---
id: step-1-connect
title: "Step 1: Connect to the MQTT Broker"
sidebar_label: "Step 1: Connect to the MQTT Broker"
---

> 📗 **TUTORIAL** · Time: ~3 min

In this step we will open an MQTT subscriber to the topic where the reader publishes its responses.

### Discover the configured topic

Before subscribing, you need to know the topic the reader will publish on. For a freshly bootstrapped reader, the MDM endpoint's `subscribeTopics` (what the reader listens to) and `publishTopics` (what the reader publishes) were set by 123RFID Desktop. Common convention for the MDM publish topic is `MDM/clients/resp`.

Constructed full topic for subscribing:

```
<TENANT_ID>/MDM/clients/resp/<DEVICE_SERIAL>
```

### Run the subscriber

```bash
mosquitto_sub -h iotc-broker.zebra.com -p 8883 \
  -u "<MQTT_USERNAME>" -P "<MQTT_PASSWORD>" \
  --cafile zebra-broker-ca.pem \
  -t "<TENANT_ID>/MDM/clients/resp/<DEVICE_SERIAL>" -v
```

**You should see** the terminal pause without printing anything. That is the expected result — the subscription is active and the reader has not published anything yet.

**Related:** 📘 [§3.2 Topic Hierarchy](/foundations/mqtt/topic-hierarchy) · 📘 [§8.1 Endpoint Configuration](/infrastructure/endpoints/about) · 📗 [§5.3 Discover the Reader](/getting-started/quick-start/step-2-discover)
