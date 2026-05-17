---
id: supported-hardware
title: "About Supported Hardware (RFD40 / RFD90 Series)"
sidebar_label: "About Supported Hardware (RFD40 / RFD90 Series)"
---

> 📘 **EXPLANATION** · Audience: New Integrator, Solution Builder · Read time: ~4 min

This documentation covers the Zebra handheld RFID sled family — the RFD40 Premium, RFD40 Standard, and RFD90 — communicating with the IoT Connector over MQTT 3.1.1.

### The handheld sled product family

The **RFD40** is a compact UHF RFID sled for retail and light-industrial use. It comes in two trims: Premium (with barcode scanning) and Standard (RFID only). The **RFD90** is a longer-range, heavier-duty sled built for warehouse and field operations, with a higher-gain internal antenna and a larger battery.

### Hardware capability matrix

| Capability | RFD40 Standard | RFD40 Premium | RFD90 |
|---|---|---|---|
| RFID frequencies | UHF (region-configured) | UHF (region-configured) | UHF (region-configured) |
| Read range (typical) | ~6 m | ~6 m | ~21 m |
| Bluetooth | 5.0 LE | 5.0 LE | 5.0 LE |
| Barcode scanner | — | Yes | Yes |
| Battery (mAh) | 2,400 | 2,400 | 3,000 |
| Trigger button | Yes | Yes | Yes |
| Charging | USB-C / cradle | USB-C / cradle | USB-C / cradle |

[DIAGRAM: D-1.2.A — annotated sled illustration showing antenna location, trigger button, USB-C port, charging contacts]

[DIAGRAM: D-1.2.B — capability matrix as visual comparison]

### Physical anatomy

Every sled in this family has: a single **internal antenna** at the top of the device (forward-facing in operating position), a **physical trigger** on the underside grip, **USB-C and pogo-pin charging contacts** at the base, and an **attachment shoe** that mates with the supported host device. There are no external antenna ports, no GPIO pins, and no display.

### Minimum firmware version

All content in this documentation assumes firmware **3.10.27 or later**. Earlier firmware versions support a subset of IOTC functionality and are not covered. Verification surfaces are listed in [§4.1 Hardware & Software Requirements](/getting-started/prerequisites/requirements).

### What this implies for documentation scope

Because every sled in this family has a single internal antenna, the documentation does not cover antenna-port selection, cable-loss compensation, or directionality settings. Because every sled is battery-powered and connects via Bluetooth, the documentation gives sustained attention to battery lifecycle and host-device pairing. These constraints are not caveats; they shape every chapter.

**Related:** 📘 [§2.5 Handheld-Specific Architecture Considerations](/foundations/architecture/handheld-considerations) · 📕 [§4.1 Hardware Requirements](/getting-started/prerequisites/requirements) · 📕 [§20.3 Firmware History](/reference/appendices/firmware-history) · 📕 [§20.5 Regulatory & Regional Information](/reference/appendices/regulatory)
