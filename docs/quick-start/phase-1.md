---
id: phase-1
title: "Phase 1: Prepare network and broker"
sidebar_label: "Phase 1: Prepare network and broker"
description: "Phase 1 of the IOTC Quick Start: prepare the network and broker. By the end you have a reachable MQTT 3.1.1 broker and credentials."
---

> 📗 **TUTORIAL** · **Phase:** 1 of 7 · **Audience:** IT / Network Admin · **Time:** ~5 min (or 30 if you need a firewall change)

**Artifact this phase produces:** an unobstructed TCP/IP path from the sled's network segment to your MQTT broker, on the broker's MQTT port. Without this, every later phase fails silently, the sled sits in a reconnect loop with nothing for you to read.

### Why this phase exists

A Direct sled (RFD40 Premium / Premium Plus / RFD90) connects to Wi-Fi and then **directly** to your MQTT broker over TCP. There is no proxy, no tunnel, no HTTP fall-back. If the path is blocked, the sled cannot complete its initial bootstrap connection and Phase 2 will appear to succeed locally while the broker sees nothing.

Three patterns block this path more often than any others:

- **Subnet isolation.** Your laptop sits on `Employee-WiFi` (10.0.x.x); the sled connects to `IoT-WiFi` (192.168.50.x). The corporate firewall rejects 10.0 to 192.168.50 traffic. Neither the laptop nor the sled can reach the broker.
- **Port blocking.** Outbound 1883 (and sometimes 8883) is blocked at the firewall edge for "untrusted" device classes.
- **Captive portals.** Guest Wi-Fi requires a browser-based login the sled cannot complete. The radio associates, DHCP succeeds, *all* traffic is held until the portal is satisfied. The reader looks online; nothing flows.

### What to do

#### 1. Choose your broker

| Scenario | Recommended broker | Address |
|---|---|---|
| Local evaluation, no internet needed | Mosquitto on your laptop | `localhost` from the laptop; the laptop's LAN IP from the sled |
| Cloud evaluation, fastest path | HiveMQ Cloud free tier | TLS only, `<your-id>.s2.eu.hivemq.cloud:8883` |
| Already deploying to AWS | AWS IoT Core | TLS only, your account-specific endpoint |
| Production target | Your existing broker | As configured |

If you don't have a broker yet, install Mosquitto on the laptop:

```bash
# macOS
brew install mosquitto && brew services start mosquitto

# Linux
sudo apt-get install mosquitto && sudo systemctl start mosquitto

# Windows
choco install mosquitto
```

Mosquitto listens on `localhost:1883` by default. Anonymous publish/subscribe is allowed out of the box — fine for evaluation, never for production.

#### 2. Verify the path from the sled's network segment

Before you touch 123RFID Desktop, confirm the broker is reachable **from the network the sled will join**. From a host on that segment:

```bash
nc -vz <broker-host> 1883      # plain MQTT
nc -vz <broker-host> 8883      # TLS MQTT
```

A successful TCP handshake means the path exists. If the sled and laptop are on different segments, run this check from a host on each (both need a path).

#### 3. Note the broker's MQTT-facing address

You will type this into 123RFID Desktop in Phase 2:

- **Hostname:** `broker.example.com` or `localhost` (only valid if 123RFID Desktop runs *on* the broker host).
- **IP address:** `192.168.1.50` or whatever the broker's LAN IP is. Use this when DNS is unreliable on the sled's network.

The sled will reach the broker at the exact address you type. Get it right now to avoid re-bootstrapping later.

#### 4. Prepare MQTTX for validation

MQTTX is your diagnostic and validation client throughout the rest of the tutorial. **It is not the bootstrap mechanism for the reader.** Use it only to confirm that what the reader publishes reaches the broker, and that what you publish reaches the reader.

Suggested MQTTX connection values:

- **Name:** `Zebra Test`
- **Host:** broker address
- **Port:** 1883 (plain) or 8883 (TLS)
- **Protocol:** MQTT or MQTT over TLS, matching your broker

### Success check

You can `nc -vz` the broker on the MQTT port from a host on the sled's Wi-Fi segment. You have the broker's exact hostname or IP written down. MQTTX connects to the broker and shows the active connection.

### Didn't work?

- **`Connection refused`**, the broker isn't listening on that port. Confirm it's running (`mosquitto -d` foregrounds for debugging).
- **`Operation timed out`**, a firewall is dropping the packet silently. Talk to IT.
- **`Connection reset`**, a firewall is sending RST. Same conversation.
- **`Name or service not known`**: DNS can't resolve the hostname. Use the IP address instead.

### Where to go next

[Phase 2: Bootstrap (Direct or Bridged)](/quick-start/phase-2) — pick the [Direct (123RFID Desktop)](/quick-start/phase-2/direct) walkthrough for a Premium / Premium Plus / RFD90 sled with a Windows laptop, or the [Bridged (123RFID Mobile)](/quick-start/phase-2/bridged) walkthrough for an RFD40 Standard sled (or a Direct sled when no Windows laptop is available).
