---
id: operating-mode
title: Operating mode (CTRL endpoint)
sidebar_label: "Operating Mode (CTRL)"
description: "Reference for the CTRL endpoint operating-mode surface: set_operating_mode payload (profiles, advancedConfigurations, query, select, reportFilter)."
---
> 📕 **REFERENCE**

#### [`get_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-get-operating-mode) (T4)

Returns current operating mode configuration.

#### [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/#op-set-operating-mode) (T1)

Most complex command. Payload key `operatingMode`. Sub-objects: `profiles`, `advancedConfigurations` (when `profiles: ADVANCED`), `accessOperations[]`, `radioConditions.{start, stop}`, `query`, `select[]`, `reportFilter`. See [Configure operating mode](/rfid/operating-mode/configure) for examples.

**Errors:** 11 (inventory in progress), 22 (advanced profile not set), 23, 24 (>32 prefilters), 28 (tag pattern length).
