---
id: process
title: How to process tag data in your application
sidebar_label: How to Process Tag Data in Your Application
description: "Process IOTC dataEVT in an application: windowed dedup, EPC normalisation, RSSI thresholding, batch vs streaming, absorbing QoS 0 drops gracefully."
---

> 📙 **HOW-TO** · **Audience:** Solution Builder · **Time:** ~20 min

This guide shows you how to process incoming tag data on the application side. The patterns below apply regardless of language; the Quick Start tutorials in §5.8–§5.10 give starter implementations.

### Deduplication

Decide a time window appropriate to your use case. A common choice for inventory-counting applications is 1 second: any EPC seen within 1 second of its previous reading is treated as the same sighting.

```python
last_seen = {}
DEDUPE_WINDOW_MS = 1000

def on_tag(event):
    epc = event["data"]["epc"]
    now = event_timestamp_ms(event)
    if epc in last_seen and now - last_seen[epc] < DEDUPE_WINDOW_MS:
        return  # duplicate
    last_seen[epc] = now
    process_sighting(epc, now)
```

For batch-counting applications (e.g., "how many unique items in the store?"), use a sliding window of minutes or hours.

### Buffering and batching for database writes

Tag data arrives at hundreds of events/second from each reader. Writing each event to a database synchronously will not scale. Batch:

1. Buffer events in memory (queue or array).
2. Flush every N events or every T milliseconds, whichever first.
3. Use bulk-insert APIs at the database.

A typical batch size is 500 events / 2-second flush interval.

### Real-time alerting

For applications that need to react to specific EPCs (e.g., a high-value item appearing on a sales floor), maintain a hot-set of target EPCs and check on each event:

```python
TARGET_EPCS = {"E2003412...", "E2003412..."}

def on_tag(event):
    if event["data"]["epc"] in TARGET_EPCS:
        send_alert(event)
```

### Integration with inventory management systems

```d2
direction: right
B: Broker { shape: oval }
S: MQTT consumer
D: "Deduplicate\n(by EPC + window)"
Bu: Buffer / batch
Pe: "Persist\nwarehouse / TSDB" { shape: cylinder }
Al: Alert rules
Out: PagerDuty / Slack
B -> S: subscribe DATA1/#
S -> D
D -> Bu
Bu -> Pe
Pe -> Al
Al -> Out
```

Common architecture: an MQTT consumer service deduplicates and batches; writes to a time-series database (Timescale, Influx) for analytics and to an operational database (Postgres, Mongo) for current-state queries; publishes alerts to an event bus (Kafka, EventBridge) for downstream subscribers.

### Backpressure and resilience

If the application cannot keep up, MQTT QoS 0 silently drops messages, the broker does not buffer. For high-availability requirements: increase consumer concurrency, run multiple consumers on different channels ([Dual data channels](/rfid/tag-data/dual-channels)), and consider configuring `dataEVT` at QoS 1 with sized retention. See [MQTT QoS](/foundations/mqtt/qos).

**Related:** 📕 [dataEVT Schema](/rfid/dataevt-schema) · 📙 [Interpret Fields](/rfid/tag-data/interpret) · 📘 [Integration Patterns](/fleet/cloud-integration/patterns) · 📙 [AWS IoT Core](/fleet/cloud-integration/aws)

---

# Part V: Observability & Events
