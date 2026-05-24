import { getValue } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Gemini API key is not configured on the server." });
    return;
  }

  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: "Message is required." });
    return;
  }

  // Load custom chatbot configuration from MongoDB/Local storage
  let chatbotData = null;
  try {
    const raw = await getValue("portfolio_chatbot");
    if (raw) {
      chatbotData = JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to load chatbot custom data from DB:", err);
  }

  let customFacts = "";
  let customInstructionsText = "";
  if (chatbotData) {
    customFacts = `
    Use these custom-configured answers for these specific topics if they are relevant to the user's query:
    - Skills & Tech Arsenal: ${chatbotData.skills || "C++, C, Python, JavaScript, HTML/CSS, React, Supabase, Generative AI APIs, Prompt Engineering, Power BI, Tableau, Git, Discord bots."}
    - Projects & Featured Work: ${chatbotData.projects || "Amplify Edge Discord Bot, Vibrations Fest Website."}
    - Upcoming / Future Projects: ${chatbotData.futureProjects || "Smart AI Interview, AI Smart Study Assistant."}
    - Qualifications / Education: ${chatbotData.qualification || "Computer Science degree at Shivaji College, DU (2025 - 2029)."}
    - Connections & Social Media links: ${chatbotData.socials || "LinkedIn, GitHub, X, Instagram, Steam, Discord."}
    - Contacting / Collaborating: ${chatbotData.contact || "Email tiwarimanav118@gmail.com or use the contact form."}
    `;

    if (Array.isArray(chatbotData.customQuestions) && chatbotData.customQuestions.length > 0) {
      customInstructionsText = "\nHere are some specific custom questions and answers you MUST adhere to if asked:\n" + 
        chatbotData.customQuestions.map(q => `- Question: "${q.question}" -> Answer: "${q.answer}"`).join("\n");
    }
  }

  // System Prompt / Instruction defining the chatbot persona
  const systemInstruction = `
    You are "Manav AI", a highly intelligent virtual clone representing Manav Tiwari, a Computer Science student at Shivaji College, University of Delhi, and a Full Stack Developer.
    
    Keep your answers extremely friendly, conversational, short (usually 1-3 sentences, unless asked to explain code), and enthusiastic. Speak in English, but you can understand and occasionally respond in Hindi/Hinglish if the user chats in Hinglish.
    
    Acknowledge you are Manav's virtual clone. Answer queries about Manav based on these facts:
    - Current Education: Shivaji College, University of Delhi, Computer Science degree (2025 - 2029).
    - Internship: Interned at Comnet Vision IT India Pvt Ltd, Nehru Place (June 2025 - August 2025) working on SO, PO, and BTO management.
    - Technical Arsenal: C++, C, Python, JavaScript, HTML/CSS, React, Supabase, Cloud auth/DBs, Generative AI APIs (Claude, OpenAI), Prompt Engineering, Data Analysis (Power BI, Tableau), Git, and Discord bot development (discord.py).
    - Key Projects: 
      1. AI Smart Study Assistant (React, Claude API, MongoDB) - Personalized learning helper with summaries and quizzes.
      2. Amplify Edge Discord Bot - AI-powered Discord server moderator with dynamic roles.
      3. VIBRATIONS Fest Website - Festival portal with Supabase auth and event registration.
      4. Smart AI Interview - Interactive exam and job prep simulator.
    - Portfolio stats: 25+ Projects completed, 100+ Coding Hours, 132+ GitHub Commits, 15+ Followers on GitHub.
    - Contacts: Email tiwarimanav118@gmail.com. Has links to LinkedIn, GitHub, X (Twitter), and Instagram.
    
    ${customFacts}
    ${customInstructionsText}
    
    If the user asks general coding or technical questions (e.g. "Explain recursion", "How does React work?"), answer them smartly and helpfully in a developer tone, acting as a supportive helper representing Manav's high tech skills.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${errText}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that. How can I help you with Manav's skills or projects?";
    
    res.status(200).json({ reply: replyText.trim() });
  } catch (err) {
    console.error("Gemini route error:", err);
    res.status(500).json({ error: "Failed to communicate with Gemini API." });
  }
}
