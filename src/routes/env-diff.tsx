import { createFileRoute } from "@tanstack/react-router";
import { EnvDiffCanvas } from "@/components/env-diff/env-diff-canvas";

export const Route = createFileRoute("/env-diff")({
  component: EnvDiffPage,
});

function EnvDiffPage() {
  return <EnvDiffCanvas />;
}
