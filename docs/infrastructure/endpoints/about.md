---
id: about
title: About MQTT Endpoint Configuration
sidebar_label: About MQTT Endpoint Configuration
---

> 📘 **EXPLANATION** · Audience: Solution Builder · Read time: ~5 min

In IOTC, an "endpoint" is the broker connection target — host, port, TLS settings, credentials — for a specific interface. The word *endpoint* is overloaded: API endpoints are MQTT commands like `set_wifi`; MQTT endpoints are connection targets. This page concerns the latter.

### Three endpoint types

A reader maintains three independent MQTT endpoint configurations:

- **MDM endpoint** — for enterprise MDM integration (SOTI Connect).
- **CTRL endpoint** — for RFID control commands and responses.
- **DATA endpoint** — for tag-data event streaming.

In the simplest deployment all three point at the same broker. In specialised deployments they may point at different brokers.

### Why different endpoints for different interfaces

- **Isolation** — high-volume tag data does not contend with command-response latency.
- **Authorization** — a data-consumer application can be granted access only to the DATA broker.
- **Cost / scale** — tag-data brokers can be sized for throughput; MGMT brokers for connection count.

[DIAGRAM: D-8.1.A — single-broker vs separate-broker topologies]

### Relationship to topic hierarchy

Endpoint configuration determines *where* a reader connects. Topic hierarchy ([§3.2](/foundations/mqtt/topic-hierarchy)) determines *what* it publishes and subscribes to. The two are orthogonal.

**Related:** 📘 [§2.4 Interface Model](/foundations/architecture/interface-model) · 📘 [§8.4 Multi-Endpoint Architectures](/infrastructure/endpoints/multi-endpoint) · 📙 [§8.3 Configure Endpoints](/infrastructure/endpoints/configure)
