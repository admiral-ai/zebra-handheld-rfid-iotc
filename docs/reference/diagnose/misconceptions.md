---
id: misconceptions
title: Things people get wrong about IOTC
sidebar_label: Things people get wrong about IOTC
---

> 📘 **EXPLANATION** · Audience: All personas · Read time: ~6 min

Fifteen recurring misconceptions that produce wrong integration code. Each row gives the **wrong** belief, the **right** belief, and the page that goes deeper.

### The catalogue

| # | Wrong belief | Right belief | Read next |
|---|---|---|---|
| MM-01 | "The sled connects to the broker directly on every tier." | Only Premium / Premium Plus / RFD90 connect directly (Path A). RFD40 Standard requires a host (Path B). | [Supported hardware](/foundations/introduction/supported-hardware) |
| MM-02 | "Publishing a command guarantees I will see the response." | Only if you subscribed to the response topic before publishing. MQTT does not pair publish with response automatically. | [The message lifecycle](/foundations/architecture/communication-flow) |
| MM-03 | "`FAST_READ` is faster than `BALANCED_PERFORMANCE` for production." | `FAST_READ` does not emit `dataEVT` at all. Use it only for radio benchmarking. | [Operating mode profiles](/rfid/operating-mode/profiles) |
| MM-04 | "`get_status` returns the firmware version." | `get_status` returns *runtime* status (battery, temperature, radio activity). Firmware version is in `get_version`. | [Device state and identity](/infrastructure/management/device-state) |
| MM-05 | "I can set the region via MQTT." | No `set_region` exists. Region is configured via 123RFID Desktop over USB. | [Supported hardware](/foundations/introduction/supported-hardware) |
| MM-06 | "Events are reliable; I will always receive them." | Reliability depends on QoS, subscribe timing, retention-buffer state, and broker delivery. Most events are not retained. | [Event architecture](/observability/events/model) |
| MM-07 | "QoS 2 guarantees the sled received my command." | QoS 2 guarantees broker-to-subscriber delivery, not that the sled application processed it. Correlate by `requestId`. | [The message lifecycle](/foundations/architecture/communication-flow) |
| MM-08 | "All MQTT endpoints are interchangeable." | epTypes are not interchangeable. MDM is hybrid; CTRL is control-plane; DATA1 / DATA2 are data-plane; SOTI has vendor-specific behavior. | [MQTT endpoint architecture](/infrastructure/endpoints/about) |
| MM-09 | "`set_config` with the same fields is idempotent at the protocol layer." | The *last* `set_config` wins; replay is safe in outcome but may cause unnecessary reboots if reboot-required fields are present. | [The configuration document](/infrastructure/management/config-document) |
| MM-10 | "Filters reduce air-protocol read effort." | Only pre-filters (Select) do. Post-filters reduce *bandwidth*, not radio effort. | [Tag filtering](/rfid/operating-mode/post-filters-about) |
| MM-11 | "`mqttConnEVT.timestamp` is ISO-8601 like other events." | It is `HH:MM:SS` (time only). Special-case parsing. | [MQTT connectivity events](/observability/events/mqtt-connection) |
| MM-12 | "The integrated barcode scanner is controlled by the IOTC." | Not yet. Barcode scanning is on the roadmap. Control barcode scanning via the Scanner SDK on the host. | (Roadmap — Scanner SDK) |
| MM-13 | "Alerts include antenna, CPU, GPI events on handhelds." | Handhelds emit `alertsEVT` for the configured event flags in `config_events` (battery, firmwareUpdate, network, temperature, power being the most common). | [Event configuration](/observability/events/configure) |
| MM-14 | "On Path B, the host is a passive Bluetooth pipe." | The host runs the IOTC daemon. It is an active node — configure it, monitor it, manage it. | [Hardware tiers](/foundations/introduction/supported-hardware) |
| MM-15 | "I can use HTTP or REST as a fallback on handheld." | MQTT is the only transport on handheld sleds. Fixed readers expose REST and HTTP POST; handhelds do not. | [About the IoT Connector](/foundations/introduction/about-iotc) |

### A note on incoming mental models

Most of these misconceptions trace to one of three incoming mental models:

- **From fixed RFID:** assumes antenna ports, GPIO, REST. None of these exist on handheld.
- **From Android peripheral SDK:** assumes synchronous SDK calls. MQTT is asynchronous.
- **From REST APIs:** assumes connection-per-request and HTTP semantics. MQTT is a long-lived pub/sub session.

Each model is *partially* right. The catalogue above identifies the specific places each model breaks.

**Related:** [Symptom Index](/reference/diagnose/symptom-index) · [The two physical edges](/reference/diagnose/two-edges) · [Recovery playbooks](/reference/diagnose/recovery-playbooks).
