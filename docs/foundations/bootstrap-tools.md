---
id: bootstrap-tools
title: "Two bootstrap tools: 123RFID Desktop and 123RFID Mobile"
sidebar_label: "Two bootstrap tools: Desktop & Mobile"
---

> 📘 **EXPLANATION** · **Audience:** New Integrator, Solution Builder · **Read time:** ~5 min

A sled out of the box has no regulatory region, no Wi-Fi credentials (Direct) or host pairing (Bridged), and no broker target. **None of these can be set over MQTT.** Zebra ships two free bootstrap tools for that first-light provisioning, picked by the tier of the sled you have in hand.

| Tool | Platform | First attach | Tier it bootstraps |
|---|---|---|---|
| **123RFID Desktop** | Windows 10 / 11 | USB-C (or Bluetooth after pairing) | 🅓 Direct: RFD40 Premium, Premium Plus, RFD90 |
| **123RFID Mobile** | Android 7+ (Nougat) | Bluetooth 5.0 LE (NFC tap, host-scans-sled, sled-scans-mobile, camera, or manual) — see availability matrix in [Bluetooth pairing](/getting-started/prerequisites/bluetooth-pairing) | 🅑 Bridged: RFD40 Standard. Also works for Direct sleds over BT. |

Both tools download free from `support.zebra.com`. **Once a sled is online, every IoTC MQTT operation behaves identically across tiers** — the bootstrap-tool choice is a one-time decision about which onboarding flow your operator follows.

### Why two tools

The two tiers expose different physical attach paths at the moment a sled is unpacked.

- A **Direct** sled (Premium / Premium Plus / RFD90) has a USB-C port and an internal Wi-Fi 6 radio; the natural first attach is a USB-C cable to a Windows laptop running 123RFID Desktop.
- A **Bridged** sled (RFD40 Standard) has no Wi-Fi radio at all — it must pair Bluetooth-first to its host, which is also the device that carries its MQTT traffic afterwards; the natural first attach is a Bluetooth pair from an Android mobile computer running 123RFID Mobile.

The split is a property of **first-attach physics**, not a difference in the IoTC surface. After the MDM endpoint is active, the same [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version), [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode), [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint), [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate), and [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) commands work the same way on every sled.

### What each tool does

Both tools perform the same logical bootstrap steps; the UX and transport differ.

| Bootstrap step | 123RFID Desktop | 123RFID Mobile |
|---|---|---|
| Discover and attach the sled | Click **FIND READERS**, choose USB or Bluetooth | One of five Bluetooth pairing methods — Tap and Pair (NFC), Scan and Pair (host scans sled), Pair by Barcode (sled scans mobile), Pairing with the Camera, or Manual Android pairing; plus USB / Common IO direct attach without pairing. See [Bluetooth pairing](/getting-started/prerequisites/bluetooth-pairing). |
| Set the regulatory region | **Region** tab → choose country → **Apply** | **Settings** → **Region** → choose country → **Apply** |
| Configure Wi-Fi (Direct only) | Communication → Wi-Fi → Scan and Choose Network | n/a — Bridged sleds rely on the host's Wi-Fi; Wi-Fi for Direct via Mobile is supported when the sled itself has a Wi-Fi radio |
| Configure the MDM endpoint | Communication → **End Point** → **New** | **Settings** → MQTT / MDM endpoint |
| Activate and verify the bootstrap connection | End Point Status → **Activate** → **Refresh** | Connection-status indicator on the home screen |

### Pairing methods supported by 123RFID Mobile

For Bluetooth pairing the mobile app supports **five** methods, each with its own sled-tier and host-device availability constraints (full procedures in [How to pair the reader sled with a host](/getting-started/prerequisites/bluetooth-pairing)):

