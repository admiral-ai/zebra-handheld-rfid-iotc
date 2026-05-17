---
id: api-overview
title: API Reference Overview & Conventions
sidebar_label: API Reference Overview & Conventions
---

> 📕 **REFERENCE**

Every command in this API follows the same envelope:

```json
{
  "command": "<command_name>",
  "requestId": "<client-supplied id>",
  "<commandPayloadKey>": { /* command-specific payload */ }
}
```

Responses echo `command` and `requestId` and add `apiVersion` and `response`:

```json
{
  "command": "<command_name>",
  "requestId": "<echo>",
  "apiVersion": "V1.1",
  "<responsePayloadKey>": { /* result */ },
  "response": {"code": 0, "description": "Success"}
}
```

### Command-specific payload keys

| Command | Required payload key |
|---|---|
| `get_*` (most) | (none beyond command + requestId) |
| `control_operation` | `ctrlOprPayload` |
| `set_operating_mode` | `operatingMode` |
| `set_post_filter` | `postFilterPayload` |
| `set_wifi` | `wifiConfig` |
| `delete_wifi_profile` | `wifiConfig` |
| `config_endpoint` | `epConfig` |
| `install_certificate` | `certDetails` |
| `delete_certificate` | `certDetails` |
| `config_events` | `eventConfiguration` |
| `set_config` | `configData` |
| `set_os` | `OSUpdateDetails` |

### Topic format

Three-part: `<tenantId> / <topic> / <deviceSerialNumber>`. The middle `<topic>` is configured per endpoint.

### Error envelope

See [§17.1 Error Response Format](/reference/errors/format) and [§17.2 Command Response Error Codes](/reference/errors/codes).
