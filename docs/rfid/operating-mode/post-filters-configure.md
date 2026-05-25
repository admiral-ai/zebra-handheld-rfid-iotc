---
id: post-filters-configure
title: How to Configure Post-Filters
sidebar_label: How to Configure Post-Filters
---

> 📙 **HOW-TO** · Audience: Solution Builder · Time: ~10 min

### View current post-filters

```json
{"command": "get_post_filter", "requestId": "pf-1"}
```

### Add a PREFIX inclusion filter

```json
{
  "command": "set_post_filter",
  "requestId": "pf-2",
  "postFilterPayload": {
    "operation": "ADD",
    "dataEndpoint": "DATA_EP1",
    "matchPattern": "E28000",
    "matchPatternMethod": "PREFIX",
    "reportOperation": "INCLUDE"
  }
}
```

### Add a SUFFIX exclusion filter

```json
{
  "command": "set_post_filter",
  "requestId": "pf-3",
  "postFilterPayload": {
    "operation": "ADD",
    "dataEndpoint": "DATA_EP2",
    "matchPattern": "FFFF",
    "matchPatternMethod": "SUFFIX",
    "reportOperation": "EXCLUDE"
  }
}
```

### Add a REGEX filter

```json
{
  "command": "set_post_filter",
  "requestId": "pf-4",
  "postFilterPayload": {
    "operation": "ADD",
    "dataEndpoint": "DATA_EP1",
    "matchPattern": "^E280[0-9A-F]{20}$",
    "matchPatternMethod": "REGEX",
    "reportOperation": "INCLUDE"
  }
}
```

### Modify or delete

`operation: MODIFY` updates an existing filter; `operation: DELETE` removes one.

**Related:** 📘 [Post-Filters](/rfid/operating-mode/post-filters-about) · 📕 [set_post_filter](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-post-filter)
