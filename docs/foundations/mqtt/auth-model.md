---
id: auth-model
title: About the Authentication & Authorization Model
sidebar_label: About the Authentication & Authorization Model
---

> 📘 **EXPLANATION** · Audience: Solution Builder · Read time: ~5 min

IOTC's authentication and authorization model has three independent layers: who the client is (authentication), what subtree of the topic namespace it can touch (authorization), and how the traffic is encrypted in flight (transport security, covered in [§7.1](/infrastructure/security/model)).

### Authentication modes

IOTC supports three authentication modes, configured at the broker:

- **Username + password.** The simplest. Credentials issued by the Zebra developer portal. Suitable for development and small deployments.
- **TLS client certificate.** Mutual TLS: the client presents an X.509 certificate; the broker validates it. Stronger; suitable for production fleets.
- **Both.** Username + password layered on top of mutual TLS. Defense in depth.

[DIAGRAM: D-3.5.A. auth flow showing CONNECT with credentials reaching the broker, broker validating, CONNACK returned]

### Tenant scoping

Every IOTC credential is scoped to a tenant. The credentials grant access only to topics beginning with the credential's `tenantId`. This is enforced at the broker. There is no operation a credential for tenant A can perform on a reader belonging to tenant B, even if the application attempts to publish on tenant B's topic, the broker rejects the publish.

### Topic ACLs

Within a tenant, the broker enforces topic-level access control lists. Common patterns: an application service principal granted publish+subscribe on `{tenantId}/mgmt/...` and `{tenantId}/ctrl/...` but only subscribe on `{tenantId}/data1event/...`. This lets data-consumer services have minimum-necessary privileges.

### Where credentials originate

For Zebra-hosted brokers, credentials are issued through the Zebra developer portal, see [§4.2 Obtain Credentials](/getting-started/prerequisites/credentials). For customer-hosted brokers and SOTI-managed fleets, credentials are configured at the broker and distributed through the MDM layer, see [§13.2 SOTI Connect Provisioning](/fleet/provisioning/soti-connect).

### Threat model

The model defends against: eavesdropping on the wire (TLS), unauthorized command publish (authentication + ACLs), and cross-tenant access (tenant scoping). It does **not** defend against: physical access to a sled (an attacker with the device can extract credentials), Bluetooth interception between sled and host, or a compromised host device. For deployments where these threats matter, layer hardware-level protections — MDM-controlled hosts, sled custody policies, on top of the IOTC model.

**Related:** 📘 [§7.1 Security Model](/infrastructure/security/model) · 📙 [§4.2 Obtaining Credentials](/getting-started/prerequisites/credentials) · 📙 [§7.4 Securing MQTT with TLS](/infrastructure/security/tls-setup)

---

# Part II: Getting Started
