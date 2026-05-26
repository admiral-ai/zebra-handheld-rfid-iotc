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

```mermaid
flowchart TB
  subgraph DB["Fleet Health Dashboard"]
    direction TB
    subgraph Row1["Overview KPIs"]
      direction LR
      KPI1["Online<br/>487 / 500"]
      KPI2["Battery avg<br/>78%"]
      KPI3["Active scans<br/>23"]
      KPI4["Alerts 24h<br/>12"]
    end
    subgraph Row2["Charts"]
      direction LR
      C1[Battery histogram]
      C2[Connection quality]
    end
    subgraph Row3["Outliers"]
      direction LR
      O1["Readers reconnecting<br/>&gt;5x / hr"]
      O2["Battery &lt; 20%"]
    end
  end
```

```mermaid
flowchart LR
  R1[Reader 1] --> B((Broker))
  R2[Reader 2] --> B
  Rn[Reader N] --> B
  B --> C[MQTT consumer]
  C --> SS[("State store<br/>Redis / Postgres")]
  SS --> DQ[Dashboard query layer]
  DQ --> UI[Web UI]
```

### Alerting integration

Route critical alerts (battery critical, sustained connection loss, high exception rates) to PagerDuty, Opsgenie, or Slack via webhook from your dashboard backend. Threshold tuning is operational — start with conservative thresholds and tighten as the fleet's baseline stabilises.

**Related:** 📕 [events](/reference/api-overview) · 📙 [AWS IoT Core](/fleet/cloud-integration/aws) · 📙 [Azure IoT Hub](/fleet/cloud-integration/azure) · 📘 [Alert Events](/observability/alerts)

---

# Part VI: Fleet Operations
