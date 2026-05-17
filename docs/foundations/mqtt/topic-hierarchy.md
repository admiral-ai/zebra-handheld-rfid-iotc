---
id: topic-hierarchy
title: 3.2 About Topic Hierarchy & Naming Conventions
sidebar_label: 3.2 Topic Hierarchy
---

# About Topic Hierarchy & Naming Conventions

<div className="badge-explanation">EXPLANATION</div>

Every MQTT topic produced by or consumed by an IOTC reader follows a three-part structure:

```
<tenantId> / <topic> / <deviceSerialNumber>
```

## What each segment means

- **`tenantId`** — the customer's tenant identifier, assigned during account provisioning.
- **`topic`** — the **user-chosen middle segment**, configured per endpoint via `publishTopics` and `subscribeTopics`. An endpoint may publish to up to 3 topics and subscribe to 1.
- **`deviceSerialNumber`** — the reader's hardware serial. Appended automatically by the reader.

## Worked example

If `tenantId` is `zebra`, the `publishTopics[0].topic` is `MGMT/clients/cmnd`, and the device serial is `RFD40-24190525100255`, the reader publishes to:

```
zebra/MGMT/clients/cmnd/RFD40-24190525100255
```

## Per-endpoint topic limits

- **Maximum 3 publish topics** per endpoint (error code 25 if exceeded).
- **Maximum 1 subscribe topic** per endpoint (error code 26 if exceeded).
- **`tenantId` length is bounded** (error code 27).

**Related:** [Interface Model](/foundations/architecture/interface-model) · [Endpoint Configuration](/infrastructure/endpoints/about)
