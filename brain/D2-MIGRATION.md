# Mermaid → D2 migration

## 1. Mermaid diagram inventory (54 total, 41 files)

| ID | File | Heading | Type | Description / intent |
|---|---|---|---|---|
| D01 | `fleet/cloud-integration/aws.md` | Step 5: Verify | `flowchart LR` | Reader → broker → AWS pipeline, verification step |
| D02 | `fleet/cloud-integration/azure.md` | Step 5: Verify | `flowchart LR` | Reader → broker → Azure IoT Hub event flow |
| D03 | `fleet/cloud-integration/custom-broker.md` | Step 6: Verify | `flowchart LR` | Reader → broker → subscriber verification |
| D04 | `fleet/cloud-integration/gcp.md` | Step 5: Verify | `flowchart LR` | Reader → broker → GCP Pub/Sub flow |
| D05 | `fleet/cloud-integration/patterns.md` | Direct integration | `flowchart LR` | Reader → cloud broker directly |
| D06 | `fleet/cloud-integration/patterns.md` | Bridge pattern | `flowchart LR` | Reader → bridge → cloud broker translation pattern |
| D07 | `fleet/cloud-integration/patterns.md` | Gateway pattern | `flowchart LR` | Reader → app gateway → cloud-native ingestion |
| D08 | `fleet/management/drift.md` | Fleet-wide compliance monitoring | `flowchart LR` | Per-reader drift scoring over time |
| D09 | `fleet/management/read-config.md` | Section correspondence | `flowchart TB` | `get_config` response section → API ref sub-tag mapping |
| D10 | `fleet/provisioning/automation.md` | Step 5: CI/CD integration | `flowchart LR` | CI/CD pipeline for staged provisioning |
| D11 | `fleet/provisioning/bulk-123rfid.md` | Verify post-apply | `flowchart LR` | Bulk-provisioning verification path |
| D12 | `fleet/provisioning/soti-connect.md` | Step 5: Orchestrate firmware updates | `flowchart LR` | SOTI firmware update orchestration |
| D13 | `foundations/about-iotc.md` | The four MQTT interfaces | `flowchart TB` | MGMT / CTRL / EVT / DATA interface family |
| D14 | `foundations/actors.md` | (top of page) | `flowchart LR` | Five actors: tag, reader, host, broker, application |
| D15 | `foundations/architecture/end-to-end.md` | The end-to-end flow at a glance | `flowchart LR` | Tag → reader → BT → host → Wi-Fi → broker → app, with timings |
| D16 | `foundations/architecture/handheld-considerations.md` | The host device is the network gateway | `flowchart LR` | Why the host is on the network path |
| D17 | `foundations/architecture/interface-model.md` | The three-part topic template (1) | `flowchart LR` | tenantId / topic / deviceSerialNumber composition |
| D18 | `foundations/architecture/interface-model.md` | The three-part topic template (2) | `flowchart TB` | Topic-template visual decomposition |
| D19 | `foundations/communication-flow.md` | Flow 1: Command/Response | `sequenceDiagram` | App → broker → reader → app, request/response |
| D20 | `foundations/communication-flow.md` | Flow 2: Event Streaming | `flowchart LR` | Reader → broker → multiple subscribers |
| D21 | `foundations/communication-flow.md` | Flow 3: Tag-Data Streaming | `flowchart LR` | High-throughput data1event / data2event fan-out |
| D22 | `foundations/documentation-guide.md` | The eight Parts | `flowchart LR` | Sequential reading path Part 1 → Part 8 |
| D23 | `foundations/documentation-guide.md` | Recommended reading paths by persona | `flowchart LR` | 4 persona reading paths through Parts |
| D24 | `foundations/hardware-tiers.md` | Two tiers, one product line | `flowchart LR` | Direct vs Bridged topology side-by-side |
| D25 | `foundations/mqtt/auth-model.md` | Authentication modes | `sequenceDiagram` | Client CONNECT → broker auth check |
| D26 | `foundations/mqtt/connection-lifecycle.md` | CONNECT and CONNACK | `sequenceDiagram` | TCP → CONNECT → CONNACK lifecycle |
| D27 | `foundations/mqtt/connection-lifecycle.md` | Reconnection behaviour on the handheld | `stateDiagram-v2` | Connected / Disconnected / Reconnecting states |
| D28 | `foundations/mqtt/qos.md` | QoS 0, at most once | `sequenceDiagram` | Fire-and-forget QoS 0 publish |
| D29 | `foundations/mqtt/topic-hierarchy.md` | Per-endpoint topic limits (1) | `flowchart LR` | Topic limit / endpoint architecture |
| D30 | `foundations/mqtt/topic-hierarchy.md` | Per-endpoint topic limits (2) | `flowchart LR` | Same limits, alternative view |
| D31 | `foundations/mqtt-primer.md` | The shift from HTTP | `flowchart LR` | HTTP request/response vs MQTT pub/sub |
| D32 | `foundations/mqtt-primer.md` | The four primitives | `flowchart LR` | publish / subscribe / topic / broker |
| D33 | `infrastructure/endpoints/configure.md` | Rollback if connectivity is lost | `flowchart TD` | Canary → rollback decision tree |
| D34 | `infrastructure/endpoints/multi-endpoint.md` | Single-broker architecture | `flowchart LR` | All 4 interfaces → 1 broker |
| D35 | `infrastructure/endpoints/multi-endpoint.md` | Separate data broker | `flowchart LR` | MGMT/CTRL/MDM on broker A; DATA on broker B |
| D36 | `infrastructure/endpoints/multi-endpoint.md` | MDM-managed endpoint | `flowchart LR` | SOTI as endpoint configurator |
| D37 | `infrastructure/endpoints/view.md` | Interpret the response | `flowchart TB` | `get_endpoints` JSON → broker target mapping |
| D38 | `infrastructure/network/troubleshooting.md` | Diagnostic command sequence | `flowchart TD` | Step-by-step network diagnostic decision tree |
| D39 | `infrastructure/security/rotation.md` | Widen the rollout in waves | `gantt` | Multi-week certificate rotation schedule |
| D40 | `observability/monitoring/connection-quality.md` | MQTT connection stability | `flowchart LR` | `mqttConnEVT` transition tracking timeline |
| D41 | `observability/monitoring/device-health.md` | On-demand `get_status` | `flowchart TB` | get_status response fields breakdown |
| D42 | `observability/monitoring/fleet-dashboard.md` | Key metrics to display (1) | `flowchart TB` | Dashboard panel layout |
| D43 | `observability/monitoring/fleet-dashboard.md` | Key metrics to display (2) | `flowchart LR` | Dashboard data-source pipeline |
| D44 | `reference/troubleshooting/approach.md` | (top of page) | `flowchart TD` | Troubleshooting methodology decision tree |
| D45 | `reference/troubleshooting/battery.md` | (top of page) | `xychart-beta` | Battery-level vs time chart |
| D46 | `reference/troubleshooting/bluetooth.md` | (top of page) | `flowchart TD` | Bluetooth-symptom decision tree |
| D47 | `reference/troubleshooting/connection.md` | (top of page) | `flowchart TD` | MQTT-connect-failure decision tree |
| D48 | `reference/troubleshooting/rfid.md` | (top of page) | `flowchart TD` | RFID-read-failure decision tree |
| D49 | `reference/troubleshooting/tag-data.md` | (top of page) | `flowchart TD` | Tag-data-anomaly decision tree |
| D50 | `rfid/tag-data/architecture.md` | The flow | `flowchart LR` | Tag → singulator → dataEVT pipeline |
| D51 | `rfid/tag-data/architecture.md` | Event generation rate | `flowchart TB` | Singulation rate → event rate funnel |
| D52 | `rfid/tag-data/dual-channels.md` | How channel assignment is configured | `flowchart LR` | data1event / data2event channel split |
| D53 | `rfid/tag-data/interpret.md` | Decode EPC | `flowchart LR` | EPC bytes → GS1 components |
| D54 | `rfid/tag-data/process.md` | Integration with inventory management systems | `flowchart LR` | tag event → enrich → inventory system |

