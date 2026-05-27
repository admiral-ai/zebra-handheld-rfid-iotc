# Meta-Description Rulebook for Technical Documentation

This rulebook governs the `description:` front-matter field on every
doc page. The `description:` becomes:

1. The HTML `<meta name="description">` tag — Google's primary signal
   for the SERP snippet (the gray text under the title)
2. The OpenGraph `og:description` — preview text in Slack, LinkedIn,
   iMessage, Discord, etc. when the URL is shared
3. The Twitter card `twitter:description`
4. The Algolia search-result snippet fallback

A meta description is **not** a summary. It's a **conversion line**:
the words that convince a search-engine user (who has typed a query and
is staring at 10 results) to click *this* one.

---

## 1. The eight foundational principles

| # | Principle | Why it matters |
|---|---|---|
| 1 | **Query-completion** | The description finishes what the title started; answers the implicit "and then what?" the title raises |
| 2 | **Value proposition first** | The reader sees the description because they're deciding whether to click — front-load the payoff |
| 3 | **Specificity wins clicks** | Concrete nouns ("RFD40 sled", "MQTT 3.1.1", "TLS 1.2") beat abstract phrasing ("the device", "the protocol") |
| 4 | **Keyword echo** | Natural inclusion of 1–3 of the title's keywords; helps Google match the snippet to the query |
| 5 | **Audience tagging** | When the page is persona-specific, name the audience ("for fleet operators", "for new integrators") |
| 6 | **No clickbait** | The description must not over-promise; mismatched snippets get reported as low-quality |
| 7 | **One canonical paragraph** | Each page has exactly one description; no A/B variants in front-matter |
| 8 | **Length-disciplined** | 120–160 chars optimal for SERP display (Google truncates at ~155–160 on desktop, ~120 on mobile) |

---

## 2. The five description templates

Most pages fall into one of five templates. Pick the closest fit and
fill in the variables; deviate only when the page is unusual.

### Template A — Concept (Explanation) pages

> `<Subject>` — `<one-sentence definition or scope>`. `<Reason the reader cares>` `<key qualifier or sub-topic>`.

**Example:**
- Page: `/foundations/hardware-tiers`
- Title: "Which sled do you have? (Direct vs Bridged)"
- Description: "Zebra RFD40 / RFD90 sleds come in two architecture tiers — Direct and Bridged. Tell them apart by SKU prefix and network topology. (~4 min read.)"

### Template B — How-to (procedure) pages

> Step-by-step guide to `<verb> <object> <qualifier>`. Covers `<key sub-steps or topics>`. For `<audience>` on `<platform/tier>`.

**Example:**
- Page: `/infrastructure/security/tls-setup`
- Title: "How to secure the MQTT connection with TLS"
- Description: "Step-by-step guide to enabling TLS 1.2 on an IOTC reader-broker connection. Install the CA cert, switch the endpoint to MQTT_TLS, verify with mqttConnEVT."

### Template C — Tutorial pages

> Phase `<N>` of the IOTC Quick Start: `<what you do this phase>`. By the end you will have `<concrete outcome>`. Continues into Phase `<N+1>` (`<next-phase action>`).

**Example:**
- Page: `/quick-start/phase-3`
- Title: "Phase 3: Verify the bootstrap connection (get_version)"
- Description: "Phase 3 of the IOTC Quick Start: send your first MQTT command and read the response. By the end, you will have proved the reader is reachable and ready for Phase 4."

### Template D — Reference (API) pages

> Reference for `<object>`. `<One-line scope>`. Includes `<schema / field types / examples / errors>`. Authoritative source: `<canonical>`.

**Example:**
- Page: `/reference/errors/codes`
- Title: "Command response error codes"
- Description: "Reference for the complete list of IOTC command response error codes 0-15. Includes the code, name, semantic meaning, and recovery hint."

### Template E — Diagnostic / troubleshooting pages

> Symptom: `<observable signal>`. This page maps it to the `<failure-mode / fix>`. Includes `<the actionable steps>` and `<related pages>`.

