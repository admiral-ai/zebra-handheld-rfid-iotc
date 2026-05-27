# Zebra IoT Connector for Handheld RFID Reader | Documentation

> MQTT API documentation for the Zebra RFD40 and RFD90 handheld RFID reader sled family. Built with [Docusaurus 3](https://docusaurus.io/) and organised on the [Diátaxis framework](https://diataxis.fr/) (Tutorials · How-to guides · Reference · Explanation).

**Live site:** [https://al1913-zebra.github.io/zebra-handheld-rfid-iotc/](https://al1913-zebra.github.io/zebra-handheld-rfid-iotc/)

---

## Contents

- [What this documents](#what-this-documents)
- [Documentation map](#documentation-map)
- [Quick start](#quick-start)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Editing content](#editing-content)
- [Design system](#design-system)
- [Sidebar and navigation](#sidebar-and-navigation)
- [Deployment](#deployment)
- [Related resources](#related-resources)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License and acknowledgements](#license-and-acknowledgements)

---

## What this documents

The Zebra IoT Connector (IOTC) for Handheld RFID is the in-firmware MQTT control and data plane on Zebra's handheld RFID reader sleds: RFD40 Standard, RFD40 Premium, RFD40 Premium Plus, RFD90, and RFD9030. It lets applications configure readers, run RFID inventory, stream tag reads, and operate fleets over a single persistent MQTT 3.1.1 connection. This repository is the source for the conceptual documentation site that explains how the system works and how to integrate with it. The companion **[MQTT API Reference site](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/)** is the authoritative field-level reference for all 27 commands and events; this site links to it from every operation row.

**Audiences served**

- **New integrators** writing their first MQTT publisher or subscriber against a reader sled.
- **Solution builders** architecting multi-reader deployments and choosing endpoints, profiles, and security postures.
- **API consumers** writing production integration code who need exact payload shapes and error codes.
- **Fleet operators** rolling out and maintaining hundreds-to-thousands of sleds via 123RFID Desktop, SOTI Connect, or 42Gears SureMDM.

---

## Documentation map

The site is organised into **eight Parts** with **128 pages**. Parts 1 through 3 are read top-down; Parts 4 through 8 are reference surfaces consulted as needed.

| Part | Title | What it covers | Pages |
|---|---|---|---|
| 1 | Get oriented | Entry-point reading, MQTT primer for HTTP/REST integrators, conceptual-vs-API-reference pairing | 3 |
| 2 | Foundations | What IOTC is, hardware-tier fork (Monolithic vs Bipartite), roles, command/response/event flows, the OpenAPI Illusion | 5 |
| 3 | Quick start | Tutorial: 7 phases from network preparation to live `dataEVT`, with 15 inline screenshots of 123RFID Desktop | 8 |
| 4 | Manage your reader | Device state, network, MQTT endpoints, TLS and certificates, configuration document, system operations | 6 |
| 5 | Read tags | Operating-mode profiles, start/stop/trigger, pre-filter vs post-filter | 3 |
| 6 | Observe and monitor | Event configuration, heartbeat, alerts, connection events, tag data event | 5 |
| 7 | Scale to a fleet | Provisioning paths (123RFID Desktop, SOTI, SureMDM), bulk config and drift, retention and retry under network drops | 3 |
| 8 | Diagnose and reference | Symptom-first index, 24 failure modes, 9 recovery playbooks, 15 misconceptions, glossary, MQTT API directory, error codes | many |

Per-Part details are visible in [`sidebars.ts`](sidebars.ts).

---

## Quick start

```bash
# Install dependencies (requires Node 20+)
npm install

# Start the dev server at http://localhost:3000
npm start

# Production build (output in ./build)
npm run build

# Serve the production build locally
npm run serve

# Type-check (no emit)
npm run typecheck

# Clear the Docusaurus cache (use when a stale build misbehaves)
npm run clear
```

After editing `docusaurus.config.ts` or `sidebars.ts`, restart the dev server. Hot-reload covers `docs/`, `src/`, and `static/` changes.

---

## Tech stack

| Layer | Choice |
|---|---|
| Site generator | [Docusaurus 3.10](https://docusaurus.io/) (classic preset) |
| Performance | `@docusaurus/faster` Rust-based bundler |
| Diagrams | `@docusaurus/theme-mermaid` |
| Styling | SCSS via `docusaurus-plugin-sass` |
| Redirects | `@docusaurus/plugin-client-redirects` |
| Language | TypeScript (`tsconfig.json`) |
| React | 19.x |
| Runtime | Node.js 20 or later |
| CI / hosting | GitHub Actions + GitHub Pages (publishes from `gh-pages` branch) |

---

## Project structure

```
zebra-handheld-rfid-iotc/
├── docs/                          # 128 doc pages across 8 Parts (Diátaxis)
│   ├── foundations/               # Parts 1 and 2 — orient, MQTT primer, architecture, OpenAPI Illusion
│   ├── getting-started/           # Part 3 — prerequisites and 8-page Quick Start tutorial
│   ├── infrastructure/            # Part 4 — device state, network, endpoints, security, config, system ops
│   ├── rfid/                      # Part 5 — operating modes, start/stop, filtering, tag data
│   ├── observability/             # Part 6 — events, heartbeats, alerts, mqttConnEVT, monitoring
│   ├── fleet/                     # Part 7 — provisioning, bulk config, reliability, cloud integration, migration
│   ├── reference/                 # Part 8 — API overview, error codes, symptom index, failure modes,
│   │                              #           recovery playbooks, misconceptions, FAQs, appendices
│   └── sdks/                      # Language tutorials (Python, Node.js, C#)
├── src/
│   ├── css/                       # SCSS palette and layout modules
│   │   ├── custom.scss            #   Brand palette + module imports
│   │   ├── sidebar.scss           #   Sidebar layout + mask-based SVG category icons
│   │   ├── toc.scss               #   Table-of-contents active indicator
│   │   ├── cards.scss             #   SDK and integration card patterns
│   │   ├── api.scss               #   API Reference page styling
│   │   ├── proxy.scss             #   Method-tab styling
│   │   └── copy-page-button.module.scss
│   ├── theme/                     # Swizzled Docusaurus components
│   │   ├── CodeBlock/             #   Default CodeBlock with showLineNumbers
│   │   └── Heading/               #   Hash-link headings + CopyPageButton on H1
│   ├── components/
│   │   ├── CopyPageButton.tsx     #   Copy page as Markdown; open in ChatGPT or Claude
│   │   ├── If.tsx                 #   Conditional-rendering utility
│   │   ├── LazyVideo.tsx          #   Lazy-loaded video component
│   │   └── Steps/                 #   Step-by-step guide components
│   ├── client-modules/
│   │   └── img-zoom/              #   Click-to-zoom for documentation screenshots
│   └── pages/
│       ├── index.tsx              # Landing page (hero, six feature cards, four persona cards)
│       └── index.module.css
├── static/
│   └── img/                       # Logos, favicon, and Quick-Start screenshots
│       ├── zebra-logo-black-horizontal.svg
│       ├── zebra-logo-white-horizontal.svg
│       ├── zebra-logo-black-stacked.{svg,png}
│       ├── zebra-logo-white-stacked.svg
│       └── quick-start/           # 15 Phase-2 screenshots
├── .github/
│   └── workflows/deploy.yml       # CI: build + publish to gh-pages on push to main
├── docusaurus.config.ts           # Site config (URL, navbar, footer, metadata, plugins)
├── sidebars.ts                    # Eight-Part docs sidebar
├── package.json
└── tsconfig.json
```

---

## Editing content

| What to change | Where |
|---|---|
| A documentation page | `docs/<part>/<chapter>/<page>.md` |
| The 8-Part sidebar ordering or grouping | [`sidebars.ts`](sidebars.ts) |
| Site title, navbar, footer, metadata | [`docusaurus.config.ts`](docusaurus.config.ts) |
| Brand colour palette | `src/css/custom.scss` (`:root` and `[data-theme='dark']` blocks) |
| Sidebar category icons | `src/css/sidebar.scss` (add a `mask-image` rule, then reference it from `sidebars.ts` via `className`) |
| Landing page (hero, cards, personas) | `src/pages/index.tsx` and `src/pages/index.module.css` |
| Logos and favicon | `static/img/` |
| GitHub Pages workflow | `.github/workflows/deploy.yml` |

Markdown files use Docusaurus front matter (`id`, `title`, `sidebar_label`). Many pages also use **explicit anchor IDs** with the `{#anchor-name}` syntax on headings so that cross-page links remain stable when the heading text is edited.

---

## Design system

### Layout and typography

- Docusaurus 3 classic preset with a system font stack.
- Sidebar: SCSS-driven, mask-based SVG category icons with named classes (`basics`, `guides`, `tools`, `status`, `api`, `sdk`, `analytics`, `integrations`, and so on). Active-link indicator: 3 px primary-colour left border. Nested-level offsets at -2 px / -14 px / -26 px / -38 px.
- Table of Contents: 2 px active indicator with nested-level offsets.
- Code blocks: line numbers enabled by default via the swizzled `CodeBlock`.
- Headings: hash anchor links on hover; H1 wrapped with a `CopyPageButton` that copies the page as Markdown and opens it in ChatGPT or Claude.
- Footer: `style: 'dark'` with four columns (Documentation, Zebra Resources, Help and Resources, Engage).
- Image zoom: click any in-content image to zoom in.

### Brand

- **Primary colour (light mode):** `#004C97` Zebra navy
- **Primary colour (dark mode):** `#6CB4EE` light blue
- **Logos:** Zebra Technologies wordmark in horizontal and stacked variants (light and dark mode SVGs)
- **Favicon:** `zebra-logo-black-stacked.png`
- **Content-type badges:** `badge-explanation`, `badge-tutorial`, `badge-howto`, `badge-reference` — Zebra-flavoured pastel and dark palettes that match the Diátaxis quadrants

---

## Sidebar and navigation

The site exposes one primary docs sidebar (defined in [`sidebars.ts`](sidebars.ts)) and a top-navbar link to the external [MQTT API Reference site](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/). Reference-only pages such as the MQTT API directory and the error-code tables are reached from the landing page and from in-content cross-links rather than from the sidebar.

The eight Parts use **outcome-led labels** rather than topic-led labels. Each chapter's `sidebar_label` predicts what the reader will know after reading. The Quick Start tutorial uses sequential `step-N` page IDs that match the deployment-guide phases.

---

## Deployment

The project deploys to GitHub Pages at `https://al1913-zebra.github.io/zebra-handheld-rfid-iotc/`. Two paths are supported:

**Automatic (recommended).** Push to `main`. The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs `npm install`, `npm run build`, and publishes `./build` to the `gh-pages` branch via [`peaceiris/actions-gh-pages@v4`](https://github.com/peaceiris/actions-gh-pages). Concurrency is grouped on `pages`, so successive pushes cancel any in-flight run.

**Manual.**

```bash
npm run build                                      # builds into ./build
GIT_USER=<github-username> npm run deploy          # pushes ./build to the gh-pages branch
```

If hosting somewhere other than the default URL, update both `url` and `baseUrl` in `docusaurus.config.ts`.

---

## Related resources

| Resource | Purpose |
|---|---|
| [MQTT API Reference site](https://aa5123.github.io/RFID-40-90-handled-reader-api-reference-documentatiion/) | Authoritative per-operation reference (payloads, schemas, error codes). This site links to each operation by anchor. |
| [`api-schema-reference/`](../../../x/api-schema-reference/) (external) | Source of truth for the API reference. Contains `tag_config.json`, `error_codes.json`, `operation_descriptions/`, `tag_descriptions/`, `schemas/`. |
| [`knowledge/toc/`](../../../x/knowledge/toc/) (external) | Working notes corpus that informed the conceptual chapters: the IOTC content draft, the canonical deployment guide, the 28 `mqtt-api-reference/*.md` files, RFID textbooks and academic papers, MQTT references, hardware specifications, and the chapter-knowledge mapping. |
| [Docusaurus documentation](https://docusaurus.io/docs) | Framework reference. |
| [Diátaxis](https://diataxis.fr/) | Documentation-architecture framework this site follows. |

---

## Contributing

1. **Fork and branch.** Create a topic branch off `main` named for the change (for example, `fix/symptom-index-anchors` or `docs/improve-tls-chapter`).
2. **Edit in place.** Page changes belong in `docs/<part>/<chapter>/<page>.md`; styling in `src/css/`; site config in `docusaurus.config.ts`.
3. **Verify locally.** Run `npm start` and confirm the page renders, the sidebar updates, and all internal links resolve. Run `npm run build` to catch broken-link warnings that don't appear in dev mode.
4. **Match the established voice.** Conceptual chapters are Explanation-quadrant: discursive, third-person, evidence-anchored. The Quick Start is Tutorial-quadrant: narrative, second-person, confidence-closing. Reference pages are tabular and atomic. Use colons (not em-dashes) between identifier and title (`FM-NET-01: Title`, `RP-04: Title`).
5. **Anchors are stable contracts.** When editing a page that other pages link to, preserve the explicit `{#anchor}` IDs on its headings. Section text can change; the anchor cannot.
6. **Open a PR.** Describe the change, list any cross-page implications, and link any related issue.

For substantial content rewrites or new chapters, raise an issue first so the change can be scoped against the eight-Part IA.

---

## Contributors

| Name | Email |
|---|---|
| Abdul Latheef Mohamed | abdullatheef.mohamed@zebra.com |
| Immanuel Aloysius | immanuel.aloysius@zebra.com |

---

## License and acknowledgements

Documentation content © Zebra Technologies Corporation and/or its affiliates. The Docusaurus build harness is © Meta Platforms, Inc. and contributors.

**Built with**

- [Docusaurus](https://docusaurus.io/) — site generator
- [Diátaxis](https://diataxis.fr/) — content-type framework
- [Mermaid](https://mermaid.js.org/) — diagrams
- [Prism](https://prismjs.com/) — code-block syntax highlighting
