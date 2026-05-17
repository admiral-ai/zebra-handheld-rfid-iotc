---
id: fleet-dashboard
title: How to Build a Fleet Health Dashboard
sidebar_label: How to Build a Fleet Health Dashboard
---

> 📙 **HOW-TO** · Audience: Solution Builder · Time: ~30 min

This guide shows you how to build a fleet health dashboard from IOTC events.

### Subscribe with a wildcard for fleet-wide visibility

```
{tenantId}/mgmt/clients/+/+
```

This delivers every MGMT-interface event (heartbeats, alerts, exceptions, connection events) from every reader on the tenant to your subscriber.

### Aggregate by serial number

Maintain a per-reader record keyed by `deviceSerial`:

```python
fleet_state = {}  # serial -> {last_heartbeat, battery, state, alerts_count, ...}

def on_event(topic, payload):
    serial = extract_serial_from_topic(topic)
    record = fleet_state.setdefault(serial, default_record())
    if payload["event"] == "heartBeatEVT":
        record.update(payload["data"])
        record["last_heartbeat"] = now()
    elif payload["event"] == "alerts":
        record["alerts_count"] += 1
        record["last_alert"] = payload
    ...
```

### Reference architectures

- **Grafana** — write aggregated metrics to Prometheus or InfluxDB; build panels for online count, battery distribution, alert counts, reconnect rates.
- **Azure IoT Central** — native MQTT consumption; dashboards and alerting built in.
- **AWS IoT Core** — use rules to route events into CloudWatch or DynamoDB; build dashboards in QuickSight or Grafana.

Each architecture's setup is in the relevant cloud-integration how-to ([§15.2](/fleet/cloud-integration/aws)–[§15.4](/fleet/cloud-integration/gcp)).

### Key metrics to display

- **Online count** — readers with a heartbeat in the last 3× interval
- **Battery distribution** — histogram of `battery_percent` across the fleet
- **Active operations count** — readers in `running` state
- **Alert counts** — last 24h, segmented by category
- **Connection-quality outliers** — readers with reconnect rate above threshold

[DIAGRAM: D-12.4.A — example dashboard mockup]

[DIAGRAM: D-12.4.B — aggregation pipeline: MQTT consumer → state store → dashboard query]

### Alerting integration

Route critical alerts (battery critical, sustained connection loss, high exception rates) to PagerDuty, Opsgenie, or Slack via webhook from your dashboard backend. Threshold tuning is operational — start with conservative thresholds and tighten as the fleet's baseline stabilises.

**Related:** 📕 [§16.6 events](#chapter-16--mqtt-api-reference) · 📙 [§15.2 AWS IoT Core](/fleet/cloud-integration/aws) · 📙 [§15.3 Azure IoT Hub](/fleet/cloud-integration/azure) · 📘 [§11.5 Alert Events](/observability/events/alerts)

---

# Part VI: Fleet Operations
