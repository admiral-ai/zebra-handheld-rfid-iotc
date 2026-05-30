---
id: rotation
title: How to rotate certificates at scale
sidebar_label: How to rotate certificates at scale
description: "Rotate IOTC TLS certificates across a fleet: pre-stage new CA, switch endpoints, expire old cert, recover when rotation leaves readers stranded."
---

> 📙 **HOW-TO** · **Audience:** Fleet Operator · **Time:** ~30 min

This guide shows you how to rotate TLS certificates across a fleet of handheld readers without downtime.

### Monitor for expiration

Subscribe to the certificate-expiry `alerts` event. Configure the warning threshold via [`config_events`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-events), typically 30 days before expiration.

### Stage the new certificate to a canary cohort

Select 1–5% of the fleet. Issue [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) for each canary reader with the new certificate under a **new alias** (e.g., `client-cert-2026`). Do not delete the old certificate.

### Cut over the canary

Update the canary readers' [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) to reference the new certificate alias. Watch `mqttConnEVT` confirm secure reconnection.

### Widen the rollout in waves

| Wave | % of fleet | Wait before next wave | Pass criteria |
|---|---:|---|---|
| 1 | 1% (canary) | 24 hours | Zero cert-related `exceptionEVT` |
| 2 | 10% | 24 hours | Same |
| 3 | 50% | 12 hours | Same |
| 4 | 100% | — | Same |

```d2
title: "Certificate rotation rollout" { near: top-center; shape: text; style.font-size: 18; style.bold: true }
direction: right
W1: "Wave 1 - canary 1%\nInstall + monitor 24 h" { shape: step }
W2: "Wave 2 - 10%\nInstall + monitor 24 h" { shape: step }
W3: "Wave 3 - 50%\nInstall + monitor 12 h" { shape: step }
W4: "Wave 4 - 100%\nInstall 8 h" { shape: step }
W1 -> W2: "t=0 -> +24 h"
W2 -> W3: +48 h
W3 -> W4: +60 h

```

### Handle install failures

If [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) returns an error, the reader retains its existing certificate and remains operational. Log the failure, fix the cause, and retry. Do not delete the old certificate until the new one is verified working.

### Verify and clean up

Once 100% of the fleet is on the new alias, issue [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate) for the old alias.

**Related:** 📙 [Certificate Management](/infrastructure/security/certificate-management) · 📙 [Automation](/fleet/provisioning/automation) · 📕 [alerts](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#tag-alerts) · 📙 [Phased Rollout Pattern](/fleet/migration/execute)
