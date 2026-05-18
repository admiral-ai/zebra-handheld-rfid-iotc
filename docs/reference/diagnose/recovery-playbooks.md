---
id: recovery-playbooks
title: Playbooks for getting back online
sidebar_label: Playbooks for getting back online
---

> 📙 **HOW-TO** · Audience: All personas in incident response · Read time: ~10 min

Six recovery playbooks. Each is a tested sequence of steps that bring a failing sled back to a known-good state. Pick the playbook that matches your situation.

### RP-01: Recover lost connectivity

The sled is no longer reaching the broker.

1. Confirm sled power and physical condition. Press the trigger and observe LED feedback.
2. On Path A, open 123RFID Desktop, connect over USB, and verify Wi-Fi association in *Configure → Communication → Wi-Fi*. On Path B, confirm that host-sled Bluetooth pairing is still active.
3. From the broker side, watch for `mqttConnEVT`. If silent for 10 minutes or more, suspect endpoint configuration. Verify that `url`, `port`, and `tenantId` match the broker's expectation.
4. If still silent, reboot the sled. Stop any active inventory first.
5. Watch for `mqttConnEVT.CONNECTED`. Run the reconcile protocol: `get_status`, then `get_config`, then `get_operating_mode`.

### RP-02: Recover from configuration drift

A sled's saved configuration differs from your canonical configuration source of truth.

1. Snapshot the current state with `get_config`. Store as baseline.
2. Compute the diff against canonical.
3. If reboot-required fields differ, schedule a maintenance window. Push `set_config` with the canonical `configData`, then reboot (after stopping inventory).
4. If only runtime fields differ, push and apply at runtime. No reboot is needed.
5. Re-run `get_config` and confirm a match.
6. Document the reconciliation.

### RP-03: Re-add a missing or corrupt endpoint configuration

A sled's endpoint configuration disappeared (FM-CFG-03) or is wrong.

1. Run `get_endpoint_config` for each expected endpoint name.
2. Identify missing or misconfigured entries.
3. Call `config_endpoint` with `operation: ADD` for missing entries, or `MODIFY` for misconfigured entries.
4. Set `activate: true`. Reboot if the endpoint is new.
5. Confirm via a fresh `get_endpoint_config`.
6. Watch for `mqttConnEVT.CONNECTED` on the new connection.

### RP-04: Roll back from a failed firmware update

A `firmwareUpdateEVT.status: FAILED` is observed, or a post-update `get_version` does not match expectations.

1. List the sleds that failed. Group by current firmware version (`get_version`).
2. Stage the previous firmware image on a file server reachable from the sleds.
3. For each sled, stop any active inventory first using `control_operation` with `operation: stop`.
4. Issue `set_os` pointing at the previous image. The same operation rolls forward and back.
5. Watch for `mqttConnEVT.CONNECTED` post-reboot. Confirm that `get_version` matches the target.
6. If a sled is unreachable over MQTT after the rollback attempt, recover via 123RFID Desktop over USB.

> **Constraint.** The `reboot` operation, and by extension the apply phase of `set_os`, is rejected with error code 5 during active inventory. Always stop the inventory first.

### RP-05: Free the phantom `RF90_DATA_BROKER` slot

This applies exactly once per sled, when migrating from the MDM hybrid endpoint to a dedicated DATA endpoint.

Factory-fresh RFD40 and RFD90 sleds ship with a hidden, pre-configured endpoint named `RF90_DATA_BROKER`. It occupies one of the two available DATA-pipe slots. Trying to add a new DATA endpoint without removing this phantom first fails with a slot-exhaustion error.

1. Confirm the phantom exists. Call `get_endpoint_config` for `RF90_DATA_BROKER`.
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
4. The slot is freed. You may now call `config_endpoint` with `operation: ADD` for a real DATA endpoint.

### RP-06: Implement graceful degradation in the application

This is preventive design, not just a response after a failure.

1. Define degraded states for your application: `NO_HEARTBEAT`, `NO_RESPONSE`, `NO_DATA`.
2. For each state, choose a fallback. Options include caching last-known data, pausing writes, notifying the operator, or falling back to the host-side SDK on Path B.
3. Subscribe to `mqttConnEVT` and `alertsEVT.NETWORK_EVENT` to drive state transitions.
4. On recovery (a fresh `CONNECTED` event), run the reconcile protocol before resuming normal operation.

### Related

[Something's broken?](/reference/diagnose/symptom-index) · [Where things fail](/reference/diagnose/two-edges) · [Common misconceptions](/reference/diagnose/misconceptions) · [Updating firmware and rebooting](/infrastructure/management/system-operations) · [What happens when the network drops](/fleet/reliability/retention-retry).
