---
id: about
title: How the MQTT plumbing fits together
sidebar_label: How the MQTT plumbing fits together
description: How IOTC's seven MQTT endpoint types (MDM, MGMT, CTRL, EVT, DATA1, DATA2, ALERT) interconnect. Topic three-segment pattern, retention, per-endpoint TLS.
---

> 📘 **EXPLANATION** · **Audience:** Solution Builder · **Read time:** ~5 min · **Ties to:** MQTT Endpoint Configuration sub-tag of the API Reference

:::tip[See in the API Reference]
Sub-tag: MQTT Endpoint Configuration. Operations: [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) · [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint).
:::

The word *endpoint* is overloaded. **API endpoints** are MQTT operation names — [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status), [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint), [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation). **MQTT endpoints** are broker connection targets — host, port, TLS settings, credentials, topic mapping. This chapter is about the second meaning: how the reader's broker connections are shaped, how many you can have, and how to choose between the hybrid bootstrap and the split-by-role production posture.

### Seven endpoint types

Each [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) operation creates or updates one MQTT endpoint of a specific `epType`:

| epType | What it carries | Direction | When to use |
|---|---|---|---|
| `MGMT` | Identity, network, security, config, firmware commands and responses | Bidirectional | Dedicated management channel |
| `MGMT_EVT` | Heartbeats, alerts, exceptions, NTP, network/firmware events | Sled → app | Dedicated event channel |
| `CTRL` | [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode), [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation), [`set_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-post-filter) | Bidirectional | Dedicated RFID control channel |
| `DATA1` | `dataEVT` tag stream | Sled → app | Primary tag-data destination |
| `DATA2` | Second `dataEVT` stream | Sled → app | Secondary tag-data destination |
| `MDM` | Management + Control + Data combined | Bidirectional | Bootstrap default; MDM platform integration |
| `SOTI` | SOTI MobiControl integration | Bidirectional | SOTI-managed fleets |

The full field schema for each endpoint is in `mqtt-api-reference/config_endpoint.md`. The runtime list of what is currently active is fetched with [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config).

### The topic format, always three parts

Every IOTC topic is constructed at runtime as:

```
<tenantId> / <topic> / <deviceSerialNumber>
```

You configure **only the middle segment** in `publishTopics[].topic` and `subscribeTopics[].topic`. The reader prepends `tenantId` and appends `deviceSerialNumber` automatically. With tenant `zebra`, middle topic `CTRL/clients/cmnd`, serial `RFD40-24190525100255`, the wire topic is:

```
zebra/CTRL/clients/cmnd/RFD40-24190525100255
```

**Never** include `tenantId` or the serial in the `topic` field, they get added twice and the path becomes unroutable.

### Hybrid (MDM) vs split (MGMT + CTRL + DATA)

The MDM endpoint created by 123RFID Desktop at bootstrap is **hybrid**: it carries management commands, control commands, events, *and* tag data on one topic family. This is convenient for first-light but has three production costs:

- **Backpressure leaks across roles.** A slow data consumer can starve management commands on the same session.
- **No per-role QoS.** QoS is per-endpoint; you cannot apply QoS 1 to commands and QoS 0 to tag data on the same hybrid.
- **Authorization sprawl.** Broker-side ACLs cannot separate operator access from data-pipeline access when everything lives under `MDM/`.

Production deployments typically split into `MGMT` + `CTRL` + `DATA1`. Add `MGMT_EVT` if you need a dedicated event channel; add `DATA2` if you need a second data destination (e.g., one to a real-time analytics pipeline, one to an archive).

The split is **additive** — adding `CTRL` does not remove the MDM endpoint. Phase 5 of the Quick Start walks the canonical add sequence.

### Limits that matter

| Constraint | Limit | Error code |
|---|---|---|
| `publishTopics` per endpoint | 3 | `25` (Max 3 publish topics exceeded) |
| `subscribeTopics` per endpoint | 1 | `26` (Max 1 subscribe topic exceeded) |
| `endpointName` uniqueness for `add` | required | `10` (Configuration already exists) |
| Tenant ID length | bounded | `27` (Invalid tenant ID length) |
| `epType` and other enums | per schema | `23` (Invalid enum value) |

Operations on [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) are `add`, `update`, `delete` (lowercase). For `delete`, only `endpointName` and `epType` are required.

### Verification types

The `verificationType` enum controls TLS handshake behavior:

| Value | Verifies | Use |
|---|---|---|
| `NONE` | Nothing | Plain MQTT (port 1883); required field even then |
| `VERIFY_PEER` | Server certificate against trusted CAs | Encryption without hostname check |
| `VERIFY_HOST` | Hostname matches certificate | Hostname check without trust chain |
| `VERIFY_HOST_PEER` | Both | Recommended for production |

For TLS, certificate logical names referenced in `securityParams` must already be installed via [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate). See [Securing the connection (TLS & certificates)](/infrastructure/security/model).

### Inspecting what's active

[`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) returns:

- `endpointResponse.activeEndpoints.epConfig[]`, every currently-active endpoint with its full configuration.
- `endpointResponse.activeEndpoints.savedEndpoints.epNames[]`: names of every saved-but-inactive endpoint.

You can also query a single endpoint:

```json
{
  "command": "get_endpoint_config",
  "requestId": "lookup-001",
  "endpointDetails": { "endpointName": "ctrlEP" }
}
```

[`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) runs **before** any `config_endpoint update` or `delete` — confirm the target exists, see its current configuration, then make the change.

### Out of scope

- **TLS setup and certificate installation**: [Securing the connection](/infrastructure/security/model).
- **Per-endpoint event flag configuration**: `eventConfiguration` and `heartbeatConfiguration` within [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) are covered in [Choose what the reader tells you](/observability/configure-events).
- **Bulk endpoint configuration across a fleet**: [Keeping a fleet in sync](/fleet/bulk-management).

**Related:** 📘 [How commands and responses flow](/foundations/communication-flow) · 📘 [Securing the connection (TLS & certificates)](/infrastructure/security/model) · 📕 [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