- **Tap and Pair (NFC).** Touch the host phone to the sled's NFC tag area on the handle. **Available only on RFD40 Premium and Premium Plus** (per the *123RFID Mobile User Guide*; Standard has no NFC tag).
- **Scan and Pair.** The host's integrated barcode scanner reads a code on the sled to obtain the sled's Bluetooth MAC. **Available only on RFD40 Premium Plus, and only on Zebra Enterprise Mobile Computing devices** (not third-party Android phones).
- **Pair by Scanning a Barcode (reverse).** 123RFID Mobile displays a barcode encoding the mobile computer's Bluetooth address; the sled's scanner reads it. **Available only on RFD40 Premium Plus.**
- **Pairing with the Camera.** The mobile computer's camera (not its integrated scanner) captures a barcode on the sled. Fallback for hosts without a built-in barcode scanner.
- **Manual Android pairing.** Generic Android Bluetooth discovery and pair flow (Settings → Connected devices → Pair new device). **Works on every Android device** and is the practical default for RFD40 Standard sleds and consumer Android phones.

In addition, **USB / Common IO** is a wired direct-attach alternative (no pairing step) for RFD40 and RFD90 sleds via the 8-pin eConnex connector. *eConnex names the USB pin/connector specification* — it is not a Bluetooth profile.

### Picking your bootstrap tool

| If your sled is… | Recommended tool | Alternative |
|---|---|---|
| RFD40 Standard (Bridged) | **123RFID Mobile** on Android | None — there is no USB path for Wi-Fi or MDM on Standard |
| RFD40 Premium / Premium Plus | 123RFID Desktop | 123RFID Mobile (BT) |
| RFD90 / RFD9030 | 123RFID Desktop | 123RFID Mobile (BT) |

The default Quick Start walkthrough (Part 3) uses **123RFID Desktop**, because it gives the most predictable USB-attached experience for a brand-new Direct sled. If you're bootstrapping a Bridged (Standard) sled, or if your operator's primary device is an Android mobile computer rather than a Windows laptop, use 123RFID Mobile — the post-bootstrap MQTT surface is the same.

### What doesn't change between the two

Once the MDM endpoint is active and the sled is talking to your broker:

- The full MQTT command surface (22 commands across 4 tag groups) is identical on every sled.
- Event semantics (`heartbeatEVT`, `alerts`, `alert_short`, `mqttConnEVT`, `dataEVT`) are identical.
- Topic structure (`<tenantId>/<topic>/<deviceSerialNumber>`) is identical.
- Endpoint types (MGMT, MGMT_EVT, CTRL, DATA1, DATA2, SOTI, MDM) are identical.
- The retention buffer, QoS settings, TLS handshake, and certificate management are identical.

The **only** operational differences after bootstrap:

- Bridged sleds report `terminalConnection` events for their host's Bluetooth link, because there *is* a host link to report on. Direct sleds do not, because there is no host in the network path.
- [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi) is a no-op surface on Bridged sleds, because the sled has no on-board Wi-Fi radio; on Bridged the host owns the network, and host-side Wi-Fi configuration is out of the IoTC scope.

### Out of scope

- **OS-level Bluetooth pairing as a separate concept**, see [How to pair the reader sled with a host](/getting-started/prerequisites/bluetooth-pairing).
- **The full bootstrap walkthroughs (with screenshots)**, see the two Phase 2 pages of the Quick Start: [Direct (123RFID Desktop)](/getting-started/quick-start/step-2-discover) and [Bridged (123RFID Mobile)](/getting-started/quick-start/step-2-discover-mobile).
- **Tier identification by SKU label**, see [Which sled do you have?](/foundations/hardware-tiers).

**Related:** 📘 [Which sled do you have? (Direct vs Bridged)](/foundations/hardware-tiers) · 📘 [Roles: Reader, Host, Broker, Application](/foundations/actors) · 📗 [Phase 2: Direct (123RFID Desktop)](/getting-started/quick-start/step-2-discover) · 📗 [Phase 2: Bridged (123RFID Mobile)](/getting-started/quick-start/step-2-discover-mobile) · 📙 [How to pair the reader sled with a host](/getting-started/prerequisites/bluetooth-pairing)
