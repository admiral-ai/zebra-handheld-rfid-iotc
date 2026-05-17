---
id: certificates
title: "Certificate Management (MGMT)"
sidebar_label: "Certificate Management (MGMT)"
---
> 📕 **REFERENCE**

#### `get_installed_certificate` (T4)

Lists installed certificates.

#### `install_certificate` (T2)

Types: `client`, `server`, `mqtt`, `wifi`, `filestore`. Sources: `HTTP` (default) or `DIRECT`. Payload key `certDetails`.

**Errors:** 1 (accepted, async), 9 (file not found), 21 (cert not found in subsequent reference), 23 (invalid enum).

#### `delete_certificate` (T3)

Removes by `name`. **Errors:** 9, 21.
