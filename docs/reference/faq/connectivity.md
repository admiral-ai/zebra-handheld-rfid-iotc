---
id: connectivity
title: Connectivity and network FAQs
sidebar_label: Connectivity & Network FAQs
description: "Frequently asked questions about IOTC connectivity: Wi-Fi reconnect, Bluetooth pairing, broker reachability checks, and what each diagnostic signal means."
---

> 📕 **REFERENCE**

**Q:** Which ports does IOTC use?
**A:** TCP/8883 for MQTT over TLS (recommended); TCP/1883 for cleartext MQTT.
**Details:** [About Network Architecture](/infrastructure/network/architecture)

---

**Q:** Is TLS required?
**A:** Not strictly required, but strongly recommended for any non-trivial deployment.
**Details:** [How to Secure the MQTT Connection with TLS](/infrastructure/security/tls-setup)

---

**Q:** Does the reader support cellular?
**A:** Not directly. The reader connects via the host device; the host can use cellular.
**Details:** [About Network Architecture](/infrastructure/network/architecture)

---

**Q:** Can the reader connect to the broker without the host device?
**A:** Yes, when docked in a cradle that bridges to Ethernet or Wi-Fi independently.
**Details:** [About Network Architecture](/infrastructure/network/architecture)
