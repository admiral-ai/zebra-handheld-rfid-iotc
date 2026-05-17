---
id: models
title: About Provisioning Models
sidebar_label: About Provisioning Models
---

> 📘 **EXPLANATION** · Audience: Solution Builder, Fleet Operator · Read time: ~5 min

Three provisioning approaches are available for handheld reader fleets. The right choice depends on fleet size and operational policy — not technical capability.

### Manual provisioning (123RFID Desktop)

One reader at a time, over USB, using the 123RFID Desktop utility. Used for the initial bootstrap of any reader (region setting is exclusively available here). Suited for development, evaluation, and very small deployments.

### MDM-managed (SOTI Connect)

Zero-touch provisioning. New readers, on first boot, contact the MDM endpoint set during initial bootstrap and receive their configuration from SOTI Connect. No per-device manual intervention after the bootstrap. Suited for enterprise fleets of dozens to thousands.

### Hybrid

123RFID Desktop for initial bootstrap (region, Wi-Fi, MDM endpoint) — once per device, by whoever assembles the deployment kit. Then MQTT-based configuration via `set_config` for runtime settings. The MDM layer may or may not be used. Suited for deployments where SOTI is not in scope but bulk MQTT-based configuration is acceptable.

[DIAGRAM: D-13.1.A — three models side-by-side: process flow per model]

### Choosing a model

| Fleet size | Recommended model |
|---|---|
| 1–5 readers | Manual |
| 5–50 readers | Hybrid |
| 50+ readers | MDM-managed |

The thresholds are operational, not technical. A 200-reader fleet can be provisioned manually; it just isn't pleasant.

**Related:** 📗 [§4.3 123RFID Bootstrap Tutorial](/getting-started/prerequisites/bootstrap) · 📙 [§13.2 SOTI Provisioning](/fleet/provisioning/soti-connect) · 📙 [§13.3 Bulk 123RFID](/fleet/provisioning/bulk-123rfid) · 📙 [§13.4 Automation](/fleet/provisioning/automation)
