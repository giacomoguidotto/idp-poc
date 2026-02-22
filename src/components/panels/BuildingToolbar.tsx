import { motion, AnimatePresence } from "motion/react";
import { Plus, MousePointer, Link2, Type } from "lucide-react";
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
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-layer-building/20 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/30">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                    "text-muted-foreground hover:text-layer-building hover:bg-layer-building/10",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-layer-building/50",
                  )}
                  title={`${tool.label} (${tool.shortcut})`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] font-medium hidden sm:inline">{tool.label}</span>
                  <kbd className="text-[9px] font-mono opacity-40 bg-white/[0.03] border border-border/20 rounded px-1 py-0.5 hidden sm:inline">
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
