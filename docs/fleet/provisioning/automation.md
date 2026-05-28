---
id: automation
title: How to automate provisioning workflows
sidebar_label: How to Automate Provisioning Workflows
description: "Automate IOTC provisioning beyond 123RFID Desktop / Mobile: scripted set_config after first-light, MDM template push, CI-driven smoke tests."
---

> 📙 **HOW-TO** · **Audience:** Solution Builder · **Time:** ~60 min for first build

This guide shows you how to automate the provisioning of new readers as they come online.

### Step 1: Detect new readers via `mqttConnEVT`

Subscribe to a fleet-wide wildcard and watch for `mqttConnEVT` from previously-unknown serial numbers:

```python
known_serials = load_known_serials()

def on_mqtt_conn_evt(topic, payload):
    serial = extract_serial(topic)
    if serial not in known_serials:
        provision(serial)
        known_serials.add(serial)
```

### Step 2: Apply initial configuration

```python
def provision(serial):
    golden_config = load_golden_config()  # shaped as {wifiConfig?, epConfig?, applyAfterReboot?}
    publish_command(serial, {
        "command": "set_config",
        "requestId": f"prov-{serial}",
        "configData": golden_config
    })
```

### Step 3: Verify

```python
def verify(serial):
    publish_command(serial, {"command": "get_config", "command_id": f"verify-{serial}"})
    # Match response against golden_config
```

### Step 4: Promote to production fleet

After successful verification: tag the serial in your fleet database, route the reader to its production broker (if using separate brokers), and apply group memberships.

### Step 5: CI/CD integration

Store the golden config in version control. Build a CI pipeline that, on push to `main`:

1. Validates the golden config against the schema in [Config schema](/reference/appendices/config-schema).
2. Tests it against a canary reader in a lab environment.
3. Promotes to production for the next round of provisioning.

```d2
direction: right
Push: git push to main
CI: CI pipeline
V: Validate config schema
Build: Build artifact
SOTI: SOTI Connect API
R1: Reader 1
R2: Reader 2
Rn: Reader N
Mon: Monitor mqttConnEVT
Rep: Rollout report
Push -> CI
CI -> V
V -> Build
Build -> SOTI
SOTI -> R1
SOTI -> R2
SOTI -> Rn
R1 -> Mon
Mon -> Rep
```

**Related:** 📕 [set_config / get_config](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) · 📕 [mqttConnEVT](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#tag-mqttconnevt) · 📙 [Apply Bulk Configuration](/fleet/management/apply-config)
