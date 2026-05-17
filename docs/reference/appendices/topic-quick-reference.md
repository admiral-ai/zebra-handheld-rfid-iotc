---
id: topic-quick-reference
title: MQTT Topic Quick Reference
sidebar_label: MQTT Topic Quick Reference
---

Three-part topic structure: `<tenantId> / <topic> / <deviceSerialNumber>`. The middle `<topic>` is configured per endpoint via `publishTopics` and `subscribeTopics`.

| Source-convention `topic` | Direction | Convention |
|---|---|---|
| `MGMT/clients/cmnd` | App → Reader | Management commands inbound |
| `MGMT/clients/resp` | Reader → App | Management responses outbound |
| `MGMT/clients/event` | Reader → App | Management events (heartbeat, alerts, mqttConn) |
| `MGMT/clients/rfid` | Reader → App | RFID tag data on MGMT-shared endpoint |
| `CTRL/clients/cmnd` | App → Reader | Control commands |
| `CTRL/clients/resp` | Reader → App | Control responses |
| `CTRL/clients/event` | Reader → App | Control events |
| `CTRL/clients/rfid` | Reader → App | Tag data on CTRL-shared endpoint |
| `MDM/clients/cmnd` | App → Reader | MDM/SOTI commands |
| `MDM/clients/resp` | Reader → App | MDM/SOTI responses |
| `MDM/clients/event` | Reader → MDM | MDM events |

Endpoint topic limits: max 3 publish topics, max 1 subscribe topic per endpoint. `tenantId` has a max length (code 27 if exceeded).
