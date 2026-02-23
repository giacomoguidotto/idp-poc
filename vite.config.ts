import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react({
      babel: {
        plugins: [
          // React Compiler must run first in the Babel pipeline.
          // Automatically memoizes components and hooks — memo(), useCallback(),
          // and useMemo() are no longer needed as manual optimizations.
          ["babel-plugin-react-compiler"],
        ],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
