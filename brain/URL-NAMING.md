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
| Prerequisites under `phase-0` | `/quick-start/phase-0/requirements` |
| Branch variants as sub-segments | `/quick-start/phase-2/direct`, `/quick-start/phase-2/bridged` |
| Phase landing pages (generated-index) | `/quick-start/phase-0`, `/quick-start/phase-2` |

### Diagnostic pages

| Rule | Example |
|---|---|
| Symptom index | `/diagnose/symptoms` |
| Failure mode catalogue | `/diagnose/failure-modes` |
| Recovery playbooks | `/diagnose/recovery-playbooks` |
| Misconceptions | `/diagnose/misconceptions` |

---

## 6. Anti-patterns (always avoid)

- **Stop words in segments**: `/the-mqtt-primer` → `/mqtt-primer`
- **Filler intermediate segments**: `/foundations/introduction/about-iotc` → `/foundations/about-iotc`
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

### Renames applied in this pass (high-confidence, low-disruption)

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

### Future-pass candidates (deferred — larger blast radius)

| Old URL | Possible new URL | Why deferred |
|---|---|---|
| `/getting-started/quick-start/step-N-X` | `/quick-start/phase-N` | Step→phase renaming would touch every Quick Start page + many cross-refs; defer until a planned IA refresh |
| `/infrastructure/management/*` | `/infrastructure/*` (flatten) | Touches device-state, config-document, system-operations and many cross-refs |
| `/infrastructure/endpoints/about` | `/infrastructure/endpoints` | Collides with the existing category landing; needs Docusaurus generated-index reshape |
| `/infrastructure/security/model` | `/infrastructure/security` | Same generated-index collision |
| `/reference/diagnose/*` | `/diagnose/*` (flatten) | Pulls a known set of pages out of `/reference/`; consider when `/reference/` is redesigned |

---

## 10. Per-page checklist when adding a new URL

Before merging a PR that introduces a new page:

- [ ] URL is lowercase, hyphen-separated, ASCII-only
- [ ] No stop words or filler segments
- [ ] Depth ≤ 3 (≤ 4 only for explicit branch variants)
- [ ] Each segment 2–30 characters
- [ ] Page type matches the URL pattern (concept = noun, how-to = verb or artifact, tutorial = phased, reference = object)
- [ ] No date or version in the URL
- [ ] If renaming an existing URL: redirect added to `docusaurus.config.ts`
- [ ] If renaming: every internal cross-reference updated to the new URL (the old URL exists only as a redirect target)
- [ ] Sidebar label is concise (≤ 30 chars typically)
- [ ] Page title and `sidebar_label` are consistent with URL slug semantics

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

A canonical script for the cross-reference update lives at
`/tmp/url-rename.py` (re-creatable; not committed).
