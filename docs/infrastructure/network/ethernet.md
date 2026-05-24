---
id: ethernet
title: "How to Check Ethernet Status (Cradle-Connected)"
sidebar_label: "How to Check Ethernet Status (Cradle-Connected)"
---

> 📙 **HOW-TO** · Audience: Solution Builder · Time: ~3 min

This guide shows you how to check Ethernet status on a reader docked in a cradle with Ethernet uplink. Ethernet configuration on handheld sleds is read-only over MQTT; the cradle infrastructure is configured outside of IOTC.

### Issue the command

```json
{"command": "get_eth", "command_id": "eth-1"}
```

### Interpret the response

```json
{
  "response": "get_eth",
  "command_id": "eth-1",
  "data": {
    "link": "up",
    "ip_address": "10.0.4.21",
    "gateway": "10.0.4.1",
    "dns": ["10.0.4.1"],
    "mac": "AA:BB:CC:DD:EE:FF"
  }
}
```

`link` is `up` when the cradle's Ethernet is connected; `down` otherwise. The remaining fields reflect the DHCP-assigned configuration.

:::info
The sled's own Ethernet hardware does not exist; these fields reflect the cradle's bridge. To change Ethernet behaviour, configure the cradle.
:::

**Related:** 📘 [§6.1 Network Architecture](/infrastructure/network/architecture) · 📕 [§16.2 get_eth](#chapter-16--mqtt-api-reference)
