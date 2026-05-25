---
id: symptom-index
title: Something's broken?
sidebar_label: Something's broken?
---

> 🩺 **FAILURE MODE INDEX** · **Audience:** All personas in incident response · **Use:** symptom-first lookup

Pick the symptom that matches what you are actually seeing. Each row links to a failure-mode (FM) page, a recovery playbook (RP), or a misconception (MM). If your symptom is not listed, scan the alphabetical list; the closest neighbour is usually informative.

### Bootstrap and first connection

| Symptom | Likely cause | Go to |
|---|---|---|
| 123RFID Desktop can't find my sled | USB cable is charge-only; sled is asleep; Bluetooth disabled | [RP-01: Connect a sled to 123RFID Desktop](/reference/diagnose/recovery-playbooks#rp-01) |
| Wi-Fi associates but sled doesn't reach the broker | DNS, routing, firewall on the sled's segment | [FM-NET-01: Network path between sled and broker](/reference/diagnose/failure-modes#fm-net-01) |
| MDM endpoint configured but no broker connection | Wrong credentials, wrong port, broker not accepting client | [FM-NET-02: MDM endpoint won't connect](/reference/diagnose/failure-modes#fm-net-02) |
| No MQTT command works after bootstrap | MDM endpoint isn't active | [RP-02: Activate the bootstrap MDM endpoint](/reference/diagnose/recovery-playbooks#rp-02) |
| Reader connects then disconnects in a loop | Authentication mismatch; broker ACL rejects topic | [FM-NET-03: Reconnect loop](/reference/diagnose/failure-modes#fm-net-03) |

### Commands and responses

| Symptom | Likely cause | Go to |
|---|---|---|
| [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) returns no response | Wrong publish topic; subscriber on wrong response topic | [RP-03: Verify topic routing](/reference/diagnose/recovery-playbooks#rp-03) |
| Command returns "unknown field" error | OpenAPI-style payload with extra `params` wrapper | [MM-01: The OpenAPI rendering is not the payload](/reference/diagnose/misconceptions#mm-01) |
| `config_endpoint add` returns code 10 | Endpoint name already exists | [FM-CFG-01: Endpoint name collision](/reference/diagnose/failure-modes#fm-cfg-01) |
| [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) returns code 25 or 26 | Too many publish topics or subscribe topics | [FM-CFG-02: Topic count caps](/reference/diagnose/failure-modes#fm-cfg-02) |
| [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) returns code 11 | Inventory currently running | [RP-04: Stop inventory cleanly](/reference/diagnose/recovery-playbooks#rp-04) |
| [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) returns code 22 | `ADVANCED` profile selected without `advancedConfigurations` | [FM-CFG-03: Advanced profile incomplete](/reference/diagnose/failure-modes#fm-cfg-03) |
| [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) returns code 23 | Invalid enum value (often `FAST_READ`) | [MM-02: FAST_READ is not a usable profile](/reference/diagnose/misconceptions#mm-02) |

### Inventory

| Symptom | Likely cause | Go to |
|---|---|---|
| `control_operation START` returns code 11 | Inventory already running | [FM-OPS-01: Inventory state mismatch](/reference/diagnose/failure-modes#fm-ops-01) |
| `control_operation STOP` returns code 12 | Inventory not running | (Not a failure; code 12 is idempotent confirmation) |
| [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) returns code 23 | Lowercase `start` / `stop` instead of `START` / `STOP` | [MM-03: Enum casing varies by command](/reference/diagnose/misconceptions#mm-03) |
| Start succeeds but no `dataEVT` events arrive | DATA endpoint inactive; post-filter excludes everything; FAST_READ profile | [RP-05: Tag data not flowing](/reference/diagnose/recovery-playbooks#rp-05) |
| `dataEVT` arrives but missing expected fields | `tagMetaDataToEnable` not configured; `reportFilter duration > 0` strips some fields | [FM-DATA-01: Missing metadata fields](/reference/diagnose/failure-modes#fm-data-01) |
| Only same EPC repeated; no other tags | Tag population, antenna orientation, session choice | [FM-OPS-02: Single-tag dominance](/reference/diagnose/failure-modes#fm-ops-02) |

### Firmware and reboot

| Symptom | Likely cause | Go to |
|---|---|---|
| [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) returns code 4 | Firmware update already running | [FM-FW-01: Concurrent update attempt](/reference/diagnose/failure-modes#fm-fw-01) |
| [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) returns code 8 | Insufficient flash | [FM-FW-02: Flash exhausted](/reference/diagnose/failure-modes#fm-fw-02) |
| [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) returns code 9 | URL or certificate file not found | [FM-FW-03: Firmware source unreachable](/reference/diagnose/failure-modes#fm-fw-03) |
| [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) returns code 13 | Update started then failed mid-process | [RP-06: Recover from failed firmware update](/reference/diagnose/recovery-playbooks#rp-06) |
| [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) returns code 14 | Battery too low | [FM-FW-04: Battery-low gate](/reference/diagnose/failure-modes#fm-fw-04) |
| [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) returns code 5 | Inventory active | [RP-04: Stop inventory cleanly](/reference/diagnose/recovery-playbooks#rp-04) |
| [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) returns code 1 instead of 0 | Schema-vs-example discrepancy | [MM-04: reboot code 1 is acceptance, not failure](/reference/diagnose/misconceptions#mm-04) |

### Connection and observation

| Symptom | Likely cause | Go to |
|---|---|---|
| No `mqttConnEVT` after reconnect | `MGMT_EVT` endpoint missing or `eventConfiguration` not enabling network events | [FM-EVT-01: Connection events not routed](/reference/diagnose/failure-modes#fm-evt-01) |
| `mqttConnEVT.timestamp` parser failing | Format is `HH:MM:SS`, not ISO 8601 | [MM-05: mqttConnEVT timestamp is not ISO 8601](/reference/diagnose/misconceptions#mm-05) |
| Heartbeats stop arriving | Reader offline (broker may still show connected) | [RP-07: Diagnose silent-offline state](/reference/diagnose/recovery-playbooks#rp-07) |
| Heartbeat `inventoryStatus` block missing | `heartbeatConfiguration.inventoryStatus: false` | [FM-EVT-02: Heartbeat verbosity](/reference/diagnose/failure-modes#fm-evt-02) |
| `alert_short` arriving but `alerts` not | Endpoint routing; they're separate streams | [FM-EVT-03: Two alert variants, two routes](/reference/diagnose/failure-modes#fm-evt-03) |

### TLS, certificates, network

| Symptom | Likely cause | Go to |
|---|---|---|
| TLS handshake fails | `verificationType` mismatch; cert chain incomplete | [FM-SEC-01: TLS verification mismatch](/reference/diagnose/failure-modes#fm-sec-01) |
| `MQTT_INSTALL_CERTIFICATE_FAIL` | Certificate file invalid or missing | [FM-SEC-02: Certificate install failure](/reference/diagnose/failure-modes#fm-sec-02) |
| Wi-Fi connects then drops | Enterprise auth: missing or expired cert chain | [FM-NET-04: Wi-Fi Enterprise auth failure](/reference/diagnose/failure-modes#fm-net-04) |
| Cert install succeeds but TLS still fails | Cert installed under wrong logical name | [FM-SEC-03: Logical name mismatch](/reference/diagnose/failure-modes#fm-sec-03) |

### Fleet and drift

| Symptom | Likely cause | Go to |
|---|---|---|
| One reader's configuration differs from canonical | Local operator edit; failed [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) push | [RP-08: Reconcile drift](/reference/diagnose/recovery-playbooks#rp-08) |
| Operating mode lost after reboot | Expected; radio-operation config doesn't survive reboot | [MM-06: Not all configuration survives reboot](/reference/diagnose/misconceptions#mm-06) |
| Fleet-wide firmware update failed on some readers | Mixed firmware/hardware; battery-low gate | [RP-09: Stagger and retry rollout](/reference/diagnose/recovery-playbooks#rp-09) |
| Two readers fight over same serial number | Should not happen; serial is unique. Check device labelling | [FM-FLEET-01: Identity collision](/reference/diagnose/failure-modes#fm-fleet-01) |

### Bridged-specific (RFD40 Standard) 🅑

| Symptom | Likely cause | Go to |
|---|---|---|
| `terminalConnection.status: DISCONNECTED` | Bluetooth link to host lost | [FM-DEV-01: BT bridge dropped](/reference/diagnose/failure-modes#fm-dev-01) |
| Host bridges to broker but reader silent | Host's MQTT client mis-wired | [FM-DEV-02: Bridge routing](/reference/diagnose/failure-modes#fm-dev-02) |
| Reader works from Bridged host but not when host moves | Bluetooth range; AP isolation | [FM-DEV-03: Mobility breaks bridge](/reference/diagnose/failure-modes#fm-dev-03) |

### Catch-all

| Symptom | Go to |
|---|---|
| I copied a payload from a tutorial and it's not working | [Things people get wrong about IOTC](/reference/diagnose/misconceptions) |
| Something is unexpectedly slow | [What happens when the network drops](/fleet/reliability/retention-retry) |
| The reader feels stuck | Run [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status) first; check `radioActivity`, `radioConnection` |
| I am sure I have the right payload | Log what you publish; compare to `mqtt-api-reference/<command>.md` |

---

The numbered FM, RP, and MM identifiers are stable; they don't change as new chapters are added. Bookmark a frequently-hit ID directly.

### Limits

- It does not explain *why*. For that, follow the link.
- It does not diagnose. For that, run [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status) and read what comes back.
- It is not exhaustive. If your symptom isn't listed, file an issue against the docs; your symptom may be the next entry.

**Related:** 🩺 [Failure modes](/reference/diagnose/failure-modes) · 📘 [Where things fail](/reference/diagnose/two-edges) · 📙 [Playbooks for getting back online](/reference/diagnose/recovery-playbooks) · 📘 [Things people get wrong about IOTC](/reference/diagnose/misconceptions)
