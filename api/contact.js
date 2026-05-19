import { getValue, setValue } from "./_db.js";

function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }
  const msg = {
    id: Date.now().toString(),
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
    const existing = getValue("contact_messages");
    let messages = [];
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        if (Array.isArray(parsed)) messages = parsed;
      } catch {}
    }
    messages.unshift(msg);
    setValue("contact_messages", JSON.stringify(messages));
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Could not save message." });
  }
}
