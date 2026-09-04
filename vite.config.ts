import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
    // Prevent duplicate React copies when antd / react-query are pre-bundled.
    dedupe: ["react", "react-dom"],
  },
});
