---
id: certificate-management
title: How to Manage TLS/SSL Certificates
sidebar_label: How to Manage TLS/SSL Certificates
---

> 📙 **HOW-TO** · Audience: Solution Builder, Fleet Operator · Time: ~10 min

This guide shows you how to install, list, and delete certificates on a handheld reader.

### List installed certificates

```json
{"command": "get_installed_certificate", "requestId": "cert-1"}
```

### Install via HTTP download

The reader downloads the certificate(s) from URLs you specify.

```json
{
  "command": "install_certificate",
  "requestId": "cert-2",
  "certDetails": {
    "name": "broker-mqtt-ca",
    "type": "mqtt",
    "certSource": "HTTP",
    "authenticationType": "NONE",
    "verificationType": "VERIFY_HOST_PEER",
    "url": [
      {"role": "ca_cert", "value": "https://example.com/ca.pem"}
    ]
  }
}
```

### Install via direct (inline) content

```json
{
  "command": "install_certificate",
  "requestId": "cert-3",
  "certDetails": {
    "name": "broker-mqtt-ca",
    "type": "mqtt",
    "certSource": "DIRECT",
    "certificateBundle": {
      "ca_cert": "<PEM-content-string>"
    }
  }
}
```

### Certificate types

The `type` field determines where the certificate will be used:

| `type` | Purpose |
|---|---|
| `mqtt` | MQTT broker connection certificates (CA, client cert, client key) |
| `wifi` | Wi-Fi 802.1X / EAP-TLS certificates |
| `filestore` | Authentication for certificate-download servers |
| `client` | Generic client-side certificates |
| `server` | Server-side certificates |

### Delete a certificate

```json
{
  "command": "delete_certificate",
  "requestId": "cert-4",
  "certDetails": {"name": "old-ca"}
}
```

Cannot delete a certificate currently referenced by an active endpoint or Wi-Fi profile.

### The logical name pattern

Every installed certificate carries a `name` you assign at install time. Other commands (`set_wifi`, `config_endpoint`, `set_os`)reference the certificate by this logical name rather than by content. This keeps payloads small and lets you rotate the underlying certificate without changing the consuming commands.

**Related:** 📘 [§7.1 Security Model](/infrastructure/security/model) · 📕 [§16.2 certificate endpoints](#chapter-16--mqtt-api-reference) · 📙 [§7.3 Rotation at Scale](/infrastructure/security/rotation) · 📙 [§7.4 TLS Setup](/infrastructure/security/tls-setup)
