import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { navigation } from "./src/data";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Every room is a real HTML entry. Neocities only needs the compiled dist files.
export default defineConfig({
  // Relative assets work at a Neocities site root or inside a subdirectory.
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(dirname, "src") },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      input: Object.fromEntries(
        navigation.map((item) => [item.id, path.resolve(dirname, item.file)]),
      ),
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