**Example:**
- Page: `/diagnose/symptoms`
- Title: "Something's broken?"
- Description: "Symptom-first index for the Zebra IOTC docs: pick the observable signal, get the failure mode and the recovery playbook. Covers bootstrap, commands, inventory, TLS, fleet drift."

---

## 3. Length discipline

| Range | Status | Behaviour |
|---|---|---|
| < 70 chars | ❌ Too short | Google often ignores and synthesises a snippet from page content (loses control) |
| 70–120 chars | ⚠️ Acceptable | OK for narrow pages, but leaves SERP real-estate unused |
| **120–160 chars** | ✅ **Optimal** | Full SERP snippet on desktop and mobile |
| 160–200 chars | ⚠️ Borderline | Truncated on mobile and most SERPs |
| > 200 chars | ❌ Never | Almost always truncated; first 160 chars carry all the weight |

**Rule of thumb.** Write to 150 characters. That leaves a 10-char
margin for Google's variable truncation point.

---

## 4. Format conventions

### 4a. Sentence structure

- Lead with the **subject** (page topic), not with "This page" or "The IOTC documentation contains"
- Use **active voice**: "Configure TLS on the reader" beats "TLS is configured on the reader"
- Use **complete sentences**, not bullet fragments — meta descriptions are paragraphs, not lists
- 2–3 sentences is ideal; 1 sentence OK for very narrow pages; 4+ is too long

### 4b. Typography

| Rule | ✅ | ❌ |
|---|---|---|
| ASCII apostrophes | `reader's pulse` | `reader’s pulse` |
| ASCII quotes (when needed) | `"START" command` | `“START” command` |
| Em-dash for asides | `MQTT 3.1.1 — IOTC's wire protocol` | `MQTT 3.1.1, IOTC's wire protocol` (weaker visually) |
| No newlines | All one line in front-matter | Multi-line via YAML continuation (encoding risk) |
| No HTML | Plain text only | `<b>TLS</b>` (gets escaped, looks broken) |
| No markdown | `set_wifi` (plain) | `` `set_wifi` `` (backticks render as literal text in SERPs) |

### 4c. Numbers and units

- Spell numbers one through nine; numerals for 10+
- Always numerals with units: `2,400 mAh`, `~6 m`, `60 s`, `MQTT 3.1.1`
- Use commas in 4+ digit numbers: `2,400` not `2400`
- ASCII units; no Unicode µ → write `microsecond` or `us`

---

## 5. Keyword placement strategy

A meta description should naturally repeat 1–3 keywords from the title.
This helps Google match the snippet to the query.

**Title:** "How to install a TLS certificate"
**Good description:** "Step-by-step guide to installing a TLS CA certificate on a Zebra IOTC reader using the install_certificate HTTP source. Includes verification."

Notice: `TLS`, `certificate`, `install` all echo from title. The Zebra
/ IOTC / install_certificate are the disambiguating qualifiers.

**Bad description:** "This page walks through the process of setting up the necessary cryptographic credentials for secure communication."

Even though this paraphrases the title accurately, it shares **zero
keywords** with the title — Google's snippet-matching scoring drops.

---

## 6. Audience tagging

When a page is persona-specific, name the audience in the description.
This filters out wrong-audience clicks and improves relevance scoring.

| Page audience | Tag phrase |
|---|---|
| New integrator | "For new integrators getting their first reader connected" |
| Solution builder | "For solution builders architecting multi-reader deployments" |
| API consumer | "For developers writing IOTC integration code" |
| Fleet operator | "For fleet operators managing deployed reader populations" |
| Diagnostician | "For anyone troubleshooting a non-working reader" |

Most reference pages don't need an audience tag (they serve all
audiences). How-to and tutorial pages benefit most.

---

## 7. Anti-patterns to never use

