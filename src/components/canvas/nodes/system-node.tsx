import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Box,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Globe,
  HardDrive,
  Pencil,
  Radio,
  Server,
  Trash2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { HealthStatus, NodeKind, SystemNodeData } from "@/data/types";
import { cn } from "@/lib/utils";
import { useLayerStore } from "@/stores/layer-store";

const kindConfig: Record<
  NodeKind,
  { icon: React.ElementType; accent: string; bgAccent: string }
> = {
  gateway: {
    icon: Globe,
    accent: "text-[oklch(0.78_0.15_200)]",
    bgAccent: "bg-[oklch(0.78_0.15_200)]",
  },
  service: {
    icon: Server,
    accent: "text-[oklch(0.78_0.12_260)]",
    bgAccent: "bg-[oklch(0.78_0.12_260)]",
  },
  database: {
    icon: Database,
    accent: "text-[oklch(0.75_0.14_145)]",
    bgAccent: "bg-[oklch(0.75_0.14_145)]",
  },
  queue: {
    icon: Radio,
    accent: "text-[oklch(0.75_0.15_55)]",
    bgAccent: "bg-[oklch(0.75_0.15_55)]",
  },
  cache: {
    icon: HardDrive,
    accent: "text-[oklch(0.70_0.18_330)]",
    bgAccent: "bg-[oklch(0.70_0.18_330)]",
  },
};

const healthColors: Record<HealthStatus, string> = {
  healthy: "text-emerald-400",
  degraded: "text-amber-400",
  critical: "text-red-400",
  warning: "text-amber-400",
  unknown: "text-zinc-500",
};

const healthIcons: Record<HealthStatus, React.ElementType> = {
  healthy: CheckCircle2,
  degraded: AlertCircle,
  critical: XCircle,
  warning: AlertCircle,
  unknown: AlertCircle,
};

