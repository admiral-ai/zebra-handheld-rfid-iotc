---
id: step-2-discover
title: "Phase 2: Bootstrap (Direct, 123RFID Desktop)"
sidebar_label: "Direct (123RFID Desktop)"
---

> 📗 **TUTORIAL** · **Phase:** 2 of 7 · **Audience:** Operator with a Windows laptop · **Time:** ~8 min · **Path:** 🅓 Direct (USB-C)

**Artifact this phase produces:** an **active MDM endpoint** on the sled, connected to your broker. The MDM endpoint is the bootstrap connection, the first live MQTT path into and out of the reader. **Until this is active, no MQTT command works.**

> **Bootstrapping a Bridged (RFD40 Standard) sled?** Use **123RFID Mobile** on an Android device instead — see the sibling page [Phase 2: Bridged (123RFID Mobile)](/getting-started/quick-start/step-2-discover-mobile). The Standard sled has no USB-C bootstrap path and no on-sled Wi-Fi radio — its host phone supplies the network. The logical bootstrap steps are identical (region → endpoint → activate); only the transport and UI differ.
>
> **Premium / Premium Plus / RFD90 operator without a Windows laptop?** 123RFID Mobile also bootstraps Direct sleds over Bluetooth. Use either page; the post-bootstrap MQTT surface is identical.

### Why this phase exists

A sled out of the box has factory firmware, no Wi-Fi credentials, no broker target, and no regulatory region. None of these can be set over MQTT. 123RFID Desktop is the **only** path for the initial provisioning. After this phase the sled has:

- Regulatory region (e.g., `US`, `EU1`, `JP`) (locked into firmware).
- A Wi-Fi profile with SSID, security type, and credentials.
- An active **MDM endpoint** with broker URL, port, protocol, and tenant ID.
- A bootstrap connection that you can use in Phase 3 to send MQTT commands.

### Install and open 123RFID Desktop

Download from `support.zebra.com` (search "123RFID Desktop"). Latest is v3.0.0.63 at time of writing. Windows only. Launch it; the Welcome screen appears.

### Discover and connect the reader

Before configuring Wi-Fi or MQTT, discover and connect the reader to your PC via a direct connection (USB-C cable, or Bluetooth if the reader is paired with the host).

#### Initiate discovery

Click the **FIND READERS** button on the main screen.

![123RFID Desktop welcome screen with the FIND READERS button highlighted](/img/quick-start/01-find-readers.png)

#### Select the connection type

In the Reader Discovery screen, click the **Bluetooth** icon (or **USB** if connecting via cable) to scan for nearby devices.

![Reader Discovery screen showing Bluetooth and USB connection-type icons](/img/quick-start/02-discovery-bluetooth-usb.png)

#### Choose your device

An **Add a device** pop-up window opens. Select the handheld reader from the list; verify that the serial number matches the label on the back of the sled. Click **Next**.

![Add a device pop-up listing discovered handheld readers](/img/quick-start/03-add-device.png)

#### Connect

Locate your device in the **Available Readers** list and click the green **CONNECT** button next to it.

![Available Readers list with the green CONNECT button next to a reader](/img/quick-start/04-available-readers-connect.png)

#### Verify the connection

Once connected, the reader moves from the bottom list to the **Connected Readers** section at the top of the interface.

![Connected Readers section showing the reader successfully connected](/img/quick-start/05-connected-readers.png)

### Set the region

In the **Region** tab, select your regulatory region from the dropdown and confirm. The sled may briefly disconnect and reconnect as the region is applied.

> **Once set, the region is locked into firmware.** Changing it later requires a factory reset and re-bootstrap. Choose carefully.

### Configure Wi-Fi connectivity

For MQTT and other network-dependent protocols to function, the reader needs a stable network path to your broker. Wi-Fi is the typical choice for handheld deployments.

#### Open the reader configuration

Click the **Configure** icon (gear symbol) in the left-hand navigation panel. The Reader Configuration window appears. Click the picture of the connected reader to edit its settings.

![Reader Configuration window with a picture of the connected reader](/img/quick-start/06-reader-configuration.png)

#### Edit configuration on the reader

A page opens with two buttons. Click **Edit Configuration on Reader**.

![Edit Configuration on Reader button on the reader-configuration page](/img/quick-start/07-edit-configuration.png)

#### Navigate to Communication

