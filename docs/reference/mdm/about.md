---
id: about
title: MDM and SOTI interfaces
sidebar_label: MDM and SOTI Interfaces
description: "Reference for the IOTC MDM endpoint: the bootstrap default that 123RFID Desktop creates first, plus SOTI Connect and 42Gears SureMDM integration."
---
> 📕 **REFERENCE**

Two distinct endpoint types:

- `epType: MDM`: generic MDM-platform endpoint.
- `epType: SOTI`: SOTI MobiControl specialisation. The reader returns SOTI-shaped responses for [`get_config`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-config) (see `get_config_response_soti.json`) and [`get_wifi`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-wifi) (see `get_wifi_response_soti.json`).

Configuration uses the same [`config_endpoint`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-config-endpoint) shape with the relevant `epType` selection.
