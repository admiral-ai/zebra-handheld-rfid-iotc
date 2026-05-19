---
id: about
title: MDM and SOTI Interfaces
sidebar_label: MDM and SOTI Interfaces
---
> 📕 **REFERENCE**

Two distinct endpoint types:

- `epType: MDM`: generic MDM-platform endpoint.
- `epType: SOTI`: SOTI MobiControl specialisation. The reader returns SOTI-shaped responses for `get_config` (see `get_config_response_soti.json`) and `get_wifi` (see `get_wifi_response_soti.json`).

Configuration uses the same `config_endpoint` shape with the relevant `epType` selection.
