# Title Naming Rulebook for Technical Documentation

This rulebook governs the `title:` front-matter field on every doc page.
The `title:` becomes (a) the page's HTML `<title>` (browser tab + search
result headline), (b) the page's visible H1 in Docusaurus' default
theme, and (c) the canonical name used by Algolia search.

A page has **one** title. It is the single most important text on the
page for findability. Get it right.

---

## 1. The eight foundational principles

| # | Principle | Why it matters |
|---|---|---|
| 1 | **Search-intent match** | Title contains the words a reader would type into Google to find this page |
| 2 | **Self-contained** | Title is comprehensible without the URL, the sidebar context, or the rest of the page |
| 3 | **Specificity over cleverness** | "Configure TLS for the MQTT endpoint" beats "Locking it down" — even when the page is fun |
| 4 | **Front-loaded keywords** | Most important word(s) in the first 30 characters; SERPs and tabs truncate |
| 5 | **Diátaxis-coherent** | Title shape matches the page type (concept / how-to / tutorial / reference) |
| 6 | **One canonical phrase** | Each idea has exactly one title; aliases live in the page body or sidebar label |
| 7 | **Brand-anchored when ambiguous** | Add product/protocol qualifier when the bare phrase could mean multiple things (e.g., "IOTC", "MQTT", "RFD40") |
| 8 | **Length-disciplined** | 30–60 chars optimal for SERP display; 60–70 acceptable; never > 80 |

---

## 2. The Diátaxis title patterns

Every page is one of four types. The title shape *signals* the type to
the reader before they click.

### 2a. Explanation (concept) pages — **declarative noun phrase**

The title states the **thing being explained**, not the act of
explaining it.

| Pattern | Example ✅ | Example ❌ |
|---|---|---|
| `<Subject>` | "MQTT QoS levels" | "About QoS Levels" (the prefix "About" wastes the first three SERP-prefix characters) |
| `<Subject>: <disambiguator>` | "Endpoints: the seven types" | "Understanding Endpoints" (gerund + filler) |
| Plain English question (when the page answers it) | "Which sled do you have? (Direct vs Bridged)" | "Hardware Tier Selection Considerations" (jargon-heavy) |

**Anti-patterns for concept pages:**
- `About <X>` — strip "About"; it eats SERP space and adds zero info
- `Understanding <X>` / `Introduction to <X>` — gerunds; weak in search
- `<X> Overview` — postfix "Overview" reads as boilerplate; rephrase as "What <X> is and what it isn't" if the page is genuinely scoping

### 2b. How-to (procedure) pages — **imperative or `How to`**

Two acceptable shapes:

**Shape A (preferred): Imperative verb-led**

| Pattern | Example ✅ |
|---|---|
| `<Verb> <object>` | "Install a TLS certificate" |
| `<Verb> <object> <qualifier>` | "Configure post-filters for tag suppression" |

**Shape B (acceptable for SEO-driven discovery): `How to` prefix**

| Pattern | Example ✅ |
|---|---|
| `How to <verb> <object>` | "How to rotate certificates at scale" |
| `How to <verb> <object> <qualifier>` | "How to troubleshoot Bluetooth pairing on Android hosts" |

**When to use Shape A vs Shape B.** Use Shape A by default — it's
shorter, cleaner, and reads as instructional. Use Shape B when the page
title needs to win search queries that begin with "how to" (typically:
broad infrastructure how-tos, fleet operations, troubleshooting flows
where users explicitly Google "how to X").

**Anti-patterns for how-to pages:**
- Gerunds (`-ing`): "Configuring Endpoints", "Managing Certificates" — weak in search
- Generic verbs without an object: "Configure" (configure what?)
- Question titles: how-to pages answer questions, they don't ask them

### 2c. Tutorial pages — **phase-numbered or outcome-named**

Tutorials walk the reader through a sequence. The title declares either
**which step in the sequence** (when the page is a numbered phase) or
**what the reader will produce** (when the page is a standalone
tutorial).

