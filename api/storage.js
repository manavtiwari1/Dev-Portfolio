import { getValue, isAdminRequest, setValue } from "./_db.js";

const PUBLIC_KEYS = new Set([
  "portfolio_skills",
  "portfolio_experience",
  "portfolio_qualifications",
  "portfolio_certifications",
  "portfolio_projects",
  "portfolio_chatbot",
]);

const ADMIN_KEYS = new Set([...PUBLIC_KEYS, "contact_messages"]);

export default async function handler(req, res) {
  const key = req.query.key || req.body?.key;
  if (!key || typeof key !== "string") {
    res.status(400).json({ error: "Missing storage key." });
    return;
  }

  if (req.method === "GET") {
    const admin = isAdminRequest(req);
    if (!PUBLIC_KEYS.has(key) && !(admin && ADMIN_KEYS.has(key))) {
      res.status(403).json({ error: "This key is not public." });
      return;
    }

    try {
      const value = await getValue(key);
      res.status(200).json(value === null ? null : { value });
    } catch (error) {
      res.status(500).json({ error: "Could not read storage value." });
    }
    return;
  }

  if (req.method === "POST") {
    if (!isAdminRequest(req)) {
      res.status(401).json({ error: "Admin password required." });
      return;
    }
    if (!ADMIN_KEYS.has(key)) {
      res.status(403).json({ error: "This key cannot be changed." });
      return;
    }

    try {
      await setValue(key, req.body?.value ?? "");
      res.status(200).json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: "Could not save storage value." });
    }
    return;
  }

  res.setHeader("Allow", "GET, POST");
  res.status(405).json({ error: "Method not allowed." });
}
