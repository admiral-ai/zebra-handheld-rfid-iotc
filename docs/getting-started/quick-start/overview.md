---
id: overview
title: Your first 30 minutes
sidebar_label: Your first 30 minutes
---

> 📗 **TUTORIAL** · Audience: New Integrator · Time: ~45 min (full chapter)

In this Quick Start, we will connect a handheld reader to a broker, configure it, and read our first tags — in under one hour.

### Prerequisites

- A reader bootstrapped per [§4.3](/getting-started/prerequisites/bootstrap). After bootstrap, the reader has its **MDM endpoint** configured.
- For this tutorial we will use the MDM endpoint for everything (the simplest path). In production deployments, you would typically `config_endpoint` to add dedicated `MGMT`, `CTRL`, and `DATA1` endpoints for traffic isolation.
- IOTC credentials per [§4.2](/getting-started/prerequisites/credentials).
- `mosquitto_pub` and `mosquitto_sub` installed locally.

### The path

We will work through six steps, using the MDM endpoint's pre-configured publish and subscribe topics. The reader's MDM publish topic typically follows the source convention `MDM/clients/event` (and similar); your specific values are visible via `get_endpoint_config` on the MDM endpoint.

1. Connect to the broker
2. Discover the reader (`get_version`)
3. Subscribe to the data stream
4. Set the operating mode (`set_operating_mode` with `BALANCED_PERFORMANCE` profile)
5. Start a read (`control_operation` `START`)
6. Stop the read (`control_operation` `STOP`)

**Related:** 📘 [§3.2 Topic Hierarchy](/foundations/mqtt/topic-hierarchy) · 📕 [§4.1 Requirements](/getting-started/prerequisites/requirements) · 📗 [§4.3 Bootstrap](/getting-started/prerequisites/bootstrap)
