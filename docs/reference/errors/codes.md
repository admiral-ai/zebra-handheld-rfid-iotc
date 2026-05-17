---
id: codes
title: Command Response Error Codes
sidebar_label: "Error Codes (0–28)"
---

# Command Response Error Codes

<div className="badge-reference">REFERENCE</div>

Canonical from the IoT Connector firmware — 29 entries (codes 0–28).

| Code | `iot_status_code` | Description | Applies to |
|---:|---|---|---|
| 0 | `IOT_STATUS_SUCCESS` | Success | All |
| 1 | `IOT_STATUS_CMD_PAYLOAD_ACCEPTED` | Command payload accepted (async) | set_os, install_certificate |
| 2 | `IOT_ERROR_INVALID_PAYLOAD` | Invalid payload | set_wifi, delete_wifi_profile, set_config |
| 3 | `IOT_ERROR_INFO_NOT_AVAILABLE` | Cannot retrieve information | All get_* |
| 4 | `IOT_STATUS_FW_UPDATE_IN_PROGRESS` | Firmware update in progress | set_os |
| 5 | `IOT_ERROR_IN_REBOOT_INVENTORY_IN_PROGRESS` | Can't reboot, inventory in progress | reboot |
| 6 | `IOT_STATUS_REGION_NOT_CONFIGURED` | Region not configured | cloud_connect (internal) |
| 7 | `IOT_ERROR_INTERFACE_NOT_AVAILABLE` | Interface not available | cloud_connect (internal) |
| 8 | `IOT_ERROR_LOW_FLASH_SIZE` | Insufficient flash | set_os |
| 9 | `IOT_STATUS_FILE_NOT_FOUND` | File not found | install_certificate, delete_certificate, get_installed_certificate, set_os |
| 10 | `IOT_ERROR_CONFIG_ALREADY_EXIST` | Configuration already exists | config_endpoint, set_config |
| 11 | `IOT_ERROR_INVENTORY_IN_PROGRESS` | Inventory in progress | control_operation, set_operating_mode |
| 12 | `IOT_ERROR_NO_RADIO_OP_IN_PROGRESS` | No radio operation (idle) | control_operation |
| 13 | `IOT_ERROR_FW_UPDATE_FAIL` | Firmware update failed | set_os |
| 14 | `IOT_ERROR_FW_UPDATE_FAIL_LOW_BATTERY` | Battery too low for update | set_os |
| 15 | `IOT_ERROR_SSID_NOT_FOUND` | Wi-Fi SSID not found | set_wifi, delete_wifi_profile, set_config |
| 16 | `IOT_ERROR_DELETE_ACTIVE_SSID` | Cannot delete active SSID | delete_wifi_profile |
| 17 | `IOT_ERROR_SSID_MISSED` | SSID field missing | set_wifi, delete_wifi_profile, set_config |
| 18 | `IOT_ERROR_SSID_ALREADY_EXIST` | Wi-Fi SSID already exists | set_wifi, set_config |
| 19 | `IOT_ERROR_SSID_LIMIT_OVERFLOW` | Wi-Fi profile count overflow (max 10) | set_wifi, set_config |
| 20 | `IOT_ERROR_WIFI_INTER_NOT_SUPPORTED` | Wi-Fi not supported | set_wifi, set_config |
| 21 | `IOT_ERROR_CERT_NOT_FOUND` | Certificate not found | delete_certificate, get_installed_certificate, install_certificate |
| 22 | `IOT_CTRL_ADVANCED_PROFILE_NOT_SET` | Advanced configuration not set | set_operating_mode |
| 23 | `IOT_ERROR_INVALID_ENUM` | Invalid enum value | config_endpoint, set_config, set_wifi, install_certificate, control_operation, set_operating_mode, set_post_filter |
| 24 | `IOT_ERROR_PREFILTERS_LIMIT_EXCEEDED` | Max 32 prefilters exceeded | set_operating_mode |
| 25 | `IOT_ERROR_PUBLISH_TOPICS_EXCEEDED` | Max 3 publish topics exceeded | config_endpoint, set_config |
| 26 | `IOT_ERROR_SUBSCRIBE_TOPIC_EXCEEDED` | Max 1 subscribe topic exceeded | config_endpoint, set_config |
| 27 | `IOT_ERROR_INVALID_TENANTID_LENGTH` | Invalid tenant ID length | config_endpoint, set_config |
| 28 | `IOT_ERROR_TAG_MATCH_PATTERN_LENGTH_EXCEEDED` | Tag match pattern length exceeded (max 64 hex) | set_operating_mode |
