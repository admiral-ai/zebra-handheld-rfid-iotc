---
id: step-4-start
title: Inspect endpoint state (get_endpoint_config)
sidebar_label: Inspect endpoint state (`get_endpoint_config`)
---

> 📗 **TUTORIAL** · Phase 4 of 7 · Audience: Integrator · Time: ~4 min · Path: 🅐 Monolithic

**Artifact this phase produces:** a list of every endpoint the sled has (both active and saved-but-inactive)confirmed from the reader itself. This is the source of truth before you change anything in Phase 5.

### Why this phase exists

You configured an MDM endpoint in 123RFID Desktop and `get_version` confirmed the connection in Phase 3. Before adding more endpoints with `config_endpoint`, you need to see what the reader already has. Skipping this step is how you accidentally:

- Add an endpoint with a name that already exists (returns error code 10).
- Overwrite a working configuration with a typo.
- Believe an endpoint is active when only the saved configuration exists.

`get_endpoint_config` answers two questions in one call: what is **active** (currently connected to a broker) and what is **saved** (defined but not active).

### What to do

#### 1. List all active endpoints

Keep your Phase 3 subscriber running on `zebra/MDM/#`. Publish:

```bash
mosquitto_pub -h <broker-host> -p 1883 \
  -t 'zebra/MDM/clients/cmnd/RFD40-24190525100255' \
  -m '{"command":"get_endpoint_config","requestId":"list-001"}'
```

The payload is the minimal two-field form:

```json
{
  "command": "get_endpoint_config",
  "requestId": "list-001"
}
```

The response includes the full configuration of every active endpoint, plus the names of every saved-but-inactive endpoint:

```json
{
  "command": "get_endpoint_config",
  "requestId": "list-001",
  "apiVersion": "V1.1",
  "endpointResponse": {
    "activeEndpoints": {
      "epConfig": [
        {
          "configuration": {
            "endpointName": "mdm_bootstrap",
            "epType": "MDM",
            "protocol": "MQTT",
            "activate": true,
            "url": "broker.example.com",
            "port": 1883,
            "tenantId": "zebra",
            "mqttParams": { "...": "..." }
          }
        }
      ],
      "savedEndpoints": {
        "epNames": ["mdm_bootstrap"]
      }
    },
    "response": { "code": 0, "description": "Success" }
  }
}
```

Right after Phase 2 you should see exactly one endpoint: the MDM endpoint you provisioned. That confirms the bootstrap state.

#### 2. Query a specific endpoint by name

To pull the full configuration of a single endpoint, add `endpointDetails`:

```bash
mosquitto_pub -h <broker-host> -p 1883 \
  -t 'zebra/MDM/clients/cmnd/RFD40-24190525100255' \
  -m '{
    "command": "get_endpoint_config",
    "requestId": "lookup-001",
    "endpointDetails": { "endpointName": "mdm_bootstrap" }
  }'
```

You'll get back exactly that endpoint's `configuration` object — useful when you want to inspect `publishTopics`, `subscribeTopics`, or `securityParams` without scanning the full list.

### What to inspect in the response

| Field | What to check |
|---|---|
| `activate` | An inactive endpoint does not connect. Confirm before expecting data flow. |
| `protocol` | A mismatch (e.g., `MQTT_TLS` configured but the broker only accepts `MQTT`) prevents connection. |
| `url` and `port` | Wrong values prevent the reader from reaching the broker. |
| `verificationType` | If TLS, a mismatched verification type causes handshake failures. |
| `publishTopics` | The reader publishes only to topics explicitly listed. |
| `subscribeTopics` | The reader receives commands only on topics it has subscribed to. |
| `savedEndpoints.epNames` | All endpoints stored on the device; useful before `add` (don't collide) or `delete` (target exists). |

### Success check

- The response arrives on `MDM/apps/...` within seconds.
- `response.code` is `0`.
- `endpointResponse.activeEndpoints.epConfig` lists at least the MDM endpoint with `activate: true`.
- `savedEndpoints.epNames` contains every endpoint name you expect.

### Didn't work?

- **`response.code` is `3` (Not able to retrieve information).** The reader could not gather the requested information right now. Retry after a short delay. If it persists, you may need to reboot, but only after Phase 6 if you have an inventory running.
- **The active list is empty.** The MDM endpoint reverted to inactive. Re-check 123RFID Desktop and re-activate.
- **The endpoint name you expect isn't listed.** It was never saved or was deleted. Re-run Phase 2.

### Where to go next

You now know what the sled has. Next, add operational endpoints. CTRL for radio control and DATA1 for the tag stream. [Phase 5. Add remote endpoints (`config_endpoint`)](/getting-started/quick-start/step-5-read).