| Anti-pattern | Example ❌ | Fix ✅ |
|---|---|---|
| Boilerplate intro | "This page is about MQTT QoS levels" | Lead with the subject: "MQTT QoS levels (0, 1, 2) and what each guarantees..." |
| Vague payoff | "Learn more about MQTT" | "Understand which QoS level to use for command responses vs telemetry — and why" |
| Promo language | "Master the art of MQTT in five minutes" | "Five-minute primer on MQTT 3.1.1 for engineers new to pub/sub" |
| Repeat the title verbatim | Title: "Phase 3: Verify the bootstrap connection"; Description: "Phase 3: Verify the bootstrap connection." | Add what the page *does*: "Phase 3 of the IOTC Quick Start: send your first MQTT command and read the response." |
| Internal-jargon-only | "Two-edges fault isolation with terminalConnection signals" | "Two-edges model: how to tell whether a fault is on the reader-host edge or the host-broker edge using terminalConnection events" |
| Dates in description | "As of March 2026, IOTC supports TLS 1.2 only" | "IOTC supports TLS 1.2 (not 1.3 yet)" — date in front-matter, not description |
| Truncation indicators | "MQTT primer for engineers..." (the `...` suggests it's incomplete) | Use complete sentences with proper end punctuation |
| Question with no answer | "What's the deal with MQTT QoS levels?" | Question titles are OK; the description should *answer* not echo |
| All-caps for emphasis | "CRITICAL: Configure TLS before connecting" | "Configure TLS before connecting — IOTC requires MQTT_TLS for production endpoints" |
| Multiple paragraphs | "First sentence. Second sentence. Third sentence. Fourth sentence." (> 160 chars) | Trim to 2–3 sentences max |

---

## 8. Per-page checklist

When writing or editing a description:

- [ ] Length 120–160 chars (140–155 sweet spot)
- [ ] First 100 chars carry the primary keyword and payoff
- [ ] Echoes 1–3 keywords from the title
- [ ] Active voice, lead with subject
- [ ] No "This page", no "Learn about", no boilerplate
- [ ] Brand / product / protocol qualifier where ambiguous
- [ ] Audience tag for persona-specific pages
- [ ] No markdown, no HTML, no smart quotes, no Unicode units
- [ ] Complete sentences with proper end punctuation
- [ ] Matches the page's actual scope (no over-promising)

---

## 9. Special-case patterns

### 9a. The Quick Start phase descriptions

The Quick Start is a sequence; each phase description points forward
to the next phase. This creates a chain in SERP snippets that
search-arriving readers can follow.

| Phase | Description seed |
|---|---|
| Phase 1 | "Phase 1 of the IOTC Quick Start: prepare your network and broker. By the end, you have a reachable MQTT 3.1.1 broker the reader can connect to." |
| Phase 2 (Direct) | "Phase 2 (Direct tier) of the IOTC Quick Start: use 123RFID Desktop on Windows to set Wi-Fi, region, and the MDM endpoint. Bridged readers: see /quick-start/phase-2/bridged." |

### 9b. Reference (API) pages

Reference pages emphasise **completeness and authoritativeness**:

- "Authoritative reference for ..."
- "Complete schema for ..."
- "Field-by-field reference for ..."

### 9c. Diagnostic pages

Diagnostic descriptions emphasise **symptom-led entry**:

- "Symptom: <signal>. This page maps it to <cause> and <fix>."
- "What to check when <observable>."

### 9d. FAQ pages

FAQ descriptions emphasise **question coverage**:

- "Top questions about <topic>: <Q1>, <Q2>, <Q3>."
- "Frequently asked about <topic>: <list of canonical Q phrasings>"

---

## 10. Maintenance

This rulebook lives at `/brain/META-DESCRIPTION.md`. When a description
is added or changed:

1. Check the checklist in §8
2. Verify it matches the **current** title (titles and descriptions
   drift apart; audit together)
3. Verify the page's actual scope still matches (descriptions become
   stale when pages are expanded or trimmed)

A page's **title, URL, sidebar label, and meta description** form a
coherent quartet. Change one, audit the other three.
