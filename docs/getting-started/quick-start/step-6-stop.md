---
id: step-6-stop
title: Step 6 — Stop the Operation
sidebar_label: Step 6. Stop
---

# Step 6: Stop the Operation

<div className="badge-tutorial">TUTORIAL</div>

## Publish stop

```bash
mosquitto_pub ... \
  -m '{
    "command": "control_operation",
    "requestId": "qs-4",
    "ctrlOprPayload": {"controlType": "RFID", "operation": "STOP"}
  }'
```

> If the reader was already idle when you sent STOP, you will see `response.code: 12` (`IOT_ERROR_NO_RADIO_OP_IN_PROGRESS`). This is informational, not a failure.

## Recap

You have just connected to the broker, discovered the reader, subscribed to a data stream, configured an operating mode profile, started a read, observed live tag data, and stopped cleanly.

## What's next

- [Python tutorial](/sdks/python) · [Node.js tutorial](/sdks/nodejs) · [C# tutorial](/sdks/csharp)
- [Security & Certificates](/infrastructure/security/model)
- [Fleet Provisioning](/fleet/provisioning/models)
