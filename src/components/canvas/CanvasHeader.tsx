import { motion, AnimatePresence } from "motion/react";
import { useLayerStore } from "@/stores/layer-store";
import type { LayerId } from "@/data/types";

const layerLabels: Record<LayerId, { label: string; color: string }> = {
  tracing: { label: "Tracing", color: "text-layer-tracing" },
  building: { label: "Building", color: "text-layer-building" },
  platform: { label: "Platform", color: "text-layer-platform" },
};

export function CanvasHeader() {
  const activeLayer = useLayerStore((s) => s.activeLayer);
  const config = layerLabels[activeLayer];

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-border/30 bg-card/60 backdrop-blur-xl shadow-lg shadow-black/20">
        <h1 className="font-serif text-[15px] text-foreground/60 italic tracking-wide">
          Meridian
        </h1>
        <div className="w-px h-4 bg-border/40" />
        <AnimatePresence mode="wait">
          <motion.span
            key={activeLayer}
            className={`text-[11px] font-mono font-medium tracking-wider uppercase ${config.color}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {config.label}
          </motion.span>
        </AnimatePresence>
        <div className="hidden sm:flex items-center gap-1.5 ml-1">
          {(["1", "2", "3"] as const).map((key) => (
            <kbd
              key={key}
              className="text-[9px] font-mono text-muted-foreground/40 bg-white/[0.03] border border-border/20 rounded px-1 py-0.5 leading-none"
            >
              {key}
            </kbd>
          ))}
        </div>
      </div>
    </div>
  );
}