From the left-hand menu in the settings view, select **Communication**.

![Communication menu item in the settings sidebar](/img/quick-start/08-communication-menu.png)

#### Access Wi-Fi settings and add a network

The **Wi-Fi Configuration** window opens by default. Select the **Scan and Choose Network** radio button to search for available networks, then pick your network's SSID from the drop-down list.

![Wi-Fi Configuration window with the Scan and Choose Network option](/img/quick-start/09-wifi-scan-network.png)

#### Enter credentials and connect

Choose the appropriate security protocol (for example, **WPA2_Personal_CCMP**) and enter the passkey. Click **Add**, then click **Connect**.

![Wi-Fi connected status showing SSID, IP address, and MAC](/img/quick-start/10-wifi-connected.png)

#### Verify the network

In the **Existing Connection** section, confirm that the connected SSID, assigned IP address, MAC address, and connection status are correct, and that the Wi-Fi network can reach the broker (the path you verified in Phase 1).

### Configure the MDM endpoint

Configure the MQTT broker connection so the reader can send commands to and receive responses from your broker.

#### Navigate to the End Point tab

While still in the **Communication** section, click the **End Point** tab at the top.

![End Point tab in the Communication settings view](/img/quick-start/11-endpoint-tab.png)

#### Create a new endpoint

Click the **New** button on the right side of the screen.

![New endpoint button in the End Point configuration screen](/img/quick-start/12-new-endpoint.png)

Fill in at least these fields:

- **Endpoint name** — anything readable, e.g., `mdm_bootstrap`.
- **Broker URL** — the hostname or IP from Phase 1.
- **Port** — `1883` for plain MQTT or `8883` for TLS.
- **Protocol** — `MQTT` (plain) or `MQTT_TLS`.
- **Tenant ID** — `zebra` is the default (lowercase). Change later for multi-tenant brokers.
- **MQTT parameters** — `keepAlive` and `cleanSession` defaults are fine for evaluation.
- **Credentials** — if your broker requires authentication.
- **Certificate material** — if using TLS (certs must be installed beforehand; covered in Phase 5).

> **Note:** Command Topic, Response Topic, and Event Topic are optional. If left blank, default values are populated automatically when you click **Add**.

#### Add the endpoint

Once all required fields are filled, click **Add**. The new endpoint appears in the endpoint list at the bottom of the screen.

![New endpoint added to the endpoint list at the bottom of the screen](/img/quick-start/13-add-endpoint.png)

### Activate and verify

#### Activate the endpoint

Select the **Activate** checkbox in the row corresponding to your new endpoint.

![Activate checkbox selected for the new endpoint](/img/quick-start/14-activate-endpoint.png)

#### Verify the endpoint status

Under the **Endpoint Status** section, click **Refresh** to confirm that the connection has been established and reads **Connected**.

![Endpoint Status section showing the endpoint as Connected after Refresh](/img/quick-start/15-verify-endpoint-status.png)

#### Confirm the bootstrap connection is live

Watch your broker logs (for Mosquitto, `mosquitto -v` shows every connection). You should see an incoming MQTT connection from the sled's IP within a few seconds. In MQTTX, subscribe to `+/MDM/#` (one tenant prefix, then all MDM traffic); you should see the sled's own traffic.

### Success check

- The sled is connected to Wi-Fi.
- The broker logs show an incoming MQTT connection identifying the sled.
- The MDM endpoint shows an **active** / **Connected** state in 123RFID Desktop.
- You have noted: the sled's serial number (on the back of the device and in the UI), the broker URL and port, and the tenant ID.

### Didn't work?

- **No Wi-Fi association.** Verify SSID, security type, and password exactly (case-sensitive). Enterprise networks need a certificate chain installed; beyond Quick Start scope.
- **Wi-Fi associates but no broker connection.** DNS or routing issue. Try an IP address rather than hostname.
- **Connection appears then drops.** Credentials wrong on the broker side, or the broker rejects the client ID. Mosquitto with `allow_anonymous true` won't reject anything; HiveMQ Cloud and AWS IoT Core need credentials.
- **MDM endpoint cannot be configured.** Confirm 123RFID Desktop is v3.0 or later. Older versions handle MDM differently.

### Where to go next

[Phase 3. Verify the bootstrap connection ([`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version))](/getting-started/quick-start/step-3-subscribe).
