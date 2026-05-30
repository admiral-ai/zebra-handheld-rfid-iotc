---
id: connectivity
title: Connectivity and network FAQs
sidebar_label: Connectivity & network FAQs
description: "Frequently asked questions about IOTC connectivity: Wi-Fi reconnect, broker reachability checks, and what each diagnostic signal means."
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
**A:** Not directly — the reader connects over its own Wi-Fi. For cellular backhaul, put the reader on a Wi-Fi network served by a cellular router or gateway.
**Details:** [About Network Architecture](/infrastructure/network/architecture)