### Diagram-type tally

| Mermaid type | Count | D2 target |
|---|---|---|
| `flowchart LR` | 33 | D2 default with `direction: right` |
| `flowchart TB` | 7 | D2 default (top-down implicit) |
| `flowchart TD` | 7 | D2 default (top-down implicit) |
| `sequenceDiagram` | 4 | D2 `shape: sequence_diagram` |
| `stateDiagram-v2` | 1 | D2 nodes + connections |
| `gantt` | 1 | D2 timeline (manual layout — D2 has no native gantt) |
| `xychart-beta` | 1 | Keep as inline `<img>` ascii chart OR rebuild in D2 (D2 has no native xychart) |

## 2. D2 language summary (the parts we use)

- **Shapes (default rectangle)**: `foo`, `foo: Label`, `foo.shape: cylinder` — full shape list: rectangle, square, page, parallelogram, document, cylinder, queue, package, step, callout, stored_data, person, diamond, oval, circle, hexagon, cloud, c4-person
- **Connections**: `a -> b` forward, `a <- b` backward, `a <-> b` bidirectional, `a -- b` undirected, `a -> b: edge label`
- **Containers**: `parent: { child1; child2 }` or `parent.child1 -> parent.child2`
- **Direction**: `direction: right` (LR equivalent), default is top-down; valid values up/down/right/left
- **Styling**: `node: { style: { fill: "#004C97"; stroke: "#003070"; font-color: white; border-radius: 4 } }`
- **Sequence diagrams**: `shape: sequence_diagram` at file scope, then ordered `actor -> actor: msg` lines
- **Theme config**: `vars: { d2-config: { theme-id: 0; dark-theme-id: 200 } }`

