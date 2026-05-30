---
id: where-things-fail
title: Where things fail
sidebar_label: Where things fail
description: "A layered mental model for IOTC fault isolation: the Wi-Fi link, the MQTT/broker session, and the application. How get_status, mqttConnEVT, and heartbeat absence show which layer broke."
---

> 📘 **EXPLANATION** · **Audience:** All personas in incident response · **Read time:** ~4 min

Diagnose any IOTC failure by first identifying **which layer of the connection path is broken.** A reader runs IOTC in its own firmware and reaches the broker over a single Wi-Fi edge, so the path is short — but each layer fails differently. Get the layer right and the symptom maps to a small set of failure modes. Get it wrong and you debug in the wrong subsystem.

### One path, three layers

```
   Reader  ──[Wi-Fi]──  AP  ──[LAN/WAN]──  Broker  ──[pub/sub]──  Application
   ↑                                          ↑                        ↑
   IOTC firmware runs here          MQTT terminates here      consumes events
```

The reader (RFD40 Premium / Premium Plus / RFD90) has one physical network edge: **Reader ↔ Broker over Wi-Fi.** Everything between the AP and the broker is IT infrastructure outside IOTC's surface. Failures cluster into three layers: the **Wi-Fi link**, the **MQTT/broker session**, and the **application**.

### Layer-to-signal mapping

Each layer produces characteristic signals when it fails. Diagnose by checking these signals in order.

#### Reader ↔ Wi-Fi

- **`get_status.deviceStatus.radioConnection`**: `CONNECTED` means radio firmware sees the Wi-Fi controller.
- **`alerts` `NETWORK_EVENT`**: Wi-Fi association or network failures.
- **Heartbeats stop, no DISCONNECTED event**: soft failure; the reader still has TCP but is internally stuck. Power-cycle.

#### Reader ↔ Broker (MQTT)

- **`mqttConnEVT`**: broker-perceived connection state (CONNECTED / DISCONNECTED).
- **No `mqttConnEVT` at all**: the reader cannot reach the broker — firewall, wrong endpoint, or bad credentials.
- **No commands reach the reader**: subscription-topic mismatch on the CTRL/MGMT endpoint.

#### Broker ↔ Application

- **Application sees nothing even though `mqttConnEVT` is CONNECTED**: topic routing or broker ACLs are wrong.
- **No `dataEVT`** while inventory is running: the DATA endpoint is inactive or a post-filter is excluding tags.

### A decision tree

```
Symptom: no tag data arriving in application
  ↓
1. Are heartbeats arriving?
   No  → Reader is offline. Go to step 2.
   Yes → Reader is online; problem is downstream. Go to step 3.
  ↓
2. Is mqttConnEVT showing CONNECTED (or arriving at all)?
   No  → Wi-Fi or broker-reachability problem. Go to FM-NET-01.
   Yes → Reader reconnected; check the MGMT/CTRL endpoint subscription.
  ↓
3. Is inventory running? (get_status.radioActivity)
   No  → control_operation START hasn't fired. Verify CTRL endpoint and command.
   Yes → Inventory is running but no events arrive. Go to step 4.
  ↓
4. Is the DATA endpoint active? (get_endpoint_config)
   No  → Activate the DATA endpoint. Go to RP-05.
   Yes → Filter is excluding tags. Check post-filters and metadata enable. Go to FM-DATA-01.
```

### Why "which layer" comes first

Failures are scoped by layer. A Wi-Fi authentication failure has nothing to do with the broker; you waste time inspecting broker logs. A broker ACL problem has nothing to do with the radio; you waste time power-cycling the reader. Starting with "which layer?" → "which signal?" gets you to a one-page failure mode quickly. The symptom index in [Something's broken?](/diagnose/symptoms) is organised around exactly this hierarchy.

### Three signals to learn

Three commands and events together cover most of the diagnostic surface:

| Signal | What it tells you | When to use |
|---|---|---|
| [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status) | Power, radio, NTP, battery, connection state | First check on any new symptom |
| `mqttConnEVT` | Broker-perceived connection state | When the application can't tell whether the reader is offline |
| `heartbeatEVT` (absence) | Heartbeats stopping is a signal of silent offline | When `mqttConnEVT` and [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status) disagree |

If all three are healthy and the symptom persists, the problem is downstream of the broker — broker ACLs, downstream pipeline, application bug.

### Out of scope

- **Specific failure modes per layer**: covered as FM-XX-YY entries in the symptom index and failure-mode pages.
- **Recovery procedures**: covered in [Playbooks for getting back online](/diagnose/recovery-playbooks).
- **Why the system fails the way it does**: covered in the relevant explanation chapters in Parts 4–6.

**Related:** 📘 [Something's broken?](/diagnose/symptoms) · 📙 [Playbooks for getting back online](/diagnose/recovery-playbooks) · 📘 [What your reader knows about itself](/infrastructure/device-state) · 📘 [Knowing when you're connected](/observability/mqtt-connection)
