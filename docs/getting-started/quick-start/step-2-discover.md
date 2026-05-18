---
id: step-2-discover
title: Bootstrap with 123RFID Desktop
sidebar_label: Bootstrap with 123RFID Desktop
---

> 📗 **TUTORIAL** · Phase 2 of 7 · Audience: Operator with a Windows laptop · Time: ~8 min · Path: 🅐 Monolithic

**Artifact this phase produces:** an **active MDM endpoint** on the sled, connected to your broker. The MDM endpoint is the bootstrap connection — the first live MQTT path into and out of the reader. **Until this is active, no MQTT command works.**

### Why this phase exists

A sled out of the box has factory firmware, no Wi-Fi credentials, no broker target, and no regulatory region. None of these can be set over MQTT. 123RFID Desktop is the **only** path for the initial provisioning. After this phase the sled has:

- Regulatory region (e.g., `US`, `EU1`, `JP`) — locked into firmware.
- A Wi-Fi profile with SSID, security type, and credentials.
- An active **MDM endpoint** with broker URL, port, protocol, and tenant ID.
- A bootstrap connection that you can use in Phase 3 to send MQTT commands.

### What to do

#### 1. Install and open 123RFID Desktop

Download from `support.zebra.com` (search "123RFID Desktop"). Latest is v3.0.0.63 at time of writing. Windows only. Launch it.

#### 2. Discover the reader

Connect the sled to the laptop via USB-C (data-capable cable) or pair via Bluetooth, depending on your setup. In the **Discovery** view:

- Confirm the reader is powered on.
- Confirm Bluetooth is enabled if discovering wirelessly.
- Confirm USB is connected if discovering via cable.
- Verify the physical serial number on the back of the sled matches the device shown in the UI.

#### 3. Connect to the reader

Select the discovered reader and connect to it. **You are not yet using the MQTT command plane.** You are establishing a local management session so the initial endpoint can be configured.

#### 4. Set the region

In the **Region** tab, select your regulatory region from the dropdown. Confirm. The sled may briefly disconnect and reconnect as the region is applied.

> **Once set, the region is locked into firmware.** Changing it later requires a factory reset and re-bootstrap. Choose carefully.

#### 5. Configure Wi-Fi

In the **Wi-Fi** tab:

- **SSID** — the network the sled should join.
- **Security** — WPA2-Personal or WPA3-Personal for most deployments; WPA2/WPA3-Enterprise (EAP-TLS, PEAP) for corporate networks.
- **Password** or **certificate** — as appropriate.

Apply. The sled associates within a few seconds. Verify:

- The reader shows a connected Wi-Fi state in the UI.
- The reader has been assigned an IP address.
- The Wi-Fi network is the one that can reach the broker (Phase 1).

#### 6. Configure the initial MDM endpoint

In the **Endpoints** tab, configure the MDM endpoint with at least:

- **Endpoint name** — anything readable, e.g., `mdm_bootstrap`.
- **Broker URL** — the hostname or IP from Phase 1.
- **Port** — `1883` for plain or `8883` for TLS.
- **Protocol** — `MQTT` (plain) or `MQTT_TLS`.
- **Tenant ID** — `zebra` is the canonical default (lowercase). Change later for multi-tenant brokers.
- **MQTT parameters** — keepAlive, cleanSession defaults are fine for evaluation.
- **Credentials** — if your broker requires authentication.
- **Certificate material** — if using TLS (the certs must be loaded before this point; covered in Phase 5).

#### 7. Save and activate

Save the configuration and activate the MDM endpoint. The sled may reboot to apply the endpoint configuration — this is expected behavior. When it comes back, it will attempt to connect to your broker.

#### 8. Confirm the bootstrap connection is live

Watch your broker logs (Mosquitto: `mosquitto -v` shows every connection). You should see an incoming MQTT connection from the sled's IP within a few seconds of the activation. In MQTTX, subscribe to `+/MDM/#` (one tenant prefix, then all MDM traffic) — you should see the sled's own traffic.

### Success check

- The sled is connected to Wi-Fi.
- The broker logs show an incoming MQTT connection identifying the sled.
- The MDM endpoint shows an "active" / "connected" state in 123RFID Desktop.
- You have noted: the sled's serial number (on the back of the device and in the UI), the broker URL and port, and the tenant ID.

### Didn't work?

- **No Wi-Fi association.** Verify SSID, security type, and password exactly (case-sensitive). Enterprise networks need a certificate chain installed — beyond Quick Start scope.
- **Wi-Fi associates but no broker connection.** DNS or routing issue. Try an IP address rather than hostname.
- **Connection appears then drops.** Credentials wrong on the broker side, or the broker rejects the client ID. Mosquitto with `allow_anonymous true` won't reject anything; HiveMQ Cloud and AWS IoT Core need credentials.
- **MDM endpoint cannot be configured.** Confirm 123RFID Desktop is v3.0 or later. Older versions handle MDM differently.

### Where to go next

[Phase 3 — Verify the bootstrap connection (`get_version`)](/getting-started/quick-start/step-3-subscribe).
