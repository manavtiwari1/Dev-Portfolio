import "dotenv/config";

/**
 * GET /api/wakatime
 * Returns total coding hours from WakaTime (proxied server-side so API key stays secret).
 * Response: { total_seconds, human_readable_total, daily_average_seconds, languages, editors }
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "WakaTime API key not configured." });
  }

  const token = Buffer.from(`${apiKey}:`).toString("base64");

  try {
    // Fetch all-time stats from WakaTime
    const [allTimeRes, statsRes] = await Promise.all([
      fetch("https://wakatime.com/api/v1/users/current/all_time_since_today", {
        headers: { Authorization: `Basic ${token}`, "User-Agent": "manavtiwari-portfolio/1.0" },
      }),
      fetch("https://wakatime.com/api/v1/users/current/stats/last_7_days", {
        headers: { Authorization: `Basic ${token}`, "User-Agent": "manavtiwari-portfolio/1.0" },
      }),
    ]);

    if (!allTimeRes.ok || !statsRes.ok) {
      throw new Error(`WakaTime API error: ${allTimeRes.status} / ${statsRes.status}`);
    }

    const allTimeData = await allTimeRes.json();
    const statsData = await statsRes.json();

    const totalSeconds = allTimeData?.data?.total_seconds ?? 0;
    const humanReadable = allTimeData?.data?.text ?? "0 secs";
    const dailyAvgSeconds = statsData?.data?.daily_average_including_other_language ?? 0;

    // Top languages (last 7 days)
    const languages = (statsData?.data?.languages ?? [])
      .slice(0, 5)
      .map((l) => ({ name: l.name, percent: l.percent, text: l.text }));

    // Top editors (last 7 days)
    const editors = (statsData?.data?.editors ?? [])
      .slice(0, 3)
      .map((e) => ({ name: e.name, percent: e.percent, text: e.text }));

    // Cache for 30 minutes
    res.setHeader("Cache-Control", "public, max-age=1800");
    return res.status(200).json({
      total_seconds: totalSeconds,
      total_hours: Math.floor(totalSeconds / 3600),
      human_readable_total: humanReadable,
      daily_average_seconds: dailyAvgSeconds,
      daily_average_hours: (dailyAvgSeconds / 3600).toFixed(1),
      languages,
      editors,
    });
  } catch (err) {
    console.error("WakaTime fetch error:", err.message);
    return res.status(502).json({ error: "Could not fetch WakaTime data.", detail: err.message });
  }
}
