---
id: step-1-connect
title: Step 1 — Connect to the MQTT Broker
sidebar_label: Step 1. Connect
---

# Step 1: Connect to the MQTT Broker

<div className="badge-tutorial">TUTORIAL</div>

**Time:** ~3 min

In this step we will open an MQTT subscriber to the topic where the reader publishes its responses.

## Run the subscriber

```bash
mosquitto_sub -h iotc-broker.zebra.com -p 8883 \
  -u "<MQTT_USERNAME>" -P "<MQTT_PASSWORD>" \
  --cafile zebra-broker-ca.pem \
  -t "<TENANT_ID>/MDM/clients/resp/<DEVICE_SERIAL>" -v
```

**You should see** the terminal pause without printing anything. That is the expected result — the subscription is active and the reader has not published anything yet.
