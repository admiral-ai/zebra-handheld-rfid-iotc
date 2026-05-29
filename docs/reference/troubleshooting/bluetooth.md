---
id: bluetooth
title: How to troubleshoot Bluetooth and host-device issues
sidebar_label: How to Troubleshoot Bluetooth & Host Device Issues
description: "Troubleshoot Bluetooth and host-device issues on Bridged-tier IOTC readers: pairing failures, terminalConnection signals, Android compatibility, re-pair flow."
---

> 📙 **HOW-TO** · **Audience:** All · **Time:** ~10 min per symptom

This guide shows you how to troubleshoot Bluetooth and host-device-related issues.

#### Symptom: reader sled not pairing with host

- Power-cycle the sled by holding the trigger for 5 seconds.
- Remove any existing pairing on the host device first.
- Ensure no other host is currently connected to the sled (sled connects to one host at a time).

#### Symptom: Bluetooth disconnections during operation

- Range: the operator is moving away from the host (most common).
- Interference: 2.4 GHz environments (microwaves, dense Wi-Fi) degrade BT.
- Host BT subsystem: try the same sled with a different host device to isolate.

#### Symptom: multiple host device conflicts

- The most recently connected host wins. Explicitly disconnect from the prior host.

#### Symptom: host application not forwarding MQTT traffic

- The host application that mediates sled ↔ broker traffic may be suspended by Android's battery optimization. Whitelist the app in Android settings.
- Verify the host has its own MQTT path to the broker by running a test MQTT client on the host directly.

```d2
classes: {
  good: { style: { fill: "#e6f4ea"; stroke: "#1e8e3e"; font-color: "#137333" } }
  bad:  { style: { fill: "#fce8e6"; stroke: "#d93025"; font-color: "#c5221f" } }
}
S: Bridged sled offline?
Q1: "Host application\nrunning?" { shape: diamond }
Wake: "Wake / restart\nhost app" { class: bad }
Q2: "BT link\nconnected?" { shape: diamond }
Pair: "Re-pair sled\nvia 123RFID Mobile" { class: bad }
Q3: "Host has\nbroker connectivity?" { shape: diamond }
Net: "Fix host Wi-Fi /\ncellular" { class: bad }
Q4: "terminalConnection\nevents flowing?" { shape: diamond }
HostBattery: "Check Android\nbattery optimisation" { class: bad }
OK: "Operational -\nlook elsewhere" { class: good }
S -> Q1
Q1 -> Wake: No
Q1 -> Q2: Yes
Q2 -> Pair: No
Q2 -> Q3: Yes
Q3 -> Net: No
Q3 -> Q4: Yes
Q4 -> HostBattery: No
Q4 -> OK: Yes

```

**Related:** 📙 [Bluetooth Pairing](/quick-start/prerequisites/bluetooth-pairing) · 📘 [Handheld Considerations](/foundations/architecture/handheld-considerations)
