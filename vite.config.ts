import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1700,
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