| Pattern | Example ✅ |
|---|---|
| `Phase <N>: <action>` | "Phase 3: Verify the bootstrap connection" |
| `Phase <N>: <action> (<variant>)` | "Phase 2: Bootstrap (Direct, 123RFID Desktop)" |
| `Tutorial: <outcome>` | "Tutorial: Provision a three-reader fleet" |
| `Tutorial: <outcome> with <tool/language>` | "Tutorial: Read your first tag with Python" |

**Anti-patterns for tutorial pages:**
- `Step 3 — Subscribe` — uses "step" + content keyword (couples URL to content; changes over time)
- `<Verb> <object>` alone — reads as a how-to, not a tutorial step

### 2d. Reference pages — **object-named, schema-shaped**

Reference pages document a fixed contract. The title names the
**object** documented and (when ambiguous) its container.

| Pattern | Example ✅ |
|---|---|
| `<ObjectName>` (singular for canonical items) | "Glossary" |
| `<ObjectName> reference` | "Error codes reference" |
| `<Operation> (<sub-tag>)` for API ops | "set_wifi (MGMT/Network)" |
| `<EventName>: <one-line scope>` | "dataEVT: tag-read event schema" |
| `Appendix: <subject>` | "Appendix: Regulatory & regional information" |

**Anti-patterns for reference pages:**
- `<Object> Information` / `<Object> Details` — filler nouns
- `All About <Object>` — wastes SERP prefix
- Sentence titles: reference titles are object names, not sentences

---

## 3. Format conventions

| Rule | Example ✅ | Example ❌ |
|---|---|---|
| Sentence case (only proper nouns and acronyms capitalised) | "How to install a TLS certificate" | "How To Install A TLS Certificate" (title case) |
| **Vertical pipe (`\|`) for sub-clauses; never em-dash (—) or en-dash (–)** | "Events reference \| full schemas" | "Events reference — full schemas" (em-dash), "Events reference – full schemas" (en-dash) |
| ASCII apostrophes; no smart quotes | `Your first 30 minutes` | `Your first 30 minutes` (curly apostrophe → encoding risk) |
| Question marks allowed for question-shaped titles | "Which sled do you have?" | n/a |
| Parentheticals for variant / qualifier | "Phase 2: Bootstrap (Direct, 123RFID Desktop)" | "Phase 2: Bootstrap, Direct, 123RFID Desktop" |
| Brand qualifier when needed | "MQTT QoS levels" (MQTT is the brand of the standard) | "QoS levels" (ambiguous; QoS in mobile networks ≠ MQTT QoS) |

### 3a. Why pipes, not dashes, for sub-clause separation in titles

Titles are not body prose. They are read in dense lists (search results,
sidebars, browser tabs) where every character competes for attention,
and they are spoken aloud (screen readers, voice search), where en-dash
and em-dash collapse to indistinguishable pauses. The vertical pipe
(`|`) is a clean visual divider that:

- **Renders identically across fonts and zooms.** Em-dashes and en-dashes
  have inconsistent widths across system fonts; some monospace fonts
  render em-dash as a hyphen, breaking the visual rhythm.
- **Is unambiguous to screen readers.** Screen readers announce `|` as
  "vertical bar" (or skip it as a separator depending on settings),
  which signals to listeners that a new clause begins. Dashes get
  announced as "dash" interchangeably and listeners can't tell em from
  en from hyphen.
- **Survives copy-paste and search.** ASCII `|` (U+007C) is part of
  basic ASCII and is keyboard-typable; em-dash (U+2014) and en-dash
  (U+2013) require special input methods and are sometimes mangled by
  legacy editors, search indexes, and clipboard transforms.
- **Mirrors common title patterns in technical search results.** Many
  technical-doc sites (MDN, AWS, Stripe, Datadog) already use `|` in
  HTML `<title>` tags for site-name appending (`Page title | Site
  name`), so readers are pre-trained on the convention.

**This applies to titles only.** Body prose (paragraphs, captions,
list items) may use em-dashes — they're more readable in flowing text.

> **Migration note.** Existing titles that use em-dash or en-dash for
> sub-clause separation should be replaced with `|`. Add a space on
> each side of the pipe (`Foo | Bar`, not `Foo|Bar`) for readability.

