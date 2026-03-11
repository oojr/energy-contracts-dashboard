import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/contracts": "http://localhost:8000",
      "/portfolio": "http://localhost:8000",
      "/login": "http://localhost:8000",
    },
  },
});
