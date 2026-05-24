---
id: step-2-discover-mobile
title: "Phase 2: Bootstrap (Bridged, 123RFID Mobile)"
sidebar_label: "Bridged (123RFID Mobile)"
---

> 📗 **TUTORIAL** · Phase 2 of 7 · Audience: Operator with an Android mobile computer · Time: ~8 min · Path: 🅑 Bridged (RFD40 Standard) — also valid for 🅓 Direct sleds when no Windows laptop is available

**Artifact this phase produces:** an **active MDM endpoint** on the sled, connected to your broker. The MDM endpoint is the bootstrap connection, the first live MQTT path into and out of the reader. **Until this is active, no MQTT command works.**

> **Bootstrapping a Direct (RFD40 Premium / Premium Plus / RFD90) sled with a Windows laptop?** Use **123RFID Desktop** instead — see [Phase 2: Direct (123RFID Desktop)](/getting-started/quick-start/step-2-discover). The post-bootstrap MQTT surface is identical either way; pick the tool that matches your operator's first attach (USB-C vs Bluetooth).

### Why this phase exists

A sled out of the box has factory firmware, no host pairing (Bridged) or Wi-Fi credentials (Direct), no broker target, and no regulatory region. None of these can be set over MQTT. 123RFID Mobile is the Android-side bootstrap path. After this phase the sled has:

