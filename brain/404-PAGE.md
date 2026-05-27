# 404 Page Styleguide for Technical Documentation

This styleguide governs the design, information architecture, copy,
and technical behaviour of a 404 page for a technical-documentation
site. A 404 page is not a passive error notice — it is the **most
important UX page in the site** for a category of visitors that is
otherwise invisible to the rest of the IA: people who arrived at a
URL that doesn't exist.

A great 404 page does six things, in order of priority:

1. Confirms the visitor is still on the docs site (not in a void)
2. States, in plain English, that the URL doesn't exist
3. Gives them a concrete way to recover within one click
4. Doesn't make them feel stupid
5. Helps the site owner detect link rot (analytics, reporting)
6. Returns a real HTTP 404 status code (not a soft-404)

---

## 1. Foundational principles

| # | Principle | Why it matters |
|---|---|---|
| 1 | **Recovery > apology** | The visitor wants to find content, not absolve the site |
| 2 | **Search is the #1 recovery tool for docs** | Most people hit 404 with a topic in mind; search lets them route themselves |
| 3 | **Brand consistency, not crisis design** | A 404 must look like part of the site — same navbar, footer, typography. A wildly different aesthetic suggests something is broken at a system level |
| 4 | **Specificity over abstraction** | Show the attempted URL, the referrer (when available), and the actual HTTP code |
| 5 | **One screen, no scroll on desktop** | All recovery options should be visible above the fold at 1280×800 |
| 6 | **Plain language, mild humour at most** | Technical docs serve people who are likely stressed or under deadline; clever copy reads as smug |
| 7 | **Power-user diagnostics, casual-user comfort** | Show the URL for power users; lead with prose for casual users |
| 8 | **No dead ends** | Every recovery path leads somewhere; never leave the visitor with no next step |

---

## 2. Who hits a 404 on a docs site? Four mental states

The recovery options must serve all four. Designing the page is easier
when each section is mapped to one or more of these archetypes.

| Archetype | Mental state | What they need |
|---|---|---|
| **The link follower** | Came from an external link (Slack, blog, Stack Overflow) and is confused: "Did the link break, or is this the wrong site?" | Reassurance that they're on the right site; a search box; a way to report the dead link |
| **The bookmarker** | Saved a URL months ago; the IA changed | Site navigation map; "what's new" or "page renamed" signal if available |
| **The mistyper** | Hand-typed a URL and got a character wrong | Top-level nav links; search; quick path to home |
| **The crawler** | Search engine or LLM following an indexed URL that's since been removed | A real HTTP 404 status (no soft-404), `noindex` meta, and useful prose for the human follower |

---

## 3. The seven sections of a great docs 404

Each section is mapped to its purpose and the archetype it serves.

### 3a. Section 1: Status acknowledgement (top of page)

**Purpose:** Confirm the page-not-found state immediately and prominently.

| Element | Treatment |
|---|---|
| Visual focal point | The numeral `404` displayed in a font 2–3× larger than the H1 below it |
| Heading (H1) | Plain English statement, not "Oops!" — e.g. **"This page doesn't exist"** or **"Page not found"** |
| Subhead | One line of context: *"The URL you requested isn't part of this documentation."* |

**Anti-patterns:**
- Cartoon mascots, exploded illustrations, "oops!" prefixes
- Hiding the status code (some sites do this to feel "softer" — but power users need the signal)
- A photo that has no semantic relationship to the site or the error

### 3b. Section 2: Diagnostics strip (just below acknowledgement)

**Purpose:** Show what was requested. This satisfies power users (who want to see the exact URL) and helps casual users notice a typo.

| Element | Treatment |
|---|---|
| Attempted URL | Displayed in monospace; truncate with ellipsis if > 80 chars, but expose the full URL on hover/click |
| Referrer (if available) | One line: *"You arrived here from \<source\>"* — for casual user reassurance |
| HTTP status | Subtle muted text: *"HTTP 404 · this page doesn't exist on this site"* |

**Anti-patterns:**
- Surfacing the full request headers
- Hiding the URL entirely (the visitor needs to verify what they typed)
- Surfacing sensitive query parameters

### 3c. Section 3: "What likely happened" (optional but recommended)

**Purpose:** Reduce visitor self-blame. Naming the probable causes shifts the mental frame from "I did something wrong" to "this is a known kind of problem."

| Cause | Example phrasing |
|---|---|
| URL was renamed | "We reorganised the documentation; some URLs were moved" |
| Page was deleted | "This topic was retired or merged into another page" |
| Typo | "You may have mistyped part of the URL" |
| External outdated link | "The link you followed may be out of date" |

Keep this list short (3–4 items max). Order by likelihood for your site's specific situation.

