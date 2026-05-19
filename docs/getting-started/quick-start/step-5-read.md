---
id: step-5-read
title: Add remote endpoints (config_endpoint)
sidebar_label: Add remote endpoints (`config_endpoint`)
---

> 📗 **TUTORIAL** · Phase 5 of 7 · Audience: Integrator · Time: ~8 min · Path: 🅐 Monolithic

**Artifact this phase produces:** two operational endpoints active on the sled, a **CTRL** endpoint for radio control and a **DATA1** endpoint for the tag stream, in addition to the bootstrap MDM endpoint. This is the configuration most production deployments actually run.

### Why this phase exists

The MDM endpoint is a hybrid that carries management, control, and data on a single topic family. It works for bootstrap but has costs in steady state:

- **Backpressure leaks across roles.** A slow tag-data consumer can starve management commands on the same session.
- **No per-role QoS.** You cannot apply QoS 1 to commands and QoS 0 to data when both share an endpoint.
- **Authorization sprawl.** Broker-side ACLs can't separate operator access from data-pipeline access when everything lives under `MDM/`.

Production deployments split into MGMT + CTRL + DATA1 (and sometimes DATA2). The deployment guide recommends this split for any real workflow.

### The topic format reminder

All MQTT topics follow a fixed three-part hierarchy:

```
<tenantId> / <topic> / <deviceSerialNumber>
```

You configure only the **middle segment** in the `topic` field of each `publishTopic` or `subscribeTopic`. The reader prepends `tenantId` and appends `deviceSerialNumber` automatically. **Never** include the tenantId or serial in the `topic` field, they get added twice and the path becomes unroutable.

### What to do

#### 1. Add the CTRL endpoint

Publish on the MDM command topic:

```bash
mosquitto_pub -h <broker-host> -p 1883 \
  -t 'zebra/MDM/clients/cmnd/RFD40-24190525100255' \
  -m '{
    "command": "config_endpoint",
    "requestId": "add-ctrl-001",
    "epConfig": {
      "operation": "add",
      "configuration": {
        "endpointName": "ctrlEP",
        "epType": "CTRL",
        "protocol": "MQTT",
        "activate": true,
        "url": "broker.example.com",
        "verificationType": "NONE",
        "port": 1883,
        "qosCommon": 1,
        "tenantId": "zebra",
        "mqttParams": {
          "keepAlive": 300,
          "cleanSession": true,
          "reconnectDelayMin": 50,
          "reconnectDelayMax": 500,
          "publishTopics": [
            { "topic": "CTRL/clients/resp", "qos": 1, "retain": false },
            { "topic": "CTRL/clients/event", "qos": 1, "retain": false },
            { "topic": "CTRL/clients/rfid", "qos": 0, "retain": true }
          ],
          "subscribeTopics": [
            { "topic": "CTRL/clients/cmnd", "qos": 0, "retain": false }
          ]
        }
      }
    }
  }'
```

A few things to notice in this payload:

- The named payload object is **`epConfig`**, not `params`, not nested in any other envelope.
- `operation` is lowercase `add` (the casing varies by command; trust the per-command schema).
- `tenantId` is lowercase `zebra`, the canonical convention.
- `publishTopics` supports **at most 3 entries**; `subscribeTopics` supports **at most 1**. Exceed and the reader returns error 25 or 26.
- `verificationType: "NONE"` is required even on plain MQTT.

The response on `MDM/apps/<serial>/...`:

```json
{
  "command": "config_endpoint",
  "requestId": "add-ctrl-001",
  "apiVersion": "V1.1",
  "response": { "code": 0, "description": "Success" }
}
```

The reader is now subscribed to `zebra/CTRL/clients/cmnd/<serial>` for commands and publishes responses on `zebra/CTRL/clients/resp/<serial>`.

#### 2. Add the DATA1 endpoint

