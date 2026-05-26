import { useState, useEffect } from "react";

const RENDER_API_BASE = "https://dev-portfolio-vlzl.onrender.com";
const API_BASE_URL = (() => {
  if (typeof window === "undefined") return "";
  const configured = window.API_BASE_URL || import.meta.env?.VITE_API_BASE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1" || host.endsWith("onrender.com")) return "";
  return RENDER_API_BASE;
})();
const apiUrl = (path) => `${API_BASE_URL}${path}`;

const DEFAULT_PROJECTS = [
  { id: "1", title: "Amplify Edge Discord Bot", desc: "Fully Automod Bot for Amplify Edge Discord Server. Features include AI-powered content moderation, dynamic role assignment.", thumb: "https://i.vgy.me/BIVktF.png", tags: ["Java Script", "Python"], demo: "https://discord.com/oauth2/authorize?client_id=591543060530462720&permissions=8&integration_type=0&scope=bot", github: "https://github.com/manavtiwari1/Amplify-Edge-Discord-Bot" },
  {id: "2", title: "Vibrations Fest Website", desc: "Official website for Vibrations Fest, a college cultural fest. Built with React and hosted on Vercel.", thumb: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=840&q=80", tags: ["HTML/CSS/JS", "Vercel"], demo: "https://vibration-shivaji.space/vibrations_login_page.html", github: "https://github.com/manavtiwari1/Vibrations" }
];


const DEFAULT_QUALIFICATIONS = [
  { id: "1", role: "Student", org: "Shivaji College, University of Delhi", desc: "Pursuing a degree in Computer Science with a focus on AI and web development.", badge: "2025 - 2029" },
  { id: "2", role: "Student", org: "Mahashay Chunilal Saraswati Bal Mandir Sr. Sec. School, New Delhi", desc: "Completed high school with a focus on science and mathematics. Pass CBSE Board Exams with distinction.", badge: "2017 - 2024" },
];

const DEFAULT_EXPERIENCE = [
  { id: "1", role: "Internship", org: "Comnet Vison IT India Pvt ltd, Nehru Place", desc: "making SO PO and BTO", badge: "June 2025 to August 2025" },
];

const DEFAULT_CERTIFICATIONS = [
  { id: "1", icon: "🏆", name: "Artificial Intelligence & Prompt Engineering", org: "Shivaji College, University of Delhi", badge: "2025" },
  { id: "2", icon: "🏅", name: "Microsoft Power BI", org: "Shivaji College, University of Delhi", badge: "2025" },
  { id: "3", icon: "🎖️", name: "Tableau", org: "Shivaji College, University of Delhi", badge: "2025" },
  { id: "4", icon: "🥇", name: "Generative AI", org: "Coursera", badge: "2024" }
];

const emojiMapping = {
  "🧠": "/Photos/generative_ai.png",
  "🤖": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
  "🐍": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  "⚛️": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "🗄️": "https://cdn.simpleicons.org/langchain/3ECF8E",
  "☁️": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
  "👁️": "https://cdn.simpleicons.org/discord/5865F2",
  "🔧": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
  "⚡": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg",
  "⚙️": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  "🎨": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
  "📱": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg",
  "🔒": "https://cdn.simpleicons.org/auth0/EB5424",
  "🌐": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  "📊": "https://img.icons8.com/color/512/microsoft-power-bi.png",
  "🚀": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  "💡": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  "🎯": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  "🛠️": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
  "📦": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg",
  "🦀": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
  "☕": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  "🐳": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  "☸️": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg",
  "🍃": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  "🐿️": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg",
  "🔥": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
  "🌊": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "💎": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
  "🐬": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  "💚": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
  "❤️": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg",
  "🐧": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
  "🌟": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
};

const getFluentEmojiUrl = (emoji) => {
  return emojiMapping[emoji] || null;
};

const DEFAULT_SKILLS = [
  { id: "1", icon: "🧠", name: "Generative AI", tags: ["Claude API", "LLMs"] },
  { id: "2", icon: "🤖", name: "C++ & C", tags: ["VS Code", "Algorithm Design"] },
  { id: "3", icon: "🐍", name: "Python Language", tags: ["Flask", "FastAPI"] },
  { id: "4", icon: "⚛️", name: "Data Analysis", tags: ["Microsoft Power BI", "Tableau"] },
  { id: "5", icon: "🗄️", name: "Prompt Engineering", tags: ["OpenAI API", "LangChain"] },
  { id: "6", icon: "☁️", name: "Cloud & Supabase", tags: ["Supabase", "Auth"] },
  { id: "7", icon: "👁️", name: "Discord Bot Development", tags: ["discord.py", "Python"] },
  { id: "8", icon: "🔧", name: "Git & DevTools", tags: ["GitHub", "VS Code"] },
  { id: "9", icon: "⚡", name: "Microsoft Office", tags: ["Powerpoint", "Excel"] },
];

const DEFAULT_CHATBOT_REPLIES = {
  intro: "Hi, I am Manav AI. Ask me about Manav's skills, projects, qualifications, socials, or how to start a collaboration.",
  skills: "Manav's core skills include full stack web development, Generative AI, prompt engineering, Python, C/C++, data analysis, Microsoft Power BI, Tableau, Supabase, cloud workflows, Git, UI/UX design, Microsoft Office, and Discord bot development.",
  projects: "Featured work includes the Amplify Edge Discord Bot with AI-powered moderation and dynamic roles, plus the VIBRATIONS Fest Website with registration, Supabase auth, admin controls, and responsive event pages. Upcoming projects include Smart AI Interview and AI Smart Study Assistant.",
  futureProjects: "Manav is working on Smart AI Interview, a project that helps students practice interviews across multiple domains, including government exams and big tech companies. He is also working on an AI Smart Study Assistant for smarter learning and personalized study support.",
  contact: "You can use the contact form below to reach Manav for project collaborations, queries, or ideas. You can also email him directly at tiwarimanav118@gmail.com. I can take you there now.",
  qualification: "Manav is studying Computer Science at Shivaji College, University of Delhi, focused on AI and web development. He completed high school in New Delhi and has certifications in AI, prompt engineering, Power BI, Tableau, and Generative AI.",
  socials: "For future updates and quick connection, follow Manav on LinkedIn, GitHub, X, Instagram, YouTube, Twitch, Discord, Steam, or email. I can take you to the socials section now.",
  fallback: "I can help with Manav's skills, projects, qualifications, socials, and contact details. Try asking: What can Manav build?",
  customQuestions: [],
};

const CHATBOT_REPLY_FIELDS = [
  ["intro", "INTRO / FIRST MESSAGE"],
  ["skills", "SKILLS ANSWER"],
  ["projects", "PROJECTS ANSWER"],
  ["futureProjects", "UPCOMING PROJECTS ANSWER"],
  ["qualification", "QUALIFICATIONS ANSWER"],
  ["socials", "SOCIALS / FUTURE UPDATES ANSWER"],
  ["contact", "CONTACT ANSWER"],
  ["fallback", "FALLBACK ANSWER"],
];

const ICONS = ["🧠","🤖","🐍","⚛️","🗄️","☁️","👁️","⚙️","🔧","🎨","📱","🔒","🌐","📊","🚀","💡","🎯","🛠️","📦","⚡","🦀","☕","🐳","☸️","🍃","🐿️","🔥","🌊","💎","🐬","💚","❤️","🐧","🌟"];

let adminUsername = "";
let adminPassword = "";

/* ── styles ── */
const storage = {
  async get(key, password) {
    if (typeof window !== "undefined" && window.storage) return window.storage.get(key);
    const response = await fetch(apiUrl(`/api/storage?key=${encodeURIComponent(key)}`), {
      headers: {
        "x-admin-username": adminUsername || "",
        "x-admin-password": password || adminPassword || ""
      },
    });
    if (!response.ok) throw new Error("Could not load saved data.");
    return response.status === 204 ? null : response.json();
  },
  async set(key, value, password) {
    if (typeof window !== "undefined" && window.storage) return window.storage.set(key, value);
    const response = await fetch(apiUrl("/api/storage"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-username": adminUsername || "",
        "x-admin-password": password || adminPassword || "",
      },
      body: JSON.stringify({ key, value }),
    });
    if (!response.ok) throw new Error("Could not save data.");
  }
};

