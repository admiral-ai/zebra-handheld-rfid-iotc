---
id: format
title: Error Response Format
sidebar_label: Error Response Format
---

Every command response carries a `response` object with `code` (integer) and `description` (string). On success, `code: 0`. On error, `code` is one of 1–28 from the canonical table in [§17.2](/reference/errors/codes).

Envelope:

```json
{
  "command": "<command_name>",
  "requestId": "<echo>",
  "apiVersion": "V1.1",
  "response": {
    "code": <0..28>,
    "description": "<verbatim from error_codes.json>"
  }
}
```

When `code` is non-zero, the operation-specific response payload (e.g., `readerVersion`, `deviceStatus`, `epDetails`) is typically absent or empty.
