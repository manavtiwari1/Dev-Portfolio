import { getValue, setValue } from "./_db.js";

function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function parseReviews(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const allReviews = parseReviews(await getValue("portfolio_reviews"));
      const approvedReviews = allReviews.filter((r) => r.approved === true);
      // Sort approved reviews by date descending (newest first)
      approvedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      res.status(200).json(approvedReviews);
    } catch (error) {
      console.error("GET reviews error:", error);
      res.status(500).json({ error: "Could not fetch reviews." });
    }
    return;
  }

  if (req.method === "POST") {
    const { name, role, rating, text, avatar } = req.body || {};

    const cleanName = clean(name, 100);
    const cleanRole = clean(role, 120);
    const cleanText = clean(text, 500);
    const cleanAvatar = clean(avatar, 20) || "👨‍💻";
    const intRating = parseInt(rating, 10);

    if (!cleanName || !cleanText) {
      res.status(400).json({ error: "Name and Review text are required." });
      return;
    }

    if (isNaN(intRating) || intRating < 1 || intRating > 5) {
      res.status(400).json({ error: "Rating must be between 1 and 5 stars." });
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      name: cleanName,
      role: cleanRole,
      rating: intRating,
      text: cleanText,
      avatar: cleanAvatar,
      date: new Date().toISOString(),
      approved: false, // Default is false, pending admin moderation
    };

    try {
      const allReviews = parseReviews(await getValue("portfolio_reviews"));
      allReviews.unshift(newReview); // add to the beginning
      await setValue("portfolio_reviews", JSON.stringify(allReviews));
      res.status(200).json({ ok: true, message: "Review submitted successfully and is pending moderation." });
    } catch (error) {
      console.error("POST reviews error:", error);
      res.status(500).json({ error: "Could not save review." });
    }
    return;
  }

  res.setHeader("Allow", "GET, POST");
  res.status(405).json({ error: "Method not allowed." });
}
