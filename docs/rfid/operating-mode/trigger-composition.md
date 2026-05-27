---
id: trigger-composition
title: Trigger composition for IOTC reader sleds
sidebar_label: About Trigger Composition
description: "How the IOTC trigger button composes with control_operation: trigger modes, what each pull sends, and how host-app and trigger-driven inventory interact."
---

> 📘 **EXPLANATION** · Audience: Solution Builder · Read time: ~5 min

The handheld sled has a physical trigger button. Its behaviour with respect to RFID inventory is **composed** from two independent enums — `radioConditions.start.trigger` and `radioConditions.stop.trigger`, set inside `set_operating_mode.operatingMode`.

### The two enums

Both `start.trigger` and `stop.trigger` accept the same enum: `IMMEDIATE`, `PRESSED`, `RELEASED`.

- `IMMEDIATE`: fires as soon as the command is applied (start) or based on threshold conditions (stop).
- `PRESSED`: fires on physical trigger press.
- `RELEASED`: fires on physical trigger release.

### Common compositions

| Behaviour | start | stop |
|---|---|---|
| Press-and-hold | `PRESSED` | `RELEASED` |
| Toggle | `PRESSED` | `PRESSED` |
| Pulse with auto-stop | `PRESSED` | `IMMEDIATE` (+ `stopTimeout`) |
| Operator-initiated, count-bounded | `PRESSED` | `IMMEDIATE` (+ `tagCount`) |
| Always running | `IMMEDIATE` | `IMMEDIATE` (+ `inventoryCount`) |

The three behaviour modes Phase 2 v1 documented as separate "trigger modes" are these compositions, not enum values.

### Interaction with MQTT-initiated control

A [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) START produces the same effect as if the trigger fired (subject to the `start.trigger` configuration). The trigger and the API are equivalent input sources; the most recent event wins.

**Related:** 📘 [Handheld Considerations](/foundations/architecture/handheld-considerations) · 📙 [Start/Stop](/rfid/start-stop-inventory) · 📕 [set_operating_mode](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode)
