---
id: overview
title: 5.1 Quick Start Overview
sidebar_label: 5.1 Quick Start Overview
---

# Quick Start Overview

<div className="badge-tutorial">TUTORIAL</div>

**Audience:** New Integrator · **Time:** ~45 min (full chapter)

In this Quick Start, we will connect a handheld reader to a broker, configure it, and read our first tags — in under one hour.

## Prerequisites

- A reader bootstrapped per [Reader Bootstrap](/getting-started/prerequisites/bootstrap). After bootstrap, the reader has its **MDM endpoint** configured.
- For this tutorial we will use the MDM endpoint for everything (the simplest path).
- IOTC credentials per [Obtain Credentials](/getting-started/prerequisites/credentials).
- `mosquitto_pub` and `mosquitto_sub` installed locally.

## The path

1. [Connect to the broker](/getting-started/quick-start/step-1-connect)
2. [Discover the reader](/getting-started/quick-start/step-2-discover) (`get_version`)
3. [Subscribe to the data stream](/getting-started/quick-start/step-3-subscribe)
4. [Set the operating mode](/getting-started/quick-start/step-4-start) (`set_operating_mode` with `BALANCED_PERFORMANCE` profile)
5. [Read your first tags](/getting-started/quick-start/step-5-read)
6. [Stop the operation](/getting-started/quick-start/step-6-stop) (`control_operation` `STOP`)
