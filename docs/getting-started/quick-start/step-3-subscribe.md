---
id: step-3-subscribe
title: "Phase 3: Verify the bootstrap connection (get_version)"
sidebar_label: "Phase 3: Verify the bootstrap connection"
---

> 📗 **TUTORIAL** · **Phase:** 3 of 7 · **Audience:** Integrator · **Time:** ~3 min

**Artifact this phase produces:** a [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) **response from the sled** containing model, serial number, SKU, firmware version, and IoTC version. This is your first proof that:

- The MDM endpoint is fully active.
- The application can reach the reader.
- The reader can reach the application.

[`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) is the first command. It is read-only, idempotent, identity-establishing, and **does not depend on operating mode or radio state.**

### Why this phase exists

After Phase 2 the sled is connected to the broker, but you have not yet exchanged a command/response pair. Until you do, you cannot tell apart these three failure modes:

- The sled is connected but receiving no commands (subscription topic mismatch).
- The sled is sending responses but you cannot see them (publish topic mismatch).
- The sled is fully reachable (success).

[`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) distinguishes them in one round trip.

### What to do

#### 1. Subscribe to the reader's response topic

In MQTTX (or `mosquitto_sub`), subscribe to the topic the sled publishes responses on. The MDM endpoint you created in Phase 2 publishes on `<tenantId>/MDM/clients/resp/<deviceSerialNumber>`. With tenant `zebra` and serial `RFD40-24190525100255`:

```bash
mosquitto_sub -h <broker-host> -p 1883 \
  -t 'zebra/MDM/clients/resp/RFD40-24190525100255' -v
```

You can wildcard-subscribe across the whole MDM family while you learn the shape:

```bash
mosquitto_sub -h <broker-host> -p 1883 -t 'zebra/MDM/#' -v
```

Keep this subscriber open.

#### 2. Publish [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version)

In a second terminal:

```bash
mosquitto_pub -h <broker-host> -p 1883 \
  -t 'zebra/MDM/clients/cmnd/RFD40-24190525100255' \
  -m '{"command":"get_version","requestId":"ver-001"}'
```

The payload is the two-field minimum. No envelope, no nesting:

```json
{
  "command": "get_version",
  "requestId": "ver-001"
}
```

#### 3. Read the response

Within a few hundred milliseconds, your subscriber prints something like:

```json
{
  "command": "get_version",
  "requestId": "ver-001",
  "apiVersion": "V1.1",
  "readerVersion": {
    "firmwareVersion": "SAAFKS00-006-R02",
    "model": "RFD40",
    "serialNumber": "23053520102096",
    "sku": "RFD4031-G10B700-US",
    "companyName": "Zebra Technologies",
    "manufacturerName": "Zebra Technologies",
    "detailedVersions": {
      "scannerFirmware": "PAAEOC20-003-R01",
      "radioFirmware": "2.0.42.0",
      "iotcVersion": "V1.1"
    }
  },
  "response": {
    "code": 0,
    "description": "Success"
  }
}
```

### Reading what the response tells you

| Field | Why it matters |
|---|---|
| `model` | Confirm RFD40 vs RFD90 before applying model-specific configuration. |
| `serialNumber` | Should match the label on the back of the sled. Used for asset tracking and topic routing. |
| `sku` | Identifies the regional / hardware variant; e.g., `RFD4031-G10B700-US` is a US-regional RFD40. |
| `firmwareVersion` | Compare against your expected baseline before updates or troubleshooting. |
| `detailedVersions.iotcVersion` | Determines which commands and features are available. Quick Start assumes `V1.1` or later. |

### Success check

- A JSON response arrives on `MDM/clients/resp/...` within a few seconds.
- `requestId` echoes your value (`abc123`).
- `response.code` is `0` and `response.description` is `Success`.
- `readerVersion.serialNumber` matches the physical label.

You can now command the reader.

### Didn't work?

- **No response within 5 seconds.** Most likely your publish topic is wrong. Confirm the exact `<tenantId>/MDM/clients/cmnd/<serial>` form. The reader subscribes to *exactly* that topic shape; off-by-one segments produce silence.
- **Response on a different topic than expected.** The MDM endpoint's `publishTopics` configuration uses different names than the defaults. Use the wildcard `zebra/MDM/#` to find where responses are actually arriving, then update your subscriber.
- **`response.code` is not 0.** [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) only defines code 0 (Success); a different code indicates an unusual condition. Verify firmware version supports IoTC V1.1.
- **No response, MDM endpoint reports inactive.** Phase 2 didn't complete cleanly. Re-open 123RFID Desktop (Direct) or 123RFID Mobile (Bridged), confirm endpoint state, re-activate if needed.

### A note on `requestId` discipline

`requestId` is your only correlation tool. MQTT itself provides no request/response pairing at the protocol layer. IOTC implements correlation in the JSON payload. Choose values that are:

- **Unique within your application's session** (avoid collisions during concurrent requests).
- **Readable in logs** (UUIDs work but are noisy; prefer prefixed counters like `ver-001`, `cfg-042`).
- **Stable across retries**: reuse the same `requestId` if you retry. The reader treats it idempotently.

### Where to go next

[Phase 4: Inspect endpoint state](/getting-started/quick-start/step-4-start) — list what the sled has using [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) before adding more.
