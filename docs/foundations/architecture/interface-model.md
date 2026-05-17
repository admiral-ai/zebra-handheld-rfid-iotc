---
id: interface-model
title: 2.4 About the Interface Model
sidebar_label: 2.4 Interface Model
---

# About the Interface Model

<div className="badge-explanation">EXPLANATION</div>

**Audience:** All · **Read time:** ~5 min

An IOTC reader exposes its functionality through **endpoints** — named MQTT connections, each typed by role. There are seven endpoint types; a reader has at least one (the MDM endpoint, configured at bootstrap), and typically several more (configured remotely once the reader is online).

## The seven endpoint types

| `epType` | Role |
|---|---|
| `MGMT` | Dedicated management command and response channel |
| `MGMT_EVT` | Dedicated management events channel |
| `CTRL` | RFID control commands and responses |
| `DATA1` | Primary tag-data event stream |
| `DATA2` | Secondary tag-data event stream |
| `MDM` | Combined management commands + events for an MDM platform |
| `SOTI` | Specialised endpoint type for SOTI MobiControl MDM integration |

## The three-part topic template

All topics on an IOTC reader follow this structure:

```
<tenantId> / <topic> / <deviceSerialNumber>
```

The middle segment — `<topic>` — is **configured per endpoint** via the endpoint's `publishTopics` and `subscribeTopics` arrays. The reader prepends `tenantId` and appends `deviceSerialNumber` automatically — never include them in the configured topic.

## The MDM-endpoint-as-bootstrap pattern

The MDM endpoint is the only endpoint configurable without an MQTT connection. It is provisioned via the 123RFID Desktop application during reader onboarding. Once the reader is online via MDM, all other endpoints (`MGMT`, `MGMT_EVT`, `CTRL`, `DATA1`, `DATA2`, additional `MDM` or `SOTI`) are configured remotely with `config_endpoint`.

**Related:** [Topic Hierarchy](/foundations/mqtt/topic-hierarchy) · [Endpoint Configuration](/infrastructure/endpoints/about) · [config_endpoint Reference](/reference/mgmt/endpoint)
