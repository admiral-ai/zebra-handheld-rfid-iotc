---
id: config-document
title: The reader's configuration document
sidebar_label: The reader's configuration document
---

> 📘 **EXPLANATION** · **Audience:** Solution Builder, Fleet Operator · **Read time:** ~7 min · **Ties to:** Device Configuration sub-tag of the API Reference

:::tip[See in the API Reference]
Sub-tag: Device Configuration. Operations: [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) · [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config).
:::

The reader's "configuration document" is the runtime view of every adjustable property that is not radio-operating-mode and not endpoint configuration. Network behavior, batching, retention, event thresholds, daylight-saving, NTP, default operating-mode profile, all of this lives in the configuration document. Two operations read and write it: [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) and [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config).

### The asymmetry

[`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) returns a **comprehensive snapshot** of the device's adjustable state. It is a wide read.

[`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) accepts a **narrow writeback**, you can update one or a few fields at a time without re-supplying the whole document. Fields you omit retain their current value.

This asymmetry is the entire mental model of the configuration document. Think of [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) as "show me everything" and [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) as "change exactly these." Production drift detection compares a stored canonical config against what [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) returns now; production reconciliation pushes only the diffing fields via [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config).

### Three persistence scopes

| Scope | Persists across | Set how |
|---|---|---|
| **Factory** | A factory reset wipes everything else; only factory defaults remain. | Cannot be changed. |
| **Saved** | Reboot. The reader replays the saved configuration on every boot. | [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) writes here when `persist: true`, or implicitly per the per-field default. |
| **Runtime** | Power cycle. Discarded on reboot. | [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) with `persist: false` (where supported), or fields the schema marks runtime-only. |

The persistence rule that surprises most teams: **all management-plane configurations survive [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot). Only radio-operating-mode state from the control endpoint is lost.** So if you set a Wi-Fi profile, install certificates, configure endpoints, and adjust retention thresholds, all of it is still there after a reboot. If you set an operating mode and start an inventory, only the inventory-running state is lost.

### Drift and reconciliation

In a managed fleet, the MDM platform (or your own controller) maintains a **canonical configuration per device class** — what every RFD40 Premium *should* look like. Two readers can drift from canonical:

- **Local edits**: somebody connected via 123RFID Desktop and changed a setting on one device.
- **Failed pushes**, a [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) failed partway through; the device has the old values where the new ones should be.

The reconciliation pattern:

1. Pull current state with [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) on a schedule (commonly every heartbeat, or on-demand).
2. Diff against the canonical configuration.
3. For each differing field, push with [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config).
4. Re-pull and verify.

The cost of the wide read is amortised across many fields; the precision of the narrow write avoids overwriting fields you didn't intend to change.

### Where related surfaces live

The configuration document does **not** contain:

- **Endpoints**, those live in their own surface, addressed by [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) / [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config). See [How the MQTT plumbing fits together](/infrastructure/endpoints/about).
- **Operating mode**, that's [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) / [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode). See [Choose how the reader reads tags](/rfid/operating-mode/profiles).
- **Event configuration**: [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) is a separate operation, even though event configuration appears nested in [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) payloads as well. See [Choose what the reader tells you](/observability/events/configure).
- **Certificates**: [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) / [`get_installed_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-installed-certificate) / [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate). See [Securing the connection](/infrastructure/security/model).

This separation is intentional. The configuration document is for *device-wide adjustable state*; the other surfaces are for *roles that have their own lifecycle*.

### Worked example: change batching threshold

A [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) payload that adjusts only the tag-data batching count:

```json
{
  "command": "set_config",
  "requestId": "cfg-batch-001",
  "config": {
    "dataConfiguration": {
      "batching": {
        "tagCount": 50
      }
    }
  }
}
```

Every field not listed retains its current value. The response carries `response.code: 0` on success; error codes vary by what was attempted (see `mqtt-api-reference/set_config.md`).

### When to fetch instead of cache

A common application bug is to cache [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) output and apply diffs to the cache. **Don't.** Drift can happen from many directions — another operator, an MDM push, a reboot that re-applied a saved config. Always read fresh before computing a diff. The right pattern is:

```
current = get_config()
target  = canonical_for(serial)
diff    = target - current
if diff:
    set_config(diff)
    verify = get_config()
    assert verify matches target
```

The verify step costs one extra read but catches the case where [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-config) silently failed on a subset of fields.

### Out of scope

- **[`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events) and event-flag configuration**, that surface has its own chapter at [Choose what the reader tells you](/observability/events/configure).
- **Bulk reconciliation across fleets**: [Keeping a fleet in sync](/fleet/management/about-bulk).
- **Firmware updates**: [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) is part of [Updating firmware and rebooting](/infrastructure/management/system-operations), not the configuration document.

**Related:** 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📘 [Choose what the reader tells you](/observability/events/configure) · 📘 [Keeping a fleet in sync](/fleet/management/about-bulk) · 📕 [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`set_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
