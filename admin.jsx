import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "manav2025";
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
  { id: "1", title: "AI Study Assistant", desc: "Full-stack AI study companion powered by Claude API. Personalized learning paths, smart Q&A, and real-time feedback.", thumb: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=840&q=80", tags: ["React", "Claude API", "MongoDB"], demo: "#", github: "#" },
  { id: "2", title: "Facial Recognition Attendance", desc: "Real-time face detection and recognition pipeline with Flask dashboard and SQLite database.", thumb: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=840&q=80", tags: ["Python", "OpenCV", "Flask"], demo: "#", github: "#" },
  { id: "3", title: "VIBRATIONS Festival Website", desc: "Official Shivaji College cultural fest site with Supabase auth, event registration, and admin controls.", thumb: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=840&q=80", tags: ["Supabase", "HTML/CSS/JS", "Auth"], demo: "#", github: "#" },
  { id: "4", title: "3D Developer Portfolio", desc: "This portfolio — Three.js particles, 3D HUD rings, holographic flip cards, and a cinematic carousel.", thumb: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=840&q=80", tags: ["Three.js", "Vite", "HTML/CSS"], demo: "#", github: "#" },
  { id: "5", title: "RAG Knowledge Platform", desc: "Retrieval-augmented generation pipeline on AWS using embeddings and vector search.", thumb: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=840&q=80", tags: ["LangChain", "VectorDB", "AWS"], demo: "#", github: "#" },
];

const DEFAULT_QUALIFICATIONS = [
  { id: "1", role: "Full Stack Developer", org: "Shivaji College, University of Delhi", desc: "Building real-world web and AI projects - facial recognition, festival websites, and AI-powered study tools.", badge: "2023 - Present" },
  { id: "2", role: "AI Study Assistant", org: "Personal Project", desc: "Full-stack AI study companion powered by Claude API with React frontend, Node.js backend, and MongoDB.", badge: "2024" },
  { id: "3", role: "Facial Recognition Attendance System", org: "Project - Python / OpenCV / Flask", desc: "Smart attendance system with real-time face detection pipeline, SQLite database, and Flask dashboard.", badge: "2024" },
  { id: "4", role: "VIBRATIONS Cultural Festival Website", org: "Shivaji College", desc: "Official college fest website with Supabase auth, event registration, admin controls, and responsive design.", badge: "2024" },
];

const DEFAULT_CERTIFICATIONS = [
  { id: "1", icon: "🏆", name: "Web Development Fundamentals", org: "Online Platform", badge: "2023" },
  { id: "2", icon: "🏅", name: "Python for AI & Automation", org: "Online Platform", badge: "2024" },
  { id: "3", icon: "🎖️", name: "React & Full Stack Dev", org: "Online Platform", badge: "2024" },
];

const DEFAULT_SKILLS = [
  { id: "1", icon: "🧠", name: "Generative AI", tags: ["Claude API", "LLMs"] },
  { id: "2", icon: "🤖", name: "LLMs & RAG", tags: ["Embeddings", "VectorDB"] },
  { id: "3", icon: "🐍", name: "Python & Flask", tags: ["Flask", "FastAPI"] },
  { id: "4", icon: "⚛️", name: "React & Next.js", tags: ["Hooks", "Tailwind"] },
  { id: "5", icon: "🗄️", name: "MongoDB & SQL", tags: ["MongoDB", "SQLite"] },
  { id: "6", icon: "☁️", name: "Cloud & Supabase", tags: ["Supabase", "Auth"] },
  { id: "7", icon: "👁️", name: "Computer Vision", tags: ["OpenCV", "Face Rec"] },
  { id: "8", icon: "⚙️", name: "Node.js & Express", tags: ["REST API", "JWT"] },
  { id: "9", icon: "🔧", name: "Git & DevTools", tags: ["GitHub", "VS Code"] },
];

const ICONS = ["🧠","🤖","🐍","⚛️","🗄️","☁️","👁️","⚙️","🔧","🎨","📱","🔒","🌐","📊","🚀","💡","🎯","🛠️","📦","⚡"];

/* ── styles ── */
const storage = {
  async get(key, password) {
    if (typeof window !== "undefined" && window.storage) return window.storage.get(key);
    const response = await fetch(apiUrl(`/api/storage?key=${encodeURIComponent(key)}`), {
      headers: { "x-admin-password": password || "" },
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
        "x-admin-password": password || "",
      },
      body: JSON.stringify({ key, value }),
    });
    if (!response.ok) throw new Error("Could not save data.");
  }
};

const S = {
  root: { minHeight:"100vh", background:"#03090b", color:"#e0f7fa", fontFamily:"'Segoe UI',sans-serif", padding:0 },
  login: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#03090b 0%,#061820 100%)" },
  loginBox: { background:"rgba(0,20,28,0.9)", border:"1px solid rgba(0,229,255,0.25)", borderRadius:16, padding:"2.5rem 2rem", width:"100%", maxWidth:380, backdropFilter:"blur(20px)" },
  loginTitle: { fontFamily:"'Orbitron',monospace", fontSize:"1.3rem", fontWeight:800, background:"linear-gradient(90deg,#00e5ff,#1a6cf5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", textAlign:"center", marginBottom:".4rem" },
  loginSub: { color:"#4a7a82", fontSize:".82rem", textAlign:"center", marginBottom:"1.8rem" },
  input: { width:"100%", background:"rgba(0,30,40,0.8)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:8, padding:".8rem 1rem", color:"#e0f7fa", fontSize:".95rem", outline:"none", marginBottom:"1rem", fontFamily:"inherit" },
  loginBtn: { width:"100%", background:"linear-gradient(135deg,#00e5ff,#1a6cf5)", color:"#000", border:"none", borderRadius:50, padding:".85rem", fontWeight:700, fontSize:"1rem", cursor:"pointer", fontFamily:"'Orbitron',monospace", letterSpacing:".08em" },
  err: { color:"#ff5a6a", fontSize:".8rem", textAlign:"center", marginTop:".6rem" },

  nav: { background:"rgba(0,10,15,0.95)", borderBottom:"1px solid rgba(0,229,255,0.15)", padding:"1rem 2rem", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(16px)" },
  navTitle: { fontFamily:"'Orbitron',monospace", fontSize:"1rem", fontWeight:800, background:"linear-gradient(90deg,#00e5ff,#1a6cf5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
  navBtns: { display:"flex", gap:"0.5rem" },
  tabBtn: (active) => ({ background: active ? "linear-gradient(135deg,#00e5ff,#1a6cf5)" : "rgba(0,229,255,0.07)", color: active ? "#000" : "#00e5ff", border: active ? "none" : "1px solid rgba(0,229,255,0.2)", borderRadius:50, padding:".45rem 1.1rem", cursor:"pointer", fontWeight:700, fontSize:".8rem", fontFamily:"inherit", transition:"all .2s" }),
  logoutBtn: { background:"rgba(255,90,106,0.1)", color:"#ff5a6a", border:"1px solid rgba(255,90,106,0.3)", borderRadius:50, padding:".45rem 1rem", cursor:"pointer", fontSize:".8rem", fontFamily:"inherit" },

  main: { padding:"1.5rem", maxWidth:900, margin:"0 auto" },
  pageTitle: { fontFamily:"'Orbitron',monospace", fontSize:"1.2rem", fontWeight:800, color:"#00e5ff", marginBottom:".3rem" },
  pageSub: { color:"#4a7a82", fontSize:".82rem", marginBottom:"1.5rem" },

  statsRow: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"1rem", marginBottom:"1.5rem" },
  statCard: (color) => ({ background:"rgba(0,20,28,0.8)", border:`1px solid ${color}30`, borderRadius:12, padding:"1rem 1.2rem" }),
  statNum: (color) => ({ fontSize:"2rem", fontWeight:800, color, fontFamily:"'Orbitron',monospace", lineHeight:1 }),
  statLabel: { color:"#4a7a82", fontSize:".75rem", marginTop:".2rem" },

  msgList: { display:"flex", flexDirection:"column", gap:".8rem" },
  msgCard: (read) => ({ background: read ? "rgba(0,15,22,0.6)" : "rgba(0,229,255,0.04)", border: `1px solid ${read ? "rgba(255,255,255,0.06)" : "rgba(0,229,255,0.25)"}`, borderRadius:12, padding:"1.2rem 1.4rem", cursor:"pointer", transition:"all .2s", position:"relative" }),
  msgTop: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"1rem", marginBottom:".5rem" },
  msgName: { fontWeight:700, fontSize:"1rem", color:"#e0f7fa" },
  msgEmail: { color:"#00e5ff", fontSize:".8rem" },
  msgSubject: { color:"#e0f7fa", fontSize:".88rem", marginBottom:".4rem", fontWeight:600 },
  msgBody: { color:"#7a9aa0", fontSize:".85rem", lineHeight:1.6 },
  msgDate: { color:"#4a7a82", fontSize:".72rem", flexShrink:0 },
  unreadDot: { position:"absolute", top:"1rem", right:"1rem", width:8, height:8, borderRadius:"50%", background:"#00e5ff", boxShadow:"0 0 8px #00e5ff" },
  noMsg: { textAlign:"center", color:"#4a7a82", padding:"3rem", fontSize:".9rem" },
  delBtn: { background:"rgba(255,90,106,0.1)", color:"#ff5a6a", border:"1px solid rgba(255,90,106,0.25)", borderRadius:6, padding:".3rem .8rem", cursor:"pointer", fontSize:".75rem", fontFamily:"inherit", marginTop:".6rem" },
  markBtn: { background:"rgba(0,229,255,0.1)", color:"#00e5ff", border:"1px solid rgba(0,229,255,0.25)", borderRadius:6, padding:".3rem .8rem", cursor:"pointer", fontSize:".75rem", fontFamily:"inherit", marginTop:".6rem", marginRight:".5rem" },

  skillsGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"1rem", marginBottom:"1.5rem" },
  skillCard: { background:"rgba(0,20,28,0.85)", border:"1px solid rgba(0,229,255,0.18)", borderRadius:12, padding:"1.2rem", display:"flex", flexDirection:"column", gap:".5rem", position:"relative" },
  skillIcon: { fontSize:"1.8rem" },
  skillName: { fontWeight:700, fontSize:"1rem" },
  skillTags: { display:"flex", flexWrap:"wrap", gap:".3rem" },
  tag: { background:"rgba(0,229,255,0.08)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:20, padding:".15rem .5rem", fontSize:".68rem", color:"#00b4cc" },
  skillDelBtn: { position:"absolute", top:".7rem", right:".7rem", background:"rgba(255,90,106,0.12)", color:"#ff5a6a", border:"1px solid rgba(255,90,106,0.2)", borderRadius:6, padding:".2rem .6rem", cursor:"pointer", fontSize:".72rem", fontFamily:"inherit" },

  addBox: { background:"rgba(0,20,28,0.85)", border:"1px solid rgba(0,229,255,0.25)", borderRadius:14, padding:"1.4rem", marginBottom:"1.5rem" },
  addTitle: { fontFamily:"'Orbitron',monospace", fontSize:".75rem", color:"#00e5ff", letterSpacing:".12em", marginBottom:"1rem" },
  addRow: { display:"grid", gridTemplateColumns:"auto 1fr 1fr", gap:".8rem", alignItems:"end", flexWrap:"wrap" },
  addInput: { background:"rgba(0,30,40,0.8)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:8, padding:".65rem .9rem", color:"#e0f7fa", fontSize:".88rem", outline:"none", fontFamily:"inherit", width:"100%" },
  iconSel: { background:"rgba(0,30,40,0.9)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:8, padding:".5rem", display:"flex", flexWrap:"wrap", gap:".3rem", maxHeight:100, overflowY:"auto", marginBottom:".8rem" },
  iconOpt: (sel) => ({ fontSize:"1.3rem", padding:".3rem", borderRadius:6, cursor:"pointer", background: sel ? "rgba(0,229,255,0.2)" : "transparent", border: sel ? "1px solid #00e5ff" : "1px solid transparent" }),
  addBtn: { background:"linear-gradient(135deg,#00e5ff,#1a6cf5)", color:"#000", border:"none", borderRadius:50, padding:".65rem 1.6rem", fontWeight:700, cursor:"pointer", fontFamily:"'Orbitron',monospace", fontSize:".72rem", letterSpacing:".08em", whiteSpace:"nowrap" },
  tagsInput: { background:"rgba(0,30,40,0.8)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:8, padding:".65rem .9rem", color:"#e0f7fa", fontSize:".88rem", outline:"none", fontFamily:"inherit", width:"100%" },
};

export default function AdminPanel() {
  const [authed, setAuthed]   = useState(false);
  const [pw, setPw]           = useState("");
  const [pwErr, setPwErr]     = useState("");
  const [tab, setTab]         = useState("messages");
  const [messages, setMessages] = useState([]);
  const [skills, setSkills]   = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [newSkill, setNewSkill] = useState({ icon:"🚀", name:"", tags:"" });
  const [newQualification, setNewQualification] = useState({ role:"", org:"", desc:"", badge:"" });
  const [newCertification, setNewCertification] = useState({ icon:"🏆", name:"", org:"", badge:"" });
  const [newProject, setNewProject] = useState({ title:"", desc:"", thumb:"", tags:"", demo:"", github:"" });
  const [editingProject, setEditingProject] = useState(null); // { id, title, desc, thumb, tags (string), demo, github }
  const [iconOpen, setIconOpen] = useState(false);

  /* ── load data ── */
  useEffect(() => {
    if (!authed) return;
    (async () => {
      setLoading(true);
      try {
        const mRes = await storage.get('contact_messages', pw);
        if (mRes) setMessages(JSON.parse(mRes.value));
      } catch { setMessages([]); }
      try {
        const sRes = await storage.get('portfolio_skills', pw);
        if (sRes) setSkills(JSON.parse(sRes.value));
        else {
          setSkills(DEFAULT_SKILLS);
          await storage.set('portfolio_skills', JSON.stringify(DEFAULT_SKILLS), pw);
        }
      } catch { setSkills(DEFAULT_SKILLS); }
      try {
        const qRes = await storage.get('portfolio_qualifications', pw);
        if (qRes) setQualifications(JSON.parse(qRes.value));
        else {
          setQualifications(DEFAULT_QUALIFICATIONS);
          await storage.set('portfolio_qualifications', JSON.stringify(DEFAULT_QUALIFICATIONS), pw);
        }
      } catch { setQualifications(DEFAULT_QUALIFICATIONS); }
      try {
        const cRes = await storage.get('portfolio_certifications', pw);
        if (cRes) setCertifications(JSON.parse(cRes.value));
        else {
          setCertifications(DEFAULT_CERTIFICATIONS);
          await storage.set('portfolio_certifications', JSON.stringify(DEFAULT_CERTIFICATIONS), pw);
        }
      } catch { setCertifications(DEFAULT_CERTIFICATIONS); }
      try {
        const pRes = await storage.get('portfolio_projects', pw);
        if (pRes) setProjects(JSON.parse(pRes.value));
        else {
          setProjects(DEFAULT_PROJECTS);
          await storage.set('portfolio_projects', JSON.stringify(DEFAULT_PROJECTS), pw);
        }
      } catch { setProjects(DEFAULT_PROJECTS); }
      setLoading(false);
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

  const saveCertifications = async (updated) => {
    setCertifications(updated);
    try { await storage.set('portfolio_certifications', JSON.stringify(updated), pw); } catch {}
  };

  const saveProjects = async (updated) => {
    setProjects(updated);
    try { await storage.set('portfolio_projects', JSON.stringify(updated), pw); } catch {}
  };

  const saveMsgs = async (updated) => {
    setMessages(updated);
    try { await storage.set('contact_messages', JSON.stringify(updated), pw); } catch {}
  };

  /* ── login ── */
  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl("/api/auth"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": pw,
        },
        body: JSON.stringify({ password: pw }),
      });
      if (response.ok) {
        setAuthed(true);
        setPwErr("");
        return;
      }
      if (response.status === 404 && pw === ADMIN_PASSWORD) {
        setAuthed(true);
        setPwErr("");
        return;
      }
      setPwErr("Wrong password");
    } catch {
      if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwErr(""); }
      else setPwErr("Wrong password");
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

  const deleteQualification = async (id) => {
    await saveQualifications(qualifications.filter(q => q.id !== id));
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

  const unread = messages.filter(m => !m.read).length;
  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) + ' · ' + d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  };

  /* ─────── LOGIN SCREEN ─────── */
  if (!authed) return (
    <div style={S.login}>
      <div style={S.loginBox}>
        <div style={S.loginTitle}>ADMIN PANEL</div>
        <div style={S.loginSub}>Code with Manav · Secure Access</div>
        <form onSubmit={login}>
          <input style={S.input} type="password" placeholder="Enter admin password" value={pw}
            onChange={e => setPw(e.target.value)} autoFocus />
          <button style={S.loginBtn} type="submit">ACCESS PANEL →</button>
          {pwErr && <div style={S.err}>{pwErr}</div>}
        </form>
      </div>
    </div>
  );

  /* ─────── MAIN PANEL ─────── */
  return (
    <div style={S.root}>
      {/* NAV */}
      <div style={S.nav}>
        <div style={S.navTitle}>⚡ ADMIN — CODE WITH MANAV</div>
        <div style={S.navBtns}>
          <button style={S.tabBtn(tab==="messages")} onClick={()=>setTab("messages")}>
            📬 Messages {unread > 0 && <span style={{background:"#00e5ff",color:"#000",borderRadius:10,padding:"0 5px",fontSize:".65rem",marginLeft:4}}>{unread}</span>}
          </button>
          <button style={S.tabBtn(tab==="projects")} onClick={()=>setTab("projects")}>🚀 Projects</button>
          <button style={S.tabBtn(tab==="skills")} onClick={()=>setTab("skills")}>🛠️ Skills</button>
          <button style={S.tabBtn(tab==="qualifications")} onClick={()=>setTab("qualifications")}>Qualifications</button>
          <button style={S.tabBtn(tab==="certifications")} onClick={()=>setTab("certifications")}>Certifications</button>
          <button style={S.logoutBtn} onClick={()=>setAuthed(false)}>Logout</button>
        </div>
      </div>

      <div style={S.main}>
        {loading ? (
          <div style={{textAlign:"center",padding:"3rem",color:"#4a7a82"}}>Loading...</div>
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
                <div key={msg.id} style={S.msgCard(msg.read)} onClick={()=>{ setExpanded(expanded===msg.id?null:msg.id); if(!msg.read) markRead(msg.id); }}>
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
            <div style={S.addBox}>
              <div style={S.addTitle}>+ ADD NEW SKILL</div>
              <div style={{marginBottom:".6rem",fontSize:".82rem",color:"#4a7a82"}}>Pick icon:</div>
              <div style={S.iconSel}>
                {ICONS.map(ic => (
                  <span key={ic} style={S.iconOpt(newSkill.icon===ic)} onClick={()=>setNewSkill(p=>({...p,icon:ic}))}>{ic}</span>
                ))}
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
                <span style={{fontSize:"2rem"}}>{newSkill.icon}</span>
                <span style={{color:"#e0f7fa",fontWeight:700}}>{newSkill.name||"Skill Name"}</span>
                <button style={S.addBtn} onClick={addSkill}>ADD SKILL →</button>
              </div>
            </div>

            {/* Skills Grid */}
            <div style={S.skillsGrid}>
              {skills.map(sk => (
                <div key={sk.id} style={S.skillCard}>
                  <button style={S.skillDelBtn} onClick={()=>deleteSkill(sk.id)}>✕</button>
                  <div style={S.skillIcon}>{sk.icon}</div>
                  <div style={S.skillName}>{sk.name}</div>
                  <div style={S.skillTags}>
                    {sk.tags.map(t=><span key={t} style={S.tag}>{t}</span>)}
                  </div>
                </div>
              ))}
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
            <div style={S.addBox}>
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
        ) : tab === "qualifications" ? (
          <>
            <div style={S.pageTitle}>Manage Qualifications</div>
            <div style={S.pageSub}>Add or remove timeline items shown in the Qualifications section</div>

            <div style={S.addBox}>
              <div style={S.addTitle}>+ ADD QUALIFICATION</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".8rem",marginBottom:".8rem"}}>
                <input style={S.addInput} placeholder="Role / Title" value={newQualification.role} onChange={e=>setNewQualification(p=>({...p,role:e.target.value}))} />
                <input style={S.addInput} placeholder="Organization / Project" value={newQualification.org} onChange={e=>setNewQualification(p=>({...p,org:e.target.value}))} />
              </div>
              <textarea style={{...S.addInput,minHeight:90,resize:"vertical",marginBottom:".8rem"}} placeholder="Description" value={newQualification.desc} onChange={e=>setNewQualification(p=>({...p,desc:e.target.value}))} />
              <div style={{display:"flex",gap:".8rem",alignItems:"center"}}>
                <input style={S.addInput} placeholder="Badge / Year e.g. 2024" value={newQualification.badge} onChange={e=>setNewQualification(p=>({...p,badge:e.target.value}))} />
                <button style={S.addBtn} onClick={addQualification}>ADD</button>
              </div>
            </div>

            <div style={S.msgList}>
              {qualifications.map(q => (
                <div key={q.id} style={S.msgCard(true)}>
                  <button style={S.skillDelBtn} onClick={()=>deleteQualification(q.id)}>X</button>
                  <div style={S.msgName}>{q.role}</div>
                  <div style={S.msgEmail}>{q.org}</div>
                  <div style={S.msgBody}>{q.desc}</div>
                  <div style={S.tag}>{q.badge}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={S.pageTitle}>Manage Certifications</div>
            <div style={S.pageSub}>Add or remove certification cards shown below Qualifications</div>

            <div style={S.addBox}>
              <div style={S.addTitle}>+ ADD CERTIFICATION</div>
              <div style={{display:"grid",gridTemplateColumns:"80px 1fr 1fr 120px",gap:".8rem",marginBottom:".8rem"}}>
                <input style={S.addInput} placeholder="Icon" value={newCertification.icon} onChange={e=>setNewCertification(p=>({...p,icon:e.target.value}))} />
                <input style={S.addInput} placeholder="Certificate name" value={newCertification.name} onChange={e=>setNewCertification(p=>({...p,name:e.target.value}))} />
                <input style={S.addInput} placeholder="Provider" value={newCertification.org} onChange={e=>setNewCertification(p=>({...p,org:e.target.value}))} />
                <input style={S.addInput} placeholder="Year" value={newCertification.badge} onChange={e=>setNewCertification(p=>({...p,badge:e.target.value}))} />
              </div>
              <button style={S.addBtn} onClick={addCertification}>ADD CERTIFICATION</button>
            </div>

            <div style={S.skillsGrid}>
              {certifications.map(c => (
                <div key={c.id} style={S.skillCard}>
                  <button style={S.skillDelBtn} onClick={()=>deleteCertification(c.id)}>X</button>
                  <div style={S.skillIcon}>{c.icon}</div>
                  <div style={S.skillName}>{c.name}</div>
                  <div style={S.msgEmail}>{c.org}</div>
                  <span style={S.tag}>{c.badge}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
