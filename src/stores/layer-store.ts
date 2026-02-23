import { create } from "zustand";
import {
  draftEdges,
  draftNodes,
  systemEdges,
  systemNodes,
} from "@/data/system";
import type { LayerId, SystemEdge, SystemNode } from "@/data/types";

interface LayerState {
  activeLayer: LayerId;
  focusedNodeId: string | null;
  getEdges: () => SystemEdge[];

  getNodes: () => SystemNode[];
  selectedNodeId: string | null;

  setActiveLayer: (layer: LayerId) => void;
  setFocusedNodeId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  showDraftNodes: boolean;
}

export const useLayerStore = create<LayerState>((set, get) => ({
  activeLayer: "tracing",
  selectedNodeId: null,
  focusedNodeId: null,
  showDraftNodes: true,

  setActiveLayer: (layer) => set({ activeLayer: layer, selectedNodeId: null }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setFocusedNodeId: (id) => set({ focusedNodeId: id }),

  getNodes: () => {
    const { activeLayer } = get();
    if (activeLayer === "building") {
      return [...systemNodes, ...draftNodes];
    }
    return systemNodes;
  },

  getEdges: () => {
    const { activeLayer } = get();
    if (activeLayer === "building") {
      return [...systemEdges, ...draftEdges];
    }
    return systemEdges;
  },
}));
