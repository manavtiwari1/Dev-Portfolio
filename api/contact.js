import { getValue, setValue } from "./_db.js";

function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function parseMessages(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const msg = {
    id: clean(req.body?.id, 80) || Date.now().toString(),
    name: clean(req.body?.name, 120),
    email: clean(req.body?.email, 160),
    subject: clean(req.body?.subject, 180),
    message: clean(req.body?.message, 3000),
    date: new Date().toISOString(),
    read: false,
  };

  if (!msg.name || !msg.email || !msg.subject || !msg.message) {
    res.status(400).json({ error: "All contact fields are required." });
    return;
  }

  try {
    const existing = parseMessages(await getValue("contact_messages"));
    existing.unshift(msg);
    await setValue("contact_messages", JSON.stringify(existing.slice(0, 500)));
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not save message." });
  }
}
