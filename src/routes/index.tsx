import { createFileRoute } from "@tanstack/react-router";
import { SystemCanvas } from "@/components/canvas/system-canvas";

export const Route = createFileRoute("/")({
  component: CanvasPage,
});

function CanvasPage() {
  return <SystemCanvas />;
}
