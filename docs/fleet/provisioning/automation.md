---
id: automation
title: How to Automate Provisioning Workflows
sidebar_label: How to Automate Provisioning Workflows
---

> 📙 **HOW-TO** · Audience: Solution Builder · Time: ~60 min for first build

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
    golden_config = load_golden_config()
    publish_command(serial, {
        "command": "set_config",
        "command_id": f"prov-{serial}",
        "data": golden_config
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

1. Validates the golden config against the schema in [§20.1](/reference/appendices/config-schema).
2. Tests it against a canary reader in a lab environment.
3. Promotes to production for the next round of provisioning.

[DIAGRAM: D-13.4.A. automated enrollment pipeline]

**Related:** 📕 [§16.2 set_config / get_config](#chapter-16--mqtt-api-reference) · 📕 [§16.6 mqttConnEVT](#chapter-16--mqtt-api-reference) · 📙 [§14.3 Apply Bulk Configuration](/fleet/management/apply-config)
