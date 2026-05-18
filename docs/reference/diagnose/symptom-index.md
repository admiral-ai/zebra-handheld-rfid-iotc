---
id: symptom-index
title: Symptom-first diagnostic index
sidebar_label: Symptom Index
---

> 🩺 **FAILURE MODE INDEX** · Audience: All personas in incident response · Read time: as long as it takes

Pick the symptom that matches what you are actually seeing. Each row links to a failure-mode (FM) page or a recovery playbook (RP). If your symptom is not listed, page through the alphabetical list — the closest neighbor is usually informative.

### Symptoms

| Symptom (reader's words) | Likely subsystem | Go to |
|---|---|---|
| "Authentication failed when connecting to broker" | Security | FM-SEC-03 |
| "Battery alerts repeating every minute" | Events | FM-EVT-05 |
| "Bluetooth disconnects between sled and host (Path B)" | Reader-Host link | FM-DEV-02 |
| "Cannot connect at all" | Network | FM-NET-03 |
| "Certificate appears installed but is not used" | Security | FM-SEC-02 |
| "Command published but no response arrived" | Command/Response | FM-CMD-01 |
| "control_operation start returns code 11" | Command/Response | FM-CMD-03 |
| "dataEVT not received after START" | RFID | FM-RFID-01 |
| "Endpoint config disappeared after reboot" | Configuration | FM-CFG-03 |
| "Firmware update stuck at 50%" | Firmware | FM-FW-01 |
| "get_status shows radioConnection DISCONNECTED" | Device | FM-DEV-01 |
| "Heartbeats stopped" | Events | FM-EVT-04 |
| "Intermittent disconnections every ~30 seconds" | Network | FM-NET-02 |
| "mqttConnEVT.timestamp cannot be parsed as ISO-8601" | Events | FM-EVT-02 (it is HH:MM:SS by design) |
| "Multiple readers conflict on same broker" | Network | FM-NET-05 |
| "Phantom RF90_DATA_BROKER blocking new DATA endpoint" | Configuration | [RP-05](/reference/diagnose/recovery-playbooks) |
| "Reader cannot reach broker after corporate VPN change" | Network | FM-NET-04 |
| "Reader connects, then drops in seconds" | Network | FM-NET-01 |
| "Reader never appears in 123RFID Desktop" | Device | FM-DEV-01 |
| "reboot returns error code 5" | System | (stop inventory first — see [System operations](/infrastructure/management/system-operations)) |
| "set_config returns code 0 but field is unchanged" | Configuration | FM-CFG-01 |
| "set_os returns error code 14" | Firmware | (battery too low; charge sled before retry) |
| "Tag reads return empty metadata fields" | RFID | FM-RFID-03 |
| "Tag read rate is much lower than expected" | RFID | FM-RFID-02 |
| "TLS handshake fails" | Security | FM-SEC-01 |
| "Wi-Fi association fails (Path A)" | Network | FM-WIFI-01 |
| "Wi-Fi roaming causes long gaps" | Network | FM-WIFI-02 |

### Failure-mode pages

Failure-mode pages by subsystem (full FM-* catalog):

- **FM-NET** — Network and transport
- **FM-DEV** — Reader and Host-Bluetooth link (Bipartite-specific)
- **FM-WIFI** — Wi-Fi (Monolithic-specific)
- **FM-CMD** — Command/response correctness
- **FM-EVT** — Event loss patterns
- **FM-FW** — Firmware (`set_os`)
- **FM-CFG** — Configuration
- **FM-SEC** — Security/TLS

These are catalogued by subsystem on a forthcoming page. For now, see [Recovery playbooks](/reference/diagnose/recovery-playbooks) and [The two physical edges](/reference/diagnose/two-edges) for top-of-funnel triage.

**Related:** [The two physical edges](/reference/diagnose/two-edges) · [Recovery playbooks](/reference/diagnose/recovery-playbooks) · [Common misconceptions](/reference/diagnose/misconceptions).