## 3. Theme decision

| Surface | Theme |
|---|---|
| Light mode | **`0` Neutral Default** — clean grey + subtle blue accents, doesn't fight Zebra navy brand |
| Dark mode | **`200` Dark Mauve** — only Dark Mauve and Dark Flagship Terrastruct available; Dark Mauve is the more muted of the two |

Picked by running `d2 themes` against the 0.7.1 CLI. The themes page on d2lang.com publishes preview images but no programmatic ID list — the CLI is the source of truth.

Themes considered and rejected:
- `100 Vanilla Nitro Cola` (remark-d2 default): warm pastels, clashes with the docs' cool navy
- `300 Terminal` / `301 Terminal Grayscale`: forces monospace + caps-lock label transform; too opinionated for engineering reference docs
- `4 Cool Classics`: blue-heavy but very saturated; would compete with the Zebra brand
- `8 Colorblind Clear`: strong distinct hues — useful for status decision trees, but overall too colorful for a content set this size

## 4. Docusaurus integration plan

### Prerequisites

1. **`d2` CLI on every machine that builds the docs** (local dev + GitHub Actions runner). Installed via Homebrew (`brew install d2`) locally; needs an install step in `.github/workflows/deploy.yml` for CI.
2. **`remark-d2` npm package** (the only published Docusaurus-aware D2 plugin, `mech-a/remark-d2`, currently at `^0.2.3`).
3. **Disable the existing Mermaid theme** once all diagrams are converted; until then, both can coexist (one fenced as ` ```mermaid `, the other as ` ```d2 `).

### Step action plan with fail-paths

