import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardV2.css";

import { db, auth } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

export default function DashboardV2() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const projectsRef = useRef(null);
  const teamRef = useRef(null);

  // Fetch projects
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
      creator: "Samiya",
      createdAt: Date.now(),
    });
    setProjectName("");
    setProjectDesc("");
    setShowCreateModal(false);
  };

  const handleApply = (id) => {
    alert("Application sent to project " + id);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">SyncUp</div>
        <div className="sidebar-menu">
          <button className="menu-btn" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>🏠 Dashboard</button>
          <button className="menu-btn" onClick={() => projectsRef.current?.scrollIntoView({behavior:'smooth'})}>🔍 Explore Projects</button>
          <button className="menu-btn" onClick={() => teamRef.current?.scrollIntoView({behavior:'smooth'})}>🤝 Team Finder</button>
          <button className="menu-btn" onClick={() => navigate("/chat")}>💬 Messages</button>
          <button className="menu-btn" onClick={() => navigate("/ai-copilot")}>🤖 AI Copilot</button>
          <button className="menu-btn" onClick={() => navigate("/profile")}>👤 Profile</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="topbar">
          <h1>Welcome back 👋</h1>
          <button onClick={() => setShowCreateModal(true)}>+ Create Project</button>
        </div>

        {/* Stats */}
        <div className="section">
          <h2>Overview</h2>
          <div className="projects-grid">
            <div className="stat-card">Total Projects: {projects.length}</div>
            <div className="stat-card">Active Teams: 12</div>
          </div>
        </div>

        {/* Recommended */}
        <div className="section">
          <h2>Recommended Projects</h2>
          <div className="projects-grid">
            {["AI Resume Analyzer", "Hackathon Finder", "AR Learning Hub"].map((name, i) => (
              <div key={i} className="recommended-card">
                <h3>{name}</h3>
                <button onClick={() => alert("Launching " + name)}>Launch Idea</button>
              </div>
            ))}
          </div>
        </div>

        {/* Team Finder */}
        <div className="section" ref={teamRef}>
          <h2>Find Teammates</h2>
          <div className="projects-grid">
            {[
              {name: "Sarah Khan", role: "Designer"},
              {name: "Ali Ahmed", role: "Developer"}
            ].map((t, i) => (
              <div key={i} className="team-card">
                <h3>{t.name}</h3>
                <p>{t.role}</p>
                <button onClick={() => alert("Connected with " + t.name)}>Connect</button>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="section" ref={projectsRef}>
          <h2>Startup Projects</h2>
          <div className="projects-grid">
            {projects.map(p => (
              <div key={p.id} className="project-card">
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <button onClick={() => navigate(`/project/${p.id}`)}>View</button>
                <button onClick={() => handleApply(p.id)}>Apply</button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Project</h2>
            <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project Name" />
            <textarea value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} placeholder="Description" />
            <button onClick={handleCreateProject}>Create</button>
            <button onClick={() => setShowCreateModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
