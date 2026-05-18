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
| **Sled → broker** | Sled's MQTT publish | Wi-Fi or Bluetooth gap; broker outage | QoS choice per topic; retention buffer (150 k events / 500 TPS flush) |
| **Broker durability** | Broker's message handling | Broker restart; non-persistent broker | Choose a broker with persistence (HiveMQ, EMQX, Mosquitto with persistence flags) |
| **Broker → application** | App subscription | App offline; QoS mismatch | Persistent session (`cleanSession: false`); QoS matches publisher |
| **Application processing** | Your code | Backpressure; crash mid-batch | Backpressure-aware consumer; idempotent handlers |

### The 150,000-event retention buffer

If the broker is unreachable, the sled holds up to **150,000 `dataEVT` payloads** in its retention buffer. When the broker returns, the buffer flushes at up to **500 events per second** until drained. Order is preserved.

Events buffered: `dataEVT` (tag reads).

Events **not** buffered: `heartBeatEVT`, `alertsEVT`, `mqttConnEVT`, `firmwareUpdateEVT`, `fileDownloadEVT`. These are time-sensitive and lose value as they age.

### QoS choice per topic

| Topic family | Typical QoS | Reason |
|---|---|---|
| `cmnd/*` (commands) | 1 | Acknowledged delivery; the command must arrive |
| `resp/*` (responses) | 1 | The application must see the response |
| `event/*` (alerts) | 1 | Alerts are operational signals |
| `event/*` (heartbeats) | 0 | Loss tolerable; another arrives at the next interval |
| `data1event/*` (tag data) | 0 or 1 | 0 for throughput, 1 for correctness |

### Retry patterns

**Sled-side**: built-in exponential backoff bounded by `mqttParams.reconnectDelayMin` and `reconnectDelayMax`. Tune narrow (5 s → 60 s) for development; wide (5 s → 512 s) for production.

**Application-side**: two retry classes.

- **Idempotent retry** (for read-only operations like `get_status`, `get_version`, `get_config`): retry after timeout with the **same** `requestId`. The second response simply replaces the first.
- **State-changing retry** (for `set_config`, `set_operating_mode`, `control_operation`): retry with a **new** `requestId`. Track in-flight requests; drop late duplicates.

### Backpressure and dropped messages

When the retention buffer fills (longer-than-`150000 / TPS` outages), the **oldest** events are dropped to make room. If you observe systematic gaps in `dataEVT` timestamps, suspect either (a) the buffer overflowed during a longer outage, or (b) `FAST_READ` mode is enabled (FAST_READ does not emit `dataEVT`).

### Idempotency by operation

| Operation class | Idempotent? | Strategy |
|---|---|---|
| `get_*` (read-only) | Yes | Safe to retry; last response wins |
| `set_config`, `set_operating_mode` | Last-writer-wins (effectively idempotent) | Retry with new `requestId`; accept the new state |
| `control_operation start` | No | Duplicate START returns error code 11; check state with `get_status` first |
| `set_os` (firmware update) | No | Do not retry blindly; check `get_version` to see if the previous attempt succeeded |
| `reboot` | No | Do not retry during inventory; rejected with error code 5 |

**Related:** [Tag data events](/rfid/tag-data/dataevt-schema) · [The configuration document](/infrastructure/management/config-document) · [Symptom-first diagnostic index](/reference/diagnose/symptom-index) · [Recovery playbooks](/reference/diagnose/recovery-playbooks).
