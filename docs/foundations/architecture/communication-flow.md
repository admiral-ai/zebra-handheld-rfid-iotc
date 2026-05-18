---
id: communication-flow
title: How commands and responses flow
sidebar_label: How commands and responses flow
---

> 📘 **EXPLANATION** · Audience: Solution Builder, API Consumer · Read time: ~6 min

Three communication flows occur between an IOTC reader and an application. Every interaction in this documentation is an instance of one of them.

### Command-Response

The application publishes a command on a request topic; the reader subscribes, processes, and publishes the response on a corresponding response topic. The application correlates response to request via a client-supplied request ID echoed in the response. Latency is typically tens to hundreds of milliseconds. Used for every endpoint in [§16.2 MGMT](#chapter-16--mqtt-api-reference) and [§16.3 CTRL](#chapter-16--mqtt-api-reference).

[DIAGRAM: D-2.3.A — command-response sequence diagram]

### Event Streaming

The reader publishes events on event topics; one or more applications subscribe. Events are reader-initiated — the application has not just asked anything. Examples: heartbeats, alerts, exceptions, connection-state changes. The application's job is to subscribe at startup and react. Generation rate ranges from one event per minute (heartbeats) to bursty (exceptions).

[DIAGRAM: D-2.3.B — event streaming sequence diagram]

### Tag-Data Streaming

A specialised event-streaming case with much higher throughput. While an inventory operation is running, the reader emits a `dataEVT` per tag read (or per de-duplicated read, depending on mode). Volumes range from tens to many hundreds of events per second per reader. The DATA interface carries this traffic on dedicated topics (`data1event`, `data2event`) so it can be subscribed to separately from control traffic.

[DIAGRAM: D-2.3.C — tag-data streaming sequence diagram, emphasizing the high-volume burst pattern]

### Topic-direction conventions

By convention, the application **publishes** to request topics and **subscribes** to response and event topics. The reader does the opposite. The full topic taxonomy is in [§3.2 Topic Hierarchy](/foundations/mqtt/topic-hierarchy); QoS choices per flow are in [§3.3 QoS Levels](/foundations/mqtt/qos).

**Related:** 📘 [§3.3 QoS Levels](/foundations/mqtt/qos) · 📘 [§3.4 Connection Lifecycle](/foundations/mqtt/connection-lifecycle) · 📘 [§11.1 About the Event Model](/observability/events/model) · 📕 [§16 API Reference](#chapter-16--mqtt-api-reference)
