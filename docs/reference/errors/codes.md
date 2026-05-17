---
id: codes
title: Command Response Error Codes
sidebar_label: Command Response Error Codes
---

Canonical from `error_codes.json` — 29 entries (codes 0–28).

| Code | `iot_status_code` | Description | Cause | Recommended action | Applies to |
|---:|---|---|---|---|---|
| 0 | `IOT_STATUS_SUCCESS` | Success | Command executed successfully | No action required | All |
| 1 | `IOT_STATUS_CMD_PAYLOAD_ACCEPTED` | Command payload is accepted | Device accepted the payload; processing asynchronously | Wait for follow-up event or poll status | `set_os`, `install_certificate` |
| 2 | `IOT_ERROR_INVALID_PAYLOAD` | Invalid payload | JSON malformed or invalid field values | Validate against command schema | `set_wifi`, `delete_wifi_profile`, `set_config` |
| 3 | `IOT_ERROR_INFO_NOT_AVAILABLE` | Not able to retrieve information | Device could not gather requested information | Retry after a delay; if persistent, reboot | All `get_*` |
| 4 | `IOT_STATUS_FW_UPDATE_IN_PROGRESS` | Firmware update in progress | Update already running | Wait for current update to complete | `set_os` |
| 5 | `IOT_ERROR_IN_REBOOT_INVENTORY_IN_PROGRESS` | Can't reboot, inventory in progress | RFID inventory active | Stop inventory via `control_operation` before rebooting | `reboot` |
| 6 | `IOT_STATUS_REGION_NOT_CONFIGURED` | Region is not configured | No regulatory region set | Configure region (via 123RFID Desktop) before connecting | `cloud_connect` ¹ |
| 7 | `IOT_ERROR_INTERFACE_NOT_AVAILABLE` | Interface is not available | Requested network interface absent or disabled | Verify the device has the required interface and that it is enabled | `cloud_connect` ¹ |
| 8 | `IOT_ERROR_LOW_FLASH_SIZE` | Insufficient flash size | Not enough free flash for firmware download | Free space or use a smaller firmware package | `set_os` |
| 9 | `IOT_STATUS_FILE_NOT_FOUND` | File not found | File or certificate not found on device or server | Verify path/URL and existence | `install_certificate`, `delete_certificate`, `get_installed_certificate`, `set_os` |
| 10 | `IOT_ERROR_CONFIG_ALREADY_EXIST` | Configuration already exists | Endpoint/config with same name exists | Delete the existing one or use a different name | `config_endpoint`, `set_config` |
| 11 | `IOT_ERROR_INVENTORY_IN_PROGRESS` | Inventory in progress | RFID inventory currently running | Stop the inventory before starting a new operation or changing mode | `control_operation`, `set_operating_mode` |
| 12 | `IOT_ERROR_NO_RADIO_OP_IN_PROGRESS` | No radio operation in progress | STOP sent but radio is already idle | No action required — radio is already in desired state | `control_operation` |
| 13 | `IOT_ERROR_FW_UPDATE_FAIL` | Firmware update failed | Download or installation failed | Check firmware URL and network; retry | `set_os` |
| 14 | `IOT_ERROR_FW_UPDATE_FAIL_LOW_BATTERY` | Battery is low, cannot update firmware | Battery charge too low | Charge or connect external power; retry | `set_os` |
| 15 | `IOT_ERROR_SSID_NOT_FOUND` | Wi-Fi SSID not found | Specified SSID does not exist in saved profiles | Verify SSID name; check profile is saved | `set_wifi`, `delete_wifi_profile`, `set_config` |
| 16 | `IOT_ERROR_DELETE_ACTIVE_SSID` | Cannot delete active SSID | Profile being deleted is the currently connected network | Disconnect or switch SSID before deleting | `delete_wifi_profile` |
| 17 | `IOT_ERROR_SSID_MISSED` | SSID field missing | Required SSID field absent | Include SSID field in payload | `set_wifi`, `delete_wifi_profile`, `set_config` |
| 18 | `IOT_ERROR_SSID_ALREADY_EXIST` | SSID already exists | Profile with this SSID already saved | Delete existing or MODIFY instead of CREATE | `set_wifi`, `set_config` |
| 19 | `IOT_ERROR_SSID_LIMIT_OVERFLOW` | SSID count overflow | Max 10 saved Wi-Fi profiles reached | Delete an unused profile before adding | `set_wifi`, `set_config` |
| 20 | `IOT_ERROR_WIFI_INTER_NOT_SUPPORTED` | Wi-Fi not supported | Device lacks Wi-Fi hardware | Use Ethernet or another supported interface | `set_wifi`, `set_config` |
| 21 | `IOT_ERROR_CERT_NOT_FOUND` | Certificate not found | Specified certificate not installed | Verify cert name; install via `install_certificate` if needed | `delete_certificate`, `get_installed_certificate`, `install_certificate` |
| 22 | `IOT_CTRL_ADVANCED_PROFILE_NOT_SET` | Advanced configuration not set | Operating mode requires unset advanced profile | Configure advanced profile settings first | `set_operating_mode` |
| 23 | `IOT_ERROR_INVALID_ENUM` | Invalid enum value | Field value not in allowed enum | Check schema for allowed values | `config_endpoint`, `set_config`, `set_wifi`, `install_certificate`, `control_operation`, `set_operating_mode`, `set_post_filter` |
| 24 | `IOT_ERROR_PREFILTERS_LIMIT_EXCEEDED` | Max 32 prefilters exceeded | >32 SELECT prefilter rules | Reduce to 32 or fewer | `set_operating_mode` |
| 25 | `IOT_ERROR_PUBLISH_TOPICS_EXCEEDED` | Max 3 publish topics exceeded | >3 publish topics per endpoint | Reduce to 3 or fewer | `config_endpoint`, `set_config` |
| 26 | `IOT_ERROR_SUBSCRIBE_TOPIC_EXCEEDED` | Max 1 subscribe topic exceeded | >1 subscribe topic per endpoint | Use 1 subscribe topic per endpoint | `config_endpoint`, `set_config` |
| 27 | `IOT_ERROR_INVALID_TENANTID_LENGTH` | Invalid tenant ID length | tenantId exceeds max length | Shorten tenantId | `config_endpoint`, `set_config` |
| 28 | `IOT_ERROR_TAG_MATCH_PATTERN_LENGTH_EXCEEDED` | Tag match pattern length exceeded | tagPattern exceeds max length (64 hex chars) | Shorten the tag match pattern | `set_operating_mode` |

¹ `cloud_connect` is an internal bootstrap command invoked by the reader; application developers do not invoke it directly. Codes 6 and 7 appear in support diagnostics for region/interface readiness issues.
