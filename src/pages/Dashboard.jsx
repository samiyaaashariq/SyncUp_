import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardV2.css";

import { db, auth } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

import RecommendedProjects from "../components/RecommendedProjects";
import ProjectDiscovery from "../components/ProjectDiscovery";
import TeamMatcher from "../components/TeamMatcher";

export default function DashboardV2() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const projectsRef = useRef(null);
  const teamRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleCreateProject = async () => {
    if (!projectName || !projectDesc) return;
    await addDoc(collection(db, "projects"), {
      name: projectName,
      description: projectDesc,
      status: "Recruiting",
      creator: auth.currentUser?.email || "You",
      createdAt: Date.now(),
    });
    setProjectName("");
    setProjectDesc("");
    setShowCreateModal(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">SyncUp</div>
        <nav className="sidebar-menu">
          <button className="menu-btn active" onClick={() => { window.scrollTo({top:0, behavior:'smooth'}); setSidebarOpen(false); }}>🏠 Dashboard</button>
          <button className="menu-btn" onClick={() => { projectsRef.current?.scrollIntoView({behavior:'smooth'}); setSidebarOpen(false); }}>🔍 Discover Projects</button>
          <button className="menu-btn" onClick={() => { teamRef.current?.scrollIntoView({behavior:'smooth'}); setSidebarOpen(false); }}>👥 Team Finder</button>
         <button className="menu-btn" onClick={() => navigate("/messages")}>💬 Messages</button>
          <button className="menu-btn" onClick={() => navigate("/ai-copilot")}>🤖 AI Copilot</button>
          <button className="menu-btn" onClick={() => navigate("/profile")}>👤 Profile</button>
        </nav>
      </aside>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="main-content">
        <div className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className="welcome">Welcome back, Samiya 👋</h1>
          <button className="create-btn" onClick={() => setShowCreateModal(true)}>+ New Project</button>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">Total Projects: {projects.length}</div>
          <div className="stat-card">Active Teams: 12</div>
          <div className="stat-card">Connections: 8</div>
        </div>

        {/* Recommended */}
        <RecommendedProjects />

        {/* Discover Projects */}
        <div ref={projectsRef} className="section">
          <h2 className="section-title">Discover Projects</h2>
          <ProjectDiscovery />
        </div>

        {/* Team Finder */}
        <div ref={teamRef} className="section">
          <h2 className="section-title">Find Teammates</h2>
          <TeamMatcher />
        </div>
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Project</h2>
            <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Project Name" />
            <textarea value={projectDesc} onChange={e => setProjectDesc(e.target.value)} placeholder="Short description" />
            <div className="modal-buttons">
              <button onClick={handleCreateProject} className="create">Create</button>
              <button onClick={() => setShowCreateModal(false)} className="cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
