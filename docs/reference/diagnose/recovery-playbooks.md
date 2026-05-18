---
id: recovery-playbooks
title: Playbooks for getting back online
sidebar_label: Playbooks for getting back online
---

> 📙 **HOW-TO** · Audience: All personas in incident response · Read time: ~10 min

Six recovery playbooks. Each is a tested sequence of steps that bring a failing sled back to a known-good state. Pick the playbook that matches your situation.

---

### RP-01 — Recover lost connectivity

Use when the sled is no longer reaching the broker.

1. Confirm sled power and physical condition. Press the trigger; observe LED feedback.
2. **Path A:** open 123RFID Desktop, connect over USB, verify Wi-Fi association in *Configure → Communication → Wi-Fi*. **Path B:** confirm host-sled Bluetooth pairing is still active.
3. From the broker side, watch for `mqttConnEVT`. If silent for 10+ minutes, suspect endpoint configuration: verify `url`, `port`, `tenantId` match the broker's expectation.
4. If still silent, `reboot` the sled (after stopping any active inventory).
5. Watch for `mqttConnEVT.CONNECTED`. Run reconcile protocol: `get_status` → `get_config` → `get_operating_mode`.

---

### RP-02 — Recover from configuration drift

Use when a sled's saved configuration differs from your canonical configuration source of truth.

1. Snapshot current state with `get_config`. Store as baseline.
2. Compute diff vs canonical.
3. If reboot-required fields differ: schedule a window; push `set_config` with canonical `configData`; reboot (after stopping inventory).
4. If only runtime fields differ: push and apply at runtime; no reboot needed.
5. Re-run `get_config`; confirm match.
6. Document the reconciliation.

---

### RP-03 — Re-add a missing or corrupt endpoint configuration

Use when a sled's endpoint configuration disappeared (FM-CFG-03) or is wrong.

1. Run `get_endpoint_config` for each expected endpoint name.
2. Identify missing or misconfigured entries.
3. Call `config_endpoint` with `operation: ADD` (for missing) or `MODIFY` (for misconfigured).
4. Set `activate: true`. Reboot if the endpoint is new.
5. Confirm via fresh `get_endpoint_config`.
6. Watch for `mqttConnEVT.CONNECTED` on the new connection.

---

### RP-04 — Roll back from a failed `set_os` firmware update

Use when `firmwareUpdateEVT.status: FAILED` is observed or a post-update `get_version` does not match expectations.

1. List the sleds that failed. Group by current firmware version (`get_version`).
2. Stage the previous firmware image on a file server reachable from the sleds.
3. For each sled: stop any active inventory first (`control_operation` with `operation: stop`).
4. Issue `set_os` pointing at the previous image. Same operation rolls forward and back.
5. Watch for `mqttConnEVT.CONNECTED` post-reboot. Confirm `get_version` matches the target.
6. If a sled is unreachable over MQTT after the rollback attempt, recover via 123RFID Desktop over USB.

> **Constraint.** `reboot` (and by extension the apply phase of `set_os`) is rejected with error code 5 during active inventory. Always stop the inventory first.

---

### RP-05 — Free the phantom `RF90_DATA_BROKER` slot

Use exactly once per sled when migrating from the MDM hybrid endpoint to a dedicated DATA endpoint.

Factory-fresh RFD40 and RFD90 sleds ship with a hidden, pre-configured endpoint named `RF90_DATA_BROKER`. It occupies one of the two available DATA-pipe slots. Trying to add a new DATA endpoint without removing this phantom first fails with a slot-exhaustion error.

1. Confirm the phantom exists: `get_endpoint_config` for `RF90_DATA_BROKER`.
2. Send the delete:

   ```json
   {
     "command": "config_endpoint",
     "requestId": "delete_phantom_01",
     "epConfig": {
       "operation": "delete",
       "configuration": { "endpointName": "RF90_DATA_BROKER" }
     }
   }
   ```

3. Wait for `{"code": 0, "description": "Success"}`.
4. The slot is freed. You may now `config_endpoint` with `operation: ADD` for a real DATA endpoint.

---

### RP-06 — Implement graceful degradation in the application

Use as preventive design — not just after a failure.

1. Define degraded states for your application: `NO_HEARTBEAT`, `NO_RESPONSE`, `NO_DATA`.
2. For each state, choose a fallback: cache last-known data, pause writes, notify operator, fall back to the host-side SDK (Path B).
3. Subscribe to `mqttConnEVT` and `alertsEVT.NETWORK_EVENT` to drive state transitions.
4. On recovery (a fresh `CONNECTED` event), run the reconcile protocol before resuming normal operation.

**Related:** [Symptom Index](/reference/diagnose/symptom-index) · [The two physical edges](/reference/diagnose/two-edges) · [Common misconceptions](/reference/diagnose/misconceptions) · [System operations](/infrastructure/management/system-operations) · [Reliability, retention, retry](/fleet/reliability/retention-retry).
