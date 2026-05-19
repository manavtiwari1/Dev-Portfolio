import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    // Redirect root "/" to the main portfolio page
    {
      name: "root-redirect",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/") {
            res.writeHead(302, { Location: "/manav3d.html" });
            res.end();
          } else {
            next();
          }
        });
      },
    },
  ],
  server: {
    host: "localhost",
    port: 8080,
    open: "/manav3d.html",
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