### 3d. Section 4: Search (CRITICAL for docs)

**Purpose:** The single most useful recovery tool. Most 404-hitters know *what topic* they were looking for; search lets them find it without re-navigating.

| Element | Treatment |
|---|---|
| Input | Same search field that appears in the site navbar — visually consistent |
| Placeholder | *"Search the documentation"* (not "Search…") |
| Autofocus | Yes, on page load (only when no other input is in focus) |
| Width | At least 60% of the content column width |
| Suggested seed | Optionally prefill with a guess derived from the attempted URL slug |

**Anti-patterns:**
- A small search box hidden in a corner
- Not auto-focusing
- A search that returns a different result set than the main site search

### 3e. Section 5: Curated recovery jumps

**Purpose:** Direct links to the highest-value pages on the site. These cover the visitor who can't think of a search query.

For a docs site, the canonical recovery jumps are:

| Link | When it helps |
|---|---|
| **Start here** / home | Lost visitor wants to start over |
| **Quick start tutorial** | New user who hit a 404 mid-onboarding |
| **API reference** | API consumer looking for an endpoint that moved |
| **Symptom index / diagnose** | Someone troubleshooting who hit a removed troubleshooting page |
| **Site map / full TOC** | Power user who wants to scan the IA |
| **Latest release notes** | Someone whose link is stale because of a version bump |

Limit to 4–6 links. List, not buttons (buttons imply primary action; here we want to expose options).

### 3f. Section 6: Report a broken link (low-key)

**Purpose:** Collect signal about external link rot. Visitors arriving from external sources can flag the issue; you can fix it (or contact the linker).

| Element | Treatment |
|---|---|
| Trigger | A single line: *"Think this URL should resolve? \[Report it]"* |
| Action | Opens a GitHub issue with the URL and referrer prefilled, or opens a small modal with an email/form |
| Friction | Maximum 2 clicks to submit — visitors will not fill out long forms |

**Anti-patterns:**
- Required name + email fields
- A captcha
- Linking to a separate page that has its own form

### 3g. Section 7: Standard navbar + footer

**Purpose:** Brand continuity. The 404 page lives inside the site, not outside it.

The navbar and footer should be **byte-identical** to the rest of the site. Resist the urge to "simplify" the 404 chrome — visitors lose orientation when chrome changes mid-session.

---

## 4. Visual design rules

