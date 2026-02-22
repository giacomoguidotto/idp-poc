import { useEffect } from "react";
import { useLayerStore } from "@/stores/layer-store";
import type { LayerId } from "@/data/types";

const layerKeys: Record<string, LayerId> = {
  "1": "tracing",
  "2": "building",
  "3": "platform",
};

export function useKeyboardShortcuts() {
  const setActiveLayer = useLayerStore((s) => s.setActiveLayer);
  const setSelectedNodeId = useLayerStore((s) => s.setSelectedNodeId);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const layer = layerKeys[e.key];
      if (layer) {
        e.preventDefault();
        setActiveLayer(layer);
        return;
      }

      if (e.key === "Escape") {
        setSelectedNodeId(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveLayer, setSelectedNodeId]);
}
