---
id: operating-mode
title: "Operating Mode (CTRL)"
sidebar_label: "Operating Mode (CTRL)"
---
> 📕 **REFERENCE**

#### `get_operating_mode` (T4)

Returns current operating mode configuration.

#### `set_operating_mode` (T1)

Most complex command. Payload key `operatingMode`. Sub-objects: `profiles`, `advancedConfigurations` (when `profiles: ADVANCED`), `accessOperations[]`, `radioConditions.{start, stop}`, `query`, `select[]`, `reportFilter`. See [§9.2](/rfid/operating-mode/configure) for examples.

**Errors:** 11 (inventory in progress), 22 (advanced profile not set), 23, 24 (>32 prefilters), 28 (tag pattern length).
