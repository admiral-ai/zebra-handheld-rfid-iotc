# URL Naming Rulebook for the Zebra IoT Connector docs

This rulebook governs every URL the site exposes — conceptual chapters,
how-to guides, tutorial phases, reference pages, generated-index landings,
and external API anchors. Apply it whenever a page is added, renamed,
moved, or split. The goal is URLs that are predictable, stable, and
type-able from memory after one read.

---

## 1. Foundational principles

| # | Principle | Why it matters |
|---|---|---|
| 1 | **Predictability** | A reader who knows the topic should be able to guess the URL within ±1 segment |
| 2 | **Stability** | Once published, URLs do not change. Cool URIs don't change. Renames require redirects |
| 3 | **Hierarchy** | The path reflects the information architecture, not the navigation breadcrumb |
| 4 | **Concision** | Short enough to type/share aloud, long enough to be unambiguous |
| 5 | **Semantic transparency** | A URL describes content, not the page's position in a menu |
| 6 | **Human readability** | URLs are read by both humans and machines; humans first |
| 7 | **SEO discipline** | Keywords in URLs help discovery; filler words hurt |
| 8 | **Internationalization-safe** | ASCII only, lowercase, no diacritics, no spaces |
| 9 | **URL ↔ H1 correspondence** | The terminal segment is derivable from the page's H1 (after stop-word removal and kebab-casing). A reader who sees the URL should be able to predict the H1 — and vice versa |

### 1a. URL ↔ H1 correspondence in detail

The terminal (final) segment of the URL is the canonical short name for
the page's content. It is derived from the H1, not from sidebar order,
not from the filename history, not from the section heading above it.

The derivation rule, in order:

1. Start from the H1.
2. Remove stop words (`a`, `an`, `the`, `of`, `for`, `and`, `to`, `with`,
   `your`, `you`, `is`, `are`, `on`, `in`, `from`, `vs`).
3. Remove rhetorical framing (`how to`, `what is`, `why`, `when`).
4. Identify the 1–3 most specific content nouns. Drop generic helpers
   (`overview`, `about`, `intro`).
5. Kebab-case the result. Prefer 2–3 words; tolerate up to 4 only when
   needed for disambiguation.

| H1 | ❌ Wrong terminal | ✅ Right terminal | Why |
|---|---|---|---|
| "How commands and responses flow" | `architecture/communication-flow` | `communication-flow` | Drop generic parent `architecture`; H1 is about the flow itself |
| "MQTT in five minutes" | `mqtt/primer` | `mqtt-primer` | "MQTT primer" is the canonical short form of an intro page |
| "Where things fail" | `diagnose/two-edges` | `diagnose/where-things-fail` | Old slug was an internal mental model; H1 is the topic users search for |
| "Choose how the reader reads tags" | `operating-mode/profiles` | `operating-mode-profiles` | The thing the page documents is operating-mode profiles; H1 is the verb framing |
| "Going from one reader to a fleet" | `provisioning/models` | `provisioning-models` | "models" alone is too generic; "provisioning-models" is what the H1 disambiguates to |
| "Keeping a fleet in sync" | `management/about-bulk` | `bulk-management` | "about-bulk" reads like an internal note; "bulk-management" is the artifact |
| "What happens when the network drops" | `reliability/retention-retry` | `retention-and-retry` | Hyphen mid-word read as a compound noun; explicit "and" reads as English |
| "Filter tags before vs after the read" | `operating-mode/post-filters-about` | `post-filters` | Drop redundant `-about` suffix; the page is the canonical post-filters concept |

The rule does **not** require the URL to copy the H1 word-for-word.
Marketing or rhetorical H1s (e.g., "Something's broken?") translate to
their content noun (`symptoms`). What matters is that a reader who lands
on the URL is not surprised by the H1, and a reader who reads the H1 can
guess the URL.

---

## 2. Format conventions (non-negotiable)

| Rule | Example ✅ | Example ❌ |
|---|---|---|
| Lowercase only | `/foundations/mqtt-primer` | `/Foundations/MQTT-Primer` |
| Hyphen-separated (kebab-case) | `/bootstrap-tools` | `/bootstrap_tools`, `/bootstrapTools`, `/bootstrap%20tools` |
| ASCII only | `/quick-start/phase-1` | `/quick-start/phase-uno` (non-English when site is English-default) |
| No file extensions | `/quick-start/phase-1` | `/quick-start/phase-1.html`, `/quick-start/phase-1.md` |
| No trailing slash (or use it consistently — pick one site-wide) | `/foundations/actors` | `/foundations/actors/` (if not the chosen convention) |
| Numbers OK when semantic | `/foundations/mqtt-3-1-1` | `/foundations/protocol-2024` (date-bound, unstable) |