const S = {
  root: { minHeight:"100vh", background:"#03090b", color:"#e0f7fa", fontFamily:"'Rajdhani',sans-serif", padding:0 },
  login: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"radial-gradient(circle at center, #0a2530 0%, #020709 100%)", padding:"1.5rem" },
  loginBox: { background:"rgba(0, 20, 28, 0.65)", border:"1px solid rgba(0, 229, 255, 0.2)", borderRadius:24, padding:"3rem 2.2rem", width:"100%", maxWidth:400, backdropFilter:"blur(20px)", boxShadow:"0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,229,255,0.05)" },
  loginLogoContainer: { display:"flex", justifyContent:"center", marginBottom:"1.2rem" },
  loginLogo: { width:80, height:80, borderRadius:"50%", border:"2px solid rgba(0, 229, 255, 0.35)", padding:4, background:"rgba(0, 20, 28, 0.6)", boxShadow:"0 0 20px rgba(0, 229, 255, 0.2)", objectFit:"contain" },
  loginTitle: { fontFamily:"'Orbitron',monospace", fontSize:"1.6rem", fontWeight:900, background:"linear-gradient(90deg,#00e5ff,#1a6cf5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", textAlign:"center", marginBottom:".3rem", letterSpacing:".05em" },
  loginSub: { color:"#4a7a82", fontSize:".85rem", textAlign:"center", marginBottom:"2rem", letterSpacing:".05em", fontWeight:600 },
  inputContainer: { position:"relative", marginBottom:"1.2rem" },
  inputLabel: { display:"block", fontFamily:"'Orbitron',monospace", fontSize:".68rem", fontWeight:800, color:"#00e5ff", letterSpacing:".1em", marginBottom:".4rem", textTransform:"uppercase" },
  input: (focused) => ({ width:"100%", background: focused ? "rgba(0,25,35,0.75)" : "rgba(0,12,18,0.5)", border: focused ? "1px solid #00e5ff" : "1px solid rgba(0,229,255,0.18)", borderRadius:8, padding:".8rem 1rem", color:"#e0f7fa", fontSize:".92rem", outline:"none", fontFamily:"inherit", transition:"all 0.25s ease", boxSizing:"border-box", boxShadow: focused ? "0 0 12px rgba(0,229,255,0.2)" : "none" }),
  loginBtn: (hovered) => ({ width:"100%", background: hovered ? "linear-gradient(90deg,#33f0ff,#3b82f6)" : "linear-gradient(90deg,#00e5ff,#1a6cf5)", color:"#000", border:"none", borderRadius:30, padding:".9rem", fontWeight:900, fontSize:"1rem", cursor:"pointer", fontFamily:"'Orbitron',monospace", letterSpacing:".1em", transition:"all 0.3s ease", transform: hovered ? "translateY(-2px)" : "none", boxShadow: hovered ? "0 6px 20px rgba(0,229,255,0.4)" : "0 4px 12px rgba(0,229,255,0.15)" }),
  err: { color:"#ff5a6a", fontSize:".8rem", textAlign:"center", marginTop:".8rem", fontWeight:600 },

  nav: { background:"rgba(0,10,15,0.95)", borderBottom:"1px solid rgba(0,229,255,0.15)", padding:"1rem 2rem", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(16px)" },
  navTitle: { fontFamily:"'Orbitron',monospace", fontSize:"1rem", fontWeight:800, background:"linear-gradient(90deg,#00e5ff,#1a6cf5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
  navBtns: { display:"flex", gap:"0.5rem" },
  tabBtn: (active) => ({ background: active ? "linear-gradient(135deg,#00e5ff,#1a6cf5)" : "rgba(0,229,255,0.07)", color: active ? "#000" : "#00e5ff", border: active ? "none" : "1px solid rgba(0,229,255,0.2)", borderRadius:50, padding:".45rem 1.1rem", cursor:"pointer", fontWeight:700, fontSize:".8rem", fontFamily:"inherit", transition:"all .2s" }),
  logoutBtn: { background:"rgba(255,90,106,0.1)", color:"#ff5a6a", border:"1px solid rgba(255,90,106,0.3)", borderRadius:50, padding:".45rem 1rem", cursor:"pointer", fontSize:".8rem", fontFamily:"inherit" },
  visitBtn: { background:"rgba(0,229,255,0.1)", color:"#00e5ff", border:"1px solid rgba(0,229,255,0.3)", borderRadius:50, padding:".45rem 1.1rem", cursor:"pointer", fontSize:".8rem", fontFamily:"inherit", textDecoration:"none", display:"inline-flex", alignItems:"center" },

  main: { padding:"1.5rem", maxWidth:900, margin:"0 auto" },
  pageTitle: { fontFamily:"'Orbitron',monospace", fontSize:"1.45rem", fontWeight:800, color:"#00e5ff", marginBottom:".3rem", letterSpacing:"0.03em" },
  pageSub: { color:"#4a7a82", fontSize:".88rem", marginBottom:"1.8rem", fontWeight:500 },

  statsRow: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:"1.2rem", marginBottom:"2rem" },
  statCard: (color) => ({ background:"rgba(0,20,28,0.75)", border:"1px solid rgba(0,229,255,0.15)", borderLeft:`3.5px solid ${color}`, borderRadius:16, padding:"1.4rem", transition:"all 0.3s ease", backdropFilter:"blur(15px)" }),
  statNum: (color) => ({ fontSize:"2.2rem", fontWeight:800, color, fontFamily:"'Orbitron',monospace", lineHeight:1 }),
  statLabel: { color:"#4a7a82", fontSize:"0.82rem", fontWeight:600, marginTop:"0.4rem", textTransform:"uppercase", letterSpacing:"0.05em" },

  msgList: { display:"flex", flexDirection:"column", gap:".8rem" },
  msgCard: (read) => ({ background: read ? "rgba(0,15,22,0.6)" : "rgba(0,229,255,0.04)", border: `1px solid ${read ? "rgba(255,255,255,0.06)" : "rgba(0,229,255,0.25)"}`, borderRadius:16, padding:"1.4rem 1.6rem", cursor:"pointer", transition:"all .2s", position:"relative" }),
  msgTop: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"1rem", marginBottom:".5rem" },
  msgName: { fontWeight:700, fontSize:"1.05rem", color:"#e0f7fa" },
  msgEmail: { color:"#00e5ff", fontSize:".85rem", fontWeight:600 },
  msgSubject: { color:"#e0f7fa", fontSize:".92rem", marginBottom:".4rem", fontWeight:700 },
  msgBody: { color:"#7a9aa0", fontSize:".9rem", lineHeight:1.6, fontWeight:500 },
  msgDate: { color:"#4a7a82", fontSize:".78rem", flexShrink:0, fontWeight:600 },
  unreadDot: { position:"absolute", top:"1.2rem", right:"1.2rem", width:8, height:8, borderRadius:"50%", background:"#00e5ff", boxShadow:"0 0 8px #00e5ff" },
  noMsg: { textAlign:"center", color:"#4a7a82", padding:"3rem", fontSize:".95rem", fontWeight:600 },
  delBtn: { background:"rgba(255,90,106,0.1)", color:"#ff5a6a", border:"1px solid rgba(255,90,106,0.25)", borderRadius:6, padding:".35rem .9rem", cursor:"pointer", fontSize:".78rem", fontFamily:"inherit", marginTop:".6rem", fontWeight:600 },
  markBtn: { background:"rgba(0,229,255,0.1)", color:"#00e5ff", border:"1px solid rgba(0,229,255,0.25)", borderRadius:6, padding:".35rem .9rem", cursor:"pointer", fontSize:".78rem", fontFamily:"inherit", marginTop:".6rem", marginRight:".5rem", fontWeight:600 },

  skillsGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:"1.2rem", marginBottom:"2rem" },
  skillCard: { background:"rgba(0,20,28,0.75)", border:"1px solid rgba(0,229,255,0.15)", borderRadius:16, padding:"1.5rem", display:"flex", flexDirection:"column", gap:"0.6rem", position:"relative", backdropFilter:"blur(15px)" },
  skillIcon: { fontSize:"2rem" },
  skillName: { fontWeight:700, fontSize:"1.08rem" },
  skillTags: { display:"flex", flexWrap:"wrap", gap:".3rem" },
  tag: { background:"rgba(0,229,255,0.08)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:20, padding:".18rem .6rem", fontSize:".72rem", color:"#00b4cc", fontWeight:600 },
  skillDelBtn: { position:"absolute", top:".7rem", right:".7rem", background:"rgba(255,90,106,0.12)", color:"#ff5a6a", border:"1px solid rgba(255,90,106,0.2)", borderRadius:6, padding:".2rem .6rem", cursor:"pointer", fontSize:".72rem", fontFamily:"inherit" },

  addBox: { background:"rgba(0,20,28,0.75)", border:"1px solid rgba(0,229,255,0.25)", borderRadius:16, padding:"1.8rem", marginBottom:"2rem", backdropFilter:"blur(15px)", boxShadow:"0 10px 30px rgba(0,0,0,0.2)" },
  addTitle: { fontFamily:"'Orbitron',monospace", fontSize:".8rem", color:"#00e5ff", letterSpacing:".12em", marginBottom:"1.2rem", fontWeight:800 },
  addRow: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:".8rem", alignItems:"end" },
  addInput: { background:"rgba(0,30,40,0.8)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:8, padding:".75rem 1rem", color:"#e0f7fa", fontSize:".9rem", outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box", minWidth:0 },
  iconSel: { background:"rgba(0,30,40,0.9)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:8, padding:".6rem", display:"flex", flexWrap:"wrap", gap:".35rem", maxHeight:110, overflowY:"auto", marginBottom:".8rem" },
  iconOpt: (sel) => ({ fontSize:"1.4rem", padding:".35rem", borderRadius:6, cursor:"pointer", background: sel ? "rgba(0,229,255,0.2)" : "transparent", border: sel ? "1px solid #00e5ff" : "1px solid transparent" }),
  addBtn: { background:"linear-gradient(135deg,#00e5ff,#1a6cf5)", color:"#000", border:"none", borderRadius:50, padding:".75rem 1.8rem", fontWeight:800, cursor:"pointer", fontFamily:"'Orbitron',monospace", fontSize:".75rem", letterSpacing:".08em", whiteSpace:"nowrap" },
  tagsInput: { background:"rgba(0,30,40,0.8)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:8, padding:".75rem 1rem", color:"#e0f7fa", fontSize:".9rem", outline:"none", fontFamily:"inherit", width:"100%" },
  fieldLabel: { fontSize:".78rem", color:"#00e5ff", letterSpacing:".1em", marginBottom:".4rem", fontFamily:"'Orbitron',monospace", fontWeight:700 },
  formGrid2: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:".8rem", marginBottom:".8rem" },
  formGrid4: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:".8rem", marginBottom:".8rem" },
  actionRow: { display:"flex", alignItems:"center", gap:".8rem", flexWrap:"wrap" },
  cardActions: { display:"flex", gap:".4rem", flexShrink:0, flexWrap:"wrap", justifyContent:"flex-end" },
  editBtn: { background:"rgba(0,229,255,0.1)", color:"#00e5ff", border:"1px solid rgba(0,229,255,0.25)", borderRadius:6, padding:".35rem .9rem", cursor:"pointer", fontSize:".78rem", fontFamily:"inherit", fontWeight:600 },
  removeBtn: { background:"rgba(255,90,106,0.12)", color:"#ff5a6a", border:"1px solid rgba(255,90,106,0.2)", borderRadius:6, padding:".35rem .9rem", cursor:"pointer", fontSize:".78rem", fontFamily:"inherit", fontWeight:600 },
  cancelBtn: { background:"rgba(255,255,255,0.08)", color:"#e0f7fa", border:"1px solid rgba(255,255,255,0.2)", borderRadius:50, padding:".75rem 1.6rem", fontWeight:800, cursor:"pointer", fontFamily:"'Orbitron',monospace", fontSize:".75rem", letterSpacing:".08em" },
  chartBox: { background: "rgba(0, 20, 28, 0.75)", border: "1px solid rgba(0, 229, 255, 0.15)", borderRadius: 16, padding: "1.5rem", boxShadow: "0 15px 35px rgba(0,0,0,0.3)", backdropFilter:"blur(15px)" },
  chartTitle: { fontFamily: "'Orbitron', monospace", fontSize: ".8rem", color: "#00e5ff", letterSpacing: ".08em", marginBottom: "1.2rem", fontWeight: 800 },
};

