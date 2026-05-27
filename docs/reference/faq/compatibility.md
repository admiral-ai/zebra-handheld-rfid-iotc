---
id: compatibility
title: Compatibility FAQs
sidebar_label: Compatibility FAQs
description: "Frequently asked questions about IOTC compatibility: which sleds, firmware, host devices, host OSes, brokers, and TLS versions are supported and tested."
---

> 📕 **REFERENCE** · **Audience:** All personas · **Use:** compatibility lookup · Migration procedure is in [Plan the migration](/fleet/migration/plan), not in this FAQ.

**Q:** Is IOTC V1.0 backward compatible with V1.1?
**A:** Mostly yes — V1.1 is a delta release; existing V1.0 client code typically works unmodified.
**Details:** [About IOTC V1.1 Features](/foundations/v1-1-features)

---

**Q:** Which firmware versions support V1.1?
**A:** Firmware 3.10.27 and later.
**Details:** [Firmware Version History & Changelog](/reference/appendices/firmware-history)

---

**Q:** Do I need to update applications when migrating to V1.1?
**A:** Only if you want to use V1.1-only endpoints; existing code is forward-compatible.
**Details:** [How to Plan a V1.0 to V1.1 Migration](/fleet/migration/plan)

---

**Q:** Can mixed-version fleets coexist during migration?
**A:** Yes — V1.0 and V1.1 readers can operate against the same broker with the same application.
**Details:** [How to Execute a Phased Fleet Migration](/fleet/migration/execute)

---

## Chapter 20: Appendices
