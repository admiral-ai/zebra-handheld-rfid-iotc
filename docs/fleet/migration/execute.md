---
id: execute
title: How to execute a phased migration
sidebar_label: How to Execute a Phased Migration
description: "Execute a phased IOTC migration: ring-deploy by cohort, smoke tests at each ring, rollback triggers, and how to handle stragglers without rolling back."
---

> 📙 **HOW-TO** · Audience: Fleet Operator · Time: days to weeks for a full fleet

```json
{
  "command": "set_os",
  "requestId": "fw-1",
  "OSUpdateDetails": {
    "url": "https://updates.example.com/iotc-v1.1.fw",
    "authenticationType": "NONE",
    "verificationType": "VERIFY_HOST_PEER"
  }
}
```

Watch for reconnection via `mqttConnEVT: CONNECTED` and resumed `heartbeatEVT`.

| Wave | % of fleet | Wait | Pass criteria |
|---|---:|---|---|
| 1 | 1–5% canary | 24h | Reconnect; baseline match per [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) |
| 2 | 10% | 24h | Same |
| 3 | 50% | 12h | Same |
| 4 | 100% | — | Same |

Error codes to watch: 4 (in progress), 8 (low flash), 13 (failed), 14 (battery low).
