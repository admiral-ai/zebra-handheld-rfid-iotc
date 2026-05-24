---
id: failure-modes
title: Failure modes
sidebar_label: Failure modes
---

> 🩺 **FAILURE MODE CATALOGUE** · **Audience:** All personas in incident response · **Use:** explain *why* a symptom is happening

Twenty-four catalogued failure modes covering bootstrap, network, configuration, inventory, data, firmware, events, security, the Bridged host bridge, and fleet identity. Each entry names the failure, explains the underlying cause, lists the signals that confirm it, gives the corrective steps (or points to a recovery playbook), and links to the concept chapter that explains the surface in depth.

Identifiers are stable. `FM-XX-NN` codes do not change as new entries are added; link to them directly.

The entries are grouped:

- [Network (FM-NET)](#fm-net) — paths between sled, broker, and Wi-Fi.
- [Configuration (FM-CFG)](#fm-cfg) — endpoint and operating-mode validation failures.
- [Inventory operations (FM-OPS)](#fm-ops) — radio-state and singulation problems.
- [Tag data (FM-DATA)](#fm-data) — `dataEVT` payload completeness.
- [Firmware (FM-FW)](#fm-fw) — [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) rejection conditions.
- [Events (FM-EVT)](#fm-evt) — heartbeats, alerts, and connection events.
- [Security (FM-SEC)](#fm-sec) — TLS handshake and certificate install issues.
- [Device link (FM-DEV)](#fm-dev) — Bridged-only Bluetooth bridge problems.
- [Fleet (FM-FLEET)](#fm-fleet) — identity-level cross-device anomalies.

---

## Network {#fm-net}

### FM-NET-01: Network path between sled and broker {#fm-net-01}

**Symptom.** Sled is on Wi-Fi (`get_status.deviceStatus.radioConnection: CONNECTED`) but never reaches the broker. No `mqttConnEVT` arrives.

**Cause.** A network-layer problem between the sled's Wi-Fi segment and the broker. Common causes: subnet isolation across VLANs, firewall rules blocking outbound 1883/8883, DNS resolution failing on the sled's network, or a captive portal intercepting traffic.

**Confirm.** From a host on the sled's same Wi-Fi segment, `nc -vz <broker-host> 1883` (or 8883). If it fails or times out, the path is the problem, not the sled.

**Fix.** Open the firewall to allow MQTT egress from the sled's segment to the broker port. If DNS is the issue, use the broker's IP address in 123RFID Desktop. Bypass captive portals or move the sled to a network without them.

**See.** [Prepare network and broker](/getting-started/quick-start/step-1-connect) · [Where things fail](/reference/diagnose/two-edges)

### FM-NET-02: MDM endpoint won't connect {#fm-net-02}

**Symptom.** MDM endpoint configured and activated via 123RFID Desktop; sled has Wi-Fi; broker logs show no connection attempt from the sled IP.

**Cause.** Wrong port (1883 vs 8883), wrong protocol (`MQTT` vs `MQTT_TLS`), incorrect credentials, broker-side ACL rejection, or TLS certificate not yet installed.

**Confirm.** Watch broker logs while activating the endpoint. If you see no attempt, the sled isn't trying. If you see an attempt followed by an immediate disconnect, credentials or ACL are wrong.

**Fix.** Drop to plain `MQTT` on `1883` first to isolate TLS from authentication issues. Verify credentials against what the broker expects. If TLS is required, install the broker CA via [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) (type `mqtt`) before activating. See also [FM-NET-03](#fm-net-03) for the reconnect loop variant.

**See.** [Bootstrap with 123RFID Desktop](/getting-started/quick-start/step-2-discover) · [Securing the connection](/infrastructure/security/model)

### FM-NET-03: Reconnect loop {#fm-net-03}

**Symptom.** Sled connects to the broker, then disconnects within seconds, retries, connects again. The `mqttConnEVT` stream shows alternating CONNECTED / DISCONNECTED messages.

**Cause.** Client-ID collision (two clients with the same MQTT client ID kick each other), broker-side ACL rejecting subscribe topics, keep-alive interval shorter than the network round-trip, or aggressive idle-timeout policies on intermediate firewalls.

**Confirm.** Broker logs show repeated connect/disconnect cycles. The disconnect reason in broker logs often names the cause (`client kicked by new connection`, `topic ACL deny`).

**Fix.** Ensure each sled uses a unique MQTT client ID (default behavior is fine; do not override to a fixed value across devices). Verify broker-side ACLs allow the tenant topic prefix. Increase `mqttParams.keepAlive` to 300 s on long-haul networks.

**See.** [Knowing when you're connected](/observability/events/mqtt-connection)

### FM-NET-04: Wi-Fi Enterprise auth failure {#fm-net-04}

**Symptom.** Wi-Fi profile configured for `WPA2Enterprise` or `WPA3Enterprise`; sled associates briefly then drops. `alert_short` emits `WIFI_CONFIG_FAIL`.

**Cause.** Missing or expired certificate chain on the device, wrong logical name referenced in `set_wifi.security.certificate[].name`, EAP method mismatch (the AP requires PEAP but the profile uses TLS), or revoked client certificate.

**Confirm.** Run [`get_installed_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-installed-certificate) with type `wifi` and verify the names match what the profile references. Check certificate expiry with `openssl x509 -enddate -noout -in cert.pem`.

**Fix.** Install the correct CA, client cert, and client key via [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) (type `wifi`). Use exact logical names in the Wi-Fi profile. Choose the right `authProtocol` (`tls`, `ttls`, or `peap`) per the AP's RADIUS configuration.

**See.** [Getting on the network](/infrastructure/network/architecture) · [Securing the connection](/infrastructure/security/model)

---

## Configuration {#fm-cfg}

### FM-CFG-01: Endpoint name collision {#fm-cfg-01}

**Symptom.** [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) with `operation: "add"` returns response code `10` (`IOT_ERROR_CONFIG_ALREADY_EXIST`).

**Cause.** An endpoint with the same `endpointName` already exists on the device — either created earlier, restored from a saved configuration, or created by an MDM push.

**Confirm.** Run [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) and inspect `endpointResponse.activeEndpoints.savedEndpoints.epNames` for the colliding name.

**Fix.** Either use `operation: "update"` to modify the existing endpoint, or `operation: "delete"` first and then re-add. Endpoint names should be unique and stable across the lifetime of the device.

**See.** [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · [Command Response Error Codes](/reference/errors/codes)

### FM-CFG-02: Topic count caps {#fm-cfg-02}

**Symptom.** [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) returns response code `25` (`IOT_ERROR_PUBLISH_TOPICS_EXCEEDED`) or `26` (`IOT_ERROR_SUBSCRIBE_TOPIC_EXCEEDED`).

**Cause.** Per-endpoint topic caps are tight: `publishTopics` allows at most **3** entries, `subscribeTopics` allows at most **1**. Sending more returns one of these codes.

**Fix.** Reduce the topic arrays to within the caps. If your design needs more topics, split into multiple endpoints (each with its own role — for example, one MGMT_EVT for management events and a separate DATA1 for the tag stream).

**See.** [How the MQTT plumbing fits together](/infrastructure/endpoints/about)

### FM-CFG-03: Advanced profile incomplete {#fm-cfg-03}

**Symptom.** [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) returns response code `22` (`IOT_CTRL_ADVANCED_PROFILE_NOT_SET`).

**Cause.** The `profiles` value is `ADVANCED` but no `advancedConfigurations` block was supplied. `ADVANCED` is the only profile that requires explicit `transmitPower`, `linkProfile`, `session`, and `dynamicPower`; the other five profiles fill those in from presets.

**Fix.** Either provide the `advancedConfigurations` block alongside `profiles: ADVANCED`, or switch to a preset profile (`BALANCED_PERFORMANCE`, `CYCLE_COUNT`, `DENSE_READERS`, or `OPTIMAL_BATTERY`).

**See.** [Choose how the reader reads tags](/rfid/operating-mode/profiles)

---

## Inventory operations {#fm-ops}

### FM-OPS-01: Inventory state mismatch {#fm-ops-01}

**Symptom.** `control_operation START` returns response code `11` (`IOT_ERROR_INVENTORY_IN_PROGRESS`), or [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) returns the same code.

**Cause.** An RFID inventory is already running. Both `control_operation START` and [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) require the radio to be IDLE.

**Confirm.** `get_status.deviceStatus.radioActivity` reports `ACTIVE`.

**Fix.** Send [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation) with `ctrlOprPayload.operation: "STOP"`, wait for response code `0`, then retry. The full sequence is in [RP-04](/reference/diagnose/recovery-playbooks#rp-04).

**See.** [Start, stop, and the trigger button](/rfid/operating-mode/start-stop) · [RP-04](/reference/diagnose/recovery-playbooks#rp-04)

### FM-OPS-02: Single-tag dominance {#fm-ops-02}

**Symptom.** Inventory runs; `dataEVT` events arrive; but the same EPC repeats and other tags in the field never appear.

**Cause.** A combination of factors. The closest or strongest tag (highest RSSI) dominates the Q-algorithm slot allocation. A long-persistence session (`SESSION_2` or `SESSION_3`) makes the dominant tag "remember" its inventoried flag and stop responding, but a strong tag near the antenna can collide repeatedly. Poor antenna orientation can also leave other tags outside the field.

**Fix.** Switch the operating-mode `query.session` to `SESSION_1` (500 ms – 5 s persistence) to encourage tag turnover. Set `query.tagPopulation` to a realistic estimate of the actual population (higher Q value). Reduce `transmitPower` to shrink the read zone so the dominant tag doesn't drown others. Physically reposition tags so they have line-of-sight to the antenna.

**See.** [Choose how the reader reads tags](/rfid/operating-mode/profiles)

---

## Tag data {#fm-data}

### FM-DATA-01: Missing metadata fields {#fm-data-01}

**Symptom.** `dataEVT` arrives but `RSSI`, `TID`, `USER`, `MAC`, `HOSTNAME`, `channel`, `phase`, or `seenCount` is absent or always 1.

**Cause.** Two distinct mechanisms. (a) Per-field reporting is gated by `tagMetaDataToEnable`; fields with the flag set to `false` are never emitted. (b) `channel` and `phase` are only emitted when `reportFilter duration` is `0` (per-read reporting); when greater than zero, reads are aggregated and these telemetry fields are dropped. `seenCount` is always `1` under per-read reporting and accumulates only when aggregation is on.

**Fix.** Set the needed flags in `set_operating_mode.operatingMode.operatingModes.tagMetaDataToEnable`. For per-read fidelity on `channel`, `phase`, and a meaningful `seenCount`, configure `reportFilter duration: 0`.

**See.** [Where tag reads come from](/rfid/tag-data/dataevt-schema)

---

## Firmware {#fm-fw}

### FM-FW-01: Concurrent update attempt {#fm-fw-01}

**Symptom.** [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) returns response code `4` (`IOT_STATUS_FW_UPDATE_IN_PROGRESS`).

**Cause.** Another firmware update is already running. [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) is asynchronous; once accepted (code `1`), it runs to completion (success or `FIRMWARE_UPDATE_FAIL`). A second [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) during that window is rejected.

**Fix.** Wait for the terminal `alert_short` (`FIRMWARE_UPDATE_SUCCESS` or `FIRMWARE_UPDATE_FAIL`) before sending another [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os). If you need to interrupt an in-progress update, the safe path is to wait it out; there is no documented cancel command.

**See.** [Updating firmware and rebooting](/infrastructure/management/system-operations)

### FM-FW-02: Flash exhausted {#fm-fw-02}

**Symptom.** [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) returns response code `8` (`IOT_ERROR_LOW_FLASH_SIZE`).

**Cause.** Free flash storage on the device is insufficient to download the firmware file. Common consumers of flash: large retention buffer for tag data, installed certificates, saved Wi-Fi profiles.

**Fix.** Reduce the retention buffer in `set_config.dataConfiguration.retention`. Delete unused certificates with [`delete_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-certificate). Delete unused Wi-Fi profiles with [`delete_wifi_profile`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-delete-wifi-profile). Then retry [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os).

**See.** [Updating firmware and rebooting](/infrastructure/management/system-operations) · [The reader's configuration document](/infrastructure/management/config-document)

### FM-FW-03: Firmware source unreachable {#fm-fw-03}

**Symptom.** [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) returns response code `9` (`IOT_STATUS_FILE_NOT_FOUND`).

**Cause.** The URL in `OSUpdateDetails.url` does not resolve to a downloadable file from the sled's network segment, or the server requires authentication that hasn't been satisfied.

**Confirm.** From a host on the sled's Wi-Fi segment, `curl -I <url>` to verify reachability and check the response status. If using HTTPS with `authenticationType: CERTIFICATE`, verify the CA cert is installed under type `filestore`.

**Fix.** Verify the URL is correct and reachable from the sled's segment. If the server is HTTPS-authenticated, install the CA cert via [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) (type `filestore`) and reference it as `caCertificateFile` in `OSUpdateDetails`.

**See.** [Updating firmware and rebooting](/infrastructure/management/system-operations)

### FM-FW-04: Battery-low gate {#fm-fw-04}

**Symptom.** [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os) returns response code `14` (`IOT_ERROR_FW_UPDATE_FAIL_LOW_BATTERY`).

**Cause.** Battery charge is below the firmware-update safety threshold. The firmware update is gated against the risk of mid-update power loss.

**Confirm.** `get_status.deviceStatus.batteryStatus.chargePercentage` is below ~50%, or `powerSource` is `DC` (not connected to external power).

**Fix.** Charge the sled to a safer level or connect external power (USB, WALLCHARGER, or CRADLE). Retry [`set_os`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-os). For fleet rollouts, see [RP-09](/reference/diagnose/recovery-playbooks#rp-09) on staging by battery level.

**See.** [Updating firmware and rebooting](/infrastructure/management/system-operations) · [RP-09](/reference/diagnose/recovery-playbooks#rp-09)

---

## Events {#fm-evt}

### FM-EVT-01: Connection events not routed {#fm-evt-01}

**Symptom.** Broker logs show the sled connecting and disconnecting, but the application's subscriber to `mqttConnEVT` receives nothing.

**Cause.** Two possible mismatches. (a) No active endpoint routes events of type `network` or `terminalConnection`. (b) The endpoint's `eventConfiguration` flag is `false`.

**Confirm.** Run [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config) and inspect each active endpoint's `eventConfiguration`. Look for `network: true` and (for Bridged) `terminalConnection: true`.

**Fix.** Set the flags via `config_events.eventConfiguration` or per-endpoint via `config_endpoint.configuration.eventConfiguration`. Ensure at least one active endpoint of type `MGMT_EVT` or `MDM` carries the event stream.

**See.** [Choose what the reader tells you](/observability/events/configure) · [Knowing when you're connected](/observability/events/mqtt-connection)

### FM-EVT-02: Heartbeat verbosity {#fm-evt-02}

**Symptom.** `heartbeatEVT` arrives at the configured interval, but `data.inventoryStatus` or `data.batteryAlert` blocks are absent.

**Cause.** The heartbeat skeleton always carries `eventName`, `timestamp`, `eventNumber`, and `upTime`. The two optional sub-payloads — `inventoryStatus` and `batteryAlert` — are present only when their flags are enabled.

**Fix.** Set `heartbeatConfiguration.inventoryStatus: true` and `.batteryStatus: true` via `config_events.eventConfiguration.heartbeatConfiguration`. The next heartbeat will include the sub-blocks.

**See.** [Watch your reader's pulse](/observability/events/heartbeat)

### FM-EVT-03: Two alert variants, two routes {#fm-evt-03}

**Symptom.** Application receives `alert_short` but not `alerts`, or vice versa.

**Cause.** `alert_short` and `alerts` are two distinct event streams with overlapping but not identical trigger sets. `alert_short` is optimised for MDM consumption (compact, broad `id` enum); `alerts` is application-facing (verbose, with `alertDetails`). Each is published on the endpoint(s) configured to carry it, and they can be routed independently.

**Fix.** To receive both, ensure two endpoints (or one endpoint with both event flags) subscribe. Inspect each active endpoint's `eventConfiguration` to confirm both alert paths are enabled where you expect them.

**See.** [When the reader needs to interrupt you](/observability/events/alerts)

---

## Security {#fm-sec}

### FM-SEC-01: TLS verification mismatch {#fm-sec-01}

**Symptom.** TLS handshake between sled and broker fails. The sled disconnects immediately after the TCP connection is established. No `mqttConnEVT` shows CONNECTED.

**Cause.** The endpoint's `verificationType` does not match the broker's certificate. `VERIFY_HOST` requires the broker URL to match the certificate's CN or SAN; `VERIFY_PEER` requires the broker's CA to be installed on the sled; `VERIFY_HOST_PEER` requires both.

**Fix.** For production, install the broker's CA via [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) (type `mqtt`) and use `VERIFY_HOST_PEER`. For self-signed certificates in test, use `verificationType: NONE` temporarily. Verify the broker URL matches the certificate hostname.

**See.** [Securing the connection](/infrastructure/security/model)

### FM-SEC-02: Certificate install failure {#fm-sec-02}

**Symptom.** [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) returns response code `9` (file not found), or `alert_short` emits `MQTT_INSTALL_CERTIFICATE_FAIL` / `WIFI_INSTALL_CERTIFICATE_FAIL` / `FILESTORE_INSTALL_CERTIFICATE_FAIL`.

**Cause.** With `certSource: HTTP`, the source URL is unreachable or the file is missing. With `certSource: DIRECT`, the inline PEM content is malformed. For HTTPS sources, the filestore CA is required before the chain can be verified.

**Fix.** For HTTP source: verify the URL with `curl -I` from the sled's segment. For DIRECT: validate the PEM with `openssl x509 -in cert.pem -text -noout`. For HTTPS source: install the filestore CA first via [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) (type `filestore`).

**See.** [Securing the connection](/infrastructure/security/model)

### FM-SEC-03: Logical name mismatch {#fm-sec-03}

**Symptom.** [`install_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-install-certificate) succeeds (`MQTT_INSTALL_CERTIFICATE_SUCCESS`), but the downstream operation that uses the cert (a TLS-enabled [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) or [`set_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-wifi)) still fails the TLS handshake.

**Cause.** The endpoint references the certificate by a logical name — `caCertificateFile`, `clientCert`, `clientKey`, or in Wi-Fi enterprise `certificate[].name`. If the installed name doesn't exactly match the referenced name, the operation cannot find the cert.

**Confirm.** Run [`get_installed_certificate`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-installed-certificate) to list installed names. Compare letter-for-letter against the names referenced in the endpoint or Wi-Fi configuration.

**Fix.** Either reinstall the certificate under the expected name, or update the endpoint configuration to reference the actual installed name. Pick a naming convention and apply it consistently.

**See.** [Securing the connection](/infrastructure/security/model)

---

## Device link (Bridged only) {#fm-dev}

### FM-DEV-01: BT bridge dropped {#fm-dev-01}

**Symptom.** `get_status.deviceStatus.terminalConnection.status: DISCONNECTED` on an RFD40 Standard sled. Commands sent to the sled get no response.

**Cause.** The Bluetooth link between the sled and its host device has been lost. Common triggers: host went out of range (~10 m), host's OS suspended Bluetooth, OS Bluetooth stack reset, or interference on the 2.4 GHz band.

**Fix.** Bring the host within range, wake it, and re-pair via 123RFID Desktop if needed. If the problem is chronic, audit the host's Bluetooth power-management settings.

**See.** [Roles: Reader, Host, Broker, Application](/foundations/architecture/components)

### FM-DEV-02: Bridge routing {#fm-dev-02}

**Symptom.** Host reports active broker connection; sled's Bluetooth link is connected; but commands published from the application don't reach the sled, or responses don't return.

**Cause.** The host's MQTT-to-Bluetooth bridge software is not forwarding correctly. Possible causes: bridge subscribed to the wrong topic prefix on the broker side, bridge bug, or the bridge's outbound queue overflowed and started dropping messages.

**Fix.** Inspect host bridge logs to confirm it sees incoming commands. Verify the bridge subscribes to the same topic shape as [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) defined. Restart the bridge process. If the bridge is custom-built, add logging on both Bluetooth and MQTT sides.

**See.** [Roles: Reader, Host, Broker, Application](/foundations/architecture/components)

### FM-DEV-03: Mobility breaks bridge {#fm-dev-03}

**Symptom.** Sled works when the operator is stationary, fails intermittently or completely when the operator walks with the host.

**Cause.** Bluetooth has limited range (~10 m) and is sensitive to body absorption. When the host moves between Wi-Fi APs, the new AP may have AP-isolation enabled (blocking backend access from that segment). Some host BT chips throttle under motion.

**Fix.** Keep sled and host within 5 m of each other on the body, with the host on the same side as the sled (line-of-sight, not blocked by torso). Disable AP isolation on the relevant Wi-Fi infrastructure. For mobility-critical deployments, switch to a Direct sled (RFD40 Premium / Premium Plus / RFD90), which removes the host dependency entirely.

**See.** [Which sled do you have?](/foundations/introduction/supported-hardware)

---

## Fleet {#fm-fleet}

### FM-FLEET-01: Identity collision {#fm-fleet-01}

**Symptom.** Two readers appear in fleet telemetry with the same serial number, or [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) on one device reports a serial number that does not match the physical label.

**Cause.** Should not occur — Zebra serial numbers are unique per device. Realistic causes: labelling or asset-tracking error in the back office (two physical devices recorded under the same serial), incorrect device chosen during a swap, or, very rarely, a firmware identity register corruption.

**Confirm.** Power off both candidates, power on one at a time, run [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version), and compare `readerVersion.serialNumber` against the physical label and the SKU sticker. The two values must match.

**Fix.** Correct the asset-tracking record once you identify which physical sled is which. If [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) reports a serial that does not match the physical label, contact Zebra support — this is a factory-bad device that needs RMA.

**See.** [What your reader knows about itself](/infrastructure/management/device-state)

---

## Related

- [Something's broken?](/reference/diagnose/symptom-index) — the symptom-first index that points here.
- [Playbooks for getting back online](/reference/diagnose/recovery-playbooks) — the corresponding recovery playbooks (RP-01 through RP-09).
- [Things people get wrong about IOTC](/reference/diagnose/misconceptions) — recurring misconceptions and their corrections (MM-01 through MM-15).
- [Where things fail](/reference/diagnose/two-edges) — the edge-isolation framework underlying every FM in this catalogue.
- [Command Response Error Codes](/reference/errors/codes) — full table of response codes referenced by many FM entries.