export default function AdminPanel() {
  const [authed, setAuthed]   = useState(false);
  const [username, setUsername] = useState("");
  const [pw, setPw]           = useState("");
  const [pwErr, setPwErr]     = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [tab, setTab]         = useState("dashboard");
  const [messages, setMessages] = useState([]);
  const [skills, setSkills]   = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [chatbotReplies, setChatbotReplies] = useState(DEFAULT_CHATBOT_REPLIES);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [newSkill, setNewSkill] = useState({ icon:"🚀", name:"", tags:"" });
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({ role:"", org:"", desc:"", badge:"" });
  const [editingExperience, setEditingExperience] = useState(null);
  const [newQualification, setNewQualification] = useState({ role:"", org:"", desc:"", badge:"" });
  const [newCertification, setNewCertification] = useState({ icon:"🏆", name:"", org:"", badge:"" });
  const [newProject, setNewProject] = useState({ title:"", desc:"", thumb:"", tags:"", demo:"", github:"" });
  const [newChatbotQuestion, setNewChatbotQuestion] = useState({ question:"", answer:"" });
  const [editingQualification, setEditingQualification] = useState(null);
  const [editingCertification, setEditingCertification] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [team, setTeam] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", age: "", qualification: "", role: "", dateOfHire: "", avatar: "👨‍💻" });
  const [editingMember, setEditingMember] = useState(null);
  const [iconOpen, setIconOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wakaData, setWakaData] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("admin_username");
    const savedPw = localStorage.getItem("admin_password");
    if (savedUser && savedPw) {
      adminUsername = savedUser;
      adminPassword = savedPw;
      setUsername(savedUser);
      setPw(savedPw);
      setAuthed(true);
    }
  }, []);

  /* ── load data ── */
  useEffect(() => {
    if (!authed) return;
    (async () => {
      setLoading(true);
      try {
        const [mRes, sRes, qRes, expRes, cRes, pRes, botRes, revRes, teamRes] = await Promise.all([
          storage.get('contact_messages', pw).catch(() => null),
          storage.get('portfolio_skills', pw).catch(() => null),
          storage.get('portfolio_qualifications', pw).catch(() => null),
          storage.get('portfolio_workexperience', pw).catch(() => null),
          storage.get('portfolio_certifications', pw).catch(() => null),
          storage.get('portfolio_projects', pw).catch(() => null),
          storage.get('portfolio_chatbot', pw).catch(() => null),
          storage.get('portfolio_reviews', pw).catch(() => null),
          storage.get('portfolio_team', pw).catch(() => null),
        ]);

        if (mRes && mRes.value) {
          setMessages(JSON.parse(mRes.value));
        } else {
          setMessages([]);
        }

        if (teamRes && teamRes.value) {
          setTeam(JSON.parse(teamRes.value));
        } else {
          setTeam([]);
        }

        if (sRes && sRes.value) {
          let parsedSkills = JSON.parse(sRes.value);
          if (Array.isArray(parsedSkills) && parsedSkills.length > 0) {
            setSkills(parsedSkills);
          } else {
            setSkills(DEFAULT_SKILLS);
            storage.set('portfolio_skills', JSON.stringify(DEFAULT_SKILLS), pw).catch(() => {});
          }
        } else {
          setSkills(DEFAULT_SKILLS);
          storage.set('portfolio_skills', JSON.stringify(DEFAULT_SKILLS), pw).catch(() => {});
        }

        if (qRes && qRes.value) {
          setQualifications(JSON.parse(qRes.value));
        } else {
          setQualifications(DEFAULT_QUALIFICATIONS);
          storage.set('portfolio_qualifications', JSON.stringify(DEFAULT_QUALIFICATIONS), pw).catch(() => {});
        }

        if (expRes && expRes.value) {
          const parsed = JSON.parse(expRes.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setExperiences(parsed);
          } else {
            setExperiences(DEFAULT_EXPERIENCE);
            storage.set('portfolio_workexperience', JSON.stringify(DEFAULT_EXPERIENCE), pw).catch(() => {});
          }
        } else {
          setExperiences(DEFAULT_EXPERIENCE);
          storage.set('portfolio_workexperience', JSON.stringify(DEFAULT_EXPERIENCE), pw).catch(() => {});
        }

        if (cRes && cRes.value) {
          setCertifications(JSON.parse(cRes.value));
        } else {
          setCertifications(DEFAULT_CERTIFICATIONS);
          storage.set('portfolio_certifications', JSON.stringify(DEFAULT_CERTIFICATIONS), pw).catch(() => {});
        }

        if (pRes && pRes.value) {
          setProjects(JSON.parse(pRes.value));
        } else {
          setProjects(DEFAULT_PROJECTS);
          storage.set('portfolio_projects', JSON.stringify(DEFAULT_PROJECTS), pw).catch(() => {});
        }

        if (botRes && botRes.value) {
          setChatbotReplies({ ...DEFAULT_CHATBOT_REPLIES, ...JSON.parse(botRes.value) });
        } else {
          setChatbotReplies(DEFAULT_CHATBOT_REPLIES);
          storage.set('portfolio_chatbot', JSON.stringify(DEFAULT_CHATBOT_REPLIES), pw).catch(() => {});
        }

        if (revRes && revRes.value) {
          setReviews(JSON.parse(revRes.value));
        } else {
          const defaultReviews = [
            {
              id: "1",
              name: "Dr. Rajesh Kumar",
              role: "Professor of Computer Science, DU",
              rating: 5,
              text: "Manav is an exceptionally brilliant student. His dedication to learning generative AI tools and full-stack architecture is outstanding.",
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              approved: true,
              avatar: "👨‍🏫"
            },
            {
              id: "2",
              name: "Sarah Jenkins",
              role: "Tech Recruiter",
              rating: 5,
              text: "Visited Manav's portfolio and was blown away by the 3D graphics and active chatbot clone. A top-tier developer indeed!",
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              approved: true,
              avatar: "👩‍💻"
            }
          ];
          setReviews(defaultReviews);
          storage.set('portfolio_reviews', JSON.stringify(defaultReviews), pw).catch(() => {});
        }

        // Load WakaTime async
        fetch(apiUrl('/api/wakatime'))
          .then(res => res.ok ? res.json() : null)
          .then(data => { if (data) setWakaData(data); })
          .catch(() => {});
      } catch (err) {
        console.error("Error loading data in parallel:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [authed]);

  /* ── save skills ── */
  const saveSkills = async (updated) => {
    setSkills(updated);
    try { await storage.set('portfolio_skills', JSON.stringify(updated), pw); } catch {}
  };

  /* ── save messages ── */
  const saveQualifications = async (updated) => {
    setQualifications(updated);
    try { await storage.set('portfolio_qualifications', JSON.stringify(updated), pw); } catch {}
  };

  const saveExperiences = async (updated) => {
    setExperiences(updated);
    try { await storage.set('portfolio_workexperience', JSON.stringify(updated), pw); } catch {}
  };

  const saveCertifications = async (updated) => {
    setCertifications(updated);
    try { await storage.set('portfolio_certifications', JSON.stringify(updated), pw); } catch {}
  };

  const saveProjects = async (updated) => {
    setProjects(updated);
    try { await storage.set('portfolio_projects', JSON.stringify(updated), pw); } catch {}
  };

  const saveChatbotReplies = async (updated) => {
    setChatbotReplies(updated);
    try { await storage.set('portfolio_chatbot', JSON.stringify(updated), pw); } catch {}
  };

  const saveMsgs = async (updated) => {
    setMessages(updated);
    try { await storage.set('contact_messages', JSON.stringify(updated), pw); } catch {}
  };

  const saveReviews = async (updated) => {
    setReviews(updated);
    try { await storage.set('portfolio_reviews', JSON.stringify(updated), pw); } catch {}
  };

  /* ── team actions ── */
  const saveTeam = async (updated) => {
    setTeam(updated);
    try { await storage.set('portfolio_team', JSON.stringify(updated), pw); } catch {}
  };

  const addTeamMember = async () => {
    if (!newMember.name || !newMember.role) return;
    const added = [...team, { ...newMember, id: Date.now().toString() }];
    await saveTeam(added);
    setNewMember({ name: "", age: "", qualification: "", role: "", dateOfHire: "", avatar: "👨‍💻" });
  };

  const deleteTeamMember = async (id) => {
    const updated = team.filter(m => m.id !== id);
    await saveTeam(updated);
    if (editingMember && editingMember.id === id) setEditingMember(null);
  };

  const startEditMember = (member) => {
    setEditingMember({ ...member });
  };

  const saveEditMember = async () => {
    if (!editingMember.name || !editingMember.role) return;
    const updated = team.map(m => m.id === editingMember.id ? editingMember : m);
    await saveTeam(updated);
    setEditingMember(null);
  };

  const toggleResignMember = async (id) => {
    const updated = team.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === "Resigned" ? "Active" : "Resigned" };
      }
      return m;
    });
    await saveTeam(updated);
  };

  const approveReview = async (id) => {
    const updated = reviews.map(r => r.id === id ? { ...r, approved: true } : r);
    await saveReviews(updated);
  };

  const disapproveReview = async (id) => {
    const updated = reviews.map(r => r.id === id ? { ...r, approved: false } : r);
    await saveReviews(updated);
  };

  const deleteReview = async (id) => {
    const updated = reviews.filter(r => r.id !== id);
    await saveReviews(updated);
  };

  /* ── login ── */
  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl("/api/auth"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-username": username,
          "x-admin-password": pw,
        },
        body: JSON.stringify({ username, password: pw }),
      });
      if (response.ok) {
        adminUsername = username;
        adminPassword = pw;
        localStorage.setItem("admin_username", username);
        localStorage.setItem("admin_password", pw);
        setAuthed(true);
        setPwErr("");
        return;
      }
      setPwErr("Wrong username or password");
    } catch {
      setPwErr("Wrong username or password");
    }
  };

  /* ── message actions ── */
  const markRead = async (id) => {
    const updated = messages.map(m => m.id === id ? {...m, read:true} : m);
    await saveMsgs(updated);
  };
  const deleteMsg = async (id) => {
    const updated = messages.filter(m => m.id !== id);
    await saveMsgs(updated);
    if (expanded === id) setExpanded(null);
  };
  const deleteAllRead = async () => {
    const updated = messages.filter(m => !m.read);
    await saveMsgs(updated);
  };

  /* ── skill actions ── */
  const deleteSkill = async (id) => {
    await saveSkills(skills.filter(s => s.id !== id));
  };
  const addSkill = async () => {
    if (!newSkill.name.trim()) return;
    const s = {
      id: Date.now().toString(),
      icon: newSkill.icon,
      name: newSkill.name.trim(),
      tags: newSkill.tags.split(',').map(t=>t.trim()).filter(Boolean)
    };
    await saveSkills([...skills, s]);
    setNewSkill({ icon:"🚀", name:"", tags:"" });
    setIconOpen(false);
  };

  const addQualification = async () => {
    if (!newQualification.role.trim()) return;
    const q = {
      id: Date.now().toString(),
      role: newQualification.role.trim(),
      org: newQualification.org.trim(),
      desc: newQualification.desc.trim(),
      badge: newQualification.badge.trim()
    };
    await saveQualifications([...qualifications, q]);
    setNewQualification({ role:"", org:"", desc:"", badge:"" });
  };

  const addExperience = async () => {
    if (!newExperience.role.trim()) return;
    const exp = {
      id: Date.now().toString(),
      role: newExperience.role.trim(),
      org: newExperience.org.trim(),
      desc: newExperience.desc.trim(),
      badge: newExperience.badge.trim()
    };
    await saveExperiences([...experiences, exp]);
    setNewExperience({ role:"", org:"", desc:"", badge:"" });
  };

  const deleteExperience = async (id) => {
    await saveExperiences(experiences.filter(e => e.id !== id));
    if (editingExperience?.id === id) setEditingExperience(null);
  };

  const startEditExperience = (exp) => {
    setEditingExperience({
      id: exp.id,
      role: exp.role || "",
      org: exp.org || "",
      desc: exp.desc || "",
      badge: exp.badge || "",
    });
  };

  const saveEditExperience = async () => {
    if (!editingExperience?.role?.trim()) return;
    const updated = experiences.map(e =>
      e.id === editingExperience.id
        ? {
            ...e,
            role: editingExperience.role.trim(),
            org: editingExperience.org.trim(),
            desc: editingExperience.desc.trim(),
            badge: editingExperience.badge.trim(),
          }
        : e
    );
    await saveExperiences(updated);
    setEditingExperience(null);
  };

  const deleteQualification = async (id) => {
    await saveQualifications(qualifications.filter(q => q.id !== id));
    if (editingQualification?.id === id) setEditingQualification(null);
  };

  const startEditQualification = (q) => {
    setEditingQualification({
      id: q.id,
      role: q.role || "",
      org: q.org || "",
      desc: q.desc || "",
      badge: q.badge || "",
    });
  };

  const saveEditQualification = async () => {
    if (!editingQualification?.role?.trim()) return;
    const updated = qualifications.map(q =>
      q.id === editingQualification.id
        ? {
            ...q,
            role: editingQualification.role.trim(),
            org: editingQualification.org.trim(),
            desc: editingQualification.desc.trim(),
            badge: editingQualification.badge.trim(),
          }
        : q
    );
    await saveQualifications(updated);
    setEditingQualification(null);
  };

  const addCertification = async () => {
    if (!newCertification.name.trim()) return;
    const c = {
      id: Date.now().toString(),
      icon: newCertification.icon || "🏆",
      name: newCertification.name.trim(),
      org: newCertification.org.trim(),
      badge: newCertification.badge.trim()
    };
    await saveCertifications([...certifications, c]);
    setNewCertification({ icon:"🏆", name:"", org:"", badge:"" });
  };

  const deleteCertification = async (id) => {
    await saveCertifications(certifications.filter(c => c.id !== id));
    if (editingCertification?.id === id) setEditingCertification(null);
  };

  const startEditCertification = (c) => {
    setEditingCertification({
      id: c.id,
      icon: c.icon || "🏆",
      name: c.name || "",
      org: c.org || "",
      badge: c.badge || "",
    });
  };

  const saveEditCertification = async () => {
    if (!editingCertification?.name?.trim()) return;
    const updated = certifications.map(c =>
      c.id === editingCertification.id
        ? {
            ...c,
            icon: editingCertification.icon.trim() || "🏆",
            name: editingCertification.name.trim(),
            org: editingCertification.org.trim(),
            badge: editingCertification.badge.trim(),
          }
        : c
    );
    await saveCertifications(updated);
    setEditingCertification(null);
  };

  const addProject = async () => {
    if (!newProject.title.trim()) return;
    const p = {
      id: Date.now().toString(),
      title: newProject.title.trim(),
      desc: newProject.desc.trim(),
      thumb: newProject.thumb.trim(),
      tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean),
      demo: newProject.demo.trim() || '#',
      github: newProject.github.trim() || '#',
    };
    await saveProjects([...projects, p]);
    setNewProject({ title:"", desc:"", thumb:"", tags:"", demo:"", github:"" });
  };

  const deleteProject = async (id) => {
    await saveProjects(projects.filter(p => p.id !== id));
    if (editingProject?.id === id) setEditingProject(null);
  };

  const startEditProject = (proj) => {
    setEditingProject({
      id: proj.id,
      title: proj.title,
      desc: proj.desc,
      thumb: proj.thumb || '',
      tags: (proj.tags || []).join(', '),
      demo: proj.demo || '',
      github: proj.github || '',
    });
  };

  const saveEditProject = async () => {
    if (!editingProject?.title?.trim()) return;
    const updated = projects.map(p =>
      p.id === editingProject.id
        ? {
            ...p,
            title: editingProject.title.trim(),
            desc: editingProject.desc.trim(),
            thumb: editingProject.thumb.trim(),
            tags: editingProject.tags.split(',').map(t => t.trim()).filter(Boolean),
            demo: editingProject.demo.trim() || '#',
            github: editingProject.github.trim() || '#',
          }
        : p
    );
    await saveProjects(updated);
    setEditingProject(null);
  };

  const updateChatbotReply = (key, value) => {
    setChatbotReplies(prev => ({ ...prev, [key]: value }));
  };

  const addChatbotQuestion = async () => {
    const question = newChatbotQuestion.question.trim();
    const answer = newChatbotQuestion.answer.trim();
    if (!question || !answer) return;
    const updated = {
      ...chatbotReplies,
      customQuestions: [
        ...(Array.isArray(chatbotReplies.customQuestions) ? chatbotReplies.customQuestions : []),
        { id: Date.now().toString(), question, answer },
      ],
    };
    await saveChatbotReplies(updated);
    setNewChatbotQuestion({ question:"", answer:"" });
  };

  const deleteChatbotQuestion = async (id) => {
    const updated = {
      ...chatbotReplies,
      customQuestions: (chatbotReplies.customQuestions || []).filter(item => item.id !== id),
    };
    await saveChatbotReplies(updated);
  };

  const saveChatbotFromEditor = async () => {
    const cleaned = {
      ...Object.fromEntries(
        CHATBOT_REPLY_FIELDS.map(([key]) => [key, String(chatbotReplies[key] || DEFAULT_CHATBOT_REPLIES[key] || "").trim()])
      ),
      customQuestions: (chatbotReplies.customQuestions || [])
        .map(item => ({
          id: item.id || Date.now().toString(),
          question: String(item.question || "").trim(),
          answer: String(item.answer || "").trim(),
        }))
        .filter(item => item.question && item.answer),
    };
    await saveChatbotReplies(cleaned);
  };

  const resetChatbotReplies = async () => {
    await saveChatbotReplies(DEFAULT_CHATBOT_REPLIES);
  };

  const unread = messages.filter(m => !m.read).length;
  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) + ' · ' + d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  };

  /* ─────── LOGIN SCREEN ─────── */
  if (!authed) return (
    <div style={S.login}>
      <div style={S.loginBox}>
        <div style={S.loginLogoContainer}>
          <img style={S.loginLogo} src="/Photos/logobg.png" alt="Manav Tiwari Logo" />
        </div>
        <div style={S.loginTitle}>ADMIN PANEL</div>
        <div style={S.loginSub}>Code with Manav · Secure Access</div>
        <form onSubmit={login}>
          <div style={S.inputContainer}>
            <label style={S.inputLabel}>Admin Username</label>
            <input
              style={S.input(focusedField === "username")}
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField(null)}
              autoFocus
              required
            />
          </div>
          <div style={S.inputContainer}>
            <label style={S.inputLabel}>Admin Password</label>
            <input
              style={S.input(focusedField === "password")}
              type="password"
              placeholder="Enter admin password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              required
            />
          </div>
          <button
            style={S.loginBtn(isBtnHovered)}
            type="submit"
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
          >
            ACCESS PANEL →
          </button>
          {pwErr && <div style={S.err}>{pwErr}</div>}
        </form>
      </div>
    </div>
  );

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "messages", label: "Messages", icon: "📬", count: unread, badgeColor: "#00e5ff" },
    { id: "projects", label: "Projects", icon: "🚀" },
    { id: "skills", label: "Skills", icon: "🛠️" },
    { id: "experience", label: "Work Experience", icon: "💼" },
    { id: "qualifications", label: "Qualifications", icon: "🎓" },
    { id: "certifications", label: "Certifications", icon: "🏆" },
    { id: "chatbot", label: "Manav AI", icon: "🤖" },
    { id: "reviews", label: "Reviews", icon: "⭐", count: reviews.filter(r => !r.approved).length, badgeColor: "#ff007f" },
    { id: "team", label: "Team Members", icon: "👥" }
  ];

  /* ─────── MAIN PANEL ─────── */
  return (
    <div style={{
      ...S.root,
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      minHeight: "100vh"
    }}>
      {/* Global CSS Style Block */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;800;900&family=Rajdhani:wght@500;600;700&display=swap');

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(1, 10, 15, 0.4);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 229, 255, 0.25);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 229, 255, 0.5);
        }

        .glass-panel {
          background: rgba(0, 20, 28, 0.55) !important;
          border: 1px solid rgba(0, 229, 255, 0.12) !important;
          border-radius: 16px !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37) !important;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }

        .glass-panel:hover {
          border-color: rgba(0, 229, 255, 0.35) !important;
          box-shadow: 0 12px 40px 0 rgba(0, 229, 255, 0.08), 0 8px 32px 0 rgba(0, 0, 0, 0.4) !important;
          transform: translateY(-2px) !important;
        }

        .sidebar-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 11px 16px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 12px;
          color: #a0c2cd;
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.98rem;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          outline: none;
        }

        .sidebar-btn:hover {
          color: #00e5ff;
          background: rgba(0, 229, 255, 0.06);
          border-color: rgba(0, 229, 255, 0.1);
          transform: translateX(4px);
        }

        .sidebar-btn.active {
          color: #000000;
          background: linear-gradient(135deg, #00e5ff, #1a6cf5);
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);
        }

        .sidebar-btn.active:hover {
          transform: none;
        }

        .status-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00ff87;
          box-shadow: 0 0 8px #00ff87;
          display: inline-block;
          animation: pulse-green 2s infinite;
        }

        @keyframes pulse-green {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 255, 135, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(0, 255, 135, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 255, 135, 0);
          }
        }

        .btn-glow {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-glow::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 20%;
          height: 200%;
          background: rgba(255, 255, 255, 0.25);
          transform: rotate(30deg);
          transition: all 0.5s ease;
          opacity: 0;
        }

        .btn-glow:hover::after {
          left: 120%;
          opacity: 1;
        }

        .glow-card {
          transition: all 0.3s ease !important;
        }

        .glow-card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 10px 25px rgba(0, 229, 255, 0.15) !important;
        }
      `}</style>

      {/* MOBILE TOP HEADER BAR */}
      {isMobile && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          background: "rgba(3, 9, 11, 0.95)",
          borderBottom: "1px solid rgba(0, 229, 255, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.2rem",
          zIndex: 999,
          backdropFilter: "blur(12px)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/Photos/logobg.png" alt="Logo" style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(0, 229, 255, 0.3)" }} />
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.9rem", fontWeight: 800, color: "#00e5ff", letterSpacing: "0.05em" }}>MANAV PORTFOLIO</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "rgba(0, 229, 255, 0.08)",
              border: "1px solid rgba(0, 229, 255, 0.25)",
              color: "#00e5ff",
              borderRadius: "6px",
              padding: "0.4rem 0.8rem",
              fontFamily: "inherit",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
          </button>
        </div>
      )}

      {/* LEFT SIDEBAR (Desktop) OR OVERLAY DRAWER (Mobile) */}
      <div style={{
        width: isMobile ? "280px" : "260px",
        background: "rgba(1, 10, 15, 0.88)",
        borderRight: isMobile ? "none" : "1px solid rgba(0, 229, 255, 0.12)",
        display: "flex",
        flexDirection: "column",
        height: isMobile ? "100vh" : "auto",
        position: isMobile ? "fixed" : "sticky",
        top: 0,
        left: isMobile ? (mobileMenuOpen ? "0" : "-280px") : "0",
        bottom: 0,
        zIndex: 1000,
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        backdropFilter: "blur(25px)",
        WebkitBackdropFilter: "blur(25px)",
        padding: "1.8rem 1.2rem",
        boxSizing: "border-box"
      }}>
        {/* Sidebar Header Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem", borderBottom: "1px solid rgba(0, 229, 255, 0.12)", paddingBottom: "1.5rem" }}>
          <img src="/Photos/logobg.png" alt="Logo" style={{ width: "42px", height: "42px", borderRadius: "50%", border: "2px solid rgba(0, 229, 255, 0.35)", boxShadow: "0 0 10px rgba(0,229,255,0.2)" }} />
          <div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "1.1rem", fontWeight: 800, color: "#00e5ff", letterSpacing: "0.03em" }}>MANAV T.</div>
            <div style={{ fontSize: "0.75rem", color: "#4a7a82", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}>
              <span className="status-pulse-dot"></span> Admin Active
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, overflowY: "auto", paddingRight: "4px" }}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-btn ${tab === item.id ? 'active' : ''}`}
              onClick={() => {
                setTab(item.id);
                if (isMobile) setMobileMenuOpen(false);
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.count > 0 && (
                <span style={{
                  background: item.badgeColor || "#00e5ff",
                  color: item.badgeColor === "#ff007f" ? "#fff" : "#000",
                  borderRadius: 10,
                  padding: "1px 6px",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  boxShadow: `0 0 8px ${item.badgeColor || "#00e5ff"}`
                }}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sidebar Footer Operations */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "1.5rem", borderTop: "1px solid rgba(0, 229, 255, 0.12)", paddingTop: "1.5rem" }}>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(0, 229, 255, 0.06)",
            border: "1px solid rgba(0, 229, 255, 0.18)",
            borderRadius: "10px",
            color: "#00e5ff",
            padding: "10px 14px",
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none",
            transition: "all 0.2s ease"
          }} className="btn-glow">
            <span>🌐</span> Visit Live Site
          </a>
          <button 
            onClick={() => {
              localStorage.removeItem("admin_username");
              localStorage.removeItem("admin_password");
              adminUsername = "";
              adminPassword = "";
              setAuthed(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255, 90, 106, 0.08)",
              border: "1px solid rgba(255, 90, 106, 0.22)",
              borderRadius: "10px",
              color: "#ff5a6a",
              padding: "10px 14px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease"
            }}
          >
            <span>🚪</span> Secure Logout
          </button>
        </div>
      </div>

      {/* MOBILE BACKDROP DRAWER OVERLAY */}
      {isMobile && mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(1, 6, 8, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 998,
            transition: "opacity 0.3s ease"
          }}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div style={{
        flex: 1,
        minWidth: 0,
        minHeight: "100vh",
        padding: isMobile ? "1.5rem" : "2.5rem 3.5rem",
        paddingTop: isMobile ? "5.5rem" : "2.5rem",
        boxSizing: "border-box",
        transition: "all 0.3s ease"
      }}>
        {loading ? (
          <div style={{textAlign:"center",padding:"3rem",color:"#4a7a82"}}>Loading...</div>
        ) : tab === "dashboard" ? (
          /* ─────── DASHBOARD TAB ─────── */
          <>
            <div style={S.pageTitle}>Dashboard Overview</div>
            <div style={S.pageSub}>Welcome back! Here is a summary of your developer portfolio metrics.</div>

            {/* METRICS ROW */}
            <div style={S.statsRow}>
              <div style={S.statCard("#00e5ff")} className="glow-card glass-panel">
                <div style={S.statNum("#00e5ff")}>{messages.length}</div>
                <div style={S.statLabel}>Total Messages</div>
              </div>
              <div style={S.statCard(unread > 0 ? "#ff007f" : "#00e5ff")} className="glow-card glass-panel">
                <div style={S.statNum(unread > 0 ? "#ff007f" : "#00e5ff")}>{unread}</div>
                <div style={S.statLabel}>Unread Messages</div>
              </div>
              <div style={S.statCard("#7b2fff")} className="glow-card glass-panel">
                <div style={S.statNum("#7b2fff")}>{skills.length}</div>
                <div style={S.statLabel}>Total Skills</div>
              </div>
              <div style={S.statCard("#00e5ff")} className="glow-card glass-panel">
                <div style={S.statNum("#00e5ff")}>{reviews.length}</div>
                <div style={S.statLabel}>Total Reviews</div>
              </div>
              <div style={S.statCard(reviews.filter(r => !r.approved).length > 0 ? "#ff007f" : "#00e5ff")} className="glow-card glass-panel">
                <div style={S.statNum(reviews.filter(r => !r.approved).length > 0 ? "#ff007f" : "#00e5ff")}>{reviews.filter(r => !r.approved).length}</div>
                <div style={S.statLabel}>Pending Reviews</div>
              </div>
              <div style={S.statCard("#f2c811")} className="glow-card glass-panel">
                <div style={S.statNum("#f2c811")}>
                  {messages.length > 0 
                    ? `${Math.round((messages.filter(m=>m.read).length / messages.length) * 100)}%` 
                    : "100%"}
                </div>
                <div style={S.statLabel}>Inbox Health</div>
              </div>
            </div>

            {/* CHARTS ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem", marginTop: "1rem" }}>
              
              {/* AREA CHART: Weekly Message Trend */}
              <div style={S.chartBox} className="glass-panel">
                <div style={S.chartTitle}>📬 CONTACT MESSAGES (LAST 7 DAYS)</div>
                {(() => {
                  const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d.toISOString().split("T")[0];
                  });

                  const messageCounts = last7Days.map(dateStr => {
                    return messages.filter(m => {
                      try {
                        const mDateStr = new Date(m.date).toISOString().split("T")[0];
                        return mDateStr === dateStr;
                      } catch {
                        return false;
                      }
                    }).length;
                  });

                  const maxVal = Math.max(...messageCounts, 3);
                  const chartHeight = 120;
                  const chartWidth = 500;
                  const padding = 30;
                  
                  const points = messageCounts.map((count, idx) => {
                    const x = padding + (idx * (chartWidth - 2 * padding)) / 6;
                    const y = chartHeight - padding - (count * (chartHeight - 2 * padding)) / maxVal;
                    return { x, y, count };
                  });

                  const linePath = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                  const areaPath = points.length > 0 
                    ? `${linePath} L ${points[points.length-1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z` 
                    : "";

                  return (
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: "100%", height: "auto" }}>
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {Array.from({ length: 4 }).map((_, idx) => {
                        const yVal = padding + (idx * (chartHeight - 2 * padding)) / 3;
                        return (
                          <line 
                            key={idx} 
                            x1={padding} 
                            y1={yVal} 
                            x2={chartWidth - padding} 
                            y2={yVal} 
                            stroke="rgba(74, 122, 130, 0.12)" 
                            strokeDasharray="3 3" 
                          />
                        );
                      })}
                      {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}
                      {linePath && <path d={linePath} fill="none" stroke="#00e5ff" strokeWidth="2.5" />}
                      {points.map((p, idx) => (
                        <g key={idx}>
                          <circle cx={p.x} cy={p.y} r="4" fill="#00e5ff" />
                          <circle cx={p.x} cy={p.y} r="7" fill="none" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="1" />
                          <text x={p.x} y={p.y - 10} fill="#b0d0d8" fontSize="9" textAnchor="middle" fontFamily="monospace">{p.count}</text>
                        </g>
                      ))}
                      {last7Days.map((dateStr, idx) => {
                        const x = padding + (idx * (chartWidth - 2 * padding)) / 6;
                        const dObj = new Date(dateStr);
                        const dayLabel = dObj.toLocaleDateString("en-US", { weekday: "short" });
                        return (
                          <text key={idx} x={x} y={chartHeight - 8} fill="#4a7a82" fontSize="9" textAnchor="middle" fontFamily="monospace">{dayLabel}</text>
                        );
                      })}
                    </svg>
                  );
                })()}
              </div>

              {/* DONUT CHART: Skill Categories */}
              <div style={S.chartBox} className="glass-panel">
                <div style={S.chartTitle}>🛠️ SKILL CATEGORY DISTRIBUTION</div>
                {(() => {
                  let catCounts = {
                    "AI & Data": 0,
                    "Languages": 0,
                    "Web Dev": 0,
                    "Tools": 0
                  };

                  skills.forEach(sk => {
                    const lowerName = sk.name.toLowerCase();
                    const tags = (sk.tags || []).map(t => t.toLowerCase());
                    
                    if (lowerName.includes("ai") || lowerName.includes("generative") || lowerName.includes("analysis") || lowerName.includes("power bi") || lowerName.includes("tableau") || tags.includes("openai api") || tags.includes("langchain") || tags.includes("llms") || tags.includes("claude api")) {
                      catCounts["AI & Data"]++;
                    } else if (lowerName.includes("python") || lowerName.includes("c++") || lowerName.includes("c") || lowerName.includes("javascript") || lowerName.includes("typescript") || lowerName.includes("java") || lowerName.includes("rust") || lowerName.includes("go") || lowerName.includes("golang")) {
                      catCounts["Languages"]++;
                    } else if (lowerName.includes("supabase") || lowerName.includes("firebase") || lowerName.includes("discord") || lowerName.includes("npm") || lowerName.includes("nodejs") || lowerName.includes("react") || lowerName.includes("nextjs") || lowerName.includes("flutter") || lowerName.includes("tailwindcss") || lowerName.includes("tailwind") || lowerName.includes("vue") || lowerName.includes("angular")) {
                      catCounts["Web Dev"]++;
                    } else {
                      catCounts["Tools"]++;
                    }
                  });

                  const totalSkills = skills.length;
                  const catData = Object.entries(catCounts).map(([cat, count]) => ({
                    name: cat,
                    count,
                    percent: totalSkills > 0 ? (count / totalSkills) * 100 : 0
                  }));

                  let accumulatedAngle = 0;
                  const radius = 50;
                  const cx = 80;
                  const cy = 80;
                  const circumference = 2 * Math.PI * radius; // 314.16

                  const colors = {
                    "AI & Data": "#00e5ff",
                    "Languages": "#7b2fff",
                    "Web Dev": "#ff007f",
                    "Tools": "#f2c811"
                  };

                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", minHeight: 120 }}>
                      <svg width="130" height="130" viewBox="0 0 160 160">
                        {totalSkills === 0 ? (
                          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(74, 122, 130, 0.2)" strokeWidth="18" />
                        ) : (
                          catData.map((d) => {
                            const strokeLength = (d.percent / 100) * circumference;
                            const strokeOffset = circumference - accumulatedAngle;
                            accumulatedAngle += strokeLength;
                            
                            return strokeLength > 0 ? (
                              <circle
                                key={d.name}
                                cx={cx}
                                cy={cy}
                                r={radius}
                                fill="none"
                                stroke={colors[d.name]}
                                strokeWidth="18"
                                strokeDasharray={`${strokeLength} ${circumference}`}
                                strokeDashoffset={strokeOffset}
                                transform="rotate(-90 80 80)"
                              />
                            ) : null;
                          })
                        )}
                        <circle cx={cx} cy={cy} r="32" fill="#03090b" />
                        <text x={cx} y={cy + 4} fill="#e0f7fa" fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                          {totalSkills} Skills
                        </text>
                      </svg>

                      <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
                        {catData.map((d) => (
                          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: colors[d.name] }} />
                            <span style={{ fontSize: ".72rem", color: "#b0d0d8", fontFamily: "monospace" }}>
                              {d.name}: <strong>{d.count}</strong> ({Math.round(d.percent)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* REAL-TIME ANALYTICS ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem", marginTop: "1.5rem" }}>
              
              {/* Intent Analysis Chart */}
              <div style={S.chartBox} className="glass-panel">
                <div style={S.chartTitle}>📩 CONTACT QUERY INTENT ANALYSIS</div>
                {(() => {
                  const intentCounts = { "Collab & Projects": 0, "Jobs & Internships": 0, "Queries & Questions": 0, "General & Other": 0 };
                  messages.forEach(m => {
                    const text = ((m.subject || "") + " " + (m.message || "")).toLowerCase();
                    if (text.includes("collab") || text.includes("project") || text.includes("work") || text.includes("freelance") || text.includes("build") || text.includes("client")) {
                      intentCounts["Collab & Projects"]++;
                    } else if (text.includes("hire") || text.includes("job") || text.includes("intern") || text.includes("resume") || text.includes("career")) {
                      intentCounts["Jobs & Internships"]++;
                    } else if (text.includes("query") || text.includes("question") || text.includes("ask") || text.includes("how") || text.includes("what")) {
                      intentCounts["Queries & Questions"]++;
                    } else {
                      intentCounts["General & Other"]++;
                    }
                  });
                  const totalMsgs = messages.length;
                  const colors = {
                    "Collab & Projects": "#00e5ff",
                    "Jobs & Internships": "#7b2fff",
                    "Queries & Questions": "#ff007f",
                    "General & Other": "#f2c811"
                  };
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "flex", height: "16px", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(0,229,255,0.12)" }}>
                        {totalMsgs === 0 ? (
                          <div style={{ flex: 1, background: "rgba(74, 122, 130, 0.12)" }} />
                        ) : (
                          Object.entries(intentCounts).map(([intent, count]) => {
                            const pct = (count / totalMsgs) * 100;
                            return count > 0 ? (
                              <div 
                                key={intent} 
                                style={{ 
                                  width: `${pct}%`, 
                                  background: colors[intent], 
                                  boxShadow: `0 0 10px ${colors[intent]}`, 
                                  transition: "all 0.3s ease" 
                                }} 
                                title={`${intent}: ${count} (${Math.round(pct)}%)`}
                              />
                            ) : null;
                          })
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {Object.entries(intentCounts).map(([intent, count]) => {
                          const pct = totalMsgs > 0 ? (count / totalMsgs) * 100 : 0;
                          return (
                            <div key={intent} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", fontSize: "0.78rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: colors[intent] }} />
                                <span style={{ color: "#a0c2cd", fontFamily: "monospace" }}>{intent}</span>
                              </div>
                              <span style={{ color: "#e0f7fa", fontWeight: 700, fontFamily: "monospace" }}>{count} ({Math.round(pct)}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Guestbook Ratings Breakdown */}
              <div style={S.chartBox} className="glass-panel">
                <div style={S.chartTitle}>⭐ GUESTBOOK RATINGS BREAKDOWN</div>
                {(() => {
                  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                  reviews.forEach(r => {
                    const star = Math.round(r.rating);
                    if (star >= 1 && star <= 5) starCounts[star]++;
                  });
                  const totalRevs = reviews.length;
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {Object.entries(starCounts).reverse().map(([star, count]) => {
                        const percent = totalRevs > 0 ? (count / totalRevs) * 100 : 0;
                        return (
                          <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.78rem", color: "#b0d0d8" }}>
                            <span style={{ width: "25px", fontFamily: "monospace", color: "#00e5ff", fontWeight: "bold" }}>{star}★</span>
                            <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.03)", borderRadius: "3px", overflow: "hidden", border: "1px solid rgba(0,229,255,0.06)" }}>
                              <div style={{ width: `${percent}%`, height: "100%", background: "linear-gradient(90deg, #00e5ff, #1a6cf5)", borderRadius: "3px", boxShadow: "0 0 5px #00e5ff" }} />
                            </div>
                            <span style={{ width: "65px", textAlign: "right", fontFamily: "monospace", color: "#a0c2cd" }}>{count} revs</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* WakaTime Live Coding HUD */}
              <div style={S.chartBox} className="glass-panel">
                <div style={S.chartTitle}>🚀 LIVE CODING DIAGNOSTICS (WAKATIME)</div>
                {wakaData ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,229,255,0.08)", paddingBottom: "6px" }}>
                      <span style={{ fontSize: "0.78rem", color: "#4a7a82", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Total Coding time</span>
                      <span style={{ fontSize: "0.85rem", color: "#00e5ff", fontWeight: 700, fontFamily: "monospace" }}>
                        {wakaData.total_seconds 
                          ? `${Math.floor(wakaData.total_seconds / 3600)} hrs ${Math.floor((wakaData.total_seconds % 3600) / 60)} mins ${Math.floor(wakaData.total_seconds % 60)} secs`
                          : (wakaData.human_readable_total || `${wakaData.total_hours} hrs`)}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,229,255,0.08)", paddingBottom: "6px" }}>
                      <span style={{ fontSize: "0.78rem", color: "#4a7a82", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Daily average</span>
                      <span style={{ fontSize: "0.85rem", color: "#1a6cf5", fontWeight: 700, fontFamily: "monospace" }}>{wakaData.daily_average_hours} hrs/day</span>
                    </div>
                    <div style={{ marginTop: "4px" }}>
                      <div style={{ fontSize: "0.75rem", color: "#a0c2cd", marginBottom: "6px", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>Top Languages</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {(wakaData.languages || []).slice(0, 3).map(lang => (
                          <div key={lang.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", fontSize: "0.72rem" }}>
                            <span style={{ flex: 1, color: "#e0f7fa", fontFamily: "monospace" }}>{lang.name}</span>
                            <span style={{ color: "#00e5ff", fontWeight: 600, fontFamily: "monospace" }}>{lang.percent.toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: "8px", padding: "1rem" }}>
                    <div style={{ fontSize: "1.4rem" }}>📡</div>
                    <div style={{ fontSize: "0.75rem", color: "#4a7a82", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>WakaTime stats offline</div>
                    <div style={{ fontSize: "0.7rem", color: "#7a9aa0", lineHeight: 1.4 }}>
                      Set your <strong>WAKATIME_API_KEY</strong> in <code>.env</code> to stream live IDE programming analytics directly onto your admin cockpit!
                    </div>
                  </div>
                )}
              </div>

            </div>

          </>
        ) : tab === "messages" ? (
          /* ─────── MESSAGES TAB ─────── */
          <>
            <div style={S.pageTitle}>Contact Messages</div>
            <div style={S.pageSub}>All submissions from your portfolio contact form</div>

            {/* Stats */}
            <div style={S.statsRow}>
              <div style={S.statCard("#00e5ff")}>
                <div style={S.statNum("#00e5ff")}>{messages.length}</div>
                <div style={S.statLabel}>Total Messages</div>
              </div>
              <div style={S.statCard("#00e5ff")}>
                <div style={S.statNum("#00e5ff")}>{unread}</div>
                <div style={S.statLabel}>Unread</div>
              </div>
              <div style={S.statCard("#7b2fff")}>
                <div style={S.statNum("#7b2fff")}>{messages.filter(m=>m.read).length}</div>
                <div style={S.statLabel}>Read</div>
              </div>
            </div>

            {messages.length > 0 && messages.some(m=>m.read) && (
              <button style={{...S.delBtn, marginBottom:"1rem"}} onClick={deleteAllRead}>
                🗑 Delete All Read
              </button>
            )}

            <div style={S.msgList}>
              {messages.length === 0 ? (
                <div style={S.noMsg}>📭 No messages yet. They'll appear here when someone submits the contact form.</div>
              ) : messages.map(msg => (
                <div key={msg.id} style={S.msgCard(msg.read)} className="glass-panel" onClick={()=>{ setExpanded(expanded===msg.id?null:msg.id); if(!msg.read) markRead(msg.id); }}>
                  {!msg.read && <div style={S.unreadDot}/>}
                  <div style={S.msgTop}>
                    <div>
                      <div style={S.msgName}>{msg.name}</div>
                      <div style={S.msgEmail}>{msg.email}</div>
                    </div>
                    <div style={S.msgDate}>{fmt(msg.date)}</div>
                  </div>
                  <div style={S.msgSubject}>📌 {msg.subject}</div>
                  {expanded === msg.id ? (
                    <>
                      <div style={{...S.msgBody, color:"#b0d0d8", marginTop:".4rem", whiteSpace:"pre-wrap"}}>{msg.message}</div>
                      <div style={{display:"flex",gap:".5rem",flexWrap:"wrap",marginTop:".8rem"}}>
                        {!msg.read && <button style={S.markBtn} onClick={e=>{e.stopPropagation();markRead(msg.id);}}>✓ Mark Read</button>}
                        <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} style={{...S.markBtn,textDecoration:"none"}} onClick={e=>e.stopPropagation()}>✉ Reply</a>
                        <button style={S.delBtn} onClick={e=>{e.stopPropagation();deleteMsg(msg.id);}}>🗑 Delete</button>
                      </div>
                    </>
                  ) : (
                    <div style={S.msgBody}>{msg.message.slice(0,120)}{msg.message.length>120?"…":""}</div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : tab === "skills" ? (
          /* ─────── SKILLS TAB ─────── */
          <>
            <div style={S.pageTitle}>Manage Skills</div>
            <div style={S.pageSub}>Add or remove skills shown in the Technical Arsenal section</div>

            {/* Add Skill */}
            <div style={S.addBox} className="glass-panel">
              <div style={S.addTitle}>+ ADD NEW SKILL</div>
              <div style={{marginBottom:".6rem",fontSize:".82rem",color:"#4a7a82"}}>Pick icon:</div>
              <div style={S.iconSel}>
                {ICONS.map(ic => {
                  const fluentUrl = getFluentEmojiUrl(ic);
                  return (
                    <span key={ic} style={S.iconOpt(newSkill.icon===ic)} onClick={()=>setNewSkill(p=>({...p,icon:ic}))}>
                      {fluentUrl ? (
                        <img src={fluentUrl} alt={ic} style={{ width: "24px", height: "24px", verticalAlign: "middle" }} />
                      ) : (
                        ic
                      )}
                    </span>
                  );
                })}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".8rem",marginBottom:".8rem"}}>
                <div>
                  <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>SKILL NAME</div>
                  <input style={S.addInput} placeholder="e.g. Docker & K8s" value={newSkill.name} onChange={e=>setNewSkill(p=>({...p,name:e.target.value}))} />
                </div>
                <div>
                  <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>TAGS (comma separated)</div>
                  <input style={S.addInput} placeholder="Docker, Kubernetes, CI/CD" value={newSkill.tags} onChange={e=>setNewSkill(p=>({...p,tags:e.target.value}))} />
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
                <span style={{fontSize:"2rem"}}>
                  {getFluentEmojiUrl(newSkill.icon) ? (
                    <img src={getFluentEmojiUrl(newSkill.icon)} alt={newSkill.icon} style={{ width: "40px", height: "40px", verticalAlign: "middle" }} />
                  ) : (
                    newSkill.icon
                  )}
                </span>
                <span style={{color:"#e0f7fa",fontWeight:700}}>{newSkill.name||"Skill Name"}</span>
                <button style={S.addBtn} onClick={addSkill}>ADD SKILL →</button>
              </div>
            </div>

            {/* Skills Grid */}
            <div style={S.skillsGrid}>
              {skills.map(sk => {
                const fluentUrl = getFluentEmojiUrl(sk.icon);
                return (
                  <div key={sk.id} style={S.skillCard} className="glass-panel glow-card">
                    <button style={S.skillDelBtn} onClick={()=>deleteSkill(sk.id)}>✕</button>
                    <div style={S.skillIcon}>
                      {fluentUrl ? (
                        <img src={fluentUrl} alt={sk.name} style={{ width: "44px", height: "44px", display: "block", margin: "0 auto .4rem auto", objectFit: "contain" }} />
                      ) : (
                        sk.icon
                      )}
                    </div>
                    <div style={S.skillName}>{sk.name}</div>
                    <div style={S.skillTags}>
                      {sk.tags.map(t=><span key={t} style={S.tag}>{t}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{textAlign:"center",color:"#4a7a82",fontSize:".8rem",marginTop:".5rem"}}>
              {skills.length} skills total · Changes save instantly
            </div>
          </>
        ) : tab === "projects" ? (
          /* ─────── PROJECTS TAB ─────── */
          <>
            <div style={S.pageTitle}>Manage Projects</div>
            <div style={S.pageSub}>Add or remove projects shown in the carousel · changes reflect instantly on the portfolio</div>

            {/* Add Project */}
            <div style={S.addBox} className="glass-panel">
              <div style={S.addTitle}>+ ADD NEW PROJECT</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".8rem",marginBottom:".8rem"}}>
                <div>
                  <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>PROJECT TITLE</div>
                  <input style={S.addInput} placeholder="e.g. AI Study Assistant" value={newProject.title} onChange={e=>setNewProject(p=>({...p,title:e.target.value}))} />
                </div>
                <div>
                  <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>TECH TAGS (comma separated)</div>
                  <input style={S.addInput} placeholder="React, Node.js, MongoDB" value={newProject.tags} onChange={e=>setNewProject(p=>({...p,tags:e.target.value}))} />
                </div>
              </div>
              <div style={{marginBottom:".8rem"}}>
                <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>DESCRIPTION</div>
                <textarea style={{...S.addInput,minHeight:70,resize:"vertical"}} placeholder="Short project description..." value={newProject.desc} onChange={e=>setNewProject(p=>({...p,desc:e.target.value}))} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:".8rem",marginBottom:".8rem"}}>
                <div>
                  <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>THUMBNAIL URL</div>
                  <input style={S.addInput} placeholder="https://... (image URL)" value={newProject.thumb} onChange={e=>setNewProject(p=>({...p,thumb:e.target.value}))} />
                </div>
                <div>
                  <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>🔗 LIVE DEMO URL</div>
                  <input style={S.addInput} placeholder="https://your-demo.com" value={newProject.demo} onChange={e=>setNewProject(p=>({...p,demo:e.target.value}))} />
                </div>
                <div>
                  <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>⌥ GITHUB URL</div>
                  <input style={S.addInput} placeholder="https://github.com/..." value={newProject.github} onChange={e=>setNewProject(p=>({...p,github:e.target.value}))} />
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
                {newProject.thumb && <img src={newProject.thumb} alt="preview" style={{width:80,height:50,objectFit:"cover",borderRadius:6,border:"1px solid rgba(0,229,255,0.3)"}} onError={e=>e.target.style.display='none'} />}
                <button style={S.addBtn} onClick={addProject}>ADD PROJECT →</button>
              </div>
            </div>

            {/* Projects List */}
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              {projects.length === 0 && <div style={S.noMsg}>No projects yet. Add one above!</div>}
              {projects.map((proj, idx) => (
                editingProject?.id === proj.id ? (
                  /* ── INLINE EDIT FORM ── */
                  <div key={proj.id} style={{...S.addBox, border:"1px solid rgba(0,229,255,0.45)", boxShadow:"0 0 24px rgba(0,229,255,0.1)"}}>
                    <div style={{...S.addTitle, color:"#00e5ff"}}>✏ EDITING: {proj.title}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".8rem",marginBottom:".8rem"}}>
                      <div>
                        <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>PROJECT TITLE</div>
                        <input style={S.addInput} value={editingProject.title} onChange={e=>setEditingProject(p=>({...p,title:e.target.value}))} />
                      </div>
                      <div>
                        <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>TECH TAGS (comma separated)</div>
                        <input style={S.addInput} value={editingProject.tags} onChange={e=>setEditingProject(p=>({...p,tags:e.target.value}))} />
                      </div>
                    </div>
                    <div style={{marginBottom:".8rem"}}>
                      <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>DESCRIPTION</div>
                      <textarea style={{...S.addInput,minHeight:70,resize:"vertical"}} value={editingProject.desc} onChange={e=>setEditingProject(p=>({...p,desc:e.target.value}))} />
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:".8rem",marginBottom:".8rem"}}>
                      <div>
                        <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>THUMBNAIL URL</div>
                        <input style={S.addInput} value={editingProject.thumb} onChange={e=>setEditingProject(p=>({...p,thumb:e.target.value}))} />
                      </div>
                      <div>
                        <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>🔗 LIVE DEMO URL</div>
                        <input style={S.addInput} value={editingProject.demo} onChange={e=>setEditingProject(p=>({...p,demo:e.target.value}))} />
                      </div>
                      <div>
                        <div style={{fontSize:".72rem",color:"#00e5ff",letterSpacing:".1em",marginBottom:".3rem",fontFamily:"'Orbitron',monospace"}}>⌥ GITHUB URL</div>
                        <input style={S.addInput} value={editingProject.github} onChange={e=>setEditingProject(p=>({...p,github:e.target.value}))} />
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:".8rem",flexWrap:"wrap"}}>
                      {editingProject.thumb && <img src={editingProject.thumb} alt="preview" style={{width:80,height:50,objectFit:"cover",borderRadius:6,border:"1px solid rgba(0,229,255,0.3)"}} onError={e=>e.target.style.display='none'} />}
                      <button style={S.addBtn} onClick={saveEditProject}>SAVE CHANGES ✓</button>
                      <button style={{...S.addBtn, background:"rgba(255,255,255,0.08)", color:"#e0f7fa", border:"1px solid rgba(255,255,255,0.2)"}} onClick={()=>setEditingProject(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  /* ── CARD VIEW ── */
                  <div key={proj.id} style={{...S.msgCard(true), display:"grid", gridTemplateColumns:"120px 1fr", gap:"1.2rem", alignItems:"flex-start"}}>
                    <div style={{position:"relative"}}>
                      {proj.thumb ? (
                        <img src={proj.thumb} alt={proj.title} style={{width:"100%",aspectRatio:"16/9",objectFit:"cover",borderRadius:8,border:"1px solid rgba(0,229,255,0.2)"}} />
                      ) : (
                        <div style={{width:"100%",aspectRatio:"16/9",background:"rgba(0,229,255,0.05)",borderRadius:8,border:"1px dashed rgba(0,229,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",color:"#4a7a82"}}>No Image</div>
                      )}
                      <div style={{position:"absolute",top:-6,left:-6,background:"rgba(0,229,255,0.15)",border:"1px solid rgba(0,229,255,0.4)",borderRadius:6,padding:"2px 6px",fontSize:".6rem",fontFamily:"'Orbitron',monospace",color:"#00e5ff"}}>0{idx+1}</div>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem",marginBottom:".4rem"}}>
                        <div style={S.msgName}>{proj.title}</div>
                        <div style={{display:"flex",gap:".4rem",flexShrink:0}}>
                          <button style={{...S.markBtn, fontSize:".72rem"}} onClick={()=>startEditProject(proj)}>✏ Edit</button>
                          <button style={S.skillDelBtn} onClick={()=>deleteProject(proj.id)}>✕ Remove</button>
                        </div>
                      </div>
                      <div style={{...S.msgBody,marginBottom:".6rem"}}>{proj.desc}</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:".3rem",marginBottom:".6rem"}}>
                        {(proj.tags||[]).map(t=><span key={t} style={S.tag}>{t}</span>)}
                      </div>
                      <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
                        <a href={proj.demo} target="_blank" rel="noreferrer" style={{...S.markBtn,textDecoration:"none",fontSize:".75rem"}} onClick={e=>e.stopPropagation()}>▶ Demo: {proj.demo==='#'?'Not set':proj.demo.replace('https://','')}</a>
                        <a href={proj.github} target="_blank" rel="noreferrer" style={{...S.markBtn,textDecoration:"none",fontSize:".75rem"}} onClick={e=>e.stopPropagation()}>⌥ GitHub: {proj.github==='#'?'Not set':proj.github.replace('https://github.com/','')}</a>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
            <div style={{textAlign:"center",color:"#4a7a82",fontSize:".8rem",marginTop:"1rem"}}>
              {projects.length} project{projects.length!==1?'s':''} total · Changes save instantly
            </div>
          </>
        ) : tab === "experience" ? (
          <>
            <div style={S.pageTitle}>Manage Work Experience</div>
            <div style={S.pageSub}>Add, edit, or remove timeline items shown in the Work Experience section</div>

            <div style={S.addBox} className="glass-panel">
              <div style={S.addTitle}>+ ADD WORK EXPERIENCE</div>
              <div style={S.formGrid2}>
                <div>
                  <div style={S.fieldLabel}>JOB TYPE / TITLE</div>
                  <input style={S.addInput} placeholder="Internship" value={newExperience.role} onChange={e=>setNewExperience(p=>({...p,role:e.target.value}))} />
                </div>
                <div>
                  <div style={S.fieldLabel}>COMPANY / LOCATION</div>
                  <input style={S.addInput} placeholder="Comnet Vison IT India Pvt ltd, Nehru Place" value={newExperience.org} onChange={e=>setNewExperience(p=>({...p,org:e.target.value}))} />
                </div>
              </div>
              <div style={{marginBottom:".8rem"}}>
                <div style={S.fieldLabel}>DESCRIPTION</div>
                <textarea style={{...S.addInput,minHeight:90,resize:"vertical"}} placeholder="Description of work, tasks, and responsibilities" value={newExperience.desc} onChange={e=>setNewExperience(p=>({...p,desc:e.target.value}))} />
              </div>
              <div style={S.actionRow}>
                <div style={{flex:"1 1 240px"}}>
                  <div style={S.fieldLabel}>DURATION</div>
                  <input style={S.addInput} placeholder="June 2025 to August 2025" value={newExperience.badge} onChange={e=>setNewExperience(p=>({...p,badge:e.target.value}))} />
                </div>
                <button style={S.addBtn} onClick={addExperience}>ADD WORK EXPERIENCE</button>
              </div>
            </div>

            <div style={S.msgList}>
              {experiences.map(exp => (
                editingExperience?.id === exp.id ? (
                  <div key={exp.id} style={{...S.addBox, border:"1px solid rgba(0,229,255,0.45)", boxShadow:"0 0 24px rgba(0,229,255,0.1)"}}>
                    <div style={S.addTitle}>EDIT WORK EXPERIENCE</div>
                    <div style={S.formGrid2}>
                      <div>
                        <div style={S.fieldLabel}>JOB TYPE / TITLE</div>
                        <input style={S.addInput} value={editingExperience.role} onChange={e=>setEditingExperience(p=>({...p,role:e.target.value}))} />
                      </div>
                      <div>
                        <div style={S.fieldLabel}>COMPANY / LOCATION</div>
                        <input style={S.addInput} value={editingExperience.org} onChange={e=>setEditingExperience(p=>({...p,org:e.target.value}))} />
                      </div>
                    </div>
                    <div style={{marginBottom:".8rem"}}>
                      <div style={S.fieldLabel}>DESCRIPTION</div>
                      <textarea style={{...S.addInput,minHeight:90,resize:"vertical"}} value={editingExperience.desc} onChange={e=>setEditingExperience(p=>({...p,desc:e.target.value}))} />
                    </div>
                    <div style={S.actionRow}>
                      <div style={{flex:"1 1 240px"}}>
                        <div style={S.fieldLabel}>DURATION</div>
                        <input style={S.addInput} value={editingExperience.badge} onChange={e=>setEditingExperience(p=>({...p,badge:e.target.value}))} />
                      </div>
                      <button style={S.addBtn} onClick={saveEditExperience}>SAVE CHANGES</button>
                      <button style={S.cancelBtn} onClick={()=>setEditingExperience(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div key={exp.id} style={S.msgCard(true)} className="glass-panel">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem"}}>
                      <div style={{minWidth:0}}>
                        <div style={S.msgName}>{exp.role}</div>
                        <div style={S.msgEmail}>{exp.org}</div>
                      </div>
                      <div style={S.cardActions}>
                        <button style={S.editBtn} onClick={()=>startEditExperience(exp)}>Edit</button>
                        <button style={S.removeBtn} onClick={()=>deleteExperience(exp.id)}>X</button>
                      </div>
                    </div>
                    <div style={{...S.msgBody, marginTop:".4rem"}}>{exp.desc}</div>
                    {exp.badge && <div style={{...S.tag, marginTop:".6rem", display:"inline-block"}}>{exp.badge}</div>}
                  </div>
                )
              ))}
            </div>
          </>
        ) : tab === "qualifications" ? (
          <>
            <div style={S.pageTitle}>Manage Qualifications</div>
            <div style={S.pageSub}>Add, edit, or remove timeline items shown in the Qualifications section</div>

            <div style={S.addBox} className="glass-panel">
              <div style={S.addTitle}>+ ADD QUALIFICATION</div>
              <div style={S.formGrid2}>
                <div>
                  <div style={S.fieldLabel}>ROLE / TITLE</div>
                  <input style={S.addInput} placeholder="Student" value={newQualification.role} onChange={e=>setNewQualification(p=>({...p,role:e.target.value}))} />
                </div>
                <div>
                  <div style={S.fieldLabel}>ORGANIZATION / PROJECT</div>
                  <input style={S.addInput} placeholder="Shivaji College, University of Delhi" value={newQualification.org} onChange={e=>setNewQualification(p=>({...p,org:e.target.value}))} />
                </div>
              </div>
              <div style={{marginBottom:".8rem"}}>
                <div style={S.fieldLabel}>DESCRIPTION</div>
                <textarea style={{...S.addInput,minHeight:90,resize:"vertical"}} placeholder="Short qualification description" value={newQualification.desc} onChange={e=>setNewQualification(p=>({...p,desc:e.target.value}))} />
              </div>
              <div style={S.actionRow}>
                <div style={{flex:"1 1 240px"}}>
                  <div style={S.fieldLabel}>BADGE / YEAR</div>
                  <input style={S.addInput} placeholder="2024" value={newQualification.badge} onChange={e=>setNewQualification(p=>({...p,badge:e.target.value}))} />
                </div>
                <button style={S.addBtn} onClick={addQualification}>ADD QUALIFICATION</button>
              </div>
            </div>

            <div style={S.msgList}>
              {qualifications.map(q => (
                editingQualification?.id === q.id ? (
                  <div key={q.id} style={{...S.addBox, border:"1px solid rgba(0,229,255,0.45)", boxShadow:"0 0 24px rgba(0,229,255,0.1)"}}>
                    <div style={S.addTitle}>EDIT QUALIFICATION</div>
                    <div style={S.formGrid2}>
                      <div>
                        <div style={S.fieldLabel}>ROLE / TITLE</div>
                        <input style={S.addInput} value={editingQualification.role} onChange={e=>setEditingQualification(p=>({...p,role:e.target.value}))} />
                      </div>
                      <div>
                        <div style={S.fieldLabel}>ORGANIZATION / PROJECT</div>
                        <input style={S.addInput} value={editingQualification.org} onChange={e=>setEditingQualification(p=>({...p,org:e.target.value}))} />
                      </div>
                    </div>
                    <div style={{marginBottom:".8rem"}}>
                      <div style={S.fieldLabel}>DESCRIPTION</div>
                      <textarea style={{...S.addInput,minHeight:90,resize:"vertical"}} value={editingQualification.desc} onChange={e=>setEditingQualification(p=>({...p,desc:e.target.value}))} />
                    </div>
                    <div style={S.actionRow}>
                      <div style={{flex:"1 1 240px"}}>
                        <div style={S.fieldLabel}>BADGE / YEAR</div>
                        <input style={S.addInput} value={editingQualification.badge} onChange={e=>setEditingQualification(p=>({...p,badge:e.target.value}))} />
                      </div>
                      <button style={S.addBtn} onClick={saveEditQualification}>SAVE CHANGES</button>
                      <button style={S.cancelBtn} onClick={()=>setEditingQualification(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div key={q.id} style={S.msgCard(true)} className="glass-panel">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem"}}>
                      <div style={{minWidth:0}}>
                        <div style={S.msgName}>{q.role}</div>
                        <div style={S.msgEmail}>{q.org}</div>
                      </div>
                      <div style={S.cardActions}>
                        <button style={S.editBtn} onClick={()=>startEditQualification(q)}>Edit</button>
                        <button style={S.removeBtn} onClick={()=>deleteQualification(q.id)}>X</button>
                      </div>
                    </div>
                    <div style={{...S.msgBody, marginTop:".4rem"}}>{q.desc}</div>
                    {q.badge && <div style={{...S.tag, marginTop:".6rem", display:"inline-block"}}>{q.badge}</div>}
                  </div>
                )
              ))}
            </div>
          </>
        ) : tab === "certifications" ? (
          <>
            <div style={S.pageTitle}>Manage Certifications</div>
            <div style={S.pageSub}>Add, edit, or remove certification cards shown below Qualifications</div>

            <div style={S.addBox} className="glass-panel">
              <div style={S.addTitle}>+ ADD CERTIFICATION</div>
              <div style={S.formGrid4}>
                <div>
                  <div style={S.fieldLabel}>ICON</div>
                  <input style={S.addInput} placeholder="Trophy" value={newCertification.icon} onChange={e=>setNewCertification(p=>({...p,icon:e.target.value}))} />
                </div>
                <div>
                  <div style={S.fieldLabel}>CERTIFICATE NAME</div>
                  <input style={S.addInput} placeholder="Microsoft Power BI" value={newCertification.name} onChange={e=>setNewCertification(p=>({...p,name:e.target.value}))} />
                </div>
                <div>
                  <div style={S.fieldLabel}>PROVIDER</div>
                  <input style={S.addInput} placeholder="Shivaji College" value={newCertification.org} onChange={e=>setNewCertification(p=>({...p,org:e.target.value}))} />
                </div>
                <div>
                  <div style={S.fieldLabel}>YEAR</div>
                  <input style={S.addInput} placeholder="2025" value={newCertification.badge} onChange={e=>setNewCertification(p=>({...p,badge:e.target.value}))} />
                </div>
              </div>
              <button style={S.addBtn} onClick={addCertification}>ADD CERTIFICATION</button>
            </div>

            <div style={S.skillsGrid}>
              {certifications.map(c => (
                editingCertification?.id === c.id ? (
                  <div key={c.id} style={{...S.skillCard, gridColumn:"1 / -1", border:"1px solid rgba(0,229,255,0.45)", boxShadow:"0 0 24px rgba(0,229,255,0.1)"}}>
                    <div style={S.addTitle}>EDIT CERTIFICATION</div>
                    <div style={S.formGrid4}>
                      <div>
                        <div style={S.fieldLabel}>ICON</div>
                        <input style={S.addInput} value={editingCertification.icon} onChange={e=>setEditingCertification(p=>({...p,icon:e.target.value}))} />
                      </div>
                      <div>
                        <div style={S.fieldLabel}>CERTIFICATE NAME</div>
                        <input style={S.addInput} value={editingCertification.name} onChange={e=>setEditingCertification(p=>({...p,name:e.target.value}))} />
                      </div>
                      <div>
                        <div style={S.fieldLabel}>PROVIDER</div>
                        <input style={S.addInput} value={editingCertification.org} onChange={e=>setEditingCertification(p=>({...p,org:e.target.value}))} />
                      </div>
                      <div>
                        <div style={S.fieldLabel}>YEAR</div>
                        <input style={S.addInput} value={editingCertification.badge} onChange={e=>setEditingCertification(p=>({...p,badge:e.target.value}))} />
                      </div>
                    </div>
                    <div style={S.actionRow}>
                      <button style={S.addBtn} onClick={saveEditCertification}>SAVE CHANGES</button>
                      <button style={S.cancelBtn} onClick={()=>setEditingCertification(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div key={c.id} style={S.skillCard} className="glass-panel glow-card">
                    <div style={{position:"absolute",top:".7rem",right:".7rem",display:"flex",gap:".4rem"}}>
                      <button style={S.editBtn} onClick={()=>startEditCertification(c)}>Edit</button>
                      <button style={S.removeBtn} onClick={()=>deleteCertification(c.id)}>X</button>
                    </div>
                    <div style={S.skillIcon}>{c.icon}</div>
                    <div style={{...S.skillName, paddingRight:"5.6rem"}}>{c.name}</div>
                    <div style={S.msgEmail}>{c.org}</div>
                    {c.badge && <span style={S.tag}>{c.badge}</span>}
                  </div>
                )
              ))}
            </div>
          </>
        ) : tab === "chatbot" ? (
          <>
            <div style={S.pageTitle}>Manage Manav AI Chatbot</div>
            <div style={S.pageSub}>Edit chatbot replies shown on the front page. Save changes, then refresh the portfolio to see updates.</div>

            <div style={S.addBox} className="glass-panel">
              <div style={S.addTitle}>CHATBOT REPLIES</div>
              {CHATBOT_REPLY_FIELDS.map(([key, label]) => (
                <div key={key} style={{marginBottom:"1rem"}}>
                  <div style={S.fieldLabel}>{label}</div>
                  <textarea
                    style={{...S.addInput,minHeight:88,resize:"vertical",lineHeight:1.5}}
                    value={chatbotReplies[key] || ""}
                    onChange={e=>updateChatbotReply(key, e.target.value)}
                  />
                </div>
              ))}
              <div style={S.actionRow}>
                <button style={S.addBtn} onClick={saveChatbotFromEditor}>SAVE CHATBOT REPLIES</button>
                <button style={S.cancelBtn} onClick={resetChatbotReplies}>Reset Default</button>
              </div>
            </div>

            <div style={S.addBox} className="glass-panel">
              <div style={S.addTitle}>+ ADD CUSTOM QUESTION</div>
              <div style={S.formGrid2}>
                <div>
                  <div style={S.fieldLabel}>QUESTION / PROMPT</div>
                  <input
                    style={S.addInput}
                    placeholder="e.g. What is Manav currently learning?"
                    value={newChatbotQuestion.question}
                    onChange={e=>setNewChatbotQuestion(p=>({...p,question:e.target.value}))}
                  />
                </div>
                <div>
                  <div style={S.fieldLabel}>ANSWER</div>
                  <textarea
                    style={{...S.addInput,minHeight:86,resize:"vertical"}}
                    placeholder="Write the answer Manav AI should give..."
                    value={newChatbotQuestion.answer}
                    onChange={e=>setNewChatbotQuestion(p=>({...p,answer:e.target.value}))}
                  />
                </div>
              </div>
              <button style={S.addBtn} onClick={addChatbotQuestion}>ADD QUESTION</button>
            </div>

            <div style={S.msgList}>
              {(chatbotReplies.customQuestions || []).length === 0 ? (
                <div style={S.noMsg}>No custom questions yet. Add one above to show it as a chatbot quick question.</div>
              ) : (chatbotReplies.customQuestions || []).map(item => (
                <div key={item.id} style={S.msgCard(true)} className="glass-panel">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem"}}>
                    <div>
                      <div style={S.msgName}>{item.question}</div>
                      <div style={{...S.msgBody, marginTop:".4rem"}}>{item.answer}</div>
                    </div>
                    <button style={S.removeBtn} onClick={()=>deleteChatbotQuestion(item.id)}>X</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{...S.noMsg, padding:"1.2rem", textAlign:"left"}}>
              Custom questions are matched before automatic intents and appear as extra quick question chips in Manav AI.
            </div>
          </>
        ) : tab === "team" ? (
          <>
            <div style={S.pageTitle}>👥 Manage Team Members</div>
            <div style={S.pageSub}>Add, edit, or remove your freelancing agency team members. Stored securely in MongoDB Cloud.</div>

            {editingMember ? (
              /* EDIT MEMBER BOX */
              <div style={S.addBox} className="glass-panel">
                <div style={S.addTitle}>✍️ EDIT TEAM MEMBER</div>
                <div style={S.formGrid2}>
                  <div>
                    <div style={S.fieldLabel}>FULL NAME</div>
                    <input
                      style={S.addInput}
                      value={editingMember.name}
                      onChange={e=>setEditingMember(p=>({...p,name:e.target.value}))}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <div style={S.fieldLabel}>ROLE / DESIGNATION</div>
                    <input
                      style={S.addInput}
                      value={editingMember.role}
                      onChange={e=>setEditingMember(p=>({...p,role:e.target.value}))}
                      placeholder="e.g. UI/UX Designer"
                    />
                  </div>
                </div>
                <div style={S.formGrid4}>
                  <div>
                    <div style={S.fieldLabel}>AGE</div>
                    <input
                      style={S.addInput}
                      type="number"
                      value={editingMember.age}
                      onChange={e=>setEditingMember(p=>({...p,age:e.target.value}))}
                      placeholder="e.g. 24"
                    />
                  </div>
                  <div>
                    <div style={S.fieldLabel}>QUALIFICATION</div>
                    <input
                      style={S.addInput}
                      value={editingMember.qualification}
                      onChange={e=>setEditingMember(p=>({...p,qualification:e.target.value}))}
                      placeholder="e.g. B.Tech CS"
                    />
                  </div>
                  <div style={{gridColumn: "span 2"}}>
                    <div style={S.fieldLabel}>DATE OF HIRE</div>
                    <input
                      style={S.addInput}
                      type="date"
                      value={editingMember.dateOfHire}
                      onChange={e=>setEditingMember(p=>({...p,dateOfHire:e.target.value}))}
                    />
                  </div>
                </div>
                <div style={{marginBottom: "1rem", marginTop: "1rem"}}>
                  <div style={S.fieldLabel}>SELECT TEAM MEMBER AVATAR (TECH BITMOJI)</div>
                  <div style={{
                    display: "flex", 
                    flexWrap: "wrap", 
                    gap: "8px", 
                    background: "rgba(0,12,18,0.5)", 
                    padding: "10px", 
                    borderRadius: "10px", 
                    border: "1px solid rgba(0, 229, 255, 0.15)",
                    marginTop: "4px"
                  }}>
                    {["👨‍💻", "👩‍💻", "🧑‍💻", "💻", "🧠", "🎨", "🚀", "🛡️", "⚙️", "📱", "🤖", "🌐", "📊", "🐞", "⚡", "👾", "🛰️", "🎮"].map(emoji => (
                      <span
                        key={emoji}
                        onClick={() => setEditingMember(p => ({ ...p, avatar: emoji }))}
                        style={{
                          fontSize: "1.8rem",
                          cursor: "pointer",
                          padding: "6px",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          background: editingMember.avatar === emoji ? "rgba(0, 229, 255, 0.2)" : "transparent",
                          border: editingMember.avatar === emoji ? "1px solid #00e5ff" : "1px solid transparent",
                          boxShadow: editingMember.avatar === emoji ? "0 0 10px rgba(0, 229, 255, 0.3)" : "none"
                        }}
                        title={emoji}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={S.actionRow}>
                  <button style={S.addBtn} onClick={saveEditMember}>SAVE CHANGES</button>
                  <button style={S.cancelBtn} onClick={()=>setEditingMember(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              /* ADD MEMBER BOX */
              <div style={S.addBox} className="glass-panel">
                <div style={S.addTitle}>+ ADD NEW TEAM MEMBER</div>
                <div style={S.formGrid2}>
                  <div>
                    <div style={S.fieldLabel}>FULL NAME</div>
                    <input
                      style={S.addInput}
                      value={newMember.name}
                      onChange={e=>setNewMember(p=>({...p,name:e.target.value}))}
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                  <div>
                    <div style={S.fieldLabel}>ROLE / DESIGNATION</div>
                    <input
                      style={S.addInput}
                      value={newMember.role}
                      onChange={e=>setNewMember(p=>({...p,role:e.target.value}))}
                      placeholder="e.g. Lead Web Developer"
                    />
                  </div>
                </div>
                <div style={S.formGrid4}>
                  <div>
                    <div style={S.fieldLabel}>AGE</div>
                    <input
                      style={S.addInput}
                      type="number"
                      value={newMember.age}
                      onChange={e=>setNewMember(p=>({...p,age:e.target.value}))}
                      placeholder="e.g. 22"
                    />
                  </div>
                  <div>
                    <div style={S.fieldLabel}>QUALIFICATION</div>
                    <input
                      style={S.addInput}
                      value={newMember.qualification}
                      onChange={e=>setNewMember(p=>({...p,qualification:e.target.value}))}
                      placeholder="e.g. BCA Student"
                    />
                  </div>
                  <div style={{gridColumn: "span 2"}}>
                    <div style={S.fieldLabel}>DATE OF HIRE</div>
                    <input
                      style={S.addInput}
                      type="date"
                      value={newMember.dateOfHire}
                      onChange={e=>setNewMember(p=>({...p,dateOfHire:e.target.value}))}
                    />
                  </div>
                </div>
                <div style={{marginBottom: "1rem", marginTop: "1rem"}}>
                  <div style={S.fieldLabel}>SELECT TEAM MEMBER AVATAR (TECH BITMOJI)</div>
                  <div style={{
                    display: "flex", 
                    flexWrap: "wrap", 
                    gap: "8px", 
                    background: "rgba(0,12,18,0.5)", 
                    padding: "10px", 
                    borderRadius: "10px", 
                    border: "1px solid rgba(0, 229, 255, 0.15)",
                    marginTop: "4px"
                  }}>
                    {["👨‍💻", "👩‍💻", "🧑‍💻", "💻", "🧠", "🎨", "🚀", "🛡️", "⚙️", "📱", "🤖", "🌐", "📊", "🐞", "⚡", "👾", "🛰️", "🎮"].map(emoji => (
                      <span
                        key={emoji}
                        onClick={() => setNewMember(p => ({ ...p, avatar: emoji }))}
                        style={{
                          fontSize: "1.8rem",
                          cursor: "pointer",
                          padding: "6px",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          background: newMember.avatar === emoji ? "rgba(0, 229, 255, 0.2)" : "transparent",
                          border: newMember.avatar === emoji ? "1px solid #00e5ff" : "1px solid transparent",
                          boxShadow: newMember.avatar === emoji ? "0 0 10px rgba(0, 229, 255, 0.3)" : "none"
                        }}
                        title={emoji}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                </div>
                <button style={S.addBtn} onClick={addTeamMember}>ADD MEMBER</button>
              </div>
            )}

            {/* TEAM LIST */}
            <div style={S.msgList}>
              {team.length === 0 ? (
                <div style={S.noMsg}>No team members registered yet. Add your first agency team member above!</div>
              ) : (
                team.map(m => (
                  <div key={m.id} style={S.msgCard(true)} className="glass-panel">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem"}}>
                      <div style={{display: "flex", gap: "14px", alignItems: "center"}}>
                        <div style={{fontSize: "2.1rem", background: "rgba(0, 229, 255, 0.1)", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0, 229, 255, 0.2)", boxShadow: "0 0 8px rgba(0, 229, 255, 0.1)"}}>
                          {m.avatar || "👨‍💻"}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={S.msgName}>{m.name}</div>
                            {m.status === "Resigned" && (
                              <span style={{
                                background: "rgba(255,90,106,0.12)",
                                border: "1px solid rgba(255,90,106,0.3)",
                                color: "#ff5a6a",
                                borderRadius: "4px",
                                padding: "1px 6px",
                                fontSize: "0.68rem",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em"
                              }}>
                                Resigned
                              </span>
                            )}
                          </div>
                          <div style={S.msgEmail}>{m.role}</div>
                          <div style={{fontSize: "0.8rem", color: "#7a9aa0", marginTop: "4px"}}>
                            Age: <strong>{m.age || "N/A"}</strong> · Qualification: <strong>{m.qualification || "N/A"}</strong>
                          </div>
                          {m.dateOfHire && (
                            <div style={{fontSize: "0.76rem", color: "#4a7a82", marginTop: "4px", fontFamily: "monospace"}}>
                              📅 Hired: {new Date(m.dateOfHire).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={S.cardActions}>
                        <button 
                          style={{
                            ...S.editBtn, 
                            background: m.status === "Resigned" ? "rgba(0, 255, 135, 0.08)" : "rgba(255, 193, 7, 0.08)",
                            color: m.status === "Resigned" ? "#00ff87" : "#ffc107",
                            borderColor: m.status === "Resigned" ? "rgba(0, 255, 135, 0.22)" : "rgba(255, 193, 7, 0.22)"
                          }} 
                          onClick={() => toggleResignMember(m.id)}
                        >
                          {m.status === "Resigned" ? "Rehire" : "Resign"}
                        </button>
                        <button style={S.editBtn} onClick={()=>startEditMember(m)}>Edit</button>
                        <button style={S.removeBtn} onClick={()=>deleteTeamMember(m.id)}>X</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <div style={S.pageTitle}>⭐ Reviews & Guestbook Moderation</div>
            <div style={S.pageSub}>Manage comments and ratings submitted by visitors. Approved reviews are displayed publicly on the portfolio.</div>

            {/* PENDING REVIEWS BOX */}
            <div style={{marginBottom: "2rem"}}>
              <div style={{...S.addTitle, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 229, 255, 0.15)", paddingBottom: ".4rem", marginBottom: "1rem"}}>
                ⏳ PENDING APPROVAL ({reviews.filter(r => !r.approved).length})
              </div>
              
              {reviews.filter(r => !r.approved).length === 0 ? (
                <div style={S.noMsg}>No pending reviews. Good job!</div>
              ) : (
                <div style={S.msgList}>
                  {reviews.filter(r => !r.approved).map(rev => (
                    <div key={rev.id} style={S.msgCard(false)} className="glass-panel">
                      <div style={S.msgTop}>
                        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                          <div style={{fontSize: "2rem", background: "rgba(0, 229, 255, 0.1)", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center"}}>
                            {rev.avatar || "👨‍💻"}
                          </div>
                          <div>
                            <div style={S.msgName}>{rev.name}</div>
                            {rev.role && <div style={S.msgEmail}>{rev.role}</div>}
                          </div>
                        </div>
                        <div style={{textAlign: "right"}}>
                          <div style={{color: "#f2c811", fontSize: "1.1rem", fontWeight: "bold"}}>
                            {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                          </div>
                          <div style={S.msgDate}>{fmt(rev.date)}</div>
                        </div>
                      </div>
                      <div style={{...S.msgBody, marginTop: "1rem", whiteSpace: "pre-wrap"}}>{rev.text}</div>
                      
                      <div style={{display: "flex", gap: ".6rem", marginTop: "1.2rem"}}>
                        <button style={{...S.addBtn, background: "linear-gradient(135deg, #00ff87, #60efff)"}} onClick={() => approveReview(rev.id)}>✓ APPROVE & PUBLISH</button>
                        <button style={S.removeBtn} onClick={() => deleteReview(rev.id)}>🗑️ REJECT / DELETE</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* APPROVED REVIEWS BOX */}
            <div>
              <div style={{...S.addTitle, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 229, 255, 0.15)", paddingBottom: ".4rem", marginBottom: "1rem"}}>
                ✓ LIVE APPROVED REVIEWS ({reviews.filter(r => r.approved).length})
              </div>

              {reviews.filter(r => r.approved).length === 0 ? (
                <div style={S.noMsg}>No approved reviews yet. Approve pending submissions or wait for reviews.</div>
              ) : (
                <div style={S.msgList}>
                  {reviews.filter(r => r.approved).map(rev => (
                    <div key={rev.id} style={S.msgCard(true)} className="glass-panel">
                      <div style={S.msgTop}>
                        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                          <div style={{fontSize: "2rem", background: "rgba(255, 255, 255, 0.05)", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center"}}>
                            {rev.avatar || "👨‍💻"}
                          </div>
                          <div>
                            <div style={S.msgName}>{rev.name}</div>
                            {rev.role && <div style={S.msgEmail}>{rev.role}</div>}
                          </div>
                        </div>
                        <div style={{textAlign: "right"}}>
                          <div style={{color: "#f2c811", fontSize: "1.1rem"}}>
                            {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                          </div>
                          <div style={S.msgDate}>{fmt(rev.date)}</div>
                        </div>
                      </div>
                      <div style={{...S.msgBody, marginTop: "1rem", whiteSpace: "pre-wrap"}}>{rev.text}</div>
                      
                      <div style={{display: "flex", gap: ".6rem", marginTop: "1.2rem"}}>
                        <button style={S.editBtn} onClick={() => disapproveReview(rev.id)}>⊘ HIDE / DISAPPROVE</button>
                        <button style={S.removeBtn} onClick={() => deleteReview(rev.id)}>🗑️ DELETE</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
