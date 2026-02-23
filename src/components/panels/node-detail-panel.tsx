import type { Node } from "@xyflow/react";
import {
  AlertCircle,
  Box,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  GitBranch,
  Globe,
  HardDrive,
  MemoryStick,
  Radio,
  Server,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type {
  HealthStatus,
  NodeKind,
  ServiceFeature,
  SystemNodeData,
} from "@/data/types";
import { cn } from "@/lib/utils";
import { useLayerStore } from "@/stores/layer-store";

function getMetricColor(value: number): string {
  if (value > 80) {
    return "bg-red-400";
  }
  if (value > 60) {
    return "bg-amber-400";
  }
  return "bg-emerald-400";
}

const kindIcons: Record<NodeKind, React.ElementType> = {
  gateway: Globe,
  service: Server,
  database: Database,
  queue: Radio,
  cache: HardDrive,
};

const healthConfig: Record<
  HealthStatus,
  { color: string; icon: React.ElementType; label: string }
> = {
  healthy: { color: "text-emerald-400", icon: CheckCircle2, label: "Healthy" },
  degraded: { color: "text-amber-400", icon: AlertCircle, label: "Degraded" },
  critical: { color: "text-red-400", icon: XCircle, label: "Critical" },
  warning: { color: "text-amber-400", icon: AlertCircle, label: "Warning" },
  unknown: { color: "text-zinc-500", icon: AlertCircle, label: "Unknown" },
};

function FeatureItem({ feature }: { feature: ServiceFeature }) {
  const health = healthConfig[feature.status];
  const HealthIcon = health.icon;

  return (
    <div className="flex items-start gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-white/[0.02]">
      <HealthIcon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", health.color)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[11px] text-foreground">
            {feature.name}
          </span>
          <span
            className="rounded-sm px-1 font-mono text-[9px]"
            style={{
              color: feature.team.color,
              backgroundColor: `${feature.team.color}15`,
            }}
          >
            {feature.team.name}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-snug">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export function NodeDetailPanel({
  node,
  onClose,
}: {
  node: Node<SystemNodeData>;
  onClose: () => void;
}) {
  const activeLayer = useLayerStore((s) => s.activeLayer);
  const data = node.data;
  const Icon = kindIcons[data.kind];

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 z-50 max-h-[calc(100vh-32px)] w-[300px] overflow-y-auto"
        exit={{ opacity: 0, x: 20 }}
        initial={{ opacity: 0, x: 20 }}
        key={node.id}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="rounded-xl border border-border/40 bg-card/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {/* Header */}
          <div className="p-4 pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/5 p-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{data.label}</h3>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground capitalize">
                      {data.kind}
                    </span>
                    {data.team && (
                      <>
                        <span className="text-muted-foreground/30">·</span>
                        <span
                          className="font-mono text-[10px]"
                          style={{ color: data.team.color }}
                        >
                          {data.team.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                onClick={onClose}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          </div>

          <Separator className="opacity-50" />

          {/* Tracing details */}
          {activeLayer === "tracing" && data.tracing && (
            <div className="space-y-3 p-4">
              <h4 className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                Trace Info
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3 w-3" /> Latency
                  </span>
                  <span
                    className={cn(
                      "font-mono",
                      data.tracing.status === "error"
                        ? "text-layer-error"
                        : "text-foreground"
                    )}
                  >
                    {data.tracing.latencyMs >= 1000
                      ? `${(data.tracing.latencyMs / 1000).toFixed(1)}s`
                      : `${data.tracing.latencyMs}ms`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <GitBranch className="h-3 w-3" /> Span ID
                  </span>
                  <span className="font-mono text-foreground/70">
                    {data.tracing.spanId}
                  </span>
                </div>
                {data.tracing.errorMessage && (
                  <div className="rounded-md border border-layer-error/10 bg-layer-error/5 p-2">
                    <p className="font-mono text-[10px] text-layer-error leading-relaxed">
                      {data.tracing.errorMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Platform details */}
          {activeLayer === "platform" && data.platform && (
            <div className="space-y-3 p-4">
              <h4 className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                Infrastructure
              </h4>
              <div className="space-y-2.5">
                {/* Health */}
                {(() => {
                  const health = healthConfig[data.platform.health];
                  const HealthIcon = health.icon;
                  return (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Health</span>
                      <span
                        className={cn(
                          "flex items-center gap-1 font-medium",
                          health.color
                        )}
                      >
                        <HealthIcon className="h-3 w-3" /> {health.label}
                      </span>
                    </div>
                  );
                })()}
                {/* CPU */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Cpu className="h-3 w-3" /> CPU
                    </span>
                    <span className="font-mono">{data.platform.cpu}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        getMetricColor(data.platform.cpu)
                      )}
                      style={{ width: `${data.platform.cpu}%` }}
                    />
                  </div>
                </div>
                {/* Memory */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MemoryStick className="h-3 w-3" /> Memory
                    </span>
                    <span className="font-mono">{data.platform.memory}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        getMetricColor(data.platform.memory)
                      )}
                      style={{ width: `${data.platform.memory}%` }}
                    />
                  </div>
                </div>
                {/* Pods */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Box className="h-3 w-3" /> Pods
                  </span>
                  <span className="font-mono">
                    {data.platform.pods.ready}/{data.platform.pods.total} ready
                  </span>
                </div>
                {/* Deploy info */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono text-foreground/70">
                    {data.platform.version}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-mono text-foreground/70">
                    {data.platform.uptime}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Building details */}
          {activeLayer === "building" && data.building?.isDraft && (
            <div className="space-y-3 p-4">
              <h4 className="font-mono text-[10px] text-layer-building/50 uppercase tracking-wider">
                Proposal
              </h4>
              {data.building.ticketId && (
                <Badge className="border-layer-building/20 bg-layer-building/10 font-mono text-[10px] text-layer-building/80 hover:bg-layer-building/10">
                  {data.building.ticketId}
                </Badge>
              )}
              {data.building.description && (
                <p className="text-[11px] text-foreground/70 leading-relaxed">
                  {data.building.description}
                </p>
              )}
              {data.building.proposedBy && (
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>Proposed by {data.building.proposedBy}</span>
                </div>
              )}
            </div>
          )}

          {/* Features (zoom-in preview) */}
          {data.features && data.features.length > 0 && (
            <>
              <Separator className="opacity-50" />
              <div className="space-y-2 p-4">
                <h4 className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                  Features
                </h4>
                <div className="space-y-0.5">
                  {data.features.map((feature) => (
                    <FeatureItem feature={feature} key={feature.id} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
