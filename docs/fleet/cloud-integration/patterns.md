---
id: patterns
title: Cloud integration architecture patterns
sidebar_label: Integration architecture patterns
description: "Three integration patterns for cloud-backed IOTC: direct-to-cloud, edge-hub-in-the-middle, dual-broker (control vs data). Trade-offs in latency and cost."
---

> 📘 **EXPLANATION** · **Audience:** Solution Builder · **Read time:** ~5 min

Three patterns dominate cloud-backed IOTC deployments. The choice is structural: each has different latency, complexity, and scale characteristics.

### Direct integration

Readers point their MQTT endpoints directly at a cloud-platform broker. AWS IoT Core, Azure IoT Hub MQTT, GCP, or HiveMQ Cloud. The cloud broker is the only broker in the path.

```d2
direction: right
R: IOTC Reader
B: Cloud-hosted MQTT broker { shape: queue }
A: Application services
R -> B
B -> A

```

**When:** simple deployments, fleets where Zebra-hosted broker is unnecessary.

### Bridge pattern

A small MQTT bridge translates between IOTC's topic namespace and the cloud platform's preferred topic structure. The reader publishes to its Zebra-namespace topic; the bridge republishes to a cloud-namespace topic; the cloud platform consumes natively.

```d2
direction: right
R: IOTC Reader
B: IOTC-shaped broker { shape: queue }
BR: "Bridge\n(topic-namespace translation)"
CB: "Cloud-native ingest\nAWS IoT Core / Pub/Sub /\nIoT Hub" { shape: queue }
R -> B
B -> BR
BR -> CB

```

**When:** the cloud platform has a specific topic convention you need to honour (e.g., AWS IoT Core's `$aws/things/...`); useful for retrofitting existing pipelines.

### Gateway pattern

An application service subscribes to IOTC events from the broker, transforms or enriches them, and pushes to the cloud platform's native ingest API (often non-MQTT).

```d2
direction: right
R: IOTC Reader
B: MQTT broker { shape: queue }
G: "Gateway service\n(transform + enrich)"
ST: "Stream platform\n(Kafka / Kinesis)"
S1: Service 1
S2: Service 2
R -> B
B -> G
G -> ST
ST -> S1
ST -> S2

```

**When:** the cloud platform's ingest is not MQTT-shaped, or you need to do significant transformation before persistence.

### Choosing

| Factor | Direct | Bridge | Gateway |
|---|---|---|---|
| Latency | Lowest | Low | Higher |
| Operational complexity | Low | Medium | High |
| Cost | Low | Medium | Highest |
| Flexibility | Low | Medium | Highest |
| Cloud lock-in | Highest | Medium | Lowest |

Start with **direct** for simplicity. Move to **bridge** or **gateway** when a specific cloud capability or topology constraint demands it.

**Related:** 📙 [AWS IoT Core](/fleet/cloud-integration/aws) · 📙 [Azure IoT Hub](/fleet/cloud-integration/azure) · 📙 [GCP](/fleet/cloud-integration/gcp) · 📙 [Custom Broker](/fleet/cloud-integration/custom-broker) · 📘 [Multi-Endpoint Architectures](/infrastructure/endpoints/multi-endpoint)
