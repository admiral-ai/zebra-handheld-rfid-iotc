---
id: drift
title: How to detect and remediate configuration drift
sidebar_label: How to detect and remediate configuration drift
description: "Detect IOTC configuration drift across a fleet: periodic per-domain reads, diff against desired state, surface deltas, apply corrective writes."
---

> 📙 **HOW-TO** · **Audience:** Solution Builder · **Time:** ~30 min

This guide shows you how to detect and remediate configuration drift across a reader fleet.

### Store a golden configuration baseline

Maintain the desired configuration in version control. The golden config is the authoritative declaration of "what every reader should look like."

### Diff per-domain reads against the baseline

For each reader periodically (daily or hourly):

```python
def check_drift(serial):
    actual = read_surfaces(serial)   # get_endpoint_config, get_wifi, get_operating_mode
    baseline = load_golden_config()
    diff = compute_diff(actual, baseline)
    if diff:
        log_drift(serial, diff)
        if should_remediate(diff):
            remediate(serial, diff)
```

### Decide whether to remediate

Not every difference matters. A reader's connection quality fields drift naturally; a Wi-Fi profile difference is significant. Categorize fields:

- **Ignore drift** in: runtime telemetry fields (battery, temperature, connection state)
- **Alert on drift** in: certificate aliases, MDM endpoint
- **Auto-remediate drift** in: event-reporting config, default operating mode

### Auto-remediate

```python
def remediate(serial, diff):
    # Push a corrective write to each affected surface. For an endpoint diff:
    publish_command(serial, {
        "command": "config_endpoint",
        "requestId": f"drift-{serial}",
        "epConfig": build_ep_patch_from_diff(diff)
    })
    # Wi-Fi diffs go through set_wifi; operating-mode diffs through set_operating_mode.
```

### Fleet-wide compliance monitoring

Maintain a per-reader drift score over time. Dashboards highlight readers that drift repeatedly (indicating misconfiguration source) and readers whose drift was successfully remediated.

```d2
classes: {
  bad: { style: { fill: "#fce8e6"; stroke: "#d93025"; font-color: "#c5221f" } }
}
direction: right
GC: "Golden config\n(version control)" { shape: cylinder }
CMP: Comparison engine
fleet: Fleet {
  R1: "Reader 1\nget_endpoint_config"
  R2: "Reader 2\nget_endpoint_config"
  Rn: "Reader N\nget_endpoint_config"
}
DR: Drift report
DB: Drift database { shape: cylinder }
DASH: Dashboard
ALT: Alert on threshold { class: bad }
GC -> CMP
fleet.R1 -> CMP
fleet.R2 -> CMP
fleet.Rn -> CMP
CMP -> DR
DR -> DB
DB -> DASH
DB -> ALT

```

**Related:** 📘 [Keeping a fleet in sync](/fleet/bulk-management) · 📙 [Automation](/fleet/provisioning/automation)
