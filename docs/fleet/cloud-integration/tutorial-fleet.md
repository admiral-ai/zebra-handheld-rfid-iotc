---
id: tutorial-fleet
title: "Tutorial: Provision a Three-Reader Fleet"
sidebar_label: "Tutorial: Provision a Three-Reader Fleet"
---

> 📗 **TUTORIAL** · Audience: Solution Builder, Fleet Operator · Time: ~45 min

In this tutorial, we will provision three RFD90 sleds: bootstrap them, install certificates, configure dedicated MGMT/CTRL/DATA endpoints over the MDM channel, secure with TLS, replay a per-domain golden configuration, and build a fleet dashboard.

### Step 1: Bootstrap three sleds via 123RFID Desktop

Each sled bootstrapped with identical region, Wi-Fi, and SOTI MDM endpoint configuration.

### Step 2: Install the broker CA certificate

For each reader, over the active MDM endpoint:

```json
{
  "command": "install_certificate",
  "requestId": "step2-<n>",
  "certDetails": {
    "name": "broker-ca",
    "type": "mqtt",
    "certSource": "DIRECT",
    "certificateBundle": {"ca_cert": "<PEM>"}
  }
}
```

### Step 3: Provision MGMT, CTRL, and DATA endpoints

For each reader, add three dedicated endpoints (only the MGMT example shown; CTRL and DATA1 follow the same pattern with `epType: CTRL` and `epType: DATA1`):

```json
{
  "command": "config_endpoint",
  "requestId": "step3-mgmt-<n>",
  "epConfig": {
    "operation": "add",
    "endpointName": "fleet-mgmt",
    "configuration": {
      "epType": "MGMT",
      "protocol": "MQTT_TLS",
      "url": "iotc-broker.zebra.com",
      "port": 8883,
      "verificationType": "VERIFY_HOST_PEER",
      "tenantId": "<TENANT_ID>",
      "activate": true,
      "mqttParams": {
        "username": "<USER>", "password": "<PASS>",
        "keepAlive": 60,
        "publishTopics": [{"topic": "MGMT/clients/resp", "qos": 1, "retain": false}],
        "subscribeTopics": [{"topic": "MGMT/clients/cmnd", "qos": 1, "retain": false}]
      },
      "securityParams": {"caCertificateFile": "broker-ca", "format": "PEM"}
    }
  }
}
```

**You should see** `mqttConnEVT: CONNECTED` on the new endpoint within seconds.

### Step 4: Capture golden baseline from reader 1

```json
{"command": "get_config", "requestId": "step4"}
```

Save the response (full snapshot) — this is the golden config.

### Step 5: Replay per-domain to readers 2 and 3

For each of readers 2 and 3, send the following sequence of commands derived from the golden config:

- `install_certificate` for each cert in the baseline `installedCerts`
- `set_wifi` for each profile in the baseline `wifiConfig`
- `config_endpoint` for each endpoint in the baseline `epConfig`
- `set_operating_mode` reproducing the baseline (captured separately via `get_operating_mode` before Step 4)
- `set_post_filter` reproducing the post-filter set (captured via `get_post_filter`)
- `config_events` reproducing the event configuration

**You should see** subsequent `get_config` outputs on readers 2 and 3 match the baseline on every domain.

### Step 6: Enable heartbeats fleet-wide

```json
{
  "command": "config_events",
  "requestId": "step6-<n>",
  "eventConfiguration": {
    "heartbeat": true,
    "battery": true,
    "heartbeatConfiguration": {
      "interval": 30,
      "inventoryStatus": true,
      "batteryStatus": true
    }
  }
}
```

**You should see** `heartBeatEVT` arriving from all three readers every 30 seconds.

### Step 7: Build the dashboard

```bash
mosquitto_sub -h iotc-broker.zebra.com -p 8883 \
  -u <USER> -P <PASS> --cafile zebra-broker-ca.pem \
  -t "<TENANT_ID>/MGMT/clients/event/+" -v
```

**You should see** heartbeats interleaved from all three reader serials.

### Recap

You provisioned, secured, configured, and monitored a three-reader fleet end-to-end. The replay pattern in Step 5 — per-domain commands derived from a `get_config` baseline — scales to fleets of any size; only the orchestration changes.

**Related:** 📗 [§4.3 Single-Reader Bootstrap](/getting-started/prerequisites/bootstrap) · 📙 [§7.2 Certificate Management](/infrastructure/security/certificate-management) · 📙 [§7.4 TLS Setup](/infrastructure/security/tls-setup) · 📙 [§13.2 SOTI Provisioning](/fleet/provisioning/soti-connect) · 📙 [§14.3 Apply Bulk Configuration](/fleet/management/apply-config) · 📙 [§12.4 Fleet Health Dashboard](/observability/monitoring/fleet-dashboard)

---

# Part VII — Reference & Troubleshooting (rewritten)
