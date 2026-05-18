---
id: retention-retry
title: What happens when the network drops
sidebar_label: What happens when the network drops
---

> 📘 **EXPLANATION** · Audience: Solution builder, Fleet operator · Read time: ~7 min

### Four reliability layers

Reliable end-to-end tag-data delivery on a handheld sled travels through four layers, each with distinct guarantees.

| Layer | What it is | What can go wrong | What buys reliability |
|---|---|---|---|
| Sled to broker | The sled's MQTT publish. | A Wi-Fi or Bluetooth gap; a broker outage. | QoS choice per topic; the retention buffer (150k events at a 500 TPS flush). |
| Broker durability | The broker's message handling. | Broker restart; a non-persistent broker. | Choose a broker with persistence (HiveMQ, EMQX, or Mosquitto with persistence flags). |
| Broker to application | The application subscription. | An offline app; a QoS mismatch. | Persistent session (`cleanSession: false`); QoS that matches the publisher. |
| Application processing | Your code. | Backpressure; a crash mid-batch. | A backpressure-aware consumer; idempotent handlers. |

### The 150,000-event retention buffer

If the broker is unreachable, the sled holds up to 150,000 `dataEVT` payloads in its retention buffer. When the broker returns, the buffer flushes at up to 500 events per second until drained. Order is preserved.

The buffer holds `dataEVT` (tag reads).

The buffer does not hold `heartBeatEVT`, `alertsEVT`, `mqttConnEVT`, `firmwareUpdateEVT`, or `fileDownloadEVT`. These are time-sensitive and lose value as they age.

### QoS choice per topic

| Topic family | Typical QoS | Reason |
|---|---|---|
| `cmnd/*` (commands) | 1 | Acknowledged delivery. The command must arrive. |
| `resp/*` (responses) | 1 | The application must see the response. |
| `event/*` (alerts) | 1 | Alerts are operational signals. |
| `event/*` (heartbeats) | 0 | Loss is tolerable; another arrives at the next interval. |
| `data1event/*` (tag data) | 0 or 1 | 0 for throughput; 1 for correctness. |

### Retry patterns

On the sled side, retries use built-in exponential backoff bounded by `mqttParams.reconnectDelayMin` and `reconnectDelayMax`. Tune narrowly (5 to 60 seconds) for development; widely (5 to 512 seconds) for production.

On the application side, retries fall into two classes.

For idempotent retries on read-only operations like `get_status`, `get_version`, and `get_config`, retry after timeout using the same `requestId`. The second response simply replaces the first.

For state-changing retries on operations like `set_config`, `set_operating_mode`, and `control_operation`, retry with a new `requestId`. Track in-flight requests and drop late duplicates.

### Backpressure and dropped messages

When the retention buffer fills, which happens during outages longer than `150,000 / TPS`, the oldest events are dropped to make room. If you observe systematic gaps in `dataEVT` timestamps, suspect one of two causes: the buffer overflowed during a longer outage, or `FAST_READ` mode is enabled. (FAST_READ does not emit `dataEVT`.)

### Idempotency by operation

| Operation class | Idempotent? | Strategy |
|---|---|---|
| `get_*` (read-only) | Yes. | Safe to retry. The last response wins. |
| `set_config`, `set_operating_mode` | Last-writer-wins (effectively idempotent). | Retry with a new `requestId`. Accept the new state. |
| `control_operation start` | No. | A duplicate START returns error code 11. Check state with `get_status` first. |
| `set_os` (firmware update) | No. | Do not retry blindly. Check `get_version` to see whether the previous attempt succeeded. |
| `reboot` | No. | Do not retry during inventory. The command is rejected with error code 5. |

### Related

[Where tag reads come from](/rfid/tag-data/dataevt-schema) · [The reader's configuration document](/infrastructure/management/config-document) · [Something's broken?](/reference/diagnose/symptom-index) · [Playbooks for getting back online](/reference/diagnose/recovery-playbooks).
