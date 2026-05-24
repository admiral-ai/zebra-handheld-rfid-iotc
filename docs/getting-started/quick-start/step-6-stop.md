---
id: step-6-stop
title: "Phase 6: Start and stop inventory (control_operation)"
sidebar_label: "Phase 6: Start and stop inventory"
---

> 📗 **TUTORIAL** · **Phase:** 6 of 7 · **Audience:** Integrator · **Time:** ~5 min · **Path:** 🅓 Direct

**Artifact this phase produces:** **live `dataEVT` events** streaming on the DATA1 topic. Each event is one tag read. After this phase the full loop is closed: application → CTRL → reader → radio → tag → metadata → DATA1 → application.

### Why this phase exists

Inventory is the verb. Until tag data flows, IOTC is just plumbing. This phase fires the plumbing.

### What to do

#### 1. Confirm the operating mode

Inventory needs an operating profile. The default after bootstrap is `BALANCED_PERFORMANCE` (fine for first reads). Check it:

```bash
mosquitto_pub -h <broker-host> -p 1883 \
  -t 'zebra/CTRL/clients/cmnd/RFD40-24190525100255' \
  -m '{"command":"get_operating_mode","requestId":"mode-check-001"}'
```

The response (on `zebra/CTRL/clients/resp/<serial>`) returns the active `operatingMode.operatingModes.profiles` value. If it's `BALANCED_PERFORMANCE`, you're set. If not, or if you want to be explicit, set it:

```bash
mosquitto_pub -h <broker-host> -p 1883 \
  -t 'zebra/CTRL/clients/cmnd/RFD40-24190525100255' \
  -m '{
    "command": "set_operating_mode",
    "requestId": "set-mode-001",
    "operatingMode": {
      "operatingModes": {
        "profiles": "BALANCED_PERFORMANCE"
      }
    }
  }'
```

**Note the payload shape:** `command`, `requestId`, and a named payload object; here `operatingMode`. Inside `operatingMode` is `operatingModes` (the double nesting is unique to this command). All five supported profiles are `CYCLE_COUNT`, `DENSE_READERS`, `OPTIMAL_BATTERY`, `BALANCED_PERFORMANCE`, and `ADVANCED`. The `FAST_READ` enum value exists but is **not currently supported** — selecting it will fail.

:::caution[Important pre-condition]
[`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) cannot run during active inventory. If a previous inventory is running; you must stop it first (error code 11 otherwise).
:::

#### 2. Place tags in the antenna's line of sight

Any EPC Gen2 UHF RFID tag works. A printed adhesive tag on cardboard, 1–2 meters in front of the sled antenna, is enough.

#### 3. Start inventory

The canonical [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) payload uses the **`ctrlOprPayload`** named object with `controlType` and `operation` — both **uppercase enums**:

```bash
mosquitto_pub -h <broker-host> -p 1883 \
  -t 'zebra/CTRL/clients/cmnd/RFD40-24190525100255' \
  -m '{
    "command": "control_operation",
    "requestId": "start-inv-001",
    "ctrlOprPayload": {
      "controlType": "RFID",
      "operation": "START"
    }
  }'
```

Response on `zebra/CTRL/clients/resp/<serial>`:

```json
{
  "command": "control_operation",
  "requestId": "start-inv-001",
  "apiVersion": "V1.1",
  "response": { "code": 0, "description": "Success" }
}
```

`controlType` is `RFID` or `SCANNER`; for inventory it's always `RFID`. `operation` is `START` or `STOP`.

#### 4. Watch DATA1 for tag events

Your DATA1 subscriber should immediately begin printing `dataEVT` events:

```json
{
  "type": "BALANCED_PERFORMANCE",
  "timestamp": "2026-05-19T14:23:11Z",
  "data": {
    "tagData": [
      {
        "EPCid": "E2003411B802011533ABCD12",
        "EPC": "E2003411B802011533ABCD12",
        "peakRssi": -52,
        "seenCount": 14,
        "eventNum": 1
      }
    ]
  }
}
```

Notice that `dataEVT` does **not** use the `{command, requestId, response: {code, description}}` envelope. Events have their own shape with `type` (the active profile), `timestamp`, and `data.tagData[]`. Other fields appear when enabled in `tagMetaDataToEnable` on [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) (PHASE, CHANNEL, TID, USER, MAC, HOSTNAME, etc.).

Move tags in and out of the read zone — `seenCount` increases for repeat reads, `peakRssi` changes with distance, new EPCs appear as new tags enter the field.

#### 5. Stop inventory

```bash
mosquitto_pub -h <broker-host> -p 1883 \
  -t 'zebra/CTRL/clients/cmnd/RFD40-24190525100255' \
  -m '{
    "command": "control_operation",
    "requestId": "stop-inv-001",
    "ctrlOprPayload": {
      "controlType": "RFID",
      "operation": "STOP"
    }
  }'
```

The `dataEVT` stream stops. `response.code` is `0` if an inventory was actually running, `12` if the reader was already idle — **`12` is not a failure**, just a confirmation the radio was already in the requested state.

### Error codes

| Code | Meaning | Action |
|---|---|---|
| `0` | Success | None |
| `11` | Inventory in progress | Stop the current inventory first (or you sent `START` while already running). |
| `12` | No radio operation in progress | A `STOP` was sent while idle. Idempotent; no action required. |
| `23` | Invalid enum value | Check `controlType` and `operation` casing; both are uppercase. |

### Success check

- `START` returns `response.code: 0`.
- `dataEVT` events appear on `zebra/DATA1/...`.
- `STOP` returns `response.code: 0` (or `12` if already stopped).
- After `STOP`, no further events arrive.

### Didn't work?

- **No `dataEVT` despite `START` returning OK.** Most likely the profile is `FAST_READ` (not currently supported, the radio runs but emits no events) or the post-filter is excluding every tag. Run [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode) and confirm `profiles` is one of the five supported values; run [`get_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-post-filter) to confirm no `EXCLUDE` rule is filtering everything out.
- **Always the same EPC.** Only one tag is being singulated. Move tags, add more, change distance.
- **Events stop after a few seconds.** `radioStopConditions` may have a `tagCount` or `stopTimeout` set in the operating mode. Inspect with [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode); clear the stop conditions if you want indefinite inventory.
- **`response.code: 11` on `START`.** An inventory is already running. Send `STOP` first, then `START`.
- **Events arrive on `DATA1/event` but your subscriber sees nothing.** Wildcard mismatch. Subscribe to `zebra/DATA1/#` to catch whatever path the reader is using, then narrow.

### Where to go next

You've completed the inventory loop. The last phase covers [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) — what it does, when to use it, and the one pre-condition that matters. [Phase 7. Reboot when needed](/getting-started/quick-start/step-7-reboot).
