---
id: architecture
title: Tag-data event architecture
sidebar_label: Tag-data event architecture
description: "How IOTC tag-data events are produced: radio singulation, dataEVT composition, dual-channel split (data1event / data2event), end-to-end flow."
---

> 📘 **EXPLANATION** · **Audience:** All · **Read time:** ~6 min

Tag data flows from the antenna to the application through five stages. Knowing the path is the foundation for capacity planning, latency budgeting, and deduplication strategy.

### The flow

```
RF antenna → Reader firmware (singulation) → Post-filter → MQTT publish → Broker → Application subscriber
```

Each stage has its own latency and back-pressure characteristics. The total path budget from "tag energised" to "application receives event" is typically 50–500 ms depending on broker proximity.

```d2
direction: right
T: RFID Tag
R: "Reader\n(singulation)"
PF: Post-filter
MP: MQTT publish
B: Broker { shape: queue }
A: Application
T -> R: ~µs
R -> PF: ~ms
PF -> MP: ~10 ms
MP -> B: ~50 ms
B -> A: ~10 ms

```

### Event generation rate

The rate at which `dataEVT` events are emitted depends on:

- **Tag population density**, more tags in the field generate more events.
- **Operating mode**: higher-information modes are slower per tag (see [Operating-mode profiles](/rfid/operating-mode-profiles)).
- **RF power**: affects effective read range and therefore tag count in the field.
- **Post-filters**: filtered-out tags do not generate events.

Typical event rates: 100–700 events/second for active inventory in a moderate-density environment.

```d2
direction: right
R: dataEVT generation rate
F1: Tag population density
F2: Operating-mode profile
F3: RF power
F4: Antenna gain & orientation
F5: Environment / RF noise
R1: higher density -> higher rate
R2: "CYCLE_COUNT fastest;\nDENSE_READERS slowest"
R3: higher power -> larger field
R -> F1
R -> F2
R -> F3
R -> F4
R -> F5
F1 -> R1 { style.stroke-dash: 4 }
F2 -> R2 { style.stroke-dash: 4 }
F3 -> R3 { style.stroke-dash: 4 }

```

### Deduplication considerations

`dataEVT` events are emitted per **read**, not per **tag**. The same tag in the field can be read multiple times per second. Whether the application sees duplicates depends on configuration: the reader can emit one event per read (raw, high-volume) or coalesce reads of the same EPC within a configurable window (deduplicated, lower-volume).

Applications that consume the raw stream must deduplicate themselves; applications that consume the coalesced stream can usually treat each event as a distinct sighting.

### Why two channels



A reader can be configured to publish tag data on one of two topic channels (`data1event`, `data2event`). The motivation and configuration are covered in [Dual data channels](/rfid/tag-data/dual-channels).

### QoS choices

Tag data defaults to QoS 0, at most once. For high-volume applications, QoS 0 is the default: losing a single read out of hundreds is operationally invisible, while QoS 1's PUBACK overhead becomes significant. Applications requiring guaranteed delivery can configure QoS 1; the trade-off is detailed in [MQTT QoS](/foundations/mqtt/qos).

**Related:** 📘 [QoS Levels](/foundations/mqtt/qos) · 📘 [Dual Data Channels](/rfid/tag-data/dual-channels) · 📕 [DATA Interface](/reference/api-overview) · 📕 [dataEVT Schema](/rfid/dataevt-schema)