- A persistent **Bluetooth pair** with the host (Bridged: required; Direct: optional).
- Regulatory region (e.g., `US`, `EU1`, `JP`) locked into firmware.
- For Direct sleds: an on-sled Wi-Fi profile (Bridged sleds inherit the host's network and skip this step).
- An active **MDM endpoint** with broker URL, port, protocol, and tenant ID.
- A bootstrap connection that you can use in Phase 3 to send MQTT commands.

### Install and open 123RFID Mobile

Install from the Google Play Store (search "123RFID Mobile") or download the APK from `support.zebra.com`. **Recommended Android version:** 11 or later. Per the *123RFID Mobile User Guide* the minimum is Nougat (Android 7), but newer Android versions are recommended.

> The application is also available pre-installed on most Zebra Enterprise Mobile Computing devices (TC52, TC72, MC93xx, etc.).

Launch the app. The Home screen appears.

[SCREENSHOT: M-01. 123RFID Mobile Home screen with the bottom navigation bar visible]

### Pair the sled with the host

If the sled is not yet paired, follow the appropriate path in [How to pair the reader sled with a host](/getting-started/prerequisites/bluetooth-pairing). The five Bluetooth pairing methods (Tap-and-Pair, Scan-and-Pair, Pair-by-Barcode, Camera, Manual) carry different sled-tier and host-device constraints; pick the one that matches your hardware.

Once paired, the sled appears in **Readers → Available Readers**.

[SCREENSHOT: M-02. Readers tab showing the paired sled in the Available Readers list]

Tap the sled name to establish a session. The sled moves to **Connected Readers**.

[SCREENSHOT: M-03. Readers tab with the sled now in Connected Readers]

### Set the regulatory region

From the bottom navigation bar, tap **Settings → RFID → Regulatory**.

[SCREENSHOT: M-04. Settings → RFID → Regulatory menu path]

> **WARNING:** Select only the country in which you are using the reader.

Select your region from the drop-down list. Confirm the available channels.

[SCREENSHOT: M-05. Regulatory screen with region drop-down and channel list]

> **Once set, the region is locked into firmware.** Changing it later requires a factory reset and re-bootstrap. Choose carefully.

### Configure WLAN — Direct sleds only 🅓

**Skip this section if your sled is RFD40 Standard 🅑.** Standard sleds have no on-board Wi-Fi radio; their network path is the host's Wi-Fi (or mobile data), and Wi-Fi configuration lives in the host's Android OS settings, not in 123RFID Mobile. See [Two bootstrap tools](/foundations/introduction/bootstrap-tools) for the rationale.

For Direct sleds (RFD40 Premium / Premium Plus / RFD90), configure the on-sled Wi-Fi profile so the sled can reach the broker directly:

1. From the bottom navigation bar, tap **Settings → WIFI**. The **WLAN Settings** screen appears with the current Wi-Fi status and connection details.

   [SCREENSHOT: M-06. WLAN Settings screen showing Wi-Fi Status]

2. **Select the channel band(s)** the sled is allowed to use. Tap to enable or disable:
   - **2.4 GHz**
   - **5 GHz NON DFS**
   - **5 GHz DFS**

   [SCREENSHOT: M-07. Channel List Band selection with 2.4 GHz / 5 GHz NON DFS / 5 GHz DFS toggles]

3. Tap **Wi-Fi Settings** to initiate a scan. Available SSIDs are listed.

   [SCREENSHOT: M-08. Wi-Fi Settings screen with the SSID scan results]

4. Tap your network's SSID, then create a WLAN profile and save it to the reader.

   [SCREENSHOT: M-09. WLAN profile creation form with security type and passphrase fields]

### Install certificates (optional — needed for MQTT_TLS or Enterprise Wi-Fi)

If your MDM endpoint requires TLS (`MQTT_TLS`), or your Wi-Fi profile uses an Enterprise security type (`WPA2Enterprise` / `WPA3Enterprise`), install the certificate material first.

> **Admin login may be required.** Per the *123RFID Mobile User Guide*: "This feature can be accessed by logging in as an Admin to the RFD40/90 EU devices." If the Certificates Management screen prompts for an admin password, see [Admin Login](https://support.zebra.com) in the Mobile guide.

1. From the bottom navigation bar, tap **Settings → Certificates Management**.

   [SCREENSHOT: M-10. Settings → Certificates Management menu path]

2. Tap **Add New**.
3. Select the **interface** the certificate is for:
   - **Wi-Fi** (for Enterprise SSIDs)
   - **MQTT** (for MQTT_TLS endpoints)
   - **Filestore** (for the HTTP file server source)
   - **Others**

4. Select the **certificate type:** `Ca_cert`, `Client_cert`, or `Client_key`.
5. Browse and select the certificate file. Tap **Upload Certificate**.

   [SCREENSHOT: M-11. Add Certificate form with interface / type / file picker]

Repeat for each certificate component. For TLS-authenticated MQTT you typically need all three: CA cert, client cert, client key.

### Configure the MDM endpoint

This is the bootstrap connection — the live MQTT path into the reader.

> **Admin login may be required**, same caveat as Certificates Management.

1. From the bottom navigation bar, tap **Settings → Endpoint Configuration**.

   [SCREENSHOT: M-12. Settings → Endpoint Configuration menu path]

   The **Endpoint Status** section shows the status of the currently active endpoint.

   [SCREENSHOT: M-13. Endpoint Configuration screen with Endpoint Status section]

2. Tap **Add New**.

3. Fill in the endpoint fields:

   | Field | Value |
   |---|---|
   | **Endpoint name** | Anything readable, e.g., `mdm_bootstrap` |
   | **Endpoint type** | **MDM** (the bootstrap default), or **SOTI** if you're enrolling via SOTI Connect |
   | **Protocol** | **MQTT** (plain, port 1883) or **MQTT_TLS** (port 8883, requires installed certificates) |
   | **URL / server address** | The broker hostname or IP from Phase 1 |
   | **Port** | `1883` for plain MQTT or `8883` for TLS |
   | **Keep Alive** | Default (60 s) is fine for evaluation |
   | **Tenant ID** | `zebra` (lowercase) is the default. Change later for multi-tenant brokers. |
   | **Min Reconnect Delay** | The minimum back-off after a disconnect (seconds) |
   | **Max Reconnect Delay** | The maximum back-off ceiling (seconds) |
   | **Username / Password** | If your broker requires authentication |

   [SCREENSHOT: M-14. Add Endpoint form with all fields populated]

4. Tap to save the new endpoint configuration.

### Activate and verify

1. **Check the Activate checkbox** for the new endpoint to enable it. Uncheck to deactivate. Only one MDM (or SOTI) endpoint is active at a time.

   [SCREENSHOT: M-15. Endpoint list showing the new entry with the Activate checkbox ticked]

2. Return to the **Endpoint Status** view. The new endpoint should report **Connected** within a few seconds.

3. **Confirm the bootstrap connection is live.** Watch your broker logs (for Mosquitto, `mosquitto -v` shows every connection). You should see an incoming MQTT connection from either the **sled's IP** (Direct sleds) or the **host phone's IP** (Bridged sleds) within a few seconds. In MQTTX, subscribe to `+/MDM/#` (one tenant prefix, then all MDM traffic); you should see the sled's own traffic.

### Success check

- The sled is paired and listed under **Connected Readers** in 123RFID Mobile.
- (Direct only) The sled has joined Wi-Fi and the WLAN Settings screen shows **Connected**.
- The broker logs show an incoming MQTT connection identifying the sled (Direct) or the host (Bridged carrier).
- The Endpoint Configuration screen shows the MDM endpoint as **active** / **Connected**.
- You have noted: the sled's serial number, the broker URL and port, and the tenant ID.

### Didn't work?

- **Sled does not appear in Available Readers.** The pair has failed or been removed. Re-run [bluetooth-pairing](/getting-started/prerequisites/bluetooth-pairing). On Android, also check **Settings → Connected devices** — if the sled is paired at the OS level but not visible in 123RFID Mobile, force-stop and relaunch the app.
- **(Direct only) No Wi-Fi association.** Verify SSID, security type, and passphrase exactly (case-sensitive). Enterprise networks need the certificate chain installed first via Settings → Certificates Management.
- **Wi-Fi associates but no broker connection.** DNS or routing issue. Try the broker's IP address rather than its hostname.
- **Connection appears then drops.** Credentials wrong on the broker side, or the broker rejects the client ID. Mosquitto with `allow_anonymous true` won't reject anything; HiveMQ Cloud and AWS IoT Core need credentials.
- **Endpoint Configuration screen is greyed out or asks for admin login.** Log in as Admin via **Settings → Admin Login**. On RFD40/90 EU devices these screens are admin-gated.
- **(Bridged only) Broker shows the host's IP, not the sled's.** That is expected. On Bridged sleds the host carries the sled's MQTT traffic; the sled itself has no IP because it has no Wi-Fi radio. The broker sees the host's connection.

### Where to go next

[Phase 3: Verify the bootstrap connection (`get_version`)](/getting-started/quick-start/step-3-subscribe).

**Related:** 📘 [Two bootstrap tools: 123RFID Desktop and 123RFID Mobile](/foundations/introduction/bootstrap-tools) · 📙 [How to pair the reader sled with a host](/getting-started/prerequisites/bluetooth-pairing) · 📗 [Phase 2: Direct (123RFID Desktop)](/getting-started/quick-start/step-2-discover) · 📕 [Hardware & Software Requirements](/getting-started/prerequisites/requirements)
