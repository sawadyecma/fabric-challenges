/// <reference types="vite/client" />
import { defineConfig } from "vite";
import { storyInputs } from "./src/story-inputs";

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
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        ...storyInputs,
      },
    },
  },
});