| Rule | Specification |
|---|---|
| `404` numeral | Display font, 6–8 rem, weight 600–800, color matches site's primary text |
| H1 | Same size as standard doc page H1 (don't enlarge or shrink) |
| Vertical rhythm | Same baseline grid as the rest of the site |
| Maximum content width | Matches the docs content column (typically 720–860 px) — don't full-bleed |
| Spacing | More generous than docs pages — 1.5–2× the standard section gaps |
| Accent colour for `404` | Subtle muted use of the site's secondary or accent colour — never red (red implies system-level alarm; this is just a missing page) |
| Icon (optional) | If used: a single, minimal line icon (e.g. magnifying glass, broken-chain symbol) — never an emoji or mascot |
| Background | Plain — same as docs body. No gradients, no patterns |

---

## 5. Tone and copywriting

### Allowed

- **Plain English**: "This page doesn't exist on this site."
- **Mild reassurance**: "You're still on the documentation site."
- **Action verbs in CTA**: "Search", "Start here", "Report"
- **Specific technical context** for power users (the URL, the status code)

### Disallowed

- "Oops!", "Uh oh!", "Sorry!" — over-apologetic, juvenile
- "Houston, we have a problem" — clichéd
- Cute personification ("This page is taking a nap")
- Profanity — even mild ("This page got lost")
- Long explanations (> 2 sentences without a heading break)
- Marketing copy ("While you're here, check out…")
- Forced humour (some technical writers can pull this off; most can't)

### Copy templates

| Surface | Template | Example |
|---|---|---|
| H1 | "This page doesn't exist" / "Page not found" | "This page doesn't exist" |
| Subhead | 1 sentence stating the missing URL | "The URL you requested isn't part of this documentation." |
| What-happened intro | "Likely reasons:" or "A few things that may have happened:" | "A few things that may have happened:" |
| Search prompt | "Search the documentation" or "Looking for something specific?" | "Looking for something specific? Search the documentation." |
| Curated-jumps intro | "Or jump to a known place:" | "Or jump to one of these:" |
| Report-link prompt | "Think this URL should resolve?" | "Think this URL should resolve? Tell us." |

---

## 6. Recovery pattern: "did you mean?" (advanced)

When you can compute a likely-correct URL from the attempted URL, surface it.

### 6a. When to compute a suggestion

- A redirect-table match exists (e.g. `/sdks/python` is in the redirect map → suggest the target)
- A close-Levenshtein-distance match to an existing slug (e.g. `/fooundations/start` → suggest `/foundations/start`)
- A URL with one segment off the canonical IA (e.g. `/foundations/introduction/about-iotc` → suggest the post-rename URL)

### 6b. How to present a suggestion

| Element | Treatment |
|---|---|
| Prefix | "Did you mean " |
| Suggested URL | Underlined, monospace, clickable |
| Confidence | Don't show a confidence score — either show or don't |
| Multiple suggestions | Maximum 3, ordered by likelihood |

Place the suggestion **above** the diagnostics strip — it's the most useful piece of information when available.

### 6c. When NOT to suggest

- The attempted URL has > 3 segments different from any known URL — too noisy
- The attempted URL is obviously malformed (e.g. raw HTML, query strings only, no path)
- The redirect target itself doesn't exist

---

## 7. Technical implementation

### 7a. HTTP status code

The 404 page **must** return HTTP status `404 Not Found`. Not 200, not 301, not 302.

| Platform | How to ensure 404 |
|---|---|
| Static-site host (GitHub Pages, Netlify, Vercel) | Provide a `404.html` at the site root; the platform serves it with status 404 automatically |
| Docusaurus | Create `src/pages/404.tsx` (or `404.md`) — Docusaurus uses this as the 404 template and the static host serves it with 404 status |
| Server-rendered | The framework's notFound handler must set `res.statusCode = 404` |

**Anti-pattern: soft-404.** Soft-404 is when a missing-page URL returns HTTP 200 with a "not found" body. Google penalises soft-404s in indexing; they pollute analytics; they break crawlers. Always real 404.

### 7b. Robots meta

The 404 page itself should have `<meta name="robots" content="noindex">` — search engines should not index the 404 page, only let it signal that the requested URL is gone.

### 7c. Canonical URL

Do **not** include a `<link rel="canonical">` pointing to the home page or a real page. The 404 has no canonical equivalent — leave it absent (or point to the same 404 URL).

### 7d. Sitemap

The 404 page must not appear in `sitemap.xml`.

### 7e. Analytics

Send a custom event when the 404 fires (e.g. `event: 404_view, attempted_url: <url>, referrer: <referrer>`). This is how you detect link rot and prioritise fixes.

### 7f. Search index

Exclude the 404 page from the docs search index (Algolia, MeiliSearch, etc.). Visitors should not find the 404 page itself via search.

---

## 8. Accessibility

| Concern | Requirement |
|---|---|
| Heading hierarchy | The 404 page has exactly one `<h1>`; recovery sections are `<h2>` |
| Status announcement | The status text ("HTTP 404 — this page doesn't exist") is in an element with `role="status"` or `aria-live="polite"`, announced once to screen-reader users on page load |
| Colour contrast | All text meets WCAG 2.1 AA (4.5:1 for body, 3:1 for large text) — verify the muted "404" numeral, which is often the contrast violation |
| Don't use colour alone | The 404 numeral is a high-information element; its meaning must also be carried by the H1 text |
| Keyboard navigation | The search input is reachable with Tab from the navbar; curated-jump links are reachable next; the "report" link is reachable last |
| Focus indicators | All interactive elements have visible focus rings |
| Skip-link | The site-wide skip-to-content link should land on the H1, not the search box (search is a secondary navigation, not the main content) |

---

## 9. Anti-patterns (always avoid)

| Anti-pattern | Why it's bad |
|---|---|
| **Auto-redirect to home** | Soft-404; loses visitor agency; breaks browser back button |
| **Countdown timer** ("redirecting in 5 seconds…") | Hostile to slow readers, screen-reader users, and crawlers |
| **No search box** | Removes the single most useful recovery tool |
| **No clear "what happened"** | Visitor blames themselves; doesn't return |
| **Page-not-found page that doesn't actually return 404** | Pollutes analytics, breaks crawlers, Google penalises |
| **Different chrome from rest of site** | Visitor doesn't know if they're still on the right site |
| **404 page that's behind auth or rate-limited** | A visitor following a stale link from a logged-out state hits a login wall instead of a clear 404 |
| **404 page in a 404 page** | The 404 page itself loads broken assets (logo, CSS, fonts) — fix by making the 404 page asset-minimal |
| **Marketing copy** ("While you're here, try our newsletter!") | Off-tone for an error state |
| **Cute mascot** | Reads as unprofessional in technical contexts |
| **Wall of links** | More than 6 recovery jumps becomes decision-paralysing |
| **Required-field forms** ("Tell us your name and email to report this") | Friction kills reporting |
| **Search that auto-submits with the URL slug** | The slug rarely matches a useful search query; let the visitor type |
| **404 that doesn't work without JavaScript** | Curlers and accessibility-restricted browsers should see useful HTML |

---

## 10. Worked example: an IOTC-docs 404

A concrete instantiation of this styleguide for the Zebra IOTC docs.
This is a layout sketch, not a final design.

```
┌────────────────────────────────────────────────────────────────┐
│ [navbar: Zebra logo · Documentation · API Reference · Dev      │
│  Portal · GitHub · 🔍]                                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│      4 0 4                                                     │
│                                                                │
│      This page doesn't exist                                   │
│      The URL you requested isn't part of this documentation.   │
│                                                                │
│      You tried:  /sdks/python                                  │
│      HTTP 404 · noindex                                        │
│                                                                │
│      ─────────────────────────────────────────────             │
│                                                                │
│      Did you mean:                                             │
│        ▸ /foundations/mqtt-primer                              │
│                                                                │
│      A few things that may have happened:                      │
│        • The page was retired (we recently removed the SDK     │
│          tutorials; see the MQTT primer for application code)  │
│        • You mistyped part of the URL                          │
│        • A link from another site is out of date               │
│                                                                │
│      ┌──────────────────────────────────────┐                  │
│      │ 🔍 Search the documentation          │                  │
│      └──────────────────────────────────────┘                  │
│                                                                │
│      Or jump to one of these:                                  │
│        ▸ Start here  (/foundations/start)                      │
│        ▸ Quick Start tutorial  (/quick-start/overview)         │
│        ▸ MQTT API Reference  (/reference/api-overview)         │
│        ▸ Something not working?  (/diagnose/symptoms)          │
│                                                                │
│      Think this URL should resolve?                            │
│      [Report broken link →]                                    │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│ [footer: Documentation · Zebra Resources · Help · Engage]      │
└────────────────────────────────────────────────────────────────┘
```

The "did you mean" line only appears when a suggestion can be
computed (in this case, `/sdks/python` was a deleted page whose
replacement is `/foundations/mqtt-primer` per the redirect-removal
audit).

---

## 11. Per-page checklist when designing a 404

Use this before merging a 404 page implementation.

### Information architecture
- [ ] Status acknowledgement (`404` + plain-English H1) is the visual focal point
- [ ] Diagnostics strip shows the attempted URL
- [ ] "What likely happened" section names 3–4 specific causes
- [ ] Search input is present, visually prominent, and autofocused
- [ ] 4–6 curated recovery jumps with descriptive labels (not just URLs)
- [ ] Optional "did you mean" suggestion above the diagnostics strip when computable
- [ ] Optional "report broken link" line with low-friction action (≤ 2 clicks)
- [ ] Standard site navbar and footer are byte-identical to rest of site

### Technical
- [ ] Page returns HTTP status `404 Not Found`
- [ ] `<meta name="robots" content="noindex">` is present
- [ ] Page is not in `sitemap.xml`
- [ ] Page is excluded from the docs search index
- [ ] Custom analytics event fires on render, with attempted URL and referrer
- [ ] Page renders correctly without JavaScript
- [ ] Page renders correctly without third-party assets (fonts, search widget) loading

### Accessibility
- [ ] Single `<h1>`; recovery sections use `<h2>`
- [ ] Status text uses `role="status"` or `aria-live="polite"`
- [ ] Colour contrast meets WCAG 2.1 AA
- [ ] Keyboard tab order: search → curated jumps → report link
- [ ] All interactive elements have visible focus indicators
- [ ] Skip-link lands on the H1, not the search box

### Copy
- [ ] No "Oops!", no "Sorry!", no marketing language
- [ ] Plain English throughout
- [ ] Technical disclosures (URL, status code) are visible but muted
- [ ] No required-field forms; reporting is one-click

### Brand
- [ ] Layout, typography, and colour match the docs site
- [ ] No mascots, no illustrations distracting from recovery actions
- [ ] Tone is helpful, not apologetic

---

## 12. Maintenance

This styleguide lives at `/brain/404-PAGE.md`. When the 404 page is
implemented or revised:

1. Apply the §11 checklist
2. Audit the analytics dashboard monthly for top-N 404 URLs
3. For each high-frequency 404, decide:
   - Add a redirect (if the page moved) — see `/brain/URL-NAMING.md` §7
   - Update the "did you mean" suggestion map
   - Reach out to the linker if the URL is from a fixable external source
4. Verify the 404 page still meets WCAG 2.1 AA after any chrome changes
   to the rest of the site

A page's **title, URL, sidebar label, meta description, and 404
behaviour** form a coherent quintet for any URL that has ever existed.
Renaming or deleting a page triggers a re-audit of all five surfaces.
