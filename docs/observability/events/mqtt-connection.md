---
id: mqtt-connection
title: Knowing when you're connected
sidebar_label: Knowing when you're connected
---

> 📘 **EXPLANATION** · Audience: Fleet Operator · Read time: ~3 min · Ties to the MQTT Connectivity sub-tag of the API Reference

> **See in the API Reference**
> Sub-tag: MQTT Connectivity. Event: `mqttConnEVT`.

`mqttConnEVT` is how a reader tells you it changed connection state. It fires on transitions only — once for every connect, once for every disconnect — and carries device identity context with the transition. It is the **most important fleet-health signal** after the heartbeat.

### The shape

```json
{
  "connectionState": "CONNECTED",
  "timestamp": "14:32:18",
  "deviceModel": "RFD40",
  "deviceSerialNo": "RFD40-24190525100255",
  "apiVersion": "1.0",
  "mqttVersion": "3.1.1"
}
```

Five-and-a-half fields:

- **`connectionState`** — `CONNECTED` or `DISCONNECTED`. No third value.
- **`timestamp`** — usually `HH:MM:SS`, sometimes missing on a disconnect (see below).
- **`deviceModel`** — `RFD40` or `RFD90`.
- **`deviceSerialNo`** — the sled's serial.
- **`apiVersion`** — the IoTC API version active at the time of the transition (e.g., `1.0`, `1.2`).
- **`mqttVersion`** — the MQTT protocol version negotiated (e.g., `3.1.1`).

### The `HH:MM:SS` quirk

`mqttConnEVT.timestamp` is documented in the canonical schema as a `HH:MM:SS` format string — not a full ISO 8601 date-time. The reader uses what it has at the moment of the transition; for a clean connection it has the time, for some disconnect scenarios it may not. **Two consequences for applications:**

1. **Cannot reliably correlate `mqttConnEVT` timestamps with wall-clock events.** Use the broker's receipt timestamp (most MQTT clients expose it) for cross-event correlation. Use the `mqttConnEVT.timestamp` only for human-readable display.
2. **Parsers that assume ISO 8601 will fail.** Accept either format.

This is one of the most consistent friction points in the IOTC API surface. Plan for it.

### Disconnect via Last Will and Testament

The reader registers a Last Will and Testament (LWT) message on its MQTT connection. If the reader disappears ungracefully — power loss, network drop, kernel panic — the broker publishes the LWT on its behalf after the keep-alive interval elapses. **That LWT *is* a `mqttConnEVT` with `connectionState: "DISCONNECTED"`.** The reader did not publish it directly; the broker did, from a payload the reader set at connect time.

This means an application that subscribes to `mqttConnEVT` reliably observes ungraceful disconnects without the reader having to be alive to publish them. It's the only mechanism in IOTC that surfaces "the reader stopped existing."

### What you get from each transition

A `CONNECTED` event after a clean connect carries:

- **Identity context** — model and serial, useful for indexing in your application.
- **Version context** — IoTC API version and MQTT version negotiated; surfaces version skew across a fleet.
- **Timestamp** — when the transition completed.

A `DISCONNECTED` event tells you the sled is no longer routable. Coupled with the gap-detection pattern from heartbeats, this is the dual-source confirmation of offline state:

| Heartbeat absence | `mqttConnEVT` DISCONNECTED | Interpretation |
|---|---|---|
| Yes | Yes | Reader truly offline (network drop, power loss) |
| Yes | No | Soft failure — reader still has TCP but is internally stuck |
| No | Yes | Edge case — broker disconnected the reader but reader believes it's connected (rare) |
| No | No | Reader is healthy |

Production pipelines should look for both signals and alert on disagreement.

### Reconnect behavior

After a `DISCONNECTED`, the reader attempts to reconnect with `reconnectDelayMin` and `reconnectDelayMax` parameters from its endpoint configuration. Successive failed attempts back off exponentially within those bounds. A subsequent `CONNECTED` event fires when the reconnection succeeds — same shape as the initial connect.

The `requestId` correlation pattern does not apply to `mqttConnEVT` — events have no `requestId`. Track by `deviceSerialNo` and event sequence.

### Where it publishes

`mqttConnEVT` publishes on the publish-topic family of whichever endpoint is configured to carry events — typically the MGMT_EVT endpoint, or the MDM hybrid at bootstrap. Routing follows the per-endpoint event configuration; see [How the MQTT plumbing fits together](/infrastructure/endpoints/about).

### What this chapter does not cover

- **The four-layer security model** — see [Securing the connection (TLS & certificates)](/infrastructure/security/model). Connection events fire whether TLS is on or off.
- **Application-side reconnection logic** — by definition outside IOTC. The application's MQTT client handles its own reconnect to the broker; the reader handles its own.
- **Broker-side health** — `mqttConnEVT` reflects the reader's view. If the broker is up but routing rules drop the reader's traffic, the reader will still see `CONNECTED` while the application sees nothing. Diagnose with the broker's own monitoring.

**Related:** 📘 [Watch your reader's pulse](/observability/events/heartbeat) · 📘 [How the MQTT plumbing fits together](/infrastructure/endpoints/about) · 📘 [What happens when the network drops](/fleet/reliability/retention-retry) · 📕 [`mqttConnEVT`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
