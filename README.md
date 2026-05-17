# Zebra Handheld RFID — IoT Connector Documentation

> MQTT API documentation for Zebra RFD40 / RFD90 handheld RFID reader sleds. Built with [Docusaurus 3](https://docusaurus.io/).

This documentation follows the **[Diátaxis framework](https://diataxis.fr/)** (Tutorials · How-to guides · Reference · Explanation) per the upstream Information Architecture v1.1.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm start

# Production build
npm run build

# Serve production build locally
npm run serve

# Type-check
npm run typecheck
```

**Requirements:** Node.js 20 or later.

---

## Project Structure

```
zebra-handheld-rfid-iotc/
├── docs/                          # 96 doc pages across 7 Parts (IA v1.1)
│   ├── foundations/               # Part I — what it is, MQTT, architecture
│   ├── getting-started/           # Part II — prerequisites, Quick Start (6-step tutorial)
│   ├── infrastructure/            # Part III — network, security, endpoints
│   ├── rfid/                      # Part IV — operating modes, tag data
│   ├── observability/             # Part V — events, monitoring
│   ├── fleet/                     # Part VI — provisioning, bulk config, migration, cloud integration
│   ├── reference/                 # Part VII — API reference, error codes, troubleshooting, FAQ, appendices
│   └── sdks/                      # Language tutorials (Python, Node.js, C#)
├── src/
│   ├── css/                       # SCSS — palette + ConfigCat-derived layout modules
│   │   ├── custom.scss            # Brand palette + module imports
│   │   ├── sidebar.scss           # Sidebar layout + 20 mask-based category icons
│   │   ├── toc.scss               # Table-of-contents active indicator
│   │   ├── cards.scss             # SDK / integration card patterns
│   │   ├── api.scss               # API Reference page styling
│   │   ├── proxy.scss             # Method-tab styling
│   │   └── copy-page-button.module.scss
│   ├── theme/                     # Swizzled Docusaurus theme components
│   │   ├── CodeBlock/             # Wraps default CodeBlock with showLineNumbers
│   │   └── Heading/               # Hash-link headings + CopyPageButton on H1
│   ├── components/
│   │   ├── CopyPageButton.tsx     # Copy page as Markdown, view, open in ChatGPT/Claude
│   │   ├── If.tsx                 # Conditional rendering utility
│   │   ├── LazyVideo.tsx          # Lazy-loaded video component
│   │   └── Steps/                 # Step-by-step guide components
│   ├── client-modules/
│   │   └── img-zoom/              # Click-to-zoom for documentation screenshots
│   └── pages/
│       ├── index.tsx              # Landing page
│       └── index.module.css
├── static/
│   └── img/                       # Logos and favicons
├── docusaurus.config.ts           # Site configuration
├── sidebars.ts                    # Three sidebars: docs / apiReference / sdks
├── package.json
└── tsconfig.json
```

---

## Design system

### Custom Design

- **Layout & typography:** Docusaurus 3 classic preset with system font stack.
- **Sidebar:** SCSS-driven, mask-based SVG category icons (20 named icon classes — `basics`, `guides`, `tools`, `status`, `api`, `sdk`, `analytics`, `team`, `integrations`, `faq`, `legacy`, `news`, `project-management`, `devops`, `overview`, etc.). Active link indicator: 3 px primary-color left border. Nested-level offsets at -2px / -14px / -26px / -38px.
- **Table of Contents:** 2 px active indicator with nested-level offsets.
- **Code blocks:** Line numbers enabled by default via swizzled `CodeBlock`.
- **Headings:** Hash anchor links on hover; H1 wrapped with CopyPageButton (Copy as Markdown / View / Open in ChatGPT / Open in Claude).
- **Footer:** `style: 'dark'` with four columns (Documentation / Zebra Resources / Help & Resources / Engage).
- **Image zoom:** Click any in-content image to zoom in.

### Zebra Flavors

- **Primary color (light):** `#004C97` Zebra navy
- **Primary color (dark):** `#6CB4EE` light blue
- **Logos:** Zebra Technologies wordmark (SVG, light/dark variants)
- **Content-type badges:** `badge-explanation` / `badge-tutorial` / `badge-howto` / `badge-reference` — Zebra-flavoured pastel/dark palettes

---

## Sidebars (IA v1.1)

Three named sidebars in `sidebars.ts`:

| Sidebar | Coverage |
|---|---|
| `docs` | The seven-Part product documentation: Foundations → Getting Started → Infrastructure → RFID Operations → Observability → Fleet → Reference & Troubleshooting |
| `apiReference` | MQTT API Reference grouped per the source `tag_config.json` taxonomy: Device Status, Network Configuration, MQTT Endpoint Configuration, Certificate Management, Device Configuration, System Operations, Event Configuration (MGMT) · Operating Mode, Tag Filtering, Inventory Control (CTRL) · Data Interface · MDM Interface · Events |
| `sdks` | Language tutorials (Python, Node.js, C#) and recommended libraries |

Sidebar category icons are applied via `className` strings (e.g., `'icon basics-icon'`); the underlying mask-based SVG masks are defined in `src/css/sidebar.scss`.

---

## Content migration status

- **Documentation tree:** 115 files across the seven-Part structure plus SDKs and API Reference (skeleton complete).
- **Full prose:** Canonical pages (§1.1, §2.4, §3.2, §5.1–§5.7, §9.1, §11.1, §17.2 errors table) carry the full Phase 2 v2 prose verbatim. Other pages carry structural skeletons with audience, badge, and summary; their full prose lives in the upstream `zebra-handheld-rfid-iotc-phase-2-drafts-v2.md` and migrates page-by-page during Phase 5 (Publish).
- **Authoritative source:** `api-schema-reference/` corpus (operation_descriptions, tag_descriptions, schemas, error_codes.json, tag_config.json) is the source of truth for all API content.

---

## Editing content

| What to change | Where |
|---|---|
| Documentation page text | `docs/<part>/<chapter>/<page>.md` |
| Sidebar ordering / grouping | `sidebars.ts` |
| Site title / navbar / footer | `docusaurus.config.ts` |
| Theme color palette | `src/css/custom.scss` (`:root` and `[data-theme='dark']` blocks) |
| Sidebar icons (add a new one) | `src/css/sidebar.scss` — add a `mask-image` rule keyed by class name, then reference it in `sidebars.ts` via `className: 'icon my-new-icon'` |
| Homepage | `src/pages/index.tsx` and `src/pages/index.module.css` |
| Static logos / favicons | `static/img/` |

After editing `docusaurus.config.ts` or `sidebars.ts`, restart the dev server.

---

## Deployment

This project is intended to deploy to GitHub Pages at `https://al1913-zebra.github.io/zebra-handheld-rfid-iotc/`. To deploy:

```bash
# Build
npm run build

# Deploy via GitHub Actions (recommended) — see .github/workflows/deploy.yml
# OR deploy manually via the docusaurus deploy script:
GIT_USER=<github-username> npm run deploy
```

The `baseUrl` in `docusaurus.config.ts` is `/zebra-handheld-rfid-iotc/`. If hosting elsewhere, update both `url` and `baseUrl`.

---

## License

Documentation content © Zebra Technologies Corporation and/or its affiliates. The Docusaurus build harness is © Meta Platforms, Inc. and contributors. The design system pattern derives from the Abdul Latheef Mohamed.

---

## Acknowledgements

- **[Docusaurus](https://docusaurus.io/)** — the site generator
- **[Diátaxis](https://diataxis.fr/)** — content-type framework
