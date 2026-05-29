import "dotenv/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import authHandler from "./api/auth.js";
import contactHandler from "./api/contact.js";
import storageHandler from "./api/storage.js";
import chatHandler from "./api/chat.js";
import reviewsHandler from "./api/reviews.js";

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    return {};
  }
}

function withJsonResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(payload));
  };
  return res;
}

export default defineConfig({
  plugins: [
    react(),
    // Serve the portfolio on clean local dev URLs.
    {
      name: "clean-portfolio-routes",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url || "/", "http://localhost");
          const handlers = {
            "/api/auth": authHandler,
            "/api/contact": contactHandler,
            "/api/storage": storageHandler,
            "/api/chat": chatHandler,
            "/api/reviews": reviewsHandler,
          };
          const handler = handlers[url.pathname];
          if (!handler) {
            next();
            return;
          }

          req.query = Object.fromEntries(url.searchParams.entries());
          req.body = req.method === "POST" ? await readJsonBody(req) : {};
          await handler(req, withJsonResponse(res));
        });

        server.middlewares.use((req, res, next) => {
          const originalUrl = req.url;
          if (originalUrl === "/manav3d.html") {
            res.writeHead(301, { Location: "/manav" });
            res.end();
            return;
          }
          if (originalUrl === "/admin.html") {
            res.writeHead(301, { Location: "/admin" });
            res.end();
            return;
          }
          if (originalUrl === "/" || originalUrl === "/manav" || originalUrl === "/index" || originalUrl.startsWith("/manav/")) {
            req.url = "/manav3d.html";
          }
          if (originalUrl === "/admin") {
            req.url = "/admin.html";
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
