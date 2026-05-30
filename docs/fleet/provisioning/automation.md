---
id: automation
title: How to automate provisioning workflows
sidebar_label: How to Automate Provisioning Workflows
description: "Automate IOTC provisioning beyond 123RFID Desktop: scripted per-domain config after first-light, MDM template push, CI-driven smoke tests."
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
    golden = load_golden_config()  # {epConfig, wifiConfig, operatingMode}
    publish_command(serial, {
        "command": "config_endpoint",
        "requestId": f"prov-{serial}",
        "epConfig": golden["epConfig"]
    })
    # follow with set_wifi and set_operating_mode as the golden config requires
```

### Step 3: Verify

```python
def verify(serial):
    publish_command(serial, {"command": "get_endpoint_config", "command_id": f"verify-{serial}"})
    # Match response against the golden endpoint config
```

### Step 4: Promote to production fleet

After successful verification: tag the serial in your fleet database, route the reader to its production broker (if using separate brokers), and apply group memberships.

### Step 5: CI/CD integration

Store the golden config in version control. Build a CI pipeline that, on push to `main`:

1. Validates the golden config against your declared schema.
2. Tests it against a canary reader in a lab environment.
3. Promotes to production for the next round of provisioning.

```d2
direction: right
Push: git push to main
CI: CI pipeline
V: Validate config schema
Build: Build artifact
SOTI: SOTI Connect API
fleet: Target Readers {
  R1: Reader 1
  R2: Reader 2
  Rn: Reader N
}
Mon: Monitor mqttConnEVT
Rep: Rollout report
Push -> CI
CI -> V
V -> Build
Build -> SOTI
SOTI -> fleet.R1
SOTI -> fleet.R2
SOTI -> fleet.Rn
fleet.R1 -> Mon
Mon -> Rep

```

**Related:** 📕 [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) · 📕 [mqttConnEVT](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#tag-mqttconnevt) · 📘 [Keeping a fleet in sync](/fleet/bulk-management)