function formatLatency(ms: number): string {
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${ms}ms`;
}

function getMetricColor(value: number): string {
  if (value > 80) {
    return "bg-red-400";
  }
  if (value > 60) {
    return "bg-amber-400";
  }
  return "bg-emerald-400";
}

function MetricBar({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <span className="w-8 shrink-0 font-mono text-muted-foreground">
        {label}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            color
          )}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="w-8 text-right font-mono text-foreground/70">
        {value}%
      </span>
    </div>
  );
}

function TracingOverlay({ data }: { data: SystemNodeData }) {
  const tracing = data.tracing;
  if (!tracing) {
    return null;
  }

  const isError = tracing.status === "error";
  const isWarning = tracing.status === "warning";

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span
            className={cn(
              "font-mono text-[11px]",
              isError ? "font-semibold text-layer-error" : "text-foreground/70"
            )}
          >
            {formatLatency(tracing.latencyMs)}
          </span>
        </div>
        {isError && (
          <Badge
            className="h-4 px-1.5 py-0 font-mono text-[9px]"
            variant="destructive"
          >
            ERROR
          </Badge>
        )}
        {isWarning && (
          <Badge className="h-4 border-layer-warning/30 bg-layer-warning/20 px-1.5 py-0 font-mono text-[9px] text-layer-warning hover:bg-layer-warning/20">
            WARN
          </Badge>
        )}
        {tracing.status === "ok" && (
          <Badge className="h-4 border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0 font-mono text-[9px] text-emerald-400 hover:bg-emerald-500/15">
            OK
          </Badge>
        )}
      </div>
      {tracing.errorMessage && (
        <p className="rounded border border-layer-error/10 bg-layer-error/5 px-1.5 py-1 font-mono text-[10px] text-layer-error/80 leading-tight">
          {tracing.errorMessage}
        </p>
      )}
    </div>
  );
}

function BuildingOverlay({ data }: { data: SystemNodeData }) {
  const building = data.building;
  if (!building) {
    return null;
  }

  if (building.isDraft) {
    return (
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] text-layer-building/70">
          <FileText className="h-3 w-3" />
          <span className="font-mono">{building.ticketId}</span>
        </div>
        {building.proposedBy && (
          <p className="text-[10px] text-muted-foreground">
            Proposed by {building.proposedBy}
          </p>
        )}
        {building.description && (
          <p className="text-[10px] text-foreground/50 leading-tight">
            {building.description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-1">
      <button
        className="rounded p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
        type="button"
      >
        <Pencil className="h-3 w-3" />
      </button>
      <button
        className="rounded p-1 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
        type="button"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}

function PlatformOverlay({ data }: { data: SystemNodeData }) {
  const platform = data.platform;
  if (!platform) {
    return null;
  }

  const HealthIcon = healthIcons[platform.health];

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center justify-between text-[10px]">
        <div
          className={cn(
            "flex items-center gap-1",
            healthColors[platform.health]
          )}
        >
          <HealthIcon className="h-3 w-3" />
          <span className="font-medium capitalize">{platform.health}</span>
        </div>
        <span className="font-mono text-muted-foreground">
          {platform.version}
        </span>
      </div>
      <MetricBar
        color={getMetricColor(platform.cpu)}
        label="CPU"
        value={platform.cpu}
      />
      <MetricBar
        color={getMetricColor(platform.memory)}
        label="MEM"
        value={platform.memory}
      />
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Box className="h-3 w-3" />
          <span className="font-mono">
            {platform.pods.ready}/{platform.pods.total} pods
          </span>
        </div>
        <span className="font-mono">{platform.lastDeploy}</span>
      </div>
    </div>
  );
}

type SystemNodeType = Node<SystemNodeData>;

interface NodeFlags {
  dimmed: boolean;
  isCritical: boolean;
  isDraft: boolean;
  isError: boolean;
}

function NodeAccentStripe({
  config,
  flags,
}: {
  config: { bgAccent: string };
  flags: NodeFlags;
}) {
  return (
    <div
      className={cn(
        "absolute top-3 bottom-3 left-0 w-[3px] rounded-full transition-colors duration-500",
        flags.isDraft ? "bg-layer-building/50" : config.bgAccent,
        flags.isError && "!bg-layer-error",
        flags.dimmed && "opacity-50"
      )}
    />
  );
}

function NodeIconBox({
  Icon,
  config,
  flags,
}: {
  Icon: React.ElementType;
  config: { accent: string };
  flags: NodeFlags;
}) {
  return (
    <div
      className={cn(
        "shrink-0 rounded p-1",
        flags.isDraft
          ? "bg-layer-building/10 text-layer-building/70"
          : "bg-white/5",
        flags.isError && "bg-layer-error/10 text-layer-error"
      )}
    >
      <Icon
        className={cn(
          "h-3.5 w-3.5",
          !(flags.isDraft || flags.isError) && config.accent
        )}
      />
    </div>
  );
}

function NodeStatusIcon({
  activeLayer,
  data,
  isError,
}: {
  activeLayer: string;
  data: SystemNodeData;
  isError: boolean;
}) {
  if (isError) {
    return (
      <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse text-layer-error" />
    );
  }
  if (activeLayer === "platform" && data.platform) {
    return (
      <Activity
        className={cn(
          "h-3.5 w-3.5 shrink-0",
          healthColors[data.platform.health]
        )}
      />
    );
  }
  return null;
}

export function SystemNodeComponent({
  data,
  selected,
}: NodeProps<SystemNodeType>) {
  const activeLayer = useLayerStore((s) => s.activeLayer);
  const isDraft = data.building?.isDraft ?? false;
  const isError = data.tracing?.status === "error" && activeLayer === "tracing";
  const isOnTracePath = data.tracing && activeLayer === "tracing";
  const isCritical =
    data.platform?.health === "critical" && activeLayer === "platform";
  const dimmed =
    activeLayer === "tracing" &&
    !isOnTracePath &&
    data.kind !== "database" &&
    data.kind !== "cache" &&
    data.kind !== "queue";

  const config = kindConfig[data.kind];
  const Icon = config.icon;
  const flags: NodeFlags = { isDraft, isError, isCritical, dimmed };

  return (
    <>
      <Handle
        className="!bg-border !border-surface !w-2 !h-2"
        position={Position.Top}
        type="target"
      />
      <div
        className={cn(
          "relative w-[220px] rounded-lg border transition-all duration-500",
          "bg-card/80 backdrop-blur-sm",
          selected && "ring-1 ring-ring",
          isDraft &&
            "animate-[ghost-shimmer_3s_ease-in-out_infinite] border-layer-building/40 border-dashed bg-layer-building/5",
          isError &&
            "animate-[error-pulse_2s_ease-in-out_infinite] border-layer-error/50",
          isCritical &&
            "border-red-500/40 shadow-[0_0_16px_oklch(0.65_0.25_15_/_0.2)]",
          !(isDraft || isError || isCritical) && "border-border/60",
          dimmed && "opacity-30"
        )}
      >
        <NodeAccentStripe config={config} flags={flags} />

        <div className="px-3 py-2.5 pl-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <NodeIconBox config={config} flags={flags} Icon={Icon} />
              <div className="min-w-0">
                <h3
                  className={cn(
                    "truncate font-semibold text-[12px] leading-tight",
                    isDraft && "text-layer-building/80"
                  )}
                >
                  {data.label}
                </h3>
                {data.team && (
                  <span
                    className="font-mono text-[9px] leading-none"
                    style={{ color: `${data.team.color}99` }}
                  >
                    {data.team.name}
                  </span>
                )}
              </div>
            </div>
            <NodeStatusIcon
              activeLayer={activeLayer}
              data={data}
              isError={isError}
            />
          </div>

          <p
            className={cn(
              "mt-1.5 text-[10px] text-muted-foreground leading-snug",
              dimmed && "text-muted-foreground/50"
            )}
          >
            {data.description}
          </p>

          {activeLayer === "tracing" && <TracingOverlay data={data} />}
          {activeLayer === "building" && <BuildingOverlay data={data} />}
          {activeLayer === "platform" && <PlatformOverlay data={data} />}
        </div>
      </div>
      <Handle
        className="!bg-border !border-surface !w-2 !h-2"
        position={Position.Bottom}
        type="source"
      />
    </>
  );
}
