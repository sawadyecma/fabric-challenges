import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "flexible-indirectly-ocelot.ngrok-free.app",
      ".ngrok-free.app",
    ],
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
