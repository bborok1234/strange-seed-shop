import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  publicDir: "../../public",
  build: {
    chunkSizeWarningLimit: 1700,
    emptyOutDir: true,
    outDir: "../../dist/seed-garden-phaser"
  },
  server: {
    port: 3001
  }
});
