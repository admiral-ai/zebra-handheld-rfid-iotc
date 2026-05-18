---
id: device-state
title: What your reader knows about itself
sidebar_label: What your reader knows about itself
---

> 📘 **EXPLANATION** · Audience: All personas · Read time: ~5 min · Ties to the Device Status sub-tag of the API Reference

> **See in the API Reference**
> Sub-tag: Device Status. Operations: `get_status` · `get_version` · `get_current_region`.

A sled has three introspection surfaces — **identity, runtime, regulatory** — and three commands that read them. Together they answer "is this device the one I think it is, is it healthy right now, and is it legal to transmit where it sits?" Most production problems start by asking one of those three questions.

### Identity — `get_version`

`get_version` is the canonical identity-establishing command. It returns model (`RFD40` or `RFD90`), serial number, SKU, firmware version, and component-level firmware (scanner, radio, IoTC). It is idempotent and never depends on radio state, so it is also the right first command to send after any bootstrap or reconnect.

Use `get_version` to:

- Confirm the connected device is the one you expect.
- Verify the firmware baseline before sending commands that depend on it (e.g., `config_events` requires IoTC V1.1+).
- Establish the IoTC version for SDK compatibility checks.

Two-field payload; the response carries `readerVersion.detailedVersions.iotcVersion` as the gating field for command-set compatibility. Full schema in `mqtt-api-reference/get_version.md`.

### Runtime — `get_status`

`get_status` is the live health and readiness snapshot. It returns `deviceStatus` with:

- **Power and battery** — `powerSource` (DC / WALLCHARGER / USB / CRADLE), `batteryStatus.chargePercentage`, `batteryStatus.stateOfHealth`.
- **Radio state** — `radioActivity` (INACTIVE / ACTIVE), `radioConnection` (CONNECTED / DISCONNECTED).
- **Terminal connection** — for Bipartite sleds, the Bluetooth bridge state in `terminalConnection.status`.
- **NTP synchronisation** — `ntp.reach` (non-zero means NTP is reaching its server).
- **Time and temperature** — `systemTime` ISO 8601, `temperature` in °C.

The field that most often surprises is `radioActivity`. If it is `ACTIVE`, **`reboot` will be rejected** (error 5) and **`set_operating_mode` will be rejected** (error 11). Always check `get_status.deviceStatus.radioActivity` before either operation.

A `code: 3` response means the device could not gather the requested information at this moment — retry; if persistent, reboot (after stopping any active inventory). Full schema in `mqtt-api-reference/get_status.md`.

### Regulatory — `get_current_region`

The regulatory region governs which radio frequencies the sled may transmit on and at what power. It cannot be set over MQTT — only via 123RFID Desktop at bootstrap — but it can be **read** at any time:

```json
{
  "command": "get_current_region",
  "requestId": "region-001"
}
```

The response includes:

- `country` (e.g., `"United States"`)
- `regulatoryStandard` (`FCC`, `ETSI`, etc.)
- `frequencyHopping` (boolean — usually true)
- `lbtEnabled` (Listen Before Talk — required in ETSI regions)
- `maxTxPowerSupported` / `minTxPowerSupported` in dBm
- `channelData` — list of channel frequencies the radio may use

If a freshly-bootstrapped reader reports a region that does not match the deployment country, the radio will operate but may violate regulations — Phase 2 of the Quick Start must be redone via 123RFID Desktop. The reader will **not** transmit at all until the region has been set.

### A decision tree

| If you want to know… | Use | Why |
|---|---|---|
| Is this the device I expect? | `get_version` | Identity and firmware baseline |
| Is the device alive and ready? | `get_status` | Power, radio, NTP, terminal connection |
| Is the radio currently running? | `get_status` (`radioActivity`) | Required pre-check before `reboot` or `set_operating_mode` |
| What region is it set for? | `get_current_region` | Regulatory compliance audit |
| What broker is the reader connected to? | `get_endpoint_config` | Transport-layer state; see [How the MQTT plumbing fits together](/infrastructure/endpoints/about) |
| Is the broker reachable? | Subscribe to `mqttConnEVT`; see [Knowing when you're connected](/observability/events/mqtt-connection) | Connection-state telemetry |

### What this chapter does not cover

- The full configuration document — that's `get_config` / `set_config` in [The reader's configuration document](/infrastructure/management/config-document).
- Network configuration — `get_eth` / `get_wifi` in [Getting on the network](/infrastructure/network/architecture).
- Endpoint listing — `get_endpoint_config` in [How the MQTT plumbing fits together](/infrastructure/endpoints/about).

Each of those is a deeper surface. This chapter is the lightweight introspection set you should run first whenever a reader feels wrong.

**Related:** 📘 [Roles: Reader, Host, Broker, Application](/foundations/architecture/components) · 📘 [The reader's configuration document](/infrastructure/management/config-document) · 📕 [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`get_status`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`get_current_region`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
