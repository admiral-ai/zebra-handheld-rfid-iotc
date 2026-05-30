---
id: handheld-considerations
title: Handheld-specific architecture considerations
sidebar_label: About Handheld-Specific Architecture Considerations
description: "Architectural constraints unique to handheld RFID: battery lifecycle, single antenna, intermittent connectivity, trigger button. Why IOTC is shaped this way."
---

> 📘 **EXPLANATION** · **Audience:** Solution Builder · **Read time:** ~6 min

Three architectural facts make handheld IOTC different from fixed-reader IOTC. They are not edge cases. Every operational decision rests on them.

### Battery is the primary constraint

Persistent MQTT connections, frequent heartbeats, high-throughput tag reads, all of these draw battery. A heartbeat at 5-second intervals consumes meaningfully more battery than one at 60-second intervals. An always-on inventory drains a fully-charged RFD90 in 4–6 hours. [Battery Monitoring](/observability/monitoring/battery) and [About Heartbeat Events](/observability/heartbeat) name the trade-offs.

### A single internal antenna

There is one antenna. There are no antenna ports to choose between, no cable losses to compensate, no per-port power settings. RF parameters (power, sensitivity, Q-value) apply to the single antenna for all reads. This simplifies the API significantly compared with fixed readers, but it also means range is fixed at hardware design time. The RFD90's longer range is a hardware property, not a configuration.

```d2
direction: right
T: Tag
R: "Reader\n(single antenna, Wi-Fi 6)"
B: Broker { shape: queue }
A: Application
T -> R
R -> B
B -> A
c1: "Battery\n(every PINGREQ wakes radio)" { shape: hexagon }
c2: "Single antenna\n(no port selection)" { shape: hexagon }
c3: "Hardware trigger\n(input source)" { shape: hexagon }
c4: "Mobility\n(roaming Wi-Fi)" { shape: hexagon }
c1 -- R { style.stroke-dash: 4 }
c2 -- R { style.stroke-dash: 4 }
c3 -- R { style.stroke-dash: 4 }
c4 -- R { style.stroke-dash: 4 }

```

### The physical trigger is an input source

The sled has a hardware trigger button. Pulling it generates events that map to [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) semantics — start, stop, or pulse-read depending on trigger mode. An application that subscribes only to [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) responses will receive responses regardless of whether the trigger was the cause. [About Trigger-Based Operations](/rfid/operating-mode/trigger-composition) treats this fully.

### What this implies for the rest of this documentation

These constraints surface in Part III (network and security), Part IV (operating modes are tuned to the single antenna), Part V (events focus on battery state), and Part VI (provisioning at scale assumes MDM-managed readers). They are not caveats footnoted on isolated pages; they are structural.

**Related:** 📘 [Network Architecture](/infrastructure/network/architecture) · 📘 [Trigger Operations](/rfid/operating-mode/trigger-composition) · 📙 [Battery Monitoring](/observability/monitoring/battery)
