---
id: post-filters-about
title: Filter tags before vs after the read
sidebar_label: Filter tags before vs after the read
---

> 📘 **EXPLANATION** · Audience: Solution Builder · Read time: ~4 min · Ties to the Tag Filtering sub-tag of the API Reference

> **See in the API Reference**
> Sub-tag: Tag Filtering. Operations: `get_post_filter` · `set_post_filter`.

IOTC supports filtering at **two points** in the read pipeline. Filtering early saves the radio work. Filtering late saves the application work. Each has its own surface, its own API, and its own cost.

### Pre-filter (`select`) — the Gen2 SELECT command

The reader's **pre-filter** runs on the air. The radio issues a Gen2 SELECT command before the inventory round, telling tags "only respond if your memory matches this pattern." Non-matching tags stay silent. This is the air-protocol filter.

Pre-filters live inside `set_operating_mode.operatingMode.operatingModes.select` (an array of up to **32 entries** — exceeded returns error code `24`). Each entry includes:

- **`enable`** — boolean to switch the filter on or off.
- **`memoryBank`** — `EPC`, `TID`, or `USER`. The bank the pattern matches against.
- **`offset`** — starting bit position (not 16-bit words — that's a difference from `accessOperations`).
- **`length`** — number of bits to compare.
- **`tagPattern`** — hex string (max 64 characters, even count), bit pattern to match.
- **`action`** — what to do with the tag's SL flag and inventory state on match vs mismatch.
- **`target`** — which session or SL flag this entry affects.

The savings are radio savings: tags that don't match never use a singulation slot. In dense populations this is the difference between an inventory completing in seconds and timing out.

### Post-filter (`postFilterPayload`) — reader-side report filter

The reader's **post-filter** runs after singulation. The radio has identified the tag and read its EPC; the reader's daemon then decides whether to report it on the data endpoint. This is the reader-side text-pattern filter.

Post-filters live in their own surface — `set_post_filter` and `get_post_filter` — and are configured per data endpoint (`DATA_EP1` or `DATA_EP2`):

```json
{
  "command": "set_post_filter",
  "requestId": "filter-001",
  "postFilterPayload": {
    "operation": "ADD",
    "dataEpType": "DATA_EP1",
    "matchPattern": "FFFFBBBBA500",
    "matchPatternMethod": "PREFIX",
    "reportOperation": "INCLUDE"
  }
}
```

The four fields that define a post-filter:

- **`operation`** — `ADD`, `MODIFY`, or `DELETE` (uppercase enums).
- **`dataEpType`** — `DATA_EP1` or `DATA_EP2`. Filters are endpoint-scoped.
- **`matchPattern`** — the pattern to match. Hex (even-character) for `PREFIX` and `SUFFIX`; a regular expression for `REGEX`.
- **`matchPatternMethod`** — `PREFIX` (match start of EPC), `SUFFIX` (match end), or `REGEX`.
- **`reportOperation`** — `INCLUDE` (report matching tags only) or `EXCLUDE` (suppress matching tags).

The savings are application savings: tags that don't match the post-filter are never published, so the broker, the network, and the consumer never see them.

### Pre vs post — when to use which

| Concern | Pre-filter | Post-filter |
|---|---|---|
| Optimise for radio efficiency in dense populations | ✓ | — |
| Reduce broker bandwidth | (limited; tags still singulated) | ✓ |
| Match by EPC prefix / suffix | ✓ (hex patterns) | ✓ |
| Match by regular expression | — | ✓ |
| Match against TID or USER memory | ✓ | — |
| Filter different endpoints differently | — | ✓ (per-`dataEpType`) |
| Maximum number of filters | 32 | (no documented hard cap) |

A typical production deployment uses **both**: pre-filters narrow the air-protocol catch to the EPC family that matters, post-filters narrow the application stream to the specific endpoint the consumer cares about.

### Three rules to remember

1. **Pre-filter `offset` is in bits; access-operation `offset` is in 16-bit words.** This trips up nearly everyone — same field name, different unit.
2. **Hex patterns must be even-character.** `PREFIX` and `SUFFIX` post-filters use hex; an odd character count is invalid. `REGEX` is a regex string and is exempt.
3. **A saved-but-invalid post-filter saves silently.** If the `matchPattern` is malformed in a way the device doesn't catch at save time, the filter installs but suppresses everything. Verify with a known-matching test tag.

### Pre-filter actions, briefly

The pre-filter `action` enum is the largest in the API surface. It defines what the Gen2 SELECT command sets on the tag's flags when the pattern matches and when it doesn't. The most common values:

- **`INV_B_NOT_INV_A_OR_DSRT_SL_NOT_ASRT_SL`** — match → inventory state B and deassert SL; mismatch → state A and assert SL. The canonical "make matching tags participate in inventory" action.
- **`INV_A_OR_ASRT_SL`** — match → state A or assert SL; mismatch → no change. The "additive whitelist."

A full table is in `mqtt-api-reference/set_operating_mode.md`. For 95% of deployments, the first one above is what you want.

### Listing and removing post-filters

`get_post_filter` returns the post-filters currently installed on each data endpoint. Use it before `MODIFY` or `DELETE` to confirm the target rule exists. A failed `DELETE` on a non-existent rule returns a generic error — `get_post_filter` is your verification.

### What this chapter does not cover

- **`accessOperations` (read, write, lock, kill on tag memory)** — that's the tag-side operation surface, not filtering. Covered as an advanced surface in `mqtt-api-reference/set_operating_mode.md`.
- **Application-side filtering downstream of the broker** — by definition outside IOTC. Apply Kafka filters, SQL clauses, or in-app rules at the consumer.

**Related:** 📘 [Choose how the reader reads tags](/rfid/operating-mode/profiles) · 📘 [Where tag reads come from](/rfid/tag-data/dataevt-schema) · 📕 [`set_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`get_post_filter`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