| # | Action | Expected outcome | Likely failure mode → fix |
|---|---|---|---|
| 1 | Install `d2` CLI locally: `brew install d2` | `d2 --version` prints `0.7.1` | `brew not found` → install Homebrew or use the install script from d2lang.com |
| 2 | Add a `Install d2` step to `.github/workflows/deploy.yml` before `npm run build` | CI `d2 --version` passes | `apt install d2` not available on ubuntu-latest → use the official `curl -fsSL https://d2lang.com/install.sh \| sh -s -- --version v0.7.1` |
| 3 | Install npm dep: `npm install remark-d2` | Package added to `package.json` | none significant |
| 4 | Add a top-level ESM import shim in `docusaurus.config.ts` (remark-d2 is ESM-only; Docusaurus config is loaded synchronously). Pattern from the plugin's README: `const d2 = (await import("remark-d2")).default;` inside an `async` `createConfig` wrapper | Config loads | Synchronous `require` → wrap config in `async`; or use Docusaurus 3's `loadModule` pattern |
| 5 | Wire `remark-d2` into the `docs` preset's `remarkPlugins` array with options: `{ defaultD2Opts: ['-t=0', '--dark-theme=200', '--layout=elk'] }` and `htmlImage: true` | Plugin runs on every `.md` build | `d2: command not found` at build → confirm step 1/2; permission errors → use `--no-sandbox` |
| 6 | Add a `static/d2` ignore rule to `.gitignore` (generated SVGs go there; we don't commit them) | git status clean after build | If we DO want to commit them (for offline / no-d2 builds), skip this step |
| 7 | Run `npm run build` locally; confirm a sample `.d2` fence renders | One SVG per fence ends up at `build/d2/<hash>.svg`, referenced by the rendered markdown | Build hangs → d2 might be waiting on stdin; ensure plugin uses `d2 - -` invocation; CLI argument errors → check the option string format |
| 8 | Convert one diagram (e.g. D14 `actors.md`) as a smoke test before converting the other 53 | Visual matches the Mermaid original within reason | Layout differs → switch `--layout=dagre` (default) vs `--layout=elk` until the result is acceptable |
| 9 | Bulk-convert the other 53 diagrams (Mermaid `flowchart` → D2 nodes/arrows; `sequenceDiagram` → D2 `shape: sequence_diagram`; gantt + xychart → custom D2 representations) | All diagrams render | Per-diagram syntax errors caught by `d2 fmt` step in CI |
| 10 | Drop the Mermaid plugin from `themes`/`markdown.mermaid` in `docusaurus.config.ts` once all conversions land | Build clean, fewer JS chunks shipped | If any stray `mermaid` fences remain, build warns; fix by converting or restoring the theme |
| 11 | Visual audit on every page in `npm run serve` against the prior Mermaid screenshots | All 54 diagrams legible, theme-consistent | Edge labels truncated → wrap labels with `\n` in D2 source; nodes too narrow → set `width:` on the node |

### Build-time cost note

`d2` is a Go binary that processes each `.d2` block out-of-process. For 54 diagrams the incremental build cost is ~5–10 s on a typical CI runner. Acceptable.

### Per-page conversion checklist

For each diagram:
- [ ] Mermaid block opens `` ```mermaid `` and closes `` ``` ``
- [ ] Replace fence with `` ```d2 `` (or `` ```d2 layout=elk `` for nested architectures)
- [ ] Convert syntax (helpers below)
- [ ] Build locally; confirm rendered SVG looks right
- [ ] Check both light and dark themes (Docusaurus theme switcher in navbar)

### Syntax conversion helpers (Mermaid → D2)

| Mermaid | D2 equivalent |
|---|---|
| `flowchart LR\n a-->b` | `direction: right\na -> b` |
| `flowchart TB\n a-->b` | `a -> b` (TB is D2 default) |
| `A[Label]` | `A: Label` |
| `A((Round))` | `A: Round { shape: oval }` |
| `A{Decision}` | `A: Decision { shape: diamond }` |
| `A[(DB)]` | `A: DB { shape: cylinder }` |
| `a -- text --> b` | `a -> b: text` |
| `a -.-> b` (dashed) | `a -> b: { style.stroke-dash: 3 }` |
| `subgraph Foo\n ... end` | `Foo: {\n ...\n}` |
| `sequenceDiagram\n A->>B: x` | `shape: sequence_diagram\na -> b: x` |
| `stateDiagram-v2` | manual nodes + arrows |

## 5. Audit checklist (for each converted D2 diagram)

- **Functional:** does it convey the same relationships as the Mermaid original?
- **Aesthetic:** font matches site (Inter via theme), spacing not cramped, no accidental overlap
- **Brand:** theme-id 0 light + 200 dark; no custom fills that fight the brand
- **A11y:** edge labels are full text not abbreviations; node text large enough to read at 100%
- **Layout:** LR diagrams stay LR (D2 default is TB so explicit `direction: right` required); long edge labels wrap not truncate
- **Performance:** SVGs under 30 KB each (D2's default output is conservatively sized)

## 6. Rollout sequence

1. Land integration (steps 1–7) on its own commit so the change is rollback-able
2. Convert sidebar-surfaced pages first (visitor-facing) — Parts 1–8
3. Convert deep-reference pages second
4. Run the audit pass
5. Drop the Mermaid theme as the final commit
