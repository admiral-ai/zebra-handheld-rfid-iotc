---
id: bluetooth-pairing
title: How to pair a reader sled with a host
sidebar_label: "Bluetooth pairing"
description: Pair an RFD40 or RFD90 sled with a host phone over Bluetooth 5.0 LE. Covers the 123RFID Mobile pairing flow, retry behaviour, common pairing failures.
---

> 📙 **HOW-TO** · **Audience:** New Integrator · **Time:** ~5 min · **Source of truth:** *123RFID Mobile Application User Guide* (Zebra, MN-003765-09EN Rev A)

A reader sled attaches to its Android host in one of **two ways**:

- **Wired:** the **8-pin Common IO / USB** path on the sled (RFD40 / RFD90 sleds only). No pairing step is needed — connect the cable and the host recognises the sled.
- **Wireless:** **Bluetooth**, after a one-time pair. 123RFID Mobile supports **five** Bluetooth pairing methods, each with a different sled-tier and host-device availability.

You typically pair before:

- **Bridged (RFD40 Standard) bootstrap and operation** — the host carries the sled's traffic. Standard sleds have only the **Manual** and **Camera** pairing paths available (see below).
- **Direct (RFD40 Premium / Premium Plus / RFD90) operator-UI use** — optional; the network path is the sled's own Wi-Fi regardless of whether a host is paired.

### Method 1: Tap and Pair (NFC) — Premium and Premium Plus only

The fastest path. **Available only on RFD40 Premium and Premium Plus** (per the *123RFID Mobile Application User Guide*; Standard sleds have no NFC tag).

1. From the bottom navigation bar in **123RFID Mobile**, tap **Readers**.
2. Tap the **+** icon.
3. Align the **NFC area behind the sled's handle** with the NFC area on the back of the mobile computer.
4. On the Android **Pair with** screen, optionally tick *Allow access to your contacts and call history*, then tap **PAIR**.

**You should see:** the reader appear in the **Available Readers** list. On subsequent power-ups, the sled auto-connects via the 123RFID Mobile Reader Discovery feature.

### Method 2: Scan and Pair — Premium Plus only, Zebra Enterprise hosts only

The host's integrated barcode scanner reads a code on the sled to extract the sled's Bluetooth MAC.

**Availability constraints (both must hold):**

- Sled: **RFD40 Premium Plus** only (per the reference; not Premium, not Standard).
- Host: **Zebra Enterprise Mobile Computing device** only (not third-party Android phones).

1. From the bottom navigation bar in 123RFID Mobile, tap **Readers**.
2. Tap **+** → **Scan**.
3. **Scan the code on the sled** with the mobile computer's scanner to obtain the sled's Bluetooth MAC. Alternatively scan the sled's serial-number barcode, or **enter the Bluetooth MAC ID manually** if you have it.
4. Tap **PAIR**.
5. On the Android **Pair with** screen, optionally tick *Allow access to your contacts and call history*, then tap **PAIR**.

### Method 3: Pair by Scanning a Barcode (reverse direction) — Premium Plus only

In this method the mobile app **displays** a barcode encoding the mobile computer's own Bluetooth address, and the **sled's** scanner reads it. **Available only on RFD40 Premium Plus.**

1. From the bottom navigation bar in 123RFID Mobile, tap **Readers**.
2. Tap **+** → **Barcode**.
3. **First-time setup:** provide the mobile computer's Bluetooth address. Either tap the **click here** link on the *Please Enter Your Bluetooth Address* screen, or navigate to **Settings → About Phone → Status → Bluetooth address**, copy the address, and paste it into the field.
4. Tap **Continue**. 123RFID Mobile generates the Bluetooth-address barcode and displays it.
5. **Scan the displayed barcode with the sled.**
6. Tap **PAIR**.
7. On the Android **Pair with** screen, optionally tick *Allow access to your contacts and call history*, then tap **PAIR**.

### Method 4: Pairing with the Camera

Uses the mobile computer's camera (not its integrated barcode scanner) to capture the barcode on the sled.

1. In 123RFID Mobile's pair flow, tap the **Camera** tab.
2. Tap **Scan** to activate the camera.
3. Tap the screen to capture the barcode on the sled.

This is the fallback for hosts without an integrated barcode scanner.

