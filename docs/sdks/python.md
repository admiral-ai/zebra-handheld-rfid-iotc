---
id: python
title: "Tutorial: read your first tag with Python"
sidebar_label: "Tutorial: Read Your First Tag with Python"
description: "End-to-end IOTC tutorial in Python (3.9+) with paho-mqtt: connect to broker, send control_operation START, subscribe to dataEVT, process first tag read."
---

> 📗 **TUTORIAL** · Audience: Python developer · Time: ~15 min

In this tutorial, we will read our first RFID tag using Python and `paho-mqtt`.

### Install

```bash
pip install paho-mqtt
```

### The complete program

Save as `quickstart.py`:

```python
import json
import ssl
import paho.mqtt.client as mqtt

BROKER = "iotc-broker.zebra.com"
PORT = 8883
USER = "<MQTT_USERNAME>"
PASSWORD = "<MQTT_PASSWORD>"
TENANT = "<TENANT_ID>"
SERIAL = "<DEVICE_SERIAL>"

# Topics use the three-part <tenantId>/<topic>/<deviceSerial> structure.
# The MDM endpoint's source-convention topics are used here.
CMD_TOPIC  = f"{TENANT}/MDM/clients/cmnd/{SERIAL}"
RESP_TOPIC = f"{TENANT}/MDM/clients/resp/{SERIAL}"
DATA_TOPIC = f"{TENANT}/MDM/clients/rfid/{SERIAL}"

def on_connect(client, userdata, flags, rc):
    print(f"Connected (rc={rc}). Subscribing...")
    client.subscribe(RESP_TOPIC)
    client.subscribe(DATA_TOPIC)

    print("Setting operating mode profile...")
    client.publish(CMD_TOPIC, json.dumps({
        "command": "set_operating_mode",
        "requestId": "py-1",
        "operatingMode": {"operatingModes": {"profiles": "BALANCED_PERFORMANCE"}}
    }))

    print("Starting RFID operation...")
    client.publish(CMD_TOPIC, json.dumps({
        "command": "control_operation",
        "requestId": "py-2",
        "ctrlOprPayload": {"controlType": "RFID", "operation": "START"}
    }))

def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode())
    if "type" in payload and "data" in payload and "tagData" in payload.get("data", {}):
        for tag in payload["data"]["tagData"]:
            print(f"Tag read: EPC={tag.get('EPC')}, "
                  f"RSSI={tag.get('peakRssi')}, "
                  f"channel={tag.get('channel')}")
    elif "command" in payload and "response" in payload:
        print(f"Response to {payload['command']} (rid={payload['requestId']}): "
              f"code={payload['response']['code']}")

client = mqtt.Client()
client.username_pw_set(USER, PASSWORD)
client.tls_set(ca_certs="zebra-broker-ca.pem", tls_version=ssl.PROTOCOL_TLSv1_2)
client.on_connect = on_connect
client.on_message = on_message
client.connect(BROKER, PORT, keepalive=60)

try:
    client.loop_forever()
except KeyboardInterrupt:
    print("Stopping...")
    client.publish(CMD_TOPIC, json.dumps({
        "command": "control_operation",
        "requestId": "py-stop",
        "ctrlOprPayload": {"controlType": "RFID", "operation": "STOP"}
    }))
    client.loop(timeout=1.0)
    client.disconnect()
```

### Run and observe

```bash
python quickstart.py
```

**You should see** output like:

```
Connected (rc=0). Subscribing...
Setting operating mode profile...
Starting RFID operation...
Response to set_operating_mode (rid=py-1): code=0
Response to control_operation (rid=py-2): code=0
Tag read: EPC=BEDD11112222333344445555, RSSI=-39, channel=911.75
...
```

Press Ctrl-C to stop. The program publishes a STOP command before disconnecting.

**Related:** 📕 [API Reference](/reference/api-overview) · 📙 [Processing Tag Data](/rfid/tag-data/process) · 📕 [Third-Party Libraries](/reference/appendices/libraries)