---

## 3. Path depth and segment limits

| Property | Limit |
|---|---|
| Maximum total depth | 3 segments after domain (4 in exceptional cases — e.g., tutorial phase sub-variants) |
| Maximum segment length | 30 characters; sweet spot 5–20 |
| Minimum segment length | 2 characters (allow `ip`, `os`, etc. when industry-standard) |
| Stop-word segments | Never (`the`, `of`, `for`, `and`, `to`, `a`) |
| Filler segments | Never (`introduction`, `concepts`, `overview`, `general`, `misc`, `info`, `about` used as a category name) |

> "About" is acceptable as a leaf when the page is genuinely an "about
> the topic" page (e.g., `/post-filters/about`); not acceptable as an
> intermediate segment.

---

## 4. Semantic rules by Diátaxis quadrant

### Explanation (concept) pages — **noun-phrased**

| Pattern | Use case | Example ✅ | Example ❌ |
|---|---|---|---|
| `<domain>/<topic>` | Single-topic concept | `/foundations/actors` | `/foundations/architecture/components` (verbose middle, generic leaf) |
| `<domain>/<topic>` | API-mapped concept | `/network/wifi` (maps to `set_wifi`/`get_wifi` sub-tag) | `/network/wifi-configuration` (verb-tinged) |

### How-to (procedure) pages — **verb-phrased** OR **artifact-named**

| Pattern | Example ✅ | Example ❌ |
|---|---|---|
| Verb-phrased: `<verb>-<object>` | `/security/install-certificate` | `/security/certificates` (ambiguous: how-to or concept?) |
| Artifact-named: `<noun>` when verb is implied by section | `/security/certificate-management` | `/security/managing-certificates` (gerund) |

### Tutorial pages — **phase-numbered**

| Pattern | Example ✅ | Example ❌ |
|---|---|---|
| `<series>/phase-<N>` | `/quick-start/phase-1` | `/quick-start/step-1-connect` (mixes ordinal + content keyword) |
| Variant suffixes for branches | `/quick-start/phase-2/direct` and `/phase-2/bridged` | `/quick-start/step-2-discover-mobile` (variant in filename) |

### Reference pages — **object-named** (singular for the canonical item, plural for collections)

| Pattern | Example ✅ |
|---|---|
| Single canonical object | `/reference/glossary` |
| Collection / index | `/reference/error-codes`, `/reference/failure-modes` |
| API operation | `/api/set-wifi` mirroring the operation name `set_wifi` (with underscore → hyphen) |

---

## 5. Specific patterns

### API operations (canonical schema commands)

| Rule | Example |
|---|---|
| Mirror the operation name; underscore → hyphen | `set_wifi` → `/api/set-wifi` |
| Group by sub-tag when the API reference does | `/api/network/set-wifi` (if sub-tag is "Network Configuration") |
| Events use `evt` suffix only when canonical does | `heartbeatEVT` → `/api/heartbeat-evt`; `dataEVT` → `/api/data-evt`; `alert_short` → `/api/alert-short` |

### Quick Start phases

| Rule | Example |
|---|---|
| Numbered phases use `phase-<N>` | `/quick-start/phase-1` |
| Prerequisites under `prerequisites` (sub-folder of `quick-start`) | `/quick-start/prerequisites/requirements` |
| Branch variants as sub-segments | `/quick-start/phase-2/direct`, `/quick-start/phase-2/bridged` |
| Phase landing pages (generated-index) | `/quick-start/phase-0`, `/quick-start/phase-2` |
| Series overview | `/quick-start/overview` |

### Diagnostic pages

Diagnostic pages are top-level under `/diagnose/` rather than buried
under `/reference/diagnose/`. The diagnose corpus is a peer of reference,
not a subset; it has different writing patterns (symptom-led, time-
critical) and different reading patterns (jumped to in an incident).

| Rule | Example |
|---|---|
| Symptom index | `/diagnose/symptoms` |
| Failure mode catalogue | `/diagnose/failure-modes` |
| Two-edges mental model | `/diagnose/where-things-fail` |
| Recovery playbooks | `/diagnose/recovery-playbooks` |
| Common misconceptions | `/diagnose/misconceptions` |

### Infrastructure pages (flattened)

`/infrastructure/<topic>` rather than `/infrastructure/management/<topic>`
or `/infrastructure/<category>/<topic>` where the category adds no
information. The original `management/` segment grouped administrative
endpoints in the API reference; in docs, where every infrastructure
page is administrative, the segment is redundant.

