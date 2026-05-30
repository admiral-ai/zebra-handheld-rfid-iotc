---
id: fleet-dashboard
title: How to build a fleet health dashboard
sidebar_label: How to build a fleet health dashboard
description: "Build a fleet-wide IOTC health dashboard: ingest heartbeats and alerts, compute uptime and last-seen, surface drift, visualise per-reader health."
---

> 📙 **HOW-TO** · **Audience:** Solution Builder · **Time:** ~30 min

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
    if payload["event"] == "heartbeatEVT":
        record.update(payload["data"])
        record["last_heartbeat"] = now()
    elif payload["event"] == "alerts":
        record["alerts_count"] += 1
        record["last_alert"] = payload
    ...
```

### Reference architectures

- **Grafana**: write aggregated metrics to Prometheus or InfluxDB; build panels for online count, battery distribution, alert counts, reconnect rates.
- **Azure IoT Central**: native MQTT consumption; dashboards and alerting built in.
- **AWS IoT Core**, use rules to route events into CloudWatch or DynamoDB; build dashboards in QuickSight or Grafana.

Each architecture's setup is in the relevant cloud-integration how-to ([AWS IoT Core](/fleet/cloud-integration/aws)–[GCP integration](/fleet/cloud-integration/gcp)).

### Key metrics to display

- **Online count**: readers with a heartbeat in the last 3× interval
- **Battery distribution**: histogram of `battery_percent` across the fleet
- **Active operations count**: readers in `running` state
- **Alert counts**: last 24h, segmented by category
- **Connection-quality outliers**: readers with reconnect rate above threshold

```d2
classes: {
  warn: { style: { fill: "#fef7e0"; stroke: "#f9ab00"; font-color: "#b06000" } }
  bad:  { style: { fill: "#fce8e6"; stroke: "#d93025"; font-color: "#c5221f" } }
}
DB: Fleet Health Dashboard {
  Row1: Overview KPIs {
    grid-columns: 4
    KPI1: "Online\n487 / 500"
    KPI2: "Battery avg\n78%"
    KPI3: "Active scans\n23"
    KPI4: "Alerts 24h\n12"
  }
  Row2: Charts {
    grid-columns: 2
    C1: "Battery\nhistogram"
    C2: "Connection\nquality"
  }
  Row3: Outliers {
    grid-columns: 2
    O1: "Readers\nreconnecting\n> 5x / hr" { class: warn }
    O2: "Battery\n< 20%" { class: bad }
  }
}

```

```d2
direction: right
fleet: Reader Fleet {
  R1: Reader 1
  R2: Reader 2
  Rn: Reader N
}
B: Broker { shape: queue }
C: MQTT consumer
SS: "State store\nRedis / Postgres" { shape: cylinder }
DQ: Dashboard query layer
UI: Web UI
fleet.R1 -> B
fleet.R2 -> B
fleet.Rn -> B
B -> C
C -> SS
SS -> DQ
DQ -> UI

```

### Alerting integration

Route critical alerts (battery critical, sustained connection loss, high exception rates) to PagerDuty, Opsgenie, or Slack via webhook from your dashboard backend. Threshold tuning is operational — start with conservative thresholds and tighten as the fleet's baseline stabilises.

**Related:** 📕 [events](/reference/api-overview) · 📙 [AWS IoT Core](/fleet/cloud-integration/aws) · 📙 [Azure IoT Hub](/fleet/cloud-integration/azure) · 📘 [Alert Events](/observability/alerts)

---
