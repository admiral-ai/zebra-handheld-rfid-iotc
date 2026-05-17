---
id: read-config
title: How to Read Full Device Configuration
sidebar_label: How to Read Full Device Configuration
---

> 📙 **HOW-TO** · Audience: Fleet Operator · Time: ~5 min

This guide shows you how to read the full configuration document from a handheld reader.

### Issue the command

```json
{"command": "get_config", "command_id": "gc-1"}
```

### Parse the response

The response is a nested JSON document. Top-level sections correspond to the individual `get_*` endpoint domains:

```json
{
  "response": "get_config",
  "command_id": "gc-1",
  "data": {
    "network": { ... },
    "security": { ... },
    "endpoints": { ... },
    "rfid": { ... },
    "events": { ... },
    "mdm": { ... }
  }
}
```

### Section correspondence

| Config section | Corresponds to individual endpoint |
|---|---|
| `network` | `get_wifi`, `get_eth` |
| `security` | `get_installed_certificate` |
| `endpoints` | `get_endpoint_config` |
| `rfid` | `get_operating_mode`, `get_post_filter` |
| `events` | (corresponds to `config_events` settings) |

For the complete schema, see [§20.1](/reference/appendices/config-schema).

[DIAGRAM: D-14.2.A — example `get_config` response annotated by section]

**Related:** 📕 [§16.2 get_config](#chapter-16--mqtt-api-reference) · 📕 [§20.1 Config Schema](/reference/appendices/config-schema) · 📙 [§14.3 Apply Bulk Config](/fleet/management/apply-config)
