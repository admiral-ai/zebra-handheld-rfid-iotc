---
id: approach
title: How to approach troubleshooting systematically
sidebar_label: How to Approach Troubleshooting Systematically
description: "A systematic approach to IOTC troubleshooting: scope the symptom, isolate the edge, eliminate easy causes, then escalate. Pairs with /diagnose/ symptoms."
---

> 📙 **HOW-TO** · **Audience:** All · **Time:** ~10 min reading; varies in practice

This guide shows you how to systematically diagnose IOTC issues, layer by layer.

#### Step 1: Identify the layer

A failing IOTC interaction lives in one of four layers:

- **Application**, your code, your environment, your assumptions
- **MQTT**: broker, credentials, ACLs, TLS, topics
- **Network**: Wi-Fi, firewall, DNS
- **RFID**: radio subsystem, antenna, tag population

Asking "which layer?" first is more productive than "what's wrong?", most problems become tractable once the layer is identified.

#### Step 2: Gather data

For each layer, capture the minimum data set:

- **Application**, your logs, the command_id of the failing operation
- **MQTT**: [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status), recent `mqttConnEVT` events
- **Network**: [`get_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-wifi), broker reachability from a control machine
- **RFID**: [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status) operating state, recent `exceptionEVT` events

#### Step 3: Isolate the variable

Change one thing at a time. If you suspect a Wi-Fi profile, test by switching to a known-good profile and confirming the problem resolves. Multi-variable changes mask which fix worked.

#### Step 4: Test the hypothesis

State the hypothesis concretely ("the reader cannot resolve `iotc-broker.zebra.com`"). Identify a test that would confirm or refute it (DNS query from a host on the network). Execute the test. The hypothesis is right or it's not — design the test so the answer is unambiguous.

#### Step 5: Verify the fix

A change that "seems to work" but is unconfirmed has a habit of returning. After applying a fix, exercise the original failure path and confirm the failure is gone. Then check: is the fix narrow (this device, this moment) or general (the fleet, the future)?

```d2
S: Symptom observed
L1: "Reader powered\nand reachable?" { shape: diamond }
Phy: "Layer 1 - Physical / power"
L2: "Network path\nto broker?" { shape: diamond }
Net: "Layer 2 - Network"
L3: "MQTT session\nestablished?" { shape: diamond }
Tra: "Layer 3 - Transport / TLS"
L4: "Commands\ndelivered?" { shape: diamond }
App: "Layer 4 - Application / topic routing"
L5: "Layer 5 - Reader / radio behaviour"
S -> L1
L1 -> Phy: No
L1 -> L2: Yes
L2 -> Net: No
L2 -> L3: Yes
L3 -> Tra: No
L3 -> L4: Yes
L4 -> App: No
L4 -> L5: Yes

```

**Related:** 📙 [Connection Troubleshooting](/reference/troubleshooting/connection) · 📙 [RFID Troubleshooting](/reference/troubleshooting/rfid) · 📙 [Tag Data Troubleshooting](/reference/troubleshooting/tag-data) · 📕 [get_status](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status)
