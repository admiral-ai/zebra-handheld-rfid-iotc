---
id: recovery-playbooks
title: Playbooks for getting back online
sidebar_label: Playbooks for getting back online
---

> 📙 **HOW-TO** · **Audience:** All personas in incident response · **Time:** ~10 min per playbook

Nine recovery playbooks. Each is a tested sequence of steps that brings a failing sled back to a known-good state. Pick the playbook that matches your situation. Run each step; verify the success check; move on.

### RP-01: Connect a sled to 123RFID Desktop {#rp-01}

**When:** 123RFID Desktop can't find your sled.

1. Confirm the USB-C cable is data-capable (not charge-only). Many cheap cables are charge-only; substitute a known-good cable.
2. Power-cycle the sled (hold trigger + power for 5 s).
3. Confirm Bluetooth is enabled on the laptop if discovering wirelessly.
4. Restart 123RFID Desktop.
5. **Success check:** the sled appears in the Discovery view with its serial number and current firmware.

### RP-02: Activate the bootstrap MDM endpoint {#rp-02}

**When:** Phase 2 of Quick Start completed but no MQTT command works.

1. Open 123RFID Desktop, connect to the sled.
2. In the Endpoints tab, locate the MDM endpoint. Confirm `activate: true`.
3. Verify the broker URL, port, protocol match what was reachable in Phase 1.
4. Save and re-activate. The sled may reboot.
5. Watch broker logs for an incoming connection from the sled's IP.
6. **Success check:** subscribe to `<tenantId>/MDM/#` and see at least one publish from the sled.

### RP-03: Verify topic routing {#rp-03}

**When:** [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) (or any command) returns no response within 5 s.

1. Confirm the publish topic exactly: `<tenantId>/MDM/clients/cmnd/<deviceSerialNumber>`. The reader subscribes to *this exact form*; off-by-one fails silently.
2. With `mosquitto_sub -t '#' -v`, subscribe to everything. Re-publish the command.
3. Find which topic the response arrives on. Update your subscriber to use that exact topic.
4. If still no response, run [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) on the MDM endpoint to confirm `publishTopics` matches what you expect.
5. **Success check:** [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) returns within 5 s, with `requestId` matching.

### RP-04: Stop inventory cleanly {#rp-04}

**When:** Any operation returning code 5 or 11 ("inventory in progress" or "can't reboot during inventory").

1. Publish [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) with `ctrlOprPayload: { controlType: "RFID", operation: "STOP" }`.
2. Wait for the response. Code 0 = stopped; code 12 = already stopped (also fine).
3. Confirm with [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status) — `deviceStatus.radioActivity` should be `INACTIVE`.
4. Retry the original operation.
5. **Success check:** the original operation returns code 0.

### RP-05: Tag data not flowing {#rp-05}

**When:** `control_operation START` returned code 0, but no `dataEVT` arrives.

1. Run [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode). Confirm `profiles` is one of the five supported values, **not `FAST_READ`** (not currently supported).
2. Run [`get_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-post-filter) on the active data endpoint. Look for `reportOperation: EXCLUDE` rules that may be filtering all tags.
3. Run [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config). Confirm the DATA1 (or active data) endpoint has `activate: true` and a `publishTopics` entry.
4. Subscribe to `<tenantId>/DATA1/#` (or the active data topic) with a wildcard. Move tags into the read zone.
5. **Success check:** `dataEVT` events stream past with `data.tagData[].EPCid` matching your tags.

### RP-06: Recover from failed firmware update {#rp-06}

**When:** [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) returned code 13 (Firmware update Failed) or the update appeared to start but didn't complete.

1. Run [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version). The reader may have rolled back to the previous firmware automatically; verify which version is active now.
2. Run [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status). Confirm `batteryStatus.chargePercentage` ≥ 50 and `powerSource` is `WALLCHARGER` or `USB` — battery-low gates firmware updates.
3. Confirm flash space — [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) returns code 8 if insufficient flash. If unsure, [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) to reduce retention buffer to a smaller value temporarily.
4. Verify the firmware URL is reachable from the sled's network — try downloading it from the sled's Wi-Fi segment.
5. Re-issue [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) with the same URL.
6. Watch `alert_short` for `FIRMWARE_DOWNLOAD_*` and `FIRMWARE_UPDATE_*` events.
7. **Success check:** `FIRMWARE_UPDATE_SUCCESS` alert_short. Then [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) confirms the new firmware.

### RP-07: Diagnose silent-offline state {#rp-07}

**When:** Heartbeats stop arriving but the broker still shows the reader connected.

1. Try a [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-status). If it times out, the reader is unreachable.
2. Check `mqttConnEVT` history — was there a DISCONNECTED event that you missed?
3. Inspect broker-side metrics, most brokers expose last-seen-message timestamps per client.
4. Wait for the keep-alive interval (default 5 min). The broker should issue an LWT-style disconnect by then.
5. If the reader is genuinely stuck, physically reset (hold trigger + power for 10 s, or remove battery for sleds that allow it).
6. **Success check:** heartbeats resume; `mqttConnEVT` shows CONNECTED.

### RP-08: Reconcile drift {#rp-08}

**When:** A reader's configuration differs from the canonical for its class.

1. Run [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config), capture the snapshot.
2. Run [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config), capture the endpoint list.
3. Run [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode) (note: this is *expected* to differ after every reboot — radio-operation state doesn't persist).
4. Diff each against canonical. For each differing field that *should* be persistent, push with the relevant `set_*` operation.
5. Re-read each surface; verify against canonical.
6. If the diff persists after reconcile, escalate, this implies the local change is overriding the push, possibly via 123RFID Desktop access.
7. **Success check:** every surface matches canonical, save for operating-mode (which is re-applied on every boot anyway).

### RP-09: Stagger and retry rollout {#rp-09}

**When:** Fleet-wide firmware update failed on some readers.

1. Identify which readers failed via `alert_short` `FIRMWARE_UPDATE_FAIL` events.
2. Group failures by reason — battery-low, flash-insufficient, firmware-source-unreachable have different fixes.
3. For battery-low readers (FM-FW-04): defer until charged; group them into a charging-station-mounted batch and retry.
4. For flash-insufficient (FM-FW-02): [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) to find what's consuming flash. Adjust retention buffer downward via [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config), then retry.
5. For source-unreachable (FM-FW-03): verify the firmware URL is reachable from the failing readers' Wi-Fi segment. Often a different segment than the successful readers'.
6. Re-issue [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) against the failed subset only.
7. **Success check:** `FIRMWARE_UPDATE_SUCCESS` alert_short events arrive for all targeted readers within a sensible window.

### Out of scope

- **Why the failures happened**: explanation belongs in the matching FM page or concept chapter.
- **Bridged-specific recovery**: covered in FM-DEV-* entries off the symptom index.
- **Recovery from regulatory-region misconfiguration**: requires factory reset + 123RFID Desktop reboot; out of scope for routine recovery.

**Related:** 📘 [Something's broken?](/reference/diagnose/symptom-index) · 📘 [Where things fail](/reference/diagnose/two-edges) · 📘 [Things people get wrong about IOTC](/reference/diagnose/misconceptions)
