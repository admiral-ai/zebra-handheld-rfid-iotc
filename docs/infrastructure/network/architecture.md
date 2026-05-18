---
id: architecture
title: Getting on the network (Wi-Fi & Ethernet)
sidebar_label: Getting on the network (Wi-Fi & Ethernet)
---

> 📘 **EXPLANATION** · Audience: Solution Builder · Read time: ~5 min

The network path between a handheld reader and the MQTT broker passes through five distinct media. Each is configured separately and each has its own failure profile.

### The path

```
Sled → Bluetooth → Host device → Wi-Fi (or Cellular) → Internet → Broker
```

The sled itself has Wi-Fi hardware, but in typical handheld deployments the host device's network is the path used. The sled's Wi-Fi may be enabled for direct connection during 123RFID Desktop bootstrap or when docked in a cradle that bridges Wi-Fi independently of the host.

### Direct vs relayed connectivity

- **Direct (sled Wi-Fi):** The sled connects to Wi-Fi using profiles configured via `set_wifi`. Used during bootstrap, in cradles, or when no host device is paired.
- **Relayed (via host):** The sled tunnels MQTT traffic over Bluetooth to the host; the host's network carries it to the broker. This is the normal handheld operating mode.

The reader does not distinguish between these at the IOTC API layer — `get_status` reports its current network state regardless of path.

[DIAGRAM: D-6.1.A — three deployment topologies: warehouse enterprise Wi-Fi, retail store with guest network, field operations with cellular host]

### Common deployment topologies

- **Warehouse:** enterprise Wi-Fi with WPA2-Enterprise (EAP-TLS), broker reachable over private link or VPN.
- **Retail store:** corporate Wi-Fi with WPA2-Personal, broker reachable over the public internet on TCP/8883.
- **Field operations:** cellular-tethered host device, broker reachable over the public internet.

### Bandwidth and latency budgets

Tag data dominates bandwidth. A reader in `inventory_rssi` mode reading 200 tags/second emits ~100 KB/s of MQTT payload (including headers). MGMT and CTRL traffic is negligible. Command/response round-trip latency is typically 50–200 ms over typical Wi-Fi; up to 1 s over cellular.

**Related:** 📘 [§2.1 End-to-End System](/foundations/architecture/end-to-end) · 📘 [§2.5 Handheld Considerations](/foundations/architecture/handheld-considerations) · 📙 [§6.2 Wi-Fi Configuration](/infrastructure/network/wifi) · 📙 [§6.4 Network Troubleshooting](/infrastructure/network/troubleshooting)
