---
id: step-4-start
title: Step 4 — Start an RFID Read Operation
sidebar_label: Step 4. Start Operation
---

# Step 4: Start an RFID Read Operation

<div className="badge-tutorial">TUTORIAL</div>

## Configure the operating mode

```bash
mosquitto_pub ... \
  -m '{
    "command": "set_operating_mode",
    "requestId": "qs-2",
    "operatingMode": {"profiles": "BALANCED_PERFORMANCE"}
  }'
```

## Start the operation

```bash
mosquitto_pub ... \
  -m '{
    "command": "control_operation",
    "requestId": "qs-3",
    "ctrlOprPayload": {"controlType": "RFID", "operation": "START"}
  }'
```
