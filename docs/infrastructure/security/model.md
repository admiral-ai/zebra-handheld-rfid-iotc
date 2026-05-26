---
id: model
title: Securing the connection (TLS & certificates)
sidebar_label: Securing the connection (TLS & certificates)
---

> 📘 **EXPLANATION** · **Audience:** Solution Builder · **Read time:** ~6 min · **Ties to:** Certificate Management sub-tag of the API Reference

:::tip[See in the API Reference]
Sub-tag: Certificate Management. Operations: [`get_installed_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-installed-certificate) · [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) · [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate).
:::

IOTC's security model has four layers, applied independently. Each defends against a different class of attack; together they form the security posture for a deployment. This chapter explains the layers and the operations that drive certificate management.

### The four layers

| Layer | Threat | IOTC mechanism |
|---|---|---|
| **Transport** | Eavesdropping on the wire | TLS 1.2 / 1.3 (`protocol: MQTT_TLS`, port 8883) |
| **Server identity** | A man-in-the-middle posing as your broker | `verificationType` set to `VERIFY_HOST_PEER` |
| **Client identity** | An unauthorized reader connecting as yours | Client certificate ([`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) type `client`) |
| **Tenant boundary** | A neighboring tenant reading your topics | `tenantId` + broker-side ACLs |

You cannot achieve "secure" by picking one. A TLS-encrypted connection without `VERIFY_HOST_PEER` defends against passive eavesdropping but not against an active impostor. A signed client certificate without TLS leaks every payload in clear text. The four layers are an *AND*, not an *OR*.

### Five certificate types

[`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) takes a `type` field that selects the logical bucket the cert lives in:

| Type | Used for |
|---|---|
| `mqtt` | MQTT broker connections; both client cert/key and the broker's CA cert |
| `wifi` | Enterprise Wi-Fi (WPA2/WPA3 Enterprise with EAP-TLS) — CA, client cert, client key |
| `filestore` | The HTTP file server used by [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) and [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) (HTTP source) |
| `client` | Generic client-side certs |
| `server` | Generic server-side certs |

Certificates are stored on the device under logical names that you choose at install time (e.g., `mqtt_ca_cert`, `wifi_client_cert`, `filestore_ca_cert`). Other operations reference these names: `config_endpoint.securityParams.caCertificateFile`, `set_wifi.security.certificate[].name`, `set_os.OSUpdateDetails.caCertificateFile`.

### Certificate format and size

The reader's certificate parser accepts a narrow format envelope. Mismatches here are a common cause of [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) failures (`alert_short` IDs `MQTT_INSTALL_CERTIFICATE_FAIL`, `WIFI_INSTALL_CERTIFICATE_FAIL`, `FILESTORE_INSTALL_CERTIFICATE_FAIL`).

| Constraint | Value |
|---|---|
| Encoding | **PEM** with `-----BEGIN CERTIFICATE-----` / `-----END CERTIFICATE-----` markers |
| Key encoding | **RSA in PKCS#1 format** (`-----BEGIN RSA PRIVATE KEY-----`). PKCS#8 keys (`-----BEGIN PRIVATE KEY-----`) must be converted first. |
| Maximum size per file | **4 KB** (applies to CA cert, client cert, and client key independently) |
| Required components for TLS | CA certificate (authenticates the server), client certificate (identifies the device), client key (the device's private key) |

Convert a PKCS#8 key to PKCS#1 with `openssl rsa -in key-pkcs8.pem -out key-pkcs1.pem -traditional`. Trim certificate chains to the minimum required CA when approaching the 4 KB ceiling.

### Two installation sources

`install_certificate.certSource` chooses how the certificate content arrives at the reader:

- **`HTTP`**, the reader downloads from a remote URL. Requires `filestore` certificates to be installed first if the source itself is HTTPS. This is the production pattern: certificate authorities push to an HTTPS endpoint; readers pull on demand.
- **`DIRECT`**, the certificate content is included inline in the MQTT payload (PEM string in `certificateBundle`). Simpler for first-light; less convenient at scale.

When `certSource` is omitted, the reader defaults to `HTTP`.

### Two install paths in practice

**Out-of-band, via 123RFID Desktop.** The Wi-Fi certificate chain for an Enterprise SSID can be loaded from the bootstrap UI in Phase 2. This fits when a reader has not yet joined any network.

**In-band, via [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate).** Once a reader is on the broker, MQTT certificate material for TLS and for the file store can be pushed via [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate). This is how MDM platforms (SOTI Connect, 42Gears SureMDM) provision certs at fleet scale.

### Rotation

Certificates expire. The rotation pattern is:

1. **Install the new cert with a different logical name** (`mqtt_ca_cert_2026`, not `mqtt_ca_cert`).
2. **Update endpoints to reference the new name** with `config_endpoint update`.
3. **Verify the connection survives** — watch `mqttConnEVT` for clean reconnects on the new cert.
4. **Delete the old cert** with [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate) once no endpoint references it.

This pattern survives bad rolls — if the new cert turns out to be invalid, the reader is still using the old name and you can `config_endpoint update` back. Replacing the cert in place (same logical name) leaves no escape route.

### The minimal payload: [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate)

```json
{
  "command": "install_certificate",
  "requestId": "cert-install-001",
  "certDetails": {
    "name": "mqtt_ca_cert",
    "type": "mqtt",
    "certSource": "DIRECT",
    "certificateBundle": {
      "ca_cert": "-----BEGIN CERTIFICATE-----\nMIID...\n-----END CERTIFICATE-----"
    }
  }
}
```

For HTTP-sourced installs, replace `certificateBundle` with a `url` array per certificate component (`ca_cert`, `client_cert`, `client_key`). Full schema in `mqtt-api-reference/install_certificate.md`.

### Listing and removing

- **[`get_installed_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-installed-certificate)**: returns the logical names of installed certificates by type. Use before [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate) to confirm the target exists.
- **[`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate)**: removes a certificate by logical name. The reader rejects deletion if an active endpoint still references the cert.

### Confirmation via `alert_short`

Successful and failed certificate operations generate `alert_short` events with IDs like `MQTT_ROOT_CERT_INSTALL_SUCCESS`, `WIFI_CLIENT_CERT_DOWNLOAD_FAIL`, `FILESTORE_CLIENT_KEY_INSTALL_FAIL`. An MDM platform that drives certificate installs at scale should consume these events on the SOTI or MDM endpoint and treat them as the canonical install-outcome signal. See [When the reader needs to interrupt you](/observability/alerts).

### Out of scope

- **Broker-side ACLs**, that lives in your broker's documentation (Mosquitto, HiveMQ, AWS IoT Core, etc.).
- **Region and regulatory**: different surface; see [What your reader knows about itself](/infrastructure/device-state).
- **PKI design at organizational scale**, see the Ristić *Bulletproof TLS and PKI* reference and your security team.

**Related:** 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📘 [Getting on the network (Wi-Fi & Ethernet)](/infrastructure/network/architecture) · 📘 [When the reader needs to interrupt you](/observability/alerts) · 📕 [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`get_installed_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
