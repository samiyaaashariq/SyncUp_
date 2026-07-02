import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

import RecommendedProjects from "../components/RecommendedProjects";
import ProjectDiscovery from "../components/ProjectDiscovery";
import TeamMatcher from "../components/TeamMatcher";

const FUN_GREETINGS = [
  "Welcome back, Builder",
  "Ready to ship something, Builder",
  "Let's make things, Builder",
  "Good to see you, Builder",
];

export default function DashboardV2() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const projectsRef = useRef(null);
  const teamRef = useRef(null);

  const greeting = FUN_GREETINGS[new Date().getDate() % FUN_GREETINGS.length];
  const firstName = auth.currentUser?.email?.split("@")[0];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleCreateProject = async () => {
    if (!projectName || !projectDesc) return;
    await addDoc(collection(db, "projects"), {
      title: projectName,
      fullBrief: projectDesc,
      description: projectDesc,
      status: "Recruiting",
      creator: auth.currentUser?.email || "You",
      members: auth.currentUser ? [auth.currentUser.uid] : [],
      createdAt: Date.now(),
    });
    setProjectName("");
    setProjectDesc("");
    setShowCreateModal(false);
  };

  return (
    <div className="dv2Container">
      <style>{dashboardCss}</style>

      <aside className={`dv2Sidebar ${sidebarOpen ? "dv2SidebarOpen" : ""}`}>
        <div className="dv2Logo">SyncUp</div>
        <nav className="dv2Menu">
          <button
            className="dv2MenuBtn dv2Active"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setSidebarOpen(false);
            }}
          >
            🏠 Dashboard
          </button>
          <button
            className="dv2MenuBtn"
            onClick={() => {
              projectsRef.current?.scrollIntoView({ behavior: "smooth" });
              setSidebarOpen(false);
            }}
          >
            🔍 Discover Projects
          </button>
          <button
            className="dv2MenuBtn"
            onClick={() => {
              teamRef.current?.scrollIntoView({ behavior: "smooth" });
              setSidebarOpen(false);
            }}
          >
            👥 Team Finder
          </button>
          <button className="dv2MenuBtn" onClick={() => navigate("/messages")}>💬 Messages</button>
          <button className="dv2MenuBtn" onClick={() => navigate("/ai-copilot")}>🤖 AI Copilot</button>
          <button className="dv2MenuBtn" onClick={() => navigate("/profile")}>👤 Profile</button>
        </nav>
      </aside>

      {sidebarOpen && <div className="dv2Overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="dv2Main">
        <div className="dv2Topbar">
          <button
            className="dv2Hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
          <h1 className="dv2Welcome">
            {greeting}{firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <button className="dv2CreateBtn" onClick={() => setShowCreateModal(true)}>+ New</button>
        </div>

        <div className="dv2StatsGrid">
          <div className="dv2StatCard">Total Projects: {projects.length}</div>
          <div className="dv2StatCard">Active Teams: 12</div>
          <div className="dv2StatCard">Connections: 8</div>
        </div>

        <RecommendedProjects />

        <div ref={projectsRef} className="dv2Section">
          <h2 className="dv2SectionTitle">Discover Projects</h2>
          <ProjectDiscovery />
        </div>

        <div ref={teamRef} className="dv2Section">
          <h2 className="dv2SectionTitle">Find Teammates</h2>
          <TeamMatcher />
        </div>
      </main>

      {showCreateModal && (
        <div className="dv2ModalOverlay">
          <div className="dv2Modal">
            <h2>Create New Project</h2>
            <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project Name" />
            <textarea value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} placeholder="Short description" />
            <div className="dv2ModalButtons">
              <button onClick={handleCreateProject} className="dv2Create">Create</button>
              <button onClick={() => setShowCreateModal(false)} className="dv2Cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const dashboardCss = `
  .dv2Container { display: flex; min-height: 100vh; background: #020617; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

  .dv2Sidebar {
    width: 240px;
    flex-shrink: 0;
    background: rgba(15,23,42,0.95);
    border-right: 1px solid rgba(103,232,249,0.15);
    padding: 24px 16px;
    position: sticky;
    top: 0;
    height: 100vh;
  }
  .dv2Logo { font-size: 1.4rem; font-weight: 800; color: #c084fc; margin-bottom: 24px; padding-left: 8px; }
  .dv2Menu { display: flex; flex-direction: column; gap: 6px; }
  .dv2MenuBtn {
    text-align: left;
    background: transparent;
    border: none;
    color: #cbd5e1;
    padding: 12px 14px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.95rem;
  }
  .dv2MenuBtn:hover { background: rgba(103,232,249,0.08); color: #67e8f9; }
  .dv2Active { background: rgba(103,232,249,0.12); color: #67e8f9; font-weight: 600; }

  .dv2Overlay { display: none; }

  .dv2Main { flex: 1; padding: 24px 30px 60px; min-width: 0; }

  .dv2Topbar { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .dv2Hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    width: 40px;
    height: 40px;
    background: rgba(103,232,249,0.1);
    border: 1px solid rgba(103,232,249,0.3);
    border-radius: 10px;
    cursor: pointer;
    flex-shrink: 0;
  }
  .dv2Hamburger span { display: block; width: 18px; height: 2px; background: #67e8f9; margin: 0 auto; border-radius: 2px; }

  .dv2Welcome { flex: 1; font-size: 1.6rem; font-weight: 700; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dv2CreateBtn {
    background: linear-gradient(135deg, #ec4899, #c084fc);
    color: #fff;
    border: none;
    padding: 10px 18px;
    border-radius: 999px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .dv2StatsGrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 30px; }
  .dv2StatCard {
    background: rgba(15,23,42,0.85);
    border: 1px solid rgba(103,232,249,0.2);
    border-radius: 14px;
    padding: 18px;
    font-size: 0.9rem;
    color: #cbd5e1;
  }

  .dv2Section { margin-top: 36px; }
  .dv2SectionTitle {
    font-size: 1.4rem;
    margin-bottom: 16px;
    background: linear-gradient(90deg, #67e8f9, #c084fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .dv2ModalOverlay {
    position: fixed; inset: 0; background: rgba(2,6,23,0.75);
    display: flex; align-items: center; justify-content: center;
    z-index: 50; padding: 16px;
  }
  .dv2Modal {
    background: rgba(15,23,42,0.98);
    border: 1px solid rgba(103,232,249,0.3);
    border-radius: 18px;
    padding: 26px;
    width: 100%;
    max-width: 420px;
  }
  .dv2Modal input, .dv2Modal textarea {
    width: 100%;
    padding: 12px;
    margin-top: 12px;
    background: rgba(2,6,23,0.6);
    border: 1px solid #67e8f9;
    border-radius: 10px;
    color: #fff;
    font-size: 0.95rem;
  }
  .dv2Modal textarea { min-height: 90px; resize: vertical; }
  .dv2ModalButtons { display: flex; gap: 10px; margin-top: 18px; }
  .dv2Create, .dv2Cancel { flex: 1; padding: 12px; border-radius: 999px; font-weight: 600; cursor: pointer; border: none; }
  .dv2Create { background: linear-gradient(135deg, #ec4899, #c084fc); color: #fff; }
  .dv2Cancel { background: transparent; color: #94a3b8; border: 1px solid rgba(148,163,184,0.4); }

  /* ---------- MOBILE ---------- */
  @media (max-width: 860px) {
    .dv2Sidebar {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      transform: translateX(-100%);
      transition: transform 0.25s ease;
      box-shadow: 4px 0 24px rgba(0,0,0,0.5);
      width: 220px;
    }
    .dv2SidebarOpen { transform: translateX(0); }
    .dv2Overlay {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      z-index: 90;
    }
    .dv2Hamburger { display: flex; }
    .dv2Main { padding: 16px 14px 50px; }
    .dv2Welcome { font-size: 1.2rem; }
    .dv2CreateBtn { padding: 8px 12px; font-size: 0.85rem; }
    .dv2StatsGrid { grid-template-columns: 1fr 1fr; }
    .dv2StatCard { font-size: 0.8rem; padding: 14px; }
  }

  @media (max-width: 480px) {
    .dv2StatsGrid { grid-template-columns: 1fr; }
    .dv2Welcome { font-size: 1.05rem; }
  }
`;
