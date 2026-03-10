import { motion, useAnimate } from "motion/react";
import { useCallback, useEffect, useState } from "react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const GRAPH_NODES = [
  { id: "api", label: "API Gateway", x: 450, y: 60 },
  { id: "users", label: "User Service", x: 200, y: 200 },
  { id: "products", label: "Product Catalog", x: 700, y: 200 },
  { id: "orders", label: "Order Service", x: 450, y: 340 },
  { id: "payments", label: "Payment Service", x: 200, y: 480 },
  { id: "inventory", label: "Inventory", x: 700, y: 480 },
  { id: "notifications", label: "Notifications", x: 450, y: 620 },
] as const;

const GRAPH_EDGES = [
  { from: "api", to: "users" },
  { from: "api", to: "products" },
  { from: "api", to: "orders" },
  { from: "orders", to: "payments" },
  { from: "orders", to: "inventory" },
  { from: "inventory", to: "notifications" },
  { from: "payments", to: "notifications" },
] as const;

const SELECTED_IDS = ["api", "users", "orders", "payments"];

const ENV_VERSIONS: Record<
  string,
  Array<{ env: string; version: string; status: string; hue: number }>
> = {
  api: [
    { env: "prod", version: "v2.3.1", status: "stable", hue: 155 },
    { env: "staging", version: "v2.4.0-rc1", status: "testing", hue: 80 },
    { env: "dev", version: "v2.5.0-alpha", status: "building", hue: 200 },
  ],
  users: [
    { env: "prod", version: "v1.8.2", status: "stable", hue: 155 },
    { env: "staging", version: "v1.8.2", status: "in-sync", hue: 80 },
    { env: "dev", version: "v1.9.0-beta", status: "new features", hue: 200 },
  ],
  orders: [
    { env: "prod", version: "v3.1.0", status: "stable", hue: 155 },
    { env: "staging", version: "v3.2.0-rc2", status: "testing", hue: 80 },
    { env: "dev", version: "v3.3.0-alpha", status: "building", hue: 200 },
  ],
  payments: [
    { env: "prod", version: "v2.0.4", status: "stable", hue: 155 },
    { env: "staging", version: "v2.1.0-rc1", status: "hotfix", hue: 80 },
    { env: "dev", version: "v2.1.0-rc1", status: "same as stg", hue: 200 },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nodeById(id: string) {
  return GRAPH_NODES.find((n) => n.id === id);
}

// ─── Graph View (X-Y plane) ──────────────────────────────────────────────────

function GraphView() {
  return (
    <div className="relative mx-auto h-full w-full max-w-[900px]">
      {/* Edges */}
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
        {GRAPH_EDGES.map((edge) => {
          const from = nodeById(edge.from);
          const to = nodeById(edge.to);
          if (!(from && to)) {
            return null;
          }
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              stroke="oklch(0.32 0.02 270)"
              strokeWidth={1.5}
              x1={from.x}
              x2={to.x}
              y1={from.y}
              y2={to.y}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {GRAPH_NODES.map((node) => {
        const selected = SELECTED_IDS.includes(node.id);
        return (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            key={node.id}
            style={{ left: node.x, top: node.y }}
          >
            <div
              className="whitespace-nowrap rounded-lg border px-3.5 py-2 font-medium text-xs"
              style={{
                background: selected
                  ? "oklch(0.17 0.03 200)"
                  : "oklch(0.16 0.01 270)",
                borderColor: selected
                  ? "oklch(0.38 0.1 200)"
                  : "oklch(0.26 0.02 270)",
                color: selected
                  ? "oklch(0.85 0.06 200)"
                  : "oklch(0.58 0.02 270)",
                boxShadow: selected
                  ? "0 0 16px oklch(0.5 0.15 200 / 0.2)"
                  : "0 2px 8px oklch(0 0 0 / 0.3)",
              }}
            >
              {node.label}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-[10px] text-muted-foreground">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: "oklch(0.6 0.15 200)" }}
        />
        preselected for env diff
      </div>

      {/* Axis indicators */}
      <div className="absolute inset-x-0 bottom-4 text-center text-[10px] text-muted-foreground/50 uppercase tracking-[0.25em]">
        x axis
      </div>
      <div className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 text-[10px] text-muted-foreground/50 uppercase tracking-[0.25em]">
        y axis
      </div>
    </div>
  );
}

// ─── Env Diff View (X-Z plane) ───────────────────────────────────────────────

function EnvDiffView() {
  const nodes = SELECTED_IDS.flatMap((id) => {
    const n = nodeById(id);
    return n ? [n] : [];
  });

  return (
    <div className="relative flex h-full w-full items-start justify-center gap-10 pt-14">
      {/* Horizontal connector between nodes */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-[54px] left-0 h-4 w-full"
      >
        <line
          stroke="oklch(0.28 0.02 270)"
          strokeDasharray="6 4"
          strokeWidth={1}
          x1="14%"
          x2="86%"
          y1="50%"
          y2="50%"
        />
      </svg>

      {nodes.map((node, i) => {
        const versions = ENV_VERSIONS[node.id] ?? [];
        return (
          <div className="flex flex-col items-center" key={node.id}>
            {/* Node label */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="whitespace-nowrap rounded-lg border px-3.5 py-2 font-medium text-xs"
              initial={{ opacity: 0, y: -10 }}
              style={{
                background: "oklch(0.17 0.03 200)",
                borderColor: "oklch(0.38 0.1 200)",
                color: "oklch(0.85 0.06 200)",
                boxShadow: "0 0 16px oklch(0.5 0.15 200 / 0.2)",
              }}
              transition={{ delay: 0.06 + i * 0.06, duration: 0.35 }}
            >
              {node.label}
            </motion.div>

            {/* Vertical stem (the z-axis vector) */}
            <motion.div
              animate={{ scaleY: 1 }}
              className="my-2 h-3 w-px origin-top"
              initial={{ scaleY: 0 }}
              style={{ background: "oklch(0.3 0.02 270)" }}
              transition={{ delay: 0.18 + i * 0.06, duration: 0.35 }}
            />

            {/* Env version cards */}
            <div className="flex flex-col gap-2.5">
              {versions.map((v, j) => (
                <motion.div
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="w-[148px] rounded-lg border p-2.5"
                  initial={{ opacity: 0, x: -14, scale: 0.95 }}
                  key={v.env}
                  style={{
                    borderColor: `oklch(0.4 0.1 ${v.hue})`,
                    background: `oklch(0.14 0.025 ${v.hue})`,
                    boxShadow: `0 2px 12px oklch(0.3 0.1 ${v.hue} / 0.15)`,
                  }}
                  transition={{
                    delay: 0.28 + i * 0.06 + j * 0.09,
                    duration: 0.35,
                    ease: [0, 0, 0.2, 1],
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="font-bold text-[10px] uppercase tracking-wider"
                      style={{ color: `oklch(0.72 0.14 ${v.hue})` }}
                    >
                      {v.env}
                    </span>
                    <span className="truncate text-[9px] text-muted-foreground">
                      {v.status}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-foreground text-xs">
                    {v.version}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Axis indicators */}
      <div className="absolute inset-x-0 bottom-4 text-center text-[10px] text-muted-foreground/50 uppercase tracking-[0.25em]">
        x axis
      </div>
      <div className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 text-[10px] text-muted-foreground/50 uppercase tracking-[0.25em]">
        z axis (environments)
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function EnvDiffCanvas() {
  const [mode, setMode] = useState<"graph" | "env">("graph");
  const [displayMode, setDisplayMode] = useState<"graph" | "env">("graph");
  const [isAnimating, setIsAnimating] = useState(false);
  const [scope, animate] = useAnimate();

  const handleToggle = useCallback(async () => {
    if (isAnimating) {
      return;
    }
    setIsAnimating(true);

    const next: "graph" | "env" = mode === "graph" ? "env" : "graph";

    // Phase 1: fold current view — top tilts back into the screen
    await animate(
      scope.current,
      { rotateX: -90 },
      { duration: 0.75, ease: [0.4, 0, 0.7, 0.2] }
    );

    // Content is now edge-on (invisible) — swap safely
    setDisplayMode(next);

    // Snap to the opposite edge-on position
    await animate(scope.current, { rotateX: 90 }, { duration: 0 });

    // Phase 2: unfold new view toward the user
    await animate(
      scope.current,
      { rotateX: 0 },
      { duration: 0.75, ease: [0.3, 0.8, 0.2, 1] }
    );

    setMode(next);
    setIsAnimating(false);
  }, [mode, isAnimating, animate, scope]);

  // Keyboard shortcut: Space to toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isAnimating) {
        e.preventDefault();
        handleToggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleToggle, isAnimating]);

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-border border-b px-6 py-3.5">
        <div>
          <h1 className="font-semibold text-sm tracking-tight">
            I8 — Env Diff PoC
          </h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {mode === "graph"
              ? "Graph view (X-Y plane) — preselected nodes highlighted"
              : "Environment diff (X-Z plane) — Y axis rotated away"}
            <span className="ml-3 opacity-50">press Space to toggle</span>
          </p>
        </div>
        <button
          className="rounded-lg border border-border bg-secondary px-4 py-2 font-medium text-xs transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isAnimating}
          onClick={handleToggle}
          type="button"
        >
          {mode === "graph" ? "Rotate to Env Diff" : "Rotate to Graph"}
        </button>
      </div>

      {/* 3D scene */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
      >
        {/* Shadow hint during rotation */}
        <motion.div
          animate={{ opacity: isAnimating ? 1 : 0 }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3"
          style={{
            background:
              "linear-gradient(to top, oklch(0 0 0 / 0.25), transparent)",
          }}
          transition={{ duration: 0.35 }}
        />

        {/* Rotating wrapper */}
        <div
          className="h-full w-full"
          ref={scope}
          style={{ transformStyle: "preserve-3d" }}
        >
          {displayMode === "graph" ? <GraphView /> : <EnvDiffView />}
        </div>
      </div>
    </div>
  );
}
