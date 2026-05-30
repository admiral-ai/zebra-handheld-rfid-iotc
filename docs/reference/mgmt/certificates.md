---
id: certificates
title: Certificate management (MGMT endpoint)
sidebar_label: "Certificate management (MGMT)"
description: "Reference for the MGMT certificate-management surface: install_certificate (HTTP source), delete_certificate, get_installed_certificates. Trust-store updates."
---
> 📕 **REFERENCE**

#### [`get_installed_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-installed-certificate) (T4)

Lists installed certificates.

#### [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) (T2)

Types: `client`, `server`, `mqtt`, `wifi`, `filestore`. Sources: `HTTP` (default) or `DIRECT`. Payload key `certDetails`.

**Errors:** 1 (accepted, async), 9 (file not found), 21 (cert not found in subsequent reference), 23 (invalid enum).

#### [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate) (T3)

Removes by `name`. **Errors:** 9, 21.
