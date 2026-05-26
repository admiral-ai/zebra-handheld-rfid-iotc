---
id: where-things-fail
title: Where things fail
sidebar_label: Where things fail
---

> 📘 **EXPLANATION** · **Audience:** All personas in incident response · **Read time:** ~4 min

Diagnose any IOTC failure by first identifying **which physical edge is broken.** The number of edges depends on hardware tier. Get this right and the symptom maps to one of a small set of failure modes. Get it wrong and you debug the symptom in the wrong subsystem.

### Two tiers, different edge counts

**🅓 Direct, one edge**

```
   Reader  ──[Wi-Fi]──  AP  ──[LAN]──  WAN  ──[broker]──  Broker
   ↑                                                          ↑
   IOTC firmware runs here                          MQTT terminates here
```

A Direct sled (RFD40 Premium / Premium Plus / RFD90) has one physical edge: **Reader ↔ Broker over Wi-Fi.** Everything between the AP and the broker is IT infrastructure outside IOTC's surface.

**🅑 Bridged, two edges**

```
   Reader  ──[Bluetooth/eConnex]──  Host  ──[Wi-Fi or USB]──  Broker
   ↑                                ↑                                  ↑
   Sled hardware                    MQTT client runs here     MQTT terminates here
```

A Bridged sled (RFD40 Standard) has two physical edges: **Reader ↔ Host** (Bluetooth) and **Host ↔ Broker** (any network the host can reach). The host bridges. Failures cluster differently across the two edges.

### Edge-to-signal mapping

Each edge produces characteristic signals when it fails. Diagnose by checking these signals in order.

#### Reader ↔ Wi-Fi (Direct)

- **`get_status.deviceStatus.radioConnection`**: `CONNECTED` means radio firmware sees the Wi-Fi controller.
- **No `mqttConnEVT`**, the reader cannot reach the broker. Most likely a path-layer problem above Wi-Fi.
- **`alert_short` `WIFI_*`** — Wi-Fi association failures.
- **Heartbeats stop, no DISCONNECTED event**: soft failure; reader still has TCP but is internally stuck. Power-cycle.

#### Reader ↔ Host (Bridged)

- **`get_status.deviceStatus.terminalConnection.status`**: `CONNECTED` or `DISCONNECTED`. This is the Bluetooth state.
- **`terminalConnection.type`**: `BLUETOOTH`, `CIO`, or `USB`. Which bridge is active.
- **No commands reach the reader**: host is connected to the broker but the Bluetooth side is broken.
- **No `dataEVT`** when inventory is running on the host — bridge is dropping events.

#### Host ↔ Broker (Bridged)

- **`mqttConnEVT`**: same as Direct; reflects the broker-side view of the host's connection.
- **Host's own MQTT client logs**, the host bridge has its own client with its own observability.
- **Application sees nothing**, even though the host reports connection, the topic routing may be wrong.

### A decision tree

```
Symptom: no tag data arriving in application
  ↓
1. Are heartbeats arriving?
   No  → Reader is offline. Go to step 2.
   Yes → Reader is online; problem is downstream. Go to step 4.
  ↓
2. Bridged or Direct?
   Direct → Check Reader↔Wi-Fi (via Wi-Fi status / get_status when reachable). Go to FM-NET-01.
   Bridged  → Go to step 3.
  ↓
3. Is host showing terminalConnection: CONNECTED?
   Yes → Bridge problem (host → broker). Go to FM-NET-02.
   No  → Reader-host problem. Go to FM-DEV-01.
  ↓
4. Is inventory running? (get_status.radioActivity)
   No  → control_operation START hasn't fired. Verify CTRL endpoint and command.
   Yes → Inventory is running but no events arrive. Go to step 5.
  ↓
5. Is the DATA endpoint active? (get_endpoint_config)
   No  → Activate the DATA endpoint. Go to RP-05.
   Yes → Filter is excluding tags. Check post-filters and metadata enable. Go to FM-DATA-01.
```

### Why "edge count" comes first

Failures are scoped by edge. A Wi-Fi authentication failure on a Direct sled has nothing to do with the broker; you waste time inspecting broker logs. A Bluetooth dropout on a Bridged sled has nothing to do with Wi-Fi; you waste time inspecting AP logs.

Starting with "which tier?" → "which edge?" → "which signal?" gets you to a one-page failure mode quickly. The symptom index in [Something's broken?](/diagnose/symptoms) is organised around exactly this hierarchy.

### Three signals to learn

Three commands and events together cover most of the diagnostic surface:

| Signal | What it tells you | When to use |
|---|---|---|
| [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status) | Power, radio, terminal connection, NTP, battery | First check on any new symptom |
| `mqttConnEVT` | Broker-perceived connection state | When the application can't tell whether the reader is offline |
| `heartbeatEVT` (absence) | Heartbeats stopping is a signal of silent offline | When `mqttConnEVT` and [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status) disagree |

If all three are healthy and the symptom persists, the problem is downstream of the broker — broker ACLs, downstream pipeline, application bug.

### Out of scope

- **Specific failure modes per edge**: covered as FM-XX-YY entries in the symptom index and failure-mode pages.
- **Recovery procedures**: covered in [Playbooks for getting back online](/diagnose/recovery-playbooks).
- **Why the system fails the way it does**: covered in the relevant explanation chapters in Parts 4–6.

**Related:** 📘 [Something's broken?](/diagnose/symptoms) · 📙 [Playbooks for getting back online](/diagnose/recovery-playbooks) · 📘 [What your reader knows about itself](/infrastructure/device-state) · 📘 [Knowing when you're connected](/observability/mqtt-connection)