| Rule | Example |
|---|---|
| Device state concept | `/infrastructure/device-state` |
| Config-document concept | `/infrastructure/config-document` |
| System-operations how-to | `/infrastructure/system-operations` |
| Network sub-folder kept (multiple sibling pages) | `/infrastructure/network/wifi` |
| Endpoint sub-folder kept (multiple sibling pages) | `/infrastructure/endpoints/about` |

> When a sub-folder has **only one** sidebar-surfaced child, flatten.
> When it has multiple siblings users navigate between, keep the folder.

### Observability events (flattened)

Events live directly under `/observability/`, not under
`/observability/events/`. The `events/` segment was grouping in the IA
but the observability domain itself is fundamentally about events; the
segment is tautological.

| Rule | Example |
|---|---|
| Configure-events how-to | `/observability/configure-events` |
| Per-event-family pages | `/observability/heartbeat`, `/observability/alerts`, `/observability/mqtt-connection` |

### RFID pages (flattened where one-deep)

| Rule | Example |
|---|---|
| Operating-mode profiles | `/rfid/operating-mode-profiles` |
| Start/stop inventory | `/rfid/start-stop-inventory` |
| Post-filters concept | `/rfid/post-filters` |
| Tag-data event schema | `/rfid/dataevt-schema` |

### Fleet pages (sub-folders flattened or renamed)

| Rule | Example |
|---|---|
| Provisioning models concept | `/fleet/provisioning-models` |
| Bulk fleet management concept | `/fleet/bulk-management` |
| Retention and retry reliability concept | `/fleet/retention-and-retry` |

---

## 6. Anti-patterns (always avoid)