**Capitalisation policy: sentence case.** Capitalise:
- The first word
- Proper nouns (Wi-Fi, Bluetooth, Zebra, Direct/Bridged when used as IOTC tier names)
- Acronyms (MQTT, TLS, RFID, JSON, IOTC, GPIO, MDM, OEM)
- Trademarked product names (Android, Windows, 123RFID Desktop)

Lowercase everything else, including:
- Common technical nouns ("endpoint", "broker", "certificate")
- Phase/step labels in the middle of a sentence
- Stop words

---

## 4. Length discipline

| Range | Status | When OK |
|---|---|---|
| ≤ 30 chars | ⚠️ Too terse if ambiguous | OK only for single canonical objects ("Glossary", "FAQs") |
| 30–60 chars | ✅ **Optimal** | Default target |
| 60–70 chars | ✅ Acceptable | When disambiguation requires it |
| 70–80 chars | ⚠️ Borderline | Only when both keyword and qualifier are mandatory |
| > 80 chars | ❌ Never | Title gets truncated in SERPs and tabs |

> **Why 60 chars?** Google's SERP title pixel budget is roughly 580
> pixels, which equates to ~60 characters in most fonts. Beyond that,
> the title is truncated with an ellipsis. The browser tab also
> truncates after ~30 characters at common zoom levels — front-load the
> keyword.

---

## 5. Brand and product qualifier rules

Some terms are ambiguous without a product or protocol prefix:

| Bare term | Ambiguity | Add qualifier |
|---|---|---|
| `QoS` | Mobile-network QoS ≠ MQTT QoS ≠ Quality-of-Service generic | "MQTT QoS levels" |
| `Endpoint` | Network endpoint? OpenAPI endpoint? IOTC endpoint? | "MQTT endpoint" or "IOTC endpoint" |
| `Bootstrap` | Front-end framework? OS bootstrap? | "Reader bootstrap" or scoped to phase |
| `Certificate` | TLS? Compliance? Calibration? | "TLS certificate" |
| `Topic` | Discussion topic? Pub/sub topic? | "MQTT topic" |
| `Event` | DOM event? Calendar event? Business event? | "MQTT event" or "Telemetry event" |

Apply the qualifier in the **title**, not just the body. Search engines
score keyword proximity to the title heavily.

---

## 6. Title vs sidebar label

`title:` and `sidebar_label:` are two different surfaces with different
audiences and budgets:

| Surface | Audience | Budget | Tone |
|---|---|---|---|
| `title:` | Search engines, browser tabs, page H1 | 30–60 chars | Self-contained, keyword-led |
| `sidebar_label:` | Readers navigating the sidebar | 20–40 chars | Short, scent-phrased, in-context |

