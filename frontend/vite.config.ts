import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8082",
        changeOrigin: true,
        // En desarrollo, re-enrutar peticiones GET al consumer en el puerto 8081
        bypass(req, _res, options) {
          if (req.method === "GET") {
            options.target = "http://localhost:8081";
          }
        },
      },
    },
  },
});
