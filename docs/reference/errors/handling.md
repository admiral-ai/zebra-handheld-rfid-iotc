---
id: handling
title: How to handle errors in application code
sidebar_label: How to Handle Errors in Application Code
description: "Structure error handling for IOTC MQTT commands: idempotency, retry-with-backoff, when to escalate to the user, patterns for the five common failure modes."
---

> 📙 **HOW-TO** · **Audience:** Solution Builder · **Time:** ~20 min

### Classify codes ahead of time

| Code(s) | Classification | Strategy |
|---|---|---|
| 0 | Success | Continue |
| 1 | Async-accepted | Wait for follow-up event |
| 3 | Transient (info unavailable) | Retry with backoff |
| 4, 11 | Transient (operation conflict) | Wait and retry |
| 12 | Informational (no-op) | Continue without retry |
| 2, 17, 23 | Permanent (payload bug) | Fix code and surface error |
| 10, 18 | Permanent (resource exists) | Fix logic (use MODIFY/update or different name) |
| 15, 21 | Permanent (resource missing) | Verify name, install/create first |
| 5, 14 | Conditional (device state) | Address precondition, retry |
| 6, 7 | Permanent (config gap) | Configure region/interface, retry |
| 8, 19 | Permanent (capacity) | Free space, then retry |
| 13 | Failure | Investigate logs, retry with corrections |
| 16 | Permanent (active resource) | Disconnect first |
| 20 | Permanent (capability) | Use alternate interface |
| 22, 24, 25, 26, 27, 28 | Permanent (constraint violation) | Reduce/correct payload |
| 9 | Permanent (file missing) | Verify URL/path |

### Retry transient errors with backoff

```python
def call_with_retry(send_fn, max_attempts=5):
    delay = 1.0
    for attempt in range(max_attempts):
        response = send_fn()
        code = response["response"]["code"]
        if code == 0 or code == 12:
            return response
        if code in {3, 4, 11}:
            time.sleep(delay + random.uniform(0, delay * 0.1))
            delay *= 2
            continue
        raise PermanentError(response)
    raise TimeoutError("max attempts reached")
```

### Distinguishing code 12

Code 12 (`IOT_ERROR_NO_RADIO_OP_IN_PROGRESS`) appears when STOP is sent to an already-idle reader. Treat it as success.

**Related:** 📕 [Error Codes](/reference/errors/codes) · 📕 [Events reference](/reference/api-overview)