### Method 5: Manual Bluetooth pairing — works on every Android 7+ host

Use when none of the above are available — in particular, **this is the path for RFD40 Standard sleds and for consumer Android phones**.

1. Enable Bluetooth on the host (swipe down → tap the Bluetooth icon).
2. Open **Settings → Connected devices → Connection preferences → Bluetooth**, then touch and hold **Bluetooth** and tap **Pair new device**.
3. Ensure the sled is powered on and within 10 m / 32.8 ft of the host. The sled appears under **Available devices**.
4. Tap the sled in the list. Confirm the Bluetooth pairing-request dialog on both sides.
5. The sled is added to the host's **Paired devices** list.
6. Open **123RFID Mobile** → **Readers** and select the sled from **Available Readers**.

> If the sled does not appear in the Android discovery list, confirm it is powered on, that the host is within ~10 m, and that no other host has it already paired/connected. Sled-side discoverability behavior (button combinations, LED patterns) varies by model; consult the **RFD40 Product Reference Guide** (MN-004189) or **RFD4031 Product Reference Guide** (MN-004373) for your specific SKU.

### Alternative: USB / Common IO direct attach (no pairing needed)

For RFD40 and RFD90 sleds you can skip Bluetooth entirely and connect the sled to the host via the **8-pin Common IO** (or USB) port using a USB eConnex pin. There is no pairing step — launch 123RFID Mobile and the RFID Rapid Read screen displays with the sled directly attached. (Note: **eConnex is the USB connector/pin specification**, not a Bluetooth profile.)

### Pairing-method availability matrix

| Method | RFD40 Standard 🅑 | RFD40 Premium 🅓 | RFD40 Premium Plus 🅓 | RFD90 🅓 |
|---|---|---|---|---|
| Tap and Pair (NFC) | — | ✅ | ✅ | — (per reference) |
| Scan and Pair (host scans sled) | — | — | ✅ (Zebra Enterprise hosts only) | — |
| Pair by Scanning a Barcode (sled scans mobile's barcode) | — | — | ✅ | — |
| Pairing with the Camera | — | ✅ | ✅ | ✅ |
| Manual (Android Settings) | ✅ | ✅ | ✅ | ✅ |
| USB / Common IO (no pairing) | ✅ | ✅ | ✅ | ✅ |

**Implication for Bridged sleds.** Because NFC, Scan-and-Pair, and Barcode-display pairing are all Premium/Premium Plus features, **RFD40 Standard operators in the field will use either the Camera method or the Manual method** (or the USB/Common IO wired attach when available).

### After pairing

Once paired, the sled persists in the host's Android **Paired devices** list until you forget it. 123RFID Mobile's Reader Discovery auto-reconnects the same pair on subsequent launches.

- On **Bridged** sleds, continue to [Phase 2: Bootstrap (Bridged, 123RFID Mobile)](/quick-start/phase-2/bridged) — set Regulatory, configure the MDM endpoint, and bring the sled online.
- On **Direct** sleds, the pair is optional for operator-UI use; the MQTT path is the sled's own Wi-Fi. If you do want to bootstrap via Mobile rather than 123RFID Desktop, the same Mobile walkthrough applies; otherwise see [Phase 2: Direct (123RFID Desktop)](/quick-start/phase-2/direct).

### Out of scope

- **Why pair in the first place** (Bluetooth as the network path on Bridged), see [Roles: Reader, Host, Broker, Application](/foundations/actors).
- **Bootstrap-tool comparison**, see [Two bootstrap tools: 123RFID Desktop and 123RFID Mobile](/foundations/bootstrap-tools).
- **Sled-side button combinations and LED patterns**, see the RFD40 / RFD4031 / RFD90 Product Reference Guides on `support.zebra.com`. This documentation does not duplicate the per-SKU hardware operation manuals.

**Related:** 📘 [Two bootstrap tools: 123RFID Desktop and 123RFID Mobile](/foundations/bootstrap-tools) · 📘 [Roles: Reader, Host, Broker, Application](/foundations/actors) · 📗 [Phase 2: Direct (123RFID Desktop)](/quick-start/phase-2/direct) · 📗 [Phase 2: Bridged (123RFID Mobile)](/quick-start/phase-2/bridged) · 📕 [Hardware & Software Requirements](/quick-start/prerequisites/requirements)
