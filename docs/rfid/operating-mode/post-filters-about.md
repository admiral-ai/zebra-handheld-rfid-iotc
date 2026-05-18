---
id: post-filters-about
title: Filter tags before vs after the read
sidebar_label: Filter tags before vs after the read
---

> 📘 **EXPLANATION** · Audience: Solution Builder · Read time: ~4 min

A **post-filter** is a reader-side filter applied **after** Gen2 singulation, on the textual representation of each tag's identifier. It decides whether a singulated tag becomes a `dataEVT` payload on a given data endpoint.

This is distinct from the Gen2 **SELECT** pre-filter (configured in `set_operating_mode.select`), which excludes tags from singulation in the first place by matching bit-level memory patterns. Post-filters cannot reduce air-protocol time — they only reduce reported volume on the data stream.

### Match methods

- **PREFIX** — match the start of the tag ID. Pattern must be hex, even number of characters.
- **SUFFIX** — match the end of the tag ID. Pattern must be hex, even number of characters.
- **REGEX** — match the tag ID against a regular expression. Pattern is a regex string.

### Report behaviour

- **INCLUDE** — only tags matching the filter are reported on the targeted data endpoint.
- **EXCLUDE** — matching tags are suppressed; everything else is reported.

### Per-endpoint scoping

Each post-filter targets exactly one data endpoint — `DATA_EP1` or `DATA_EP2`. Filters on `DATA_EP1` do not affect `DATA_EP2`. This lets a deployment send all tags to one data endpoint and a filtered subset to another.

**Related:** 📙 [§9.3b Configure Post-Filters](/rfid/operating-mode/post-filters-configure) · 📙 [§9.2 SELECT Filtering](/rfid/operating-mode/configure) · 📕 [§16.3 set_post_filter](#chapter-16--mqtt-api-reference)
