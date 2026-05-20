import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    // Serve the portfolio on clean local dev URLs.
    {
      name: "clean-portfolio-routes",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const originalUrl = req.url;
          if (originalUrl === "/manav3d.html") {
            res.writeHead(301, { Location: "/manav" });
            res.end();
            return;
          }
          if (originalUrl === "/" || originalUrl === "/manav" || originalUrl === "/index") {
            req.url = "/manav3d.html";
          }
          next();
        });
      },
    },
  ],
  server: {
    host: "localhost",
    port: 8080,
    open: "/manav",
  },
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        portfolio: "manav3d.html",
        admin: "admin.html",
      },
    },
  },
});