The sidebar label can be **shorter, more colloquial, and benefit from
nav context** ("Watch your reader's pulse" works as a sidebar label
under Part 6 — Observe and monitor; it's terrible as a search title).

The title cannot rely on context — it's read alone in a search snippet.

**Rule.** When in doubt, use the same string for both. Only diverge
when the title needs disambiguation that the sidebar context provides.

| Page | Sidebar label | Title |
|---|---|---|
| heartbeat.md | "Watch your reader's pulse" | "Heartbeat events: monitor reader pulse" |
| credentials.md | "IOTC credentials & tenant ID" | "How to obtain IOTC credentials and tenant ID" |
| phase-3.md | "Phase 3: Verify the connection" | "Phase 3: Verify the bootstrap connection (get_version)" |

---

## 7. Anti-patterns to never use

| Anti-pattern | Example ❌ | Fix ✅ |
|---|---|---|
| Marketing language | "Mastering MQTT for awesome RFID apps" | "MQTT in five minutes" |
| Filler prefixes | "About MQTT QoS Levels & Delivery Guarantees" | "MQTT QoS levels" |
| Pluralisation drift | "Heartbeats" (event name is singular `heartbeatEVT`) | "Heartbeat events" or "heartbeatEVT" |
| Dates / versions in title | "MQTT primer (2026)" | "MQTT in five minutes" — version belongs in front-matter |
| Mixed shapes (concept + how-to) | "About Endpoints and How to Configure Them" | Split the page, or pick one shape |
| Trailing punctuation other than `?` | "MQTT QoS levels." | "MQTT QoS levels" |
| ALL CAPS or Title Case for ordinary words | "How To Configure MQTT Endpoints" | "How to configure MQTT endpoints" |
| Hidden meaning / inside joke | "Where two edges meet" (jargon) | "Where things fail (the two-edges model)" |
| Stale phrasing tied to legacy IA | "Step 3 — Subscribe to MQTT topics" | "Phase 3: Verify the bootstrap connection" |
| Wrong type signaling | "How to think about endpoints" for a concept page | "MQTT endpoints: the seven types" |

---

## 8. Per-page checklist

When adding or editing a title:

- [ ] First 30 chars contain the primary search keyword
- [ ] Total length 30–60 chars (60–70 acceptable, > 80 forbidden)
- [ ] Sentence case (only proper nouns / acronyms capitalised)
- [ ] Diátaxis-coherent shape (concept = noun, how-to = verb, tutorial = phased, reference = object)
- [ ] No filler prefix (no "About ", no "Understanding ", no "Introduction to ")
- [ ] Brand qualifier added if the bare term is ambiguous
- [ ] No marketing fluff, no inside jokes, no jargon-only phrasing
- [ ] No em-dash (—) or en-dash (–) anywhere in the title; use vertical pipe (`\|`) for sub-clauses
- [ ] Matches the H1 of the page (Docusaurus uses `title:` as H1 by default)
- [ ] Sidebar label is consistent (same or a shorter scent-phrased variant), and also free of em/en dashes
- [ ] No trailing punctuation except `?` for genuine question titles

---

## 9. Special-case patterns

### 9a. Numbered tutorial phases

The numbered phase is the **identity** of the page; do not bury it.

| Pattern | Example ✅ |
|---|---|
| `Phase <N>: <imperative action>` | "Phase 3: Verify the bootstrap connection" |
| With variant suffix | "Phase 2: Bootstrap (Direct, 123RFID Desktop)" |
| With API call hint | "Phase 3: Verify the bootstrap connection (get_version)" |

### 9b. API operation reference pages

When documenting a single MQTT API operation, mirror the canonical
operation name in the title:

| Pattern | Example ✅ |
|---|---|
| `<op_name> (<sub-tag>)` | "set_wifi (MGMT/Network)" |
| For events | "heartbeatEVT (Events)" |

The operation name uses the canonical casing (`set_wifi` not `Set Wifi`).

### 9c. FAQ pages

FAQ pages should win Q-shaped search queries.

| Pattern | Example ✅ |
|---|---|
| `<Topic> FAQs` | "RFID operations FAQs" |
| `<Question phrasing>` for single-Q pages | "Can I use IOTC with a non-Zebra broker?" |

### 9d. Appendix pages

Appendices use the `Appendix:` prefix when the page is a true appendix
(supplementary reference). Skip the prefix when the page stands alone
as primary reference (e.g., the glossary).

| Pattern | Example ✅ |
|---|---|
| `Appendix: <subject>` | "Appendix: Regulatory and regional information" |
| Bare object name | "Glossary" |

### 9e. Series-aware titles (Part-N pages)

The `Part N: <label>` shape is reserved for **sidebar Part landings**
(generated-index pages). Individual chapter titles do not repeat the
Part number — that's the sidebar's job. Repeating it creates noise like
"Part 4 — Manage your reader — Configure your network".

---

## 10. Maintenance

This rulebook lives at `/brain/TITLE-NAMING.md`. When a title is added
or changed:

1. Check the checklist in §8
2. Verify the URL slug (§1a of `/brain/URL-NAMING.md`) is derivable
   from the new title
3. Verify the sidebar label remains consistent
4. Verify the page's meta description (`/brain/META-DESCRIPTION.md`) is
   still aligned with the new title

A page's title, URL, sidebar label, and meta description form a
**coherent quartet**. Change one, audit the other three.
