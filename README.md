# Orray

> A visual-first Internal Developer Platform — exploring spatial interfaces for complex system management.

**This is a Proof of Concept.** No backend, no real data, no integrations. Every node, edge, metric, and trace is hardcoded. The sole purpose is to test whether a system-as-a-map interface works — and to serve as a starting point for design reasoning.

## Philosophy

### Spatial reasoning over sequential navigation

Humans are wired to reason spatially — about proximity, flow, direction, containment. Traditional developer platforms present systems as lists, tables, and trees, forcing users to reconstruct spatial relationships in their heads.

Orray places the entire system on a canvas. Services, databases, queues, and caches become objects with physical positions. Connections become visible lines with direction. The topology isn't described; it's _drawn_.

### Layers as a third dimension

Different people need different views of the same system. Rather than three dashboards, Orray introduces **layers** — stacked views of the same spatial canvas. The topology stays fixed, but the information changes entirely:

| Layer | Persona | What you see |
|-------|---------|-------------|
| **Live** | Software Engineer | Request paths, latency, error propagation, span IDs |
| **Building** | Product Owner / PM | Draft components, backlog items, team ownership, planned connections |
| **Platform** | DevOps / SRE | CPU, memory, pod counts, health status, versions, uptime |

### Focus through reduction

Noise is the enemy. The interface actively helps you _not_ see things you don't need. Layer switching removes entire categories of information. Trace dimming fades irrelevant nodes. Semantic zoom lets you enter a service and break it down.

_"Simplicity is the ultimate sophistication."_

---

## Ideas

| ID | Name | TL;DR | Details |
|----|------|-------|---------|
| I1 | Timeline + Relive | Draggable timeline panel; click event to enter snapshot; relive mode replays traces step-by-step | [ideas.md#i1](docs/ideas.md#i1---version-control--timeline--relive-event) |
| I2 | Repo Introspection | LLM inspects repo structure, maps features and connections | [ideas.md#i2](docs/ideas.md#i2---repo-introspection) |
| I3 | RBAC | Meta-canvas where platform functions become nodes; configure permissions spatially | [ideas.md#i3](docs/ideas.md#i3---rbac) |
| I4 | Semantic Zoom | Zoom into a node to reveal internals (features, kafka topics) | [ideas.md#i4](docs/ideas.md#i4---semantic-zoom) |
| I5 | DevOps View | Full cluster visibility in Platform layer (namespaces, pods, kubelet) | [ideas.md#i5](docs/ideas.md#i5---devops-view) |
| I6 | Universal Search | `cmd+k` to search anything | [ideas.md#i6](docs/ideas.md#i6---universal-search) |
| I7 | Multi-collaboration | Real-time multi-user editing + chat | [ideas.md#i7](docs/ideas.md#i7---multi-collaboration) |
| I8 | Env Stacking | Z-axis stacking of environments; diff highlighting; quick diff overlay | [ideas.md#i8](docs/ideas.md#i8---env-stacking-diff-between-envs) |
| I9 | Kargo Plugin | Autopromote / schedule service promotions across envs | [ideas.md#i9](docs/ideas.md#i9---kargo-plugin) |
| I10 | Blast Radius | "What if this dies?" domino-effect simulation across the graph | [ideas.md#i10](docs/ideas.md#i10---blast-radius-simulation) |
| I11 | Cost Flow Layer | Edge thickness = dollar cost; radial fill on nodes for monthly spend | [ideas.md#i11](docs/ideas.md#i11---cost-flow-layer) |
| I12 | Ambient Sonification | Generative audio mapped to system health; hear degradation before seeing it | [ideas.md#i12](docs/ideas.md#i12---ambient-sonification) |
| I13 | Canvas Annotations | Freeform drawing layer (pen, arrows, stickies) persisted per-layer | [ideas.md#i13](docs/ideas.md#i13---canvas-annotations--sketch-layer) |
| I14 | Spatial Bookmarks | Save camera + layer + focus + timeline as a named viewpoint; deep-linkable | [ideas.md#i14](docs/ideas.md#i14---spatial-bookmarks-viewpoints) |
| I15 | AI Narrator | LLM narrates system events in natural language; click to navigate | [ideas.md#i15](docs/ideas.md#i15---ai-narrator-system-storytelling) |
| I16 | Ownership Territories | Convex hulls colored by team; visualize boundaries and orphaned services | [ideas.md#i16](docs/ideas.md#i16---ownership-territories) |
| I17 | Runbook Actions | Right-click node for actions (restart, scale, deploy); canvas as control plane | [ideas.md#i17](docs/ideas.md#i17---runbook-actions-canvas-as-control-plane) |
| I18 | Project List | Zoom-out past threshold to see all projects as live-thumbnail tiles | [ideas.md#i18](docs/ideas.md#i18---project-list-canvas-of-canvases) |

## Design Choices

- **SRD** as representation of a resource node. Deployments are too fine-grained.
- Divide SRD resources by **project / environment**.
- Inputs:
  - `db` — link to an already deployed GreptimeDB, self-deployed by us if not provided
  - `collector` — optional, requires config from the user to set a new destination for the telemetries
  - `org link` — for LLM inspection (?)

## Open Questions

- **Layout**: auto, with manual intervention in building layer.
- **Plugins**: No. Conflicts with business model. Simplifies design. Does not mean building an unscalable monolith.

## Research

| Topic | File |
|-------|------|
| Performance: ReactFlow ceiling & alternatives | [docs/performance.md](docs/performance.md) |
| Market: K8s adoption, IDP landscape, pain points | [docs/market-research.md](docs/market-research.md) |

---

## What this PoC demonstrates

- **Interactive canvas** — React Flow with custom nodes (service, database, queue, gateway, cache), animated edges, ghost nodes for drafts
- **Three persona layers** — Live (cyan), Building (amber), Platform (teal) switchable via header or `1`/`2`/`3` keys
- **Focus mode** — Click a node to scatter neighbors to viewport edges, isolating the focus target
- **Timeline panel** — Draggable, proportional bar chart with event snapshots and natural-language search
- **Node detail panel** — Slide-in inspector with layer-specific metadata
- **Mock topology** — E-commerce system: API Gateway, 5 services, 3 databases, Redis, Kafka, 2 draft nodes

## Structure

```
src/
├── data/           # Mock data (types.ts, system.ts) — decoupled from UI
├── stores/         # Zustand store — layer state, selection, computed nodes/edges
├── components/
│   ├── canvas/     # SystemCanvas, CanvasHeader, SystemNode, DataFlowEdge
│   └── panels/     # NodeDetailPanel, BuildingToolbar, TimelinePanel
├── hooks/          # Keyboard shortcuts
└── routes/         # TanStack Router
```

## Stack

React 19 · Vite 7 · React Flow · Zustand · Tailwind 4 · shadcn/ui · Motion · Bun

## Running

```bash
bun install && bun dev
```
