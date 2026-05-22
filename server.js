import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authHandler from "./api/auth.js";
import contactHandler from "./api/contact.js";
import storageHandler from "./api/storage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;
const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  allowedHeaders: ["Content-Type", "x-admin-password"],
  methods: ["GET", "POST", "OPTIONS"],
}));
app.use(express.json({ limit: "1mb" }));

app.all("/api/auth", authHandler);
app.all("/api/contact", contactHandler);
app.all("/api/storage", storageHandler);

app.get("/manav3d.html", (_req, res) => {
  res.redirect(301, "/manav");
});

app.get("/admin.html", (_req, res) => {
  res.redirect(301, "/admin");
});

app.get(["/", "/manav", "/index"], (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "manav3d.html"));
});

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "admin.html"));
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("*.pdf", (_req, res) => {
  res.sendFile(path.join(__dirname, _req.path));
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "manav3d.html"));
});

app.listen(port, () => {
  console.log(`Portfolio server running on http://localhost:${port}`);
});