- **Stop words in segments**: `/the-mqtt-primer` → `/mqtt-primer`
- **Filler intermediate segments**: `/foundations/introduction/about-iotc` → `/foundations/about-iotc`
- **Tautological intermediate segments**: `/observability/events/heartbeat` → `/observability/heartbeat` (observability *is* events)
- **Single-occupancy sub-folders**: `/fleet/reliability/retention-retry` → `/fleet/retention-and-retry` (no sibling occupies `reliability/`)
- **Internal-jargon leaves**: `/diagnose/two-edges` → `/diagnose/where-things-fail` (jargon ≠ search query)
- **Dates / years / versions in stable URLs**: `/2026/mqtt-primer` (use version in front-matter; site versioning, not URL)
- **Marketing language**: `/awesome-mqtt-guide` → `/mqtt-primer`
- **Action verbs on concept URLs**: `/configure-network` for a concept page → `/network/architecture`
- **Underscore-separated**: `/mqtt_primer` → `/mqtt-primer`
- **camelCase / PascalCase**: `/MqttPrimer` → `/mqtt-primer`
- **Numbers without semantic meaning**: `/chapter-3` → use what's actually in chapter 3
- **`about.md` as a generic name**: prefer the topic name (`/network/architecture` over `/network/about`)
- **Abbreviations that aren't industry-standard**: `/iotc-cfg` → `/iotc-configuration`
- **Localised words when site is English**: `/colour` → `/color` (or other way; pick one)
- **Trailing-slash inconsistency**: pick `/foo` OR `/foo/`, never both
- **Step-numbered tutorial filenames with content keywords**: `step-3-subscribe` → `phase-3` (the content keyword changes; the phase number doesn't)

---

## 7. Stability rules

1. **Once a URL is published, it is permanent.** Renames require a 301
   redirect from the old URL to the new URL.
2. **Redirects are documented.** Each rename adds an entry to
   `docusaurus.config.ts` plugin-client-redirects with a one-line
   comment of the rename's date and reason.
3. **Cross-references inside the docs use the *new* URL** after a
   rename. The old URL exists only as a redirect target.
4. **External references** (in source code, blog posts, slack messages,
   etc.) continue to work via the redirect; the goal is zero broken
   external links.

### 7a. Blast radius — judging rename cost before applying

"Blast radius" is the count of things that must change in lockstep for
a rename to land safely:

| Component | Counts as |
|---|---|
| File move (`git mv`) | 1 |
| `sidebars.ts` entry update | 1 |
| Redirect entry in `docusaurus.config.ts` | 1 |
| Each internal cross-reference (`[text](/old)`) | 1 |
| `generated-index` slug change if the page is a category landing | 1 |
| Front-matter `id:` update if the doc id is path-derived | 1 |

A **low-blast-radius** rename (1 file, ≤ 5 cross-refs, no sidebar
restructure) can be applied any time. A **high-blast-radius** rename
(many files moving together, dozens of cross-refs, sidebar IA changes)
is batched into a dedicated audit pass so every step lands atomically
and the broken-link audit confirms zero unresolved links before merge.

> **Heuristic.** If the rename touches > 1 file or > 10 cross-refs, treat
> it as a batched pass. Single-file renames with < 10 cross-refs are
> safe inline.

---

## 8. Internationalization

The Zebra IoTC docs site is English-default. URLs are English. When a
localised site is added later:

- `i18n: { defaultLocale: 'en', locales: ['en', '<locale>'] }` in
  `docusaurus.config.ts`
- URLs keep their English slugs; localised content lives at
  `/<locale>/<same-path>`
- No URL translation (translating URLs creates lookup-table churn for
  search engines and breaks deep links across locales)

---

## 9. Audit of current site URLs

The mapping below is the result of applying this rulebook to every
sidebar-surfaced URL. The "Old URL" column is what shipped before the
rulebook; the "New URL" column is the rulebook-aligned form. **Old URLs
remain functional via 301 redirects.**

### Pass 1 (low blast radius) — already applied

| Old URL | New URL | Reason |
|---|---|---|
| `/foundations/introduction/about-iotc` | `/foundations/about-iotc` | Drop filler segment `introduction` |
| `/foundations/introduction/supported-hardware` | `/foundations/hardware-tiers` | Drop filler + sharpen leaf (the page is about Direct vs Bridged tiers) |
| `/foundations/introduction/bootstrap-tools` | `/foundations/bootstrap-tools` | Drop filler segment |
| `/foundations/introduction/glossary` | `/reference/glossary` | A glossary is a reference object; move to the reference category |
| `/foundations/introduction/documentation-guide` | `/foundations/documentation-guide` | Drop filler segment |
| `/foundations/introduction/v1-1-features` | `/foundations/v1-1-features` | Drop filler segment |
| `/foundations/concepts/native-mqtt-vs-openapi` | `/foundations/native-mqtt-vs-openapi` | Drop filler segment `concepts` |
| `/foundations/orient/about` | `/foundations/start` | "about" as a leaf was generic; "start" is the actual purpose |
| `/foundations/orient/docs-and-api-ref` | `/foundations/docs-and-api-reference` | Drop "orient" + spell out "reference" |
| `/foundations/architecture/components` | `/foundations/actors` | "components" was generic; the page describes the five named actors |

### Pass 2 (higher blast radius, applied in this rulebook revision)

| Old URL | New URL | Reason |
|---|---|---|
| `/foundations/mqtt/primer` | `/foundations/mqtt-primer` | Single-child sub-folder flattened; H1 "MQTT in five minutes" → canonical "MQTT primer" |
| `/foundations/architecture/communication-flow` | `/foundations/communication-flow` | Drop generic intermediate `architecture`; H1 is the flow itself |
| `/getting-started/quick-start/overview` | `/quick-start/overview` | Drop redundant `getting-started/` prefix (the whole tutorial *is* getting started); align with sidebar Part 3 label |
| `/getting-started/quick-start/step-1-connect` | `/quick-start/phase-1` | "Phase" matches H1 prefix; drop content keyword from URL (it's a snapshot of v1, and phase content drifts over time) |
| `/getting-started/quick-start/step-2-discover` | `/quick-start/phase-2/direct` | Variant lives as a sub-segment, not a filename suffix |
| `/getting-started/quick-start/step-2-discover-mobile` | `/quick-start/phase-2/bridged` | Variant naming aligned to hardware tier (Direct/Bridged) |
| `/getting-started/quick-start/step-3-subscribe` | `/quick-start/phase-3` | Drop content keyword `subscribe` from URL |
| `/getting-started/quick-start/step-4-start` | `/quick-start/phase-4` | Drop content keyword |
| `/getting-started/quick-start/step-5-read` | `/quick-start/phase-5` | Drop content keyword |
| `/getting-started/quick-start/step-6-stop` | `/quick-start/phase-6` | Drop content keyword |
| `/getting-started/quick-start/step-7-reboot` | `/quick-start/phase-7` | Drop content keyword |
| `/getting-started/prerequisites/requirements` | `/quick-start/prerequisites/requirements` | Prerequisites are quick-start scoped, not a separate top-level domain |
| `/getting-started/prerequisites/credentials` | `/quick-start/prerequisites/credentials` | Same: keep under `quick-start/` |
| `/getting-started/prerequisites/bluetooth-pairing` | `/quick-start/prerequisites/bluetooth-pairing` | Same: keep under `quick-start/` |
| `/infrastructure/management/device-state` | `/infrastructure/device-state` | Drop redundant `management/` intermediate (every infra page is administrative) |
| `/infrastructure/management/config-document` | `/infrastructure/config-document` | Same flattening rule |
| `/infrastructure/management/system-operations` | `/infrastructure/system-operations` | Same flattening rule |
| `/observability/events/configure` | `/observability/configure-events` | Drop tautological `events/`; rename leaf to verb-phrased how-to |
| `/observability/events/heartbeat` | `/observability/heartbeat` | Drop tautological `events/` |
| `/observability/events/alerts` | `/observability/alerts` | Drop tautological `events/` |
| `/observability/events/mqtt-connection` | `/observability/mqtt-connection` | Drop tautological `events/` |
| `/rfid/operating-mode/profiles` | `/rfid/operating-mode-profiles` | Single sidebar-surfaced child of `operating-mode/`; flatten and lengthen leaf |
| `/rfid/operating-mode/start-stop` | `/rfid/start-stop-inventory` | Flatten; lengthen leaf to disambiguate ("start-stop" alone is too generic) |
| `/rfid/operating-mode/post-filters-about` | `/rfid/post-filters` | Drop tautological `-about` suffix; flatten |
| `/rfid/tag-data/dataevt-schema` | `/rfid/dataevt-schema` | Flatten single-child folder |
| `/fleet/provisioning/models` | `/fleet/provisioning-models` | Flatten; `models` alone too generic, `provisioning-models` is the artifact |
| `/fleet/management/about-bulk` | `/fleet/bulk-management` | Flatten; H1 "Keeping a fleet in sync" → canonical "bulk management" |
| `/fleet/reliability/retention-retry` | `/fleet/retention-and-retry` | Flatten; spell `and` to read as English |
| `/reference/diagnose/symptom-index` | `/diagnose/symptoms` | Hoist `diagnose/` to top level; "symptoms" is the canonical short form |
| `/reference/diagnose/failure-modes` | `/diagnose/failure-modes` | Hoist `diagnose/` to top level |
| `/reference/diagnose/two-edges` | `/diagnose/where-things-fail` | Hoist + rename: H1 is "Where things fail", `two-edges` was internal jargon |
| `/reference/diagnose/recovery-playbooks` | `/diagnose/recovery-playbooks` | Hoist `diagnose/` to top level |
| `/reference/diagnose/misconceptions` | `/diagnose/misconceptions` | Hoist `diagnose/` to top level |

### Future-pass candidates (deferred — still higher cost than benefit)

| Old URL | Possible new URL | Why deferred |
|---|---|---|
| `/infrastructure/endpoints/about` | `/infrastructure/mqtt-endpoints` | Sub-folder has 4 files, only 1 sidebar-surfaced; flattening requires deciding the fate of the other 3 unindexed files |
| `/infrastructure/security/model` | `/infrastructure/tls-and-certificates` | Same: 4 files in the sub-folder, 1 sidebar-surfaced; deferred pending decision on the rest |
| `/infrastructure/network/architecture` | `/infrastructure/network-architecture` | Network sub-folder has > 1 sibling (wifi, ethernet, troubleshooting); keep the folder per §5 rule |

---

## 10. Per-page checklist when adding a new URL

Before merging a PR that introduces a new page:

- [ ] URL is lowercase, hyphen-separated, ASCII-only
- [ ] No stop words or filler segments
- [ ] No tautological intermediate segments (e.g., `events/` under `observability/`)
- [ ] Depth ≤ 3 (≤ 4 only for explicit branch variants)
- [ ] Each segment 2–30 characters
- [ ] Terminal segment is derivable from the H1 per §1a
- [ ] Page type matches the URL pattern (concept = noun, how-to = verb or artifact, tutorial = phased, reference = object)
- [ ] No date or version in the URL
- [ ] If renaming an existing URL: redirect added to `docusaurus.config.ts`
- [ ] If renaming: every internal cross-reference updated to the new URL (the old URL exists only as a redirect target)
- [ ] Sidebar label is concise (≤ 30 chars typically)
- [ ] Page title and `sidebar_label` are consistent with URL slug semantics
- [ ] Blast radius assessed (§7a) — single-file = inline; multi-file = batched audit pass

---

## 11. Maintenance

This rulebook lives in `/brain/URL-NAMING.md`. When a page rename is
applied:

1. Add the rename to the "Renames applied" table in §9
2. Add the redirect to `docusaurus.config.ts`
3. Update internal cross-references via grep — every old URL not used
   as a redirect target should be replaced
4. Run the site locally and verify the redirect resolves; verify the
   sidebar renders; verify the new URL is reachable
5. Run the broken-link audit script and confirm 0 unresolved links

A canonical script for the cross-reference update lives at
`/tmp/url-rename.py` (re-creatable; not committed).
