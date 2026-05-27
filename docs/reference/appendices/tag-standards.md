---
id: tag-standards
title: Supported RFID tag types and standards
sidebar_label: Supported RFID Tag Types & Standards
description: "RFID tag types and air-interface standards supported by IOTC: EPC Gen2 (UHF), tag memory banks (EPC, TID, USER, RESERVED), session and inventory flags."
---

> 📕 **REFERENCE** · Audience: Solution Builder

EPC Gen2 / ISO 18000-63 UHF.

### Memory banks

| Bank | Index | Purpose | Read | Write |
|---|---:|---|---|---|
| RESERVED | 0 | Access and kill passwords | Yes (password-protected) | Yes (password-protected) |
| EPC | 1 | Tag identifier | Yes | **Yes** |
| TID | 2 | Manufacturer-assigned identifier | Yes | Locked (read-only) |
| USER | 3 | Application-writable data | Yes | **Yes** |

### Tag access operations supported

Via `set_operating_mode.accessOperations`:

| Operation | Action |
|---|---|
| `READ` | Read words from a memory bank |
| `WRITE` | Write hex data to a memory bank |
| `ACCESS` | Authenticate to the tag using access password |
| `LOCK` | Lock or permanently lock a memory bank or password |
| `KILL` | Permanently and irreversibly disable the tag |

Constraints:

- `password` is 8 hex characters (32 bits) for ACCESS, LOCK, KILL.
- `data` for WRITE is even-length hex, multiple of 16-bit words.
- `LOCK` with `lockAction: PERMANENT_LOCK` is irreversible.
- `KILL` is irreversible, the tag never responds again.

Phase 2 v1's claim that "tag write operations are not in the V1.1 API surface" was incorrect and is corrected here.

---

# Closing. Phase 2 v2 Status

All 🔴 pages rewritten. All 🟡 pages updated with the global corrections and per-page deltas. §11.6 and §17.3 deleted from the documentation set. The corrected drafts above replace their v1 counterparts; pages not addressed here are inherited from v1 with the global corrections applied per the front matter.

**Phase 2 v2 page count:** 97 publishable pages.

Ready for Phase 3-bis verification.

— *Editorial Core + Writers, 2026-05-17*
