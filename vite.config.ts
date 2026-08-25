import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [".manus.computer"],
  },
  plugins: [react()],
  build: {
    sourcemap: false,
    cssMinify: "esbuild",
    reportCompressedSize: false,
    chunkSizeWarningLimit: 700,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
