import { isAdminRequest } from "./_db.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  if (!isAdminRequest(req)) {
    res.status(401).json({ error: "Wrong password." });
    return;
  }

  res.status(200).json({ ok: true });
}
