---
id: dual-channels
title: Dual data channels (data1event / data2event)
sidebar_label: "About Dual Data Channels (data1event / data2event)"
description: "Why and how IOTC supports two parallel tag-data channels (data1event / data2event): use cases (split brokers, A/B routing), config, per-channel filters."
---

> 📘 **EXPLANATION** · Audience: Solution Builder · Read time: ~4 min

IOTC exposes two tag-data channels: `data1event` and `data2event`. They are independent topic families carrying the same `dataEVT` payload schema. A reader is configured to publish on one channel; configuration is per-reader, not per-tag.

### Why two channels exist

Three motivations:

- **Load balancing across consumers.** Two consumer applications can each subscribe to a different channel and receive disjoint subsets of the fleet's tag-data stream.
- **Priority separation.** Operationally critical readers can publish on `data1event` with a low-latency consumer; background-volume readers can publish on `data2event` with a batch consumer.
- **Topology specialisation.** Different channels can route to different brokers (see [Multi-endpoint architectures](/infrastructure/endpoints/multi-endpoint)), enabling architectures where high-value data goes to one pipeline and high-volume data to another.

### How channel assignment is configured

Channel assignment is set via [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) (see [Configure events](/observability/configure-events)). A reader publishes all its tag data on the configured channel; the assignment is sticky across reboots.

```mermaid
flowchart LR
  subgraph S["Single-channel"]
    direction LR
    SR[Reader] -->|"DATA1"| SB((Broker)) --> SA[App]
  end
  subgraph D["Dual-channel"]
    direction LR
    DR[Reader]
    DR -->|"DATA1<br/>(local app)"| DB1((Broker A)) --> DA1[Operational app]
    DR -->|"DATA2<br/>(analytics)"| DB2((Broker B)) --> DA2[Analytics pipeline]
  end
```

### What this implies for application architecture

Applications must subscribe to **the channel the reader is configured to use**. Subscribing to `data1event` when readers are configured for `data2event` results in no data. Fleet-wide dashboards typically subscribe to **both** channels using wildcard topics; per-channel specialised consumers subscribe to one.

**Related:** 📘 [Tag Data Architecture](/rfid/tag-data/architecture) · 📙 [Configure Event Reporting](/observability/configure-events) · 📕 [DATA Interface](/reference/api-overview) · 📕 [config_events](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events)
