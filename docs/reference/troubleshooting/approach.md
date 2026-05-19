---
id: approach
title: How to Approach Troubleshooting Systematically
sidebar_label: How to Approach Troubleshooting Systematically
---

> 📙 **HOW-TO** · Audience: All · Time: ~10 min reading; varies in practice

This guide shows you how to systematically diagnose IOTC issues, layer by layer.

#### Step 1: Identify the layer

A failing IOTC interaction lives in one of four layers:

- **Application**, your code, your environment, your assumptions
- **MQTT**: broker, credentials, ACLs, TLS, topics
- **Network**: Wi-Fi, Bluetooth, firewall, DNS
- **RFID**: radio subsystem, antenna, tag population

Asking "which layer?" first is more productive than "what's wrong?", most problems become tractable once the layer is identified.

#### Step 2: Gather data

For each layer, capture the minimum data set:

- **Application**, your logs, the command_id of the failing operation
- **MQTT**: `get_status`, recent `mqttConnEVT` events
- **Network**: `get_wifi`, broker reachability from a control machine
- **RFID**: `get_status` operating state, recent `exceptionEVT` events

#### Step 3: Isolate the variable

Change one thing at a time. If you suspect a Wi-Fi profile, test by switching to a known-good profile and confirming the problem resolves. Multi-variable changes mask which fix worked.

#### Step 4: Test the hypothesis

State the hypothesis concretely ("the reader cannot resolve `iotc-broker.zebra.com`"). Identify a test that would confirm or refute it (DNS query from the host device). Execute the test. The hypothesis is right or it's not — design the test so the answer is unambiguous.

#### Step 5: Verify the fix

A change that "seems to work" but is unconfirmed has a habit of returning. After applying a fix, exercise the original failure path and confirm the failure is gone. Then check: is the fix narrow (this device, this moment) or general (the fleet, the future)?

[DIAGRAM: D-18.1.A. diagnostic flowchart by layer]

**Related:** 📙 [§18.2 Connection Troubleshooting](/reference/troubleshooting/connection) · 📙 [§18.3 RFID Troubleshooting](/reference/troubleshooting/rfid) · 📙 [§18.4 Tag Data Troubleshooting](/reference/troubleshooting/tag-data) · 📕 [§16.2 get_status](#chapter-16--mqtt-api-reference)
