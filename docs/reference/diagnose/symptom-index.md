---
id: symptom-index
title: Something's broken?
sidebar_label: Something's broken?
---

> 🩺 **FAILURE MODE INDEX** · Audience: All personas in incident response

Pick the symptom that matches what you are actually seeing. Each row links to a failure-mode (FM) page or a recovery playbook (RP). If your symptom is not listed, scan the alphabetical list, the closest neighbour is usually informative.

### Bootstrap and first connection

| Symptom | Likely cause | Go to |
|---|---|---|
| 123RFID Desktop can't find my sled | USB cable is charge-only; sled is asleep; Bluetooth disabled | RP-01 — Connect a sled to 123RFID Desktop |
| Wi-Fi associates but sled doesn't reach the broker | DNS, routing, firewall on the sled's segment | FM-NET-01 — Network path between sled and broker |
| MDM endpoint configured but no broker connection | Wrong credentials, wrong port, broker not accepting client | FM-NET-02 — MDM endpoint won't connect |
| No MQTT command works after bootstrap | MDM endpoint isn't active | RP-02 — Activate the bootstrap MDM endpoint |
| Reader connects then disconnects in a loop | Authentication mismatch; broker ACL rejects topic | FM-NET-03 — Reconnect loop |

### Commands and responses

| Symptom | Likely cause | Go to |
|---|---|---|
| `get_version` returns no response | Wrong publish topic; subscriber on wrong response topic | RP-03 — Verify topic routing |
| Command returns "unknown field" error | OpenAPI-style payload with extra `params` wrapper | MM-01 — The OpenAPI Illusion |
| `config_endpoint add` returns code 10 | Endpoint name already exists | FM-CFG-01 — Endpoint name collision |
| `config_endpoint` returns code 25 or 26 | Too many publish topics or subscribe topics | FM-CFG-02 — Topic count caps |
| `set_operating_mode` returns code 11 | Inventory currently running | RP-04 — Stop inventory cleanly |
| `set_operating_mode` returns code 22 | `ADVANCED` profile selected without `advancedConfigurations` | FM-CFG-03 — Advanced profile incomplete |
| `set_operating_mode` returns code 23 | Invalid enum value (often `FAST_READ`) | MM-02 — FAST_READ is not supported |

### Inventory

| Symptom | Likely cause | Go to |
|---|---|---|
| `control_operation START` returns code 11 | Inventory already running | FM-OPS-01 — Inventory state mismatch |
| `control_operation STOP` returns code 12 | Inventory not running | (Not a failure; code 12 is idempotent confirmation) |
| `control_operation` returns code 23 | Lowercase `start` / `stop` instead of `START` / `STOP` | MM-03 — Casing matters |
| Start succeeds but no `dataEVT` events arrive | DATA endpoint inactive; post-filter excludes everything; FAST_READ profile | RP-05 — Tag data not flowing |
| `dataEVT` arrives but missing expected fields | `tagMetaDataToEnable` not configured; `reportFilter duration > 0` strips some fields | FM-DATA-01 — Missing metadata fields |
| Only same EPC repeated; no other tags | Tag population, antenna orientation, session choice | FM-OPS-02 — Single-tag dominance |

### Firmware and reboot

| Symptom | Likely cause | Go to |
|---|---|---|
| `set_os` returns code 4 | Firmware update already running | FM-FW-01 — Concurrent update attempt |
| `set_os` returns code 8 | Insufficient flash | FM-FW-02 — Flash exhausted |
| `set_os` returns code 9 | URL or certificate file not found | FM-FW-03 — Firmware source unreachable |
| `set_os` returns code 13 | Update started then failed mid-process | RP-06 — Recover from failed firmware update |
| `set_os` returns code 14 | Battery too low | FM-FW-04 — Battery-low gate |
| `reboot` returns code 5 | Inventory active | RP-04 — Stop inventory cleanly |
| `reboot` returns code 1 instead of 0 | Schema-vs-example discrepancy | MM-04 — reboot code 1 is acceptance, not failure |

### Connection and observation

| Symptom | Likely cause | Go to |
|---|---|---|
| No `mqttConnEVT` after reconnect | `MGMT_EVT` endpoint missing or `eventConfiguration` not enabling network events | FM-EVT-01 — Connection events not routed |
| `mqttConnEVT.timestamp` parser failing | Format is `HH:MM:SS`, not ISO 8601 | MM-05 — mqttConnEVT timestamp quirk |
| Heartbeats stop arriving | Reader offline (broker may still show connected) | RP-07 — Diagnose silent-offline state |
| Heartbeat `inventoryStatus` block missing | `heartbeatConfiguration.inventoryStatus: false` | FM-EVT-02 — Heartbeat verbosity |
| `alert_short` arriving but `alerts` not | Endpoint routing; they're separate streams | FM-EVT-03 — Two alert variants, two routes |

### TLS, certificates, network

| Symptom | Likely cause | Go to |
|---|---|---|
| TLS handshake fails | `verificationType` mismatch; cert chain incomplete | FM-SEC-01 — TLS verification mismatch |
| `MQTT_INSTALL_CERTIFICATE_FAIL` | Certificate file invalid or missing | FM-SEC-02 — Certificate install failure |
| Wi-Fi connects then drops | Enterprise auth: missing or expired cert chain | FM-NET-04 — Wi-Fi Enterprise auth |
| Cert install succeeds but TLS still fails | Cert installed under wrong logical name | FM-SEC-03 — Logical name mismatch |

### Fleet and drift

| Symptom | Likely cause | Go to |
|---|---|---|
| One reader's configuration differs from canonical | Local operator edit; failed `set_config` push | RP-08 — Reconcile drift |
| Operating mode lost after reboot | Expected; radio-operation config doesn't survive reboot | MM-06 — Persistence asymmetry |
| Fleet-wide firmware update failed on some readers | Mixed firmware/hardware; battery-low gate | RP-09 — Stagger and retry rollout |
| Two readers fight over same serial number | Should not happen; serial is unique. Check device labelling | FM-FLEET-01 — Identity collision |

### Bipartite-specific (RFD40 Standard) 🅑

| Symptom | Likely cause | Go to |
|---|---|---|
| `terminalConnection.status: DISCONNECTED` | Bluetooth link to host lost | FM-DEV-01 — BT bridge dropped |
| Host bridges to broker but reader silent | Host's MQTT client mis-wired | FM-DEV-02 — Bridge routing |
| Reader works from Bipartite host but not when host moves | Bluetooth range; AP isolation | FM-DEV-03 — Mobility breaks bridge |

### Catch-all

| Symptom | Go to |
|---|---|
| I copied a payload from a tutorial and it's not working | [Things people get wrong about IOTC](/reference/diagnose/misconceptions) |
| Something is unexpectedly slow | [What happens when the network drops](/fleet/reliability/retention-retry) |
| The reader feels stuck | Run `get_status` first; check `radioActivity`, `radioConnection` |
| I am sure I have the right payload | Log what you publish; compare to `mqtt-api-reference/<command>.md` |

---

The numbered FM and RP identifiers are stable, they don't change as new chapters are added. Bookmark a frequently-hit ID directly.

### Limits

- It does not explain *why*. For that, follow the link.
- It does not diagnose. For that, run `get_status` and read what comes back.
- It is not exhaustive. If your symptom isn't listed, file an issue against the docs, your symptom may be the next entry.

**Related:** 📘 [Where things fail](/reference/diagnose/two-edges) · 📙 [Playbooks for getting back online](/reference/diagnose/recovery-playbooks) · 📘 [Things people get wrong about IOTC](/reference/diagnose/misconceptions)
