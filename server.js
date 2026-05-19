import "dotenv/config";
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

app.use(express.json({ limit: "1mb" }));

app.all("/api/auth", authHandler);
app.all("/api/contact", contactHandler);
app.all("/api/storage", storageHandler);

app.use(express.static(path.join(__dirname, "dist")));
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "manav3d.html"));
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "manav3d.html"));
});

app.listen(port, () => {
  console.log(`Portfolio server running on http://localhost:${port}`);
});