```bash
mosquitto_pub -h <broker-host> -p 1883 \
  -t 'zebra/MDM/clients/cmnd/RFD40-24190525100255' \
  -m '{
    "command": "config_endpoint",
    "requestId": "add-data1-001",
    "epConfig": {
      "operation": "add",
      "configuration": {
        "endpointName": "dataEP",
        "epType": "DATA1",
        "protocol": "MQTT",
        "activate": true,
        "url": "broker.example.com",
        "verificationType": "NONE",
        "port": 1883,
        "qosCommon": 1,
        "tenantId": "zebra",
        "mqttParams": {
          "keepAlive": 300,
          "cleanSession": true,
          "reconnectDelayMin": 50,
          "reconnectDelayMax": 500
        }
      }
    }
  }'
```

DATA1 publishes only; there is no `subscribeTopics` because applications never send commands to a data endpoint. The reader will publish `dataEVT` events on the DATA1 publish topic family.

#### 3. Verify both endpoints are active

Re-run `get_endpoint_config` from Phase 4:

```bash
mosquitto_pub -h <broker-host> -p 1883 \
  -t 'zebra/MDM/clients/cmnd/RFD40-24190525100255' \
  -m '{"command":"get_endpoint_config","requestId":"verify-001"}'
```

The response should now list three active endpoints: `mdm_bootstrap`, `ctrlEP`, and `dataEP`.

#### 4. Subscribe to the new topic families

In additional MQTTX panes or terminal windows:

```bash
mosquitto_sub -h <broker-host> -p 1883 -t 'zebra/CTRL/#' -v &
mosquitto_sub -h <broker-host> -p 1883 -t 'zebra/DATA1/#' -v &
```

### Endpoint-type cheat sheet

| epType | Carries | Direction |
|---|---|---|
| `MGMT` | Identity, network, security, config, firmware | Bidirectional command/response |
| `MGMT_EVT` | Heartbeats, alerts, exceptions, NTP, network/firmware events | Sled → app only |
| `CTRL` | `set_operating_mode`, `control_operation`, `set_post_filter` | Bidirectional command/response |
| `DATA1` | `dataEVT` tag stream | Sled → app only |
| `DATA2` | Second `dataEVT` stream (optional) | Sled → app only |
| `MDM` | All roles combined (bootstrap default) | Bidirectional |
| `SOTI` | SOTI MobiControl variant | Bidirectional |

### Success check

- `config_endpoint` returns `response.code: 0` for both adds.
- `get_endpoint_config` shows three active endpoints.
- Your CTRL and DATA1 subscribers are open and ready.

### Didn't work?

| Code | What it means | What to do |
|---|---|---|
| `10` | Configuration already exists | Use `"operation": "update"` instead of `"add"`, or `delete` the existing one first. |
| `23` | Invalid enum value | Check `epType`, `protocol`, or `verificationType` against the schema in `mqtt-api-reference/config_endpoint.md`. |
| `25` | Max 3 publish topics exceeded | Reduce `publishTopics` to 3 entries or fewer. |
| `26` | Max 1 subscribe topic exceeded | Use only 1 `subscribeTopics` entry per endpoint. |
| `27` | Invalid tenant ID length | Shorten the tenant ID. |

Other common stumbles:

- **Endpoint configured but not flowing.** `activate` must be `true` and the broker URL must be reachable from the sled. The reader doesn't fail-loudly on broker unreachability at config time; it sits in a reconnect loop.
- **Topic missing tenantId in your subscriber.** Subscribe to `zebra/CTRL/#` not `CTRL/#`. The reader publishes the full three-part path.
- **Certificate fields referenced but not installed.** For TLS endpoints, certificate files must already be installed via `install_certificate`, see [Securing the connection](/infrastructure/security/model). Plain MQTT (this Quick Start) doesn't need them.

### Where to go next

[Phase 6. Start and stop inventory (`control_operation`)](/getting-started/quick-start/step-6-stop).
