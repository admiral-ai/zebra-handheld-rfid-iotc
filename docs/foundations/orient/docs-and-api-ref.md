---
id: docs-and-api-ref
title: Pairing the docs with the API Reference
sidebar_label: Pairing the docs with the API Reference
---

> 📘 **EXPLANATION** · **Audience:** All personas · **Read time:** ~3 min

These conceptual docs and the **MQTT API Reference** are two halves of one documentation system. Reading either alone misses half the picture.

### Why two sites

The system answers four questions, each of which has its own voice and access pattern:

| Question | Site | Voice | Look up |
|---|---|---|---|
| Why does this work the way it does? | Conceptual docs (this site) | Explanation; discursive | Concepts, mental models, decision criteria |
| Teach me by doing. | Conceptual docs, Part 3 | Tutorial; narrative | The Quick Start |
| Why is this broken? | Conceptual docs, Part 8 | Diagnostic; symptom-first | Recovery playbooks, misconception list |
| What is the exact contract of this operation? | API Reference (separate site) | Reference; atomic, tabular | Schema, command signatures, error codes |

Mixing the voices produces a worst-of-both-worlds page: too verbose for lookup, too dry for understanding. We keep them apart on purpose.

### The cross-walk

Every concept chapter in Parts 4–6 ties to exactly one API Reference sub-tag. The mapping is mechanical:

| Concept chapter | API sub-tag | Operations / Events |
|---|---|---|
| What your reader knows about itself | Device Status | [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status) · [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) · [`get_current_region`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-current-region) |
| Getting on the network (Wi-Fi & Ethernet) | Network Configuration | [`get_eth`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-eth) · [`get_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-wifi) · [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) · [`delete_wifi_profile`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-wifi-profile) |
| How the MQTT plumbing fits together | MQTT Endpoint Configuration | [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) · [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) |
| Securing the connection (TLS & certificates) | Certificate Management | [`get_installed_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-installed-certificate) · [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) · [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate) |
| The reader's configuration document | Device Configuration | [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) · [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) |
| Updating firmware and rebooting | System Operations | [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) · [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) |
| Choose how the reader reads tags | Operating Mode | [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode) · [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) |
| Start, stop, and the trigger button | Inventory Control | [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) |
| Filter tags before vs after the read | Tag Filtering | [`get_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-post-filter) · [`set_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-post-filter) |
| Choose what the reader tells you | Event Configuration | [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) |
| Watch your reader's pulse | Device Health | `heartbeatEVT` |
| When the reader needs to interrupt you | Alerts / Exceptions | `alerts` · `alert_short` |
| Knowing when you're connected | MQTT Connectivity | `mqttConnEVT` |
| Where tag reads come from | Tag Data Event | `dataEVT` |

Fourteen concept chapters, fourteen API sub-tags, twenty-three documented operations and events.

### One-hop pivots

- Every Part 4–6 concept chapter carries a **"See in the API Reference"** callout at the top, listing every operation in the matching sub-tag with a direct link.
- Every API Reference page carries a **"Concept: read more"** callout pointing back to the concept chapter that explains why it exists.

Click through either way. The cross-walk is bidirectional and complete.

### Four navigation entry points

A reader of this stack typically arrives via one of four doors:

- **The concept door**: *"I'm trying to understand X."* Land here, in Parts 1–7.
- **The tutorial door**: *"Teach me by doing."* Land in Part 3.
- **The symptom door**: *"Why is this broken?"* Land in Part 8.
- **The API door**: *"What's the exact contract?"* Land on the API Reference site.

All four doors open into the same building. Internal links never leave you stranded; the cross-walk above guarantees a one-hop path to whichever surface answers your current question.

### About payload examples

Every code example on this site uses **native MQTT flattened payloads**, the runtime contract the sled actually accepts.

```json
{
  "command": "set_operating_mode",
  "requestId": "abc-123",
  "profile": "BALANCED_PERFORMANCE"
}
```

The OpenAPI rendering on the API Reference site may show nested envelopes (`ctrlOprPayload`, `params`). Those do not work over MQTT. The native flat shape is canonical; the nested shape is a documentation artifact of `docusaurus-plugin-openapi-docs`. See [The OpenAPI Illusion](/foundations/concepts/native-mqtt-vs-openapi) for why both exist and how to read each.

### Where to go next

For the IOTC mental model: [What the IoT Connector is](/foundations/introduction/about-iotc). For the protocol primer: [MQTT in five minutes](/foundations/mqtt/primer). For the OpenAPI disambiguation: [The OpenAPI Illusion](/foundations/concepts/native-mqtt-vs-openapi).
