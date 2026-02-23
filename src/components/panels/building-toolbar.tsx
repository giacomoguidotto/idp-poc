import { Link2, MousePointer, Plus, Type } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useLayerStore } from "@/stores/layer-store";

const tools = [
  { id: "select", icon: MousePointer, label: "Select", shortcut: "V" },
  { id: "add-node", icon: Plus, label: "Add Component", shortcut: "A" },
  { id: "connect", icon: Link2, label: "Connect", shortcut: "C" },
  { id: "label", icon: Type, label: "Label", shortcut: "L" },
] as const;

export function BuildingToolbar() {
  const activeLayer = useLayerStore((s) => s.activeLayer);

  return (
    <AnimatePresence>
      {activeLayer === "building" && (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2"
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="flex items-center gap-1 rounded-xl border border-layer-building/20 bg-card/80 px-2 py-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200",
                    "text-muted-foreground hover:bg-layer-building/10 hover:text-layer-building",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-layer-building/50"
                  )}
                  key={tool.id}
                  title={`${tool.label} (${tool.shortcut})`}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden font-medium text-[11px] sm:inline">
                    {tool.label}
                  </span>
                  <kbd className="hidden rounded border border-border/20 bg-white/[0.03] px-1 py-0.5 font-mono text-[9px] opacity-40 sm:inline">
                    {tool.shortcut}
                  </kbd>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
