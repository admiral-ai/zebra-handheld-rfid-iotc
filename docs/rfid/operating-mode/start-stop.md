---
id: start-stop
title: Start, stop, and the trigger button
sidebar_label: Start, stop, and the trigger button
---

> 📙 **HOW-TO** · Audience: All · Time: ~5 min · Ties to the Inventory Control sub-tag of the API Reference

> **See in the API Reference**
> Sub-tag: Inventory Control. Operation: `control_operation`.

Inventory begins and ends with `control_operation`. The trigger button on the sled is one of three start mechanisms; the others are command-driven and timer-driven. This chapter is the surface for those choices and the operational rules around them.

### The minimum — START and STOP

`control_operation` takes a `ctrlOprPayload` object with two fields: `controlType` and `operation`. Both are uppercase enums.

**Start inventory:**

```json
{
  "command": "control_operation",
  "requestId": "start-001",
  "ctrlOprPayload": {
    "controlType": "RFID",
    "operation": "START"
  }
}
```

**Stop inventory:**

```json
{
  "command": "control_operation",
  "requestId": "stop-001",
  "ctrlOprPayload": {
    "controlType": "RFID",
    "operation": "STOP"
  }
}
```

`controlType` is `RFID` for the radio or `SCANNER` for the barcode scanner (Premium / Premium Plus only). `operation` is `START` or `STOP`.

**`control_operation` does not configure inventory behavior.** It only flips the active radio between IDLE and ACTIVE. Operating-mode parameters — profile, sessions, filters, metadata — all live in `set_operating_mode` and must be applied **before** sending `START`.

### Error codes

| Code | Meaning | Action |
|---|---|---|
| `0` | Success | None |
| `11` | Inventory in progress | Send `STOP` first if you intended a fresh start, or treat as a no-op. |
| `12` | No radio operation in progress | A `STOP` was sent while idle. **Not a failure** — the reader was already where you wanted it. |
| `23` | Invalid enum value | Check the casing of `controlType` and `operation` — both uppercase. |

The asymmetry of `11` and `12` is deliberate: starting an already-running inventory is wrong (you'd lose tag-data continuity); stopping an already-stopped inventory is harmless (idempotent).

### Three start mechanisms

The operating-mode payload's `radioStartConditions.trigger` selects when `START` actually fires the radio:

| `trigger` value | Behavior |
|---|---|
| `IMMEDIATE` | Inventory begins the moment `control_operation START` is received |
| `PRESSED` | Inventory begins when the operator presses the physical trigger button |
| `RELEASED` | Inventory begins when the operator releases the trigger button |

A typical operator-driven workflow uses `PRESSED` for start and `RELEASED` for stop — the trigger behaves like a "while pressed" button. A typical autonomous workflow uses `IMMEDIATE` for both, started and stopped by the application.

You can also combine: start `IMMEDIATE`, stop `PRESSED` (press the trigger to halt an autonomous scan).

### Stop conditions — beyond explicit STOP

`radioStopConditions` lets the radio stop itself without an explicit `control_operation STOP`:

| Field | Stops inventory when… |
|---|---|
| `trigger: PRESSED` | The operator presses the trigger |
| `trigger: RELEASED` | The operator releases the trigger |
| `trigger: IMMEDIATE` | A threshold is reached (see below) |
| `tagCount` | N unique tags have been read |
| `stopTimeout` | The configured millisecond duration elapses |
| `inventoryCount` | N full inventory rounds complete |

Thresholds (`tagCount`, `stopTimeout`, `inventoryCount`) apply when `trigger: IMMEDIATE`. They can also be set alongside a trigger condition — whichever fires first stops the radio.

**A practical pattern: countdown inventory.** Set `radioStartConditions.trigger: PRESSED`, `radioStopConditions.trigger: RELEASED`, with `radioStopConditions.tagCount: 50` and `stopTimeout: 30000`. Operator presses trigger → inventory runs → stops on the first of: release, 50 unique tags, or 30 seconds.

### Start delay and repeat

Two ancillary fields on `radioStartConditions`:

- **`startDelay`** — milliseconds to wait after the trigger condition before actually starting. Defaults to 0. A small delay helps when an operator's pressing motion is not yet steady.
- **`repeat`** — boolean. When true and using a trigger, releasing the trigger stops the operation but pressing again restarts it. When false, after a stop the operation does not auto-restart.

### State machine

Three states map the radio's lifecycle:

```
   IDLE  ──START──▶  READY  ──fire──▶  ACTIVE  ──STOP──▶  IDLE
    ▲                                                       │
    │                                                       │
    └──────────── failure / timeout / threshold ────────────┘
```

`get_status.deviceStatus.radioActivity` reads `ACTIVE` while running and `INACTIVE` otherwise. The intermediate `READY` state (radio configured, not yet emitting) is brief and not directly observable from `radioActivity`.

### The lock on `reboot` and `set_operating_mode`

Two operations require the radio to be IDLE:

- **`reboot`** — error code `5` if inventory is active.
- **`set_operating_mode`** — error code `11` if inventory is active.

Always send `control_operation STOP` first, confirm with `get_status`, then proceed.

### Watching for tag data

Once `START` succeeds, the reader publishes `dataEVT` events on the active DATA endpoint's publish topic. The volume depends on the operating mode, the tag population, and the `reportFilter duration` (when 0, every read is reported separately; when > 0, reads are aggregated). See [Where tag reads come from](/rfid/tag-data/dataevt-schema).

### What this chapter does not cover

- **The barcode scanner (`controlType: SCANNER`)** — only present on Premium / Premium Plus sleds. Currently scope-deferred; will be covered in a future chapter.
- **Filtering which tags actually emit `dataEVT`** — see [Filter tags before vs after the read](/rfid/operating-mode/post-filters-about).
- **Access operations on tags (read/write/lock/kill memory)** — set in `set_operating_mode.operatingModes.accessOperations`. Covered in advanced operating-mode material.

**Related:** 📘 [Choose how the reader reads tags](/rfid/operating-mode/profiles) · 📘 [Where tag reads come from](/rfid/tag-data/dataevt-schema) · 📕 [`control_operation`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) · 📕 [`set_operating_mode`](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)
