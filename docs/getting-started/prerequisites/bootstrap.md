---
id: bootstrap
title: Reader Bootstrap with 123RFID Desktop
sidebar_label: Reader Bootstrap with 123RFID Desktop
---

> 📗 **TUTORIAL** · Audience: New Integrator · Time: ~15 min

In this tutorial, we will bootstrap a fresh RFD40 or RFD90 sled using 123RFID Desktop. We will set the regulatory region, configure a Wi-Fi profile, and point the reader at its MDM endpoint. After this tutorial the sled is ready for MQTT enrollment.

### Prerequisites

One Windows 10 or 11 laptop with 123RFID Desktop installed, one sled, one USB-C cable.

### Step 1: Connect the sled via USB

Plug the sled into the laptop's USB-C port. Within a few seconds, the sled's status LED transitions from a slow blink to a steady glow.

**You should see** the device appear in 123RFID Desktop's left-hand device pane, labelled with its serial number.

### Step 2: Set the regulatory region

In the device pane, select the sled. In the right-hand configuration tabs, open **Region**. Choose your country from the drop-down. Click **Apply**.

**You should see** the **Region** field update to your country code (e.g., `US`, `EU1`, `IN`).

> Region settings can be configured **only** through 123RFID Desktop. They are not available over MQTT. Make sure the region is correct before continuing.

### Step 3: Configure a Wi-Fi profile

Open the **Wi-Fi** tab. Click **Add Profile**. Enter the SSID, choose **WPA2-Personal**, and enter the passphrase. Click **Apply**.

**You should see** the new profile listed in the Wi-Fi tab with status **Configured**.

### Step 4: Set the MDM endpoint URL

Open the **MDM** tab. Enter the URL provided by your SOTI Connect administrator (or use the Zebra default if you are not using SOTI yet). Click **Apply**.

**You should see** the MDM endpoint reflected in the config summary at the top of the window.

### Step 5: Apply and disconnect

Click **Save Configuration to Device** at the bottom of the window. Wait for the confirmation dialog.

**You should see** the sled's LED blink three times rapidly, acknowledging the saved configuration.

Disconnect the USB cable.

### Recap

You have just configured a sled for first use. The regulatory region is set, a Wi-Fi profile is configured, and the MDM endpoint is in place. The sled is now ready to be paired with a host device ([§4.4](/getting-started/prerequisites/bluetooth-pairing)) and brought online over MQTT ([§5 Quick Start](#chapter-5--quick-start-tutorial)).

**Related:** 📘 [§1.2 Supported Hardware](/foundations/introduction/supported-hardware) · 📕 [§20.5 Regulatory Information](/reference/appendices/regulatory) · 📗 [§5 Quick Start](#chapter-5--quick-start-tutorial) · 📙 [§4.4 Bluetooth Pairing](/getting-started/prerequisites/bluetooth-pairing)
