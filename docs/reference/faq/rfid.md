---
id: rfid
title: RFID Operations FAQs
sidebar_label: RFID Operations FAQs
---

> 📕 **REFERENCE**

**Q:** How many tags per second can the reader read?
**A:** Up to about 700 tags/second on RFD90 in `inventory` mode; lower for richer modes.
**Details:** [§9.1 About RFID Operating Modes](/rfid/operating-mode/profiles)

---

**Q:** What RFID tag standards are supported?
**A:** EPC Gen2 / ISO 18000-63 UHF tags.
**Details:** [§20.4 Supported RFID Tag Types & Standards](/reference/appendices/tag-standards)

---

**Q:** Can I read the TID memory bank?
**A:** Yes, using `inventory_tid` mode.
**Details:** [§9.1 About RFID Operating Modes](/rfid/operating-mode/profiles)

---

**Q:** How do I filter tags?
**A:** Configure post-filters with inclusion or exclusion patterns matching EPC bits.
**Details:** [§9.3a About Post-Filters](/rfid/operating-mode/post-filters-about)
