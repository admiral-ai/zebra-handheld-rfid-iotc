---
id: docs-and-api-ref
title: Pairing the docs with the API Reference
sidebar_label: Pairing the docs with the API Reference
---

> 📘 **EXPLANATION** · Audience: All personas · Read time: ~3 min

These conceptual docs and the MQTT API Reference are designed to be read together. Each answers a different question.

### The split

| Surface | Answers | Voice | Source of truth for |
|---|---|---|---|
| Conceptual docs (this site, Parts 1–8) | Why does this work the way it does? What is the right mental model? When is the right time to use this? | Explanation, tutorial, diagnostic | Concepts, decision criteria, failure recovery |
| MQTT API Reference (separate site) | What is the exact contract of this operation? What fields are in this payload? What error codes can it return? | Reference (atomic, tabular) | Schema, command signatures, error codes |

### One-hop pivots between them

Every concept chapter in Parts 4–6 of these docs maps one-to-one to an API Reference sub-tag. The cross-walk:

| Concept chapter | API Reference sub-tag |
|---|---|
| Device state and identity | Device Status |
| Network configuration | Network Configuration |
| MQTT endpoint architecture | MQTT Endpoint Configuration |
| Certificates and TLS trust | Certificate Management |
| The reader's configuration document | Device Configuration |
| System operations: OS, firmware, reboot | System Operations |
| Operating modes: seven profiles | Operating Mode |
| The RFID inventory cycle | Inventory Control |
| Tag filtering: pre vs post | Tag Filtering |
| Event configuration | Event Configuration |
| Device health and heartbeats | Device Health |
| Alerts and exceptions | Alerts |
| MQTT connectivity events | MQTT Connectivity |
| Tag data events | Tag Data Event |

Every concept chapter carries a "See in the API Reference" callout at the top. Every API Reference page carries a "Concept: read more" callout pointing back. Click through either way.

### Four navigation entry points

A reader of this documentation stack typically arrives via one of four doors.

- The concept door (this site) asks: "I am trying to understand X."
- The tutorial door (this site, Part 3) asks: "Teach me by doing."
- The symptom door (this site, Part 8) asks: "Why is this broken?"
- The API door (API Reference) asks: "What is the exact contract of this operation?"

All four doors lead to the same room.

### About payload examples

Every code example on this site uses native MQTT flattened payloads, which is the runtime contract the sled actually accepts. The OpenAPI rendering may show nested envelopes such as `ctrlOprPayload` or `params`; those do not work over MQTT. See [The OpenAPI Illusion](/foundations/concepts/native-mqtt-vs-openapi) for why both exist.

### Where to go next

[What the IoT Connector is](/foundations/introduction/about-iotc).
