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

async function sendNotificationEmail(msg) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.EMAIL_TO || "contact@manavtiwari.in";
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

  if (!apiKey) {
    console.warn("RESEND_API_KEY is not configured in environment variables. Skipping email notification.");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `Portfolio Contact <${fromEmail}>`,
      to: [to],
      reply_to: msg.email,
      subject: `📩 New Portfolio Message: ${msg.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0f7fa; border-radius: 12px; background-color: #fdfdfd; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #00e5ff, #1a6cf5); padding: 15px; border-radius: 8px 8px 0 0; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 20px;">📩 New Portfolio Message</h2>
          </div>
          <div style="padding: 20px; color: #333333; line-height: 1.6;">
            <p>You have received a new contact submission from your portfolio website.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #eeeeee;">
                <td style="padding: 10px 0; font-weight: bold; color: #4a7a82; width: 100px;">Name:</td>
                <td style="padding: 10px 0; color: #333333;">${msg.name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eeeeee;">
                <td style="padding: 10px 0; font-weight: bold; color: #4a7a82;">Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:${msg.email}" style="color: #1a6cf5; text-decoration: none;">${msg.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #eeeeee;">
                <td style="padding: 10px 0; font-weight: bold; color: #4a7a82;">Subject:</td>
                <td style="padding: 10px 0; color: #333333; font-weight: 600;">${msg.subject}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eeeeee;">
                <td style="padding: 10px 0; font-weight: bold; color: #4a7a82;">Date:</td>
                <td style="padding: 10px 0; color: #666666;">${new Date(msg.date).toLocaleString("en-IN")}</td>
              </tr>
            </table>
            
            <div style="background-color: #f7fafc; border-left: 4px solid #00e5ff; padding: 15px; border-radius: 0 8px 8px 0; margin-top: 15px;">
              <div style="font-weight: bold; margin-bottom: 8px; color: #4a7a82;">Message Content:</div>
              <div style="white-space: pre-wrap; color: #444444;">${msg.message}</div>
            </div>
          </div>
          <div style="text-align: center; padding: 15px; font-size: 11px; color: #999999; border-top: 1px solid #eeeeee; margin-top: 20px;">
            This is an automated notification from your Developer Portfolio Server via Resend HTTP API.
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(`Resend API error: ${JSON.stringify(errData)}`);
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

    // Send email asynchronously in the background so it doesn't block the client's HTTP response
    sendNotificationEmail(msg)
      .then(() => {
        console.log("Notification email sent successfully via Resend.");
      })
      .catch((emailErr) => {
        console.error("Email notification sending failed via Resend:", emailErr);
      });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not save message." });
  }
}
