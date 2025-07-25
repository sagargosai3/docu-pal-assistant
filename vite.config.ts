import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// CHANGE THIS: Replace with your actual GitHub repo name
const repoName = "docu-pal-assistant";

export default defineConfig(({ mode }) => ({
  base: '/docu-pal-assistant/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
