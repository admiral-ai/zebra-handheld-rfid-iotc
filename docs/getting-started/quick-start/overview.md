---
id: overview
title: Your first 30 minutes
sidebar_label: Your first 30 minutes
---

> 📗 **TUTORIAL** · **Audience:** New Integrator · **Time:** ~30 min hands-on, ~45 min full chapter · **Path:** 🅓 Direct (Premium / RFD90)

In the next thirty minutes you will take a sled out of its box, give it a network identity, and watch tag reads stream over MQTT. The Quick Start is **seven phases**. Each phase ends with a verifiable artifact you can see, a confirmed broker reachability check, an active MDM endpoint, a [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) response, a configured CTRL endpoint, a live `dataEVT` stream. **If the artifact appears, the phase succeeded. If it doesn't, you don't proceed.**

This is the only Tutorial in the conceptual docs. Everything else is Explanation, How-To, or Reference. Use this chapter to build confidence; come back later for the underlying concepts.

### The non-negotiable rule

A Zebra reader **cannot participate in any MQTT command workflow until its initial MDM endpoint has been provisioned through 123RFID Desktop and is active.** That means:

- [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) only works after Phase 2 succeeds.
- [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint), [`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config), [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation), [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot) all wait on the MDM endpoint.

The MDM endpoint is the bootstrap connection. Everything else depends on it.

### What you'll have at the end

- A sled on Wi-Fi, region-set, with an active MDM endpoint reaching your broker.
- A confirmed [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) round-trip — model, serial number, firmware version, IoTC version.
- Three operational endpoints: MGMT (optional), CTRL, DATA1.
- A live `dataEVT` stream — tag reads scrolling past in real time.
- Knowledge of when (and when not) to [`reboot`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-reboot).

### The dependency ladder

| Phase | Outcome | Who does it | Time |
|---|---|---|---|
| 1. [Prepare network and broker](/getting-started/quick-start/step-1-connect) | Reachable broker on 1883/8883 from the sled's network segment | IT / network admin | 5 min (or 30 if firewall change needed) |
| 2. [Bootstrap with 123RFID Desktop](/getting-started/quick-start/step-2-discover) | Sled on Wi-Fi, region set, active MDM endpoint pointing at your broker | Operator with Windows laptop | 8 min |
| 3. [Verify the bootstrap connection ([`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version))](/getting-started/quick-start/step-3-subscribe) | A [`get_version`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-version) response with model, serial, firmware, IoTC version | Integrator | 3 min |
| 4. [Inspect endpoint state ([`get_endpoint_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-endpoint-config))](/getting-started/quick-start/step-4-start) | A list of the sled's active and saved endpoints | Integrator | 4 min |
| 5. [Add remote endpoints ([`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint))](/getting-started/quick-start/step-5-read) | CTRL and DATA1 endpoints active and routable | Integrator | 8 min |
| 6. [Start and stop inventory ([`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-control-operation))](/getting-started/quick-start/step-6-stop) | Live `dataEVT` events on the DATA1 topic | Integrator | 5 min |
| 7. [Reboot when needed](/getting-started/quick-start/step-7-reboot) | A clean warm reset that preserves management config | Integrator / Fleet operator | 3 min |

### What this tutorial does not cover

- **Bridged path (RFD40 Standard).** This tutorial assumes a Direct sled — RFD40 Premium, Premium Plus, or RFD90. RFD40 Standard requires a host-device bridge and a different bootstrap. A separate Path B tutorial is planned.
- **TLS.** Phases 5 and 6 use plain MQTT on port 1883. Promote to TLS only after the unencrypted path works end-to-end. See [Securing the connection (TLS & certificates)](/infrastructure/security/model).
- **Fleet provisioning.** Six readers on a single laptop is fine for evaluation. For more, see [Going from one reader to a fleet](/fleet/provisioning/models).
- **Production reliability.** Retention, retry, batching, alert thresholds, all covered in Parts 4–7. This tutorial gets you to "it works," not to "it survives a Tuesday."

### What you need before you start

- **Hardware:** an RFD40 Premium, Premium Plus, or RFD90 sled, charged. A USB-C cable. A Windows laptop (for 123RFID Desktop). A few EPC Gen2 RFID tags.
- **Software:** 123RFID Desktop installed on the laptop. [MQTTX](https://mqttx.app) (GUI) or `mosquitto_sub`/`mosquitto_pub` (CLI) for validation. A reachable MQTT broker. Mosquitto on localhost, HiveMQ Cloud, or AWS IoT Core.
- **Access:** the credentials for your broker (if any), and outbound 1883/8883 from the sled's network segment.

### When something goes wrong

Each phase has a "Didn't work?" footer. If you can't unblock from there, jump to [Something's broken?](/reference/diagnose/symptom-index), the symptom-first index. Coming back to the tutorial after debugging is fine; phases are idempotent.

### Where to go next

Start at [Phase 1. Prepare network and broker](/getting-started/quick-start/step-1-connect).
