import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  publicDir: "../../public",
  build: {
    chunkSizeWarningLimit: 1700,
    emptyOutDir: true,
    outDir: "../../dist/legacy-react-playable",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/phaser/")) {
            return "phaser-runtime";
          }
        }
      }
    }
  },
  plugins: [react()],
  server: {
    port: 3000
  }
});
