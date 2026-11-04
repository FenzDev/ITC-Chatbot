import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backend = env.VITE_PROXY_TARGET ?? "http://localhost:3000";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": path.resolve(import.meta.dirname, "src") },
    },
    server: {
      port: 5173,
      // CORS (dev): the browser calls /api on :5173 and Vite forwards it to the
      // backend, so the request is same-origin and no CORS headers are needed.
      proxy: {
        "/api": { target: backend, changeOrigin: true },
      },
    },
  };
});
