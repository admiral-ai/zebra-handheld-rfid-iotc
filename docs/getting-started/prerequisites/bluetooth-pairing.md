---
id: bluetooth-pairing
title: How to Pair the Reader Sled via Bluetooth
sidebar_label: How to Pair the Reader Sled via Bluetooth
---

> 📙 **HOW-TO** · Audience: New Integrator · Time: ~5 min

Bluetooth pairing connects the sled to a host device. Pair before:

- **Bridged (RFD40 Standard) bootstrap** — the host is the network path, and 123RFID Mobile uses the BT link for region, endpoint, and verification.
- **Bridged production operation** — every MQTT message rides BT to the host, then Wi-Fi to the broker.
- **Direct sled paired with a Zebra mobile computer as an operator UI** — optional but common on Premium / Premium Plus / RFD90.

The pairing itself is an OS-level Android operation; what makes it Zebra-flavored is the three discovery methods that **123RFID Mobile** unlocks, listed below from fastest to most manual.

### Method 1: NFC Tap-and-Pair

The fastest path. Works on sleds that include an NFC tag (typical for Premium and Premium Plus).

1. On the Android host, enable **NFC** in the system Settings (Connections → NFC).
2. Open **123RFID Mobile**.
3. Touch the back of the host phone to the **NFC tag area** on the sled's trigger handle (look for the NFC icon on the trigger).
4. Android prompts: **Pair with `RFD40-…` ?** Tap **Pair**.
5. 123RFID Mobile auto-detects the new pair and lists the sled under **Available Readers**.

**You should see:** the sled with a green connection indicator in 123RFID Mobile within ~5 seconds.

### Method 2: Scan-and-Pair via barcode

The fastest path for Zebra Enterprise mobile computers (TC52, TC72, MC93xx, etc.) that ship with 123RFID Mobile and a barcode scanner.

1. On the back of the sled, locate the **Bluetooth pairing barcode** label.
2. Open **123RFID Mobile** → **FIND READERS** → **Scan to Pair**.
3. Aim the host's integrated scanner at the barcode and pull the trigger.
4. The mobile computer decodes the barcode, extracts the sled's Bluetooth MAC, and initiates the pair.
5. Accept the Android pairing prompt.

**You should see:** the sled listed as **Connected** in 123RFID Mobile within ~10 seconds.

> The Scan-and-Pair helper is only available on Zebra mobile computers with the bundled 123RFID Mobile build. On consumer Android phones, use Method 1 (NFC) or Method 3 (manual MAC).

### Method 3: Manual Bluetooth MAC pairing

Works on every Android 11+ host. Use when NFC and barcode are unavailable.

1. On the sled, hold the trigger and a power button combination to enter **pairing-discoverable mode** (the LED blinks blue rapidly). See the sled's product label for the exact button combination — it differs by model.
2. On the Android host, open **Settings → Connected devices → Pair new device**.
3. Wait for the sled to appear by its Bluetooth name (`RFD40-<serial>` or `RFD90-<serial>`).
4. Tap the entry. Accept the pairing confirmation on both sides.
5. Open **123RFID Mobile** and select the sled from **Available Readers**.

**You should see:** the sled listed under Android's **Paired devices** and selectable inside 123RFID Mobile.

### After pairing

Once paired, the sled persists in the host's Bluetooth paired-devices list until you forget it.

- On **Bridged** sleds, continue to [Bootstrap with 123RFID Mobile](/foundations/introduction/bootstrap-tools) to set region, configure the MDM endpoint, and bring the sled online.
- On **Direct** sleds, the pair is for operator-UI use; the MQTT path is the sled's own Wi-Fi, unrelated to this BT link.

### Why not just any MQTT-over-BT client?

The Bluetooth link uses Zebra's **eConnex** profile, a proprietary BT envelope that frames RFID-control traffic and exposes the IoTC command surface to the host. A generic Android Bluetooth Serial app cannot speak it; you need 123RFID Mobile or the Zebra Android Service SDK.

### Out of scope

- **Why pair in the first place** (BT as the only attach option on Bridged), see [Roles: Reader, Host, Broker, Application](/foundations/architecture/components).
- **Bootstrap-tool comparison**, see [Two bootstrap tools: 123RFID Desktop and 123RFID Mobile](/foundations/introduction/bootstrap-tools).
- **eConnex profile internals**, see the Zebra Android Service SDK reference (not part of the IoTC MQTT surface).

**Related:** 📘 [Two bootstrap tools: 123RFID Desktop and 123RFID Mobile](/foundations/introduction/bootstrap-tools) · 📘 [Roles: Reader, Host, Broker, Application](/foundations/architecture/components) · 📗 [Bootstrap with 123RFID Desktop](/getting-started/quick-start/step-2-discover) · 📕 [Hardware & Software Requirements](/getting-started/prerequisites/requirements)
