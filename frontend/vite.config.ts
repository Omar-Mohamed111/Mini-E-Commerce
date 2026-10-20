import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  // The backend has no /api prefix, so the proxy strips it. Proxying keeps browser
  // requests same-origin, which avoids CORS and lets the backend's cookie auth work.
  const proxy = {
    "/api": {
      target: env.VITE_PROXY_TARGET || "http://localhost:3000",
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api/, ""),
    },
  };
  return {
    plugins: [react(), tailwindcss()],
    // The backend's CORS policy allows exactly http://localhost:5173.
    server: { port: 5173, strictPort: true, proxy },
    preview: { port: 5173, strictPort: true, proxy },
  };
});
