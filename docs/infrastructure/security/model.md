---
id: model
title: Securing the connection (TLS & certificates)
sidebar_label: Securing the connection (TLS & certificates)
---

> 📘 **EXPLANATION** · Audience: Solution Builder · Read time: ~6 min

IOTC's security model has four layers, applied independently. Each defends against a different class of attack; together they form the security posture for an IOTC deployment.

### The four layers

[DIAGRAM: D-7.1.A — layered stack: transport encryption / authentication / authorization / device identity]

- **Transport encryption** — TLS 1.2 or 1.3 between client and broker. Protects against passive eavesdropping and active tampering.
- **Authentication** — MQTT username/password, TLS client certificate, or both. Establishes who the client is.
- **Authorization** — broker-enforced topic ACLs scoped to a tenant. Determines what the authenticated client can do.
- **Device identity** — the serial number embedded in every topic path. Lets fleet-level policy reason about specific devices.

### Threat model

[DIAGRAM: D-7.1.B — threat model table]

| Threat | Defended by | Notes |
|---|---|---|
| Passive eavesdropping on wire | TLS | Always enable in production |
| Unauthorized command publish | Auth + ACL | Use TLS client certs for production |
| Cross-tenant access | Tenant-scoped ACL | Enforced at broker |
| Device spoofing | Per-device credentials | One credential per device for high-security |
| Physical access to a sled | Not defended | Manage via custodial policy |
| Bluetooth interception | Not defended | Consider in physical-security scope |
| Compromised host device | Not defended | Manage host security via MDM |

### When to enable what

For development: username/password with TLS. For production fleets: TLS client certificates plus username/password. For high-security or regulated environments: per-device certificates, MDM-managed host devices, and a custodial policy for sled inventory.

**Related:** 📘 [§3.5 Auth Model](/foundations/mqtt/auth-model) · 📙 [§7.2 Certificate Management](/infrastructure/security/certificate-management) · 📙 [§7.4 Securing MQTT with TLS](/infrastructure/security/tls-setup)
