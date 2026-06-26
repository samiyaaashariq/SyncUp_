import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardV2.css";

import { db, auth } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardV2() {
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const projectsRef = useRef(null);
  const teamRef = useRef(null);

  const recommendedProjects = [
    "AI Resume Analyzer",
    "Hackathon Finder",
    "AR/VR Learning Hub",
    "Founder Match",
  ];

  const teammates = [
    { name: "Sarah Khan", role: "UI/UX Designer", match: "89%" },
    { name: "Ali Ahmed", role: "Frontend Developer", match: "94%" },
    { name: "Priya Sharma", role: "Backend Developer", match: "87%" },
  ];

  // Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUserEmail(user.email || "");
    });
    return () => unsubscribe();
  }, []);

  // Real-time projects
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(data);
    });
    return () => unsubscribe();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      project.name?.toLowerCase().includes(term) ||
      project.description?.toLowerCase().includes(term) ||
      (project.tags || []).some((t) => t.toLowerCase().includes(term))
    );
  });

  const handleCreateProject = async () => {
    if (!projectName.trim() || !projectDesc.trim()) return alert("Please fill both fields");
    try {
      await addDoc(collection(db, "projects"), {
        name: projectName.trim(),
        description: projectDesc.trim(),
        status: "Recruiting",
        applicants: 0,
        members: 1,
        creator: currentUserEmail || "Anonymous",
        tags: ["Startup"],
        createdAt: Date.now(),
      });
      setProjectName("");
      setProjectDesc("");
      setShowCreateModal(false);
      alert("Project created!");
    } catch (err) {
      alert("Failed to create project");
    }
  };

  const handleApply = async (projectId) => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Please login first");
      await addDoc(collection(db, "applications"), {
        projectId,
        userEmail: user.email,
        status: "pending",
        createdAt: Date.now(),
      });
      alert("Application sent!");
    } catch (err) {
      alert("Failed to apply");
    }
  };

  const handleLaunchRecommended = (name) => {
    setProjectName(name);
    setProjectDesc(`Excited to build ${name}! Add your vision here...`);
    setShowCreateModal(true);
  };

  const handleConnect = async (teammate) => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Please login");
      await addDoc(collection(db, "connections"), {
        from: user.email,
        to: teammate.name,
        role: teammate.role,
        match: teammate.match,
        status: "pending",
        createdAt: Date.now(),
      });
      alert(`Connection request sent to ${teammate.name}!`);
    } catch (err) {
      alert("Request sent (demo)");
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToProjects = () => projectsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToTeam = () => teamRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">SyncUp</div>

        <div className="sidebar-menu">
          <button className="menu-btn" onClick={() => { scrollToTop(); setSidebarOpen(false); }}>Dashboard</button>
          <button className="menu-btn" onClick={() => { scrollToProjects(); setSidebarOpen(false); }}>Explore Projects</button>
          <button className="menu-btn" onClick={() => { scrollToTeam(); setSidebarOpen(false); }}>Team Finder</button>

          <button className="menu-btn" onClick={() => navigate("/chat")}>Messages</button>
          <button className="menu-btn" onClick={() => navigate("/notifications")}>Notifications</button>
          <button className="menu-btn" onClick={() => navigate("/ai-copilot")}>AI Copilot</button>
          <button className="menu-btn" onClick={() => navigate("/profile")}>Profile</button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 15,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN */}
      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ fontSize: "28px", background: "none", border: "none", color: "white", cursor: "pointer", padding: "4px" }}
            >
              ☰
            </button>
            <div>
              <h1 className="welcome-title">Welcome back 👋</h1>
              <p className="welcome-subtitle">Build startups. Find teammates. Ship products.</p>
            </div>
          </div>

          <div className="topbar-actions">
            <input
              className="search-box"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="create-btn" onClick={() => setShowCreateModal(true)}>
              + Create Project
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="section">
          <div className="stats-row">
            <div className="stat-card">
              <h3>Total Projects</h3>
              <p>{projects.length}</p>
            </div>
            <div className="stat-card">
              <h3>Recruiting Now</h3>
              <p>{projects.filter(p => (p.status || "").toLowerCase() === "recruiting").length}</p>
            </div>
            <div className="stat-card">
              <h3>Teammates Ready</h3>
              <p>42</p>
            </div>
            <div className="stat-card">
              <h3>Applications</h3>
              <p>—</p>
            </div>
          </div>
        </div>

        {/* Recommended */}
        <div className="section">
          <h2>✨ Recommended for You</h2>
          <div className="projects-grid">
            {recommendedProjects.map((rec, i) => (
              <div key={i} className="recommended-card">
                <h3>{rec}</h3>
                <p>High demand • Great for portfolio</p>
                <button className="primary-btn" style={{ marginTop: "16px", width: "100%" }} onClick={() => handleLaunchRecommended(rec)}>
                  Launch Project
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Team Finder */}
        <div className="section" ref={teamRef}>
          <h2>🤝 Find Teammates</h2>
          <div className="projects-grid">
            {teammates.map((tm, i) => (
              <div key={i} className="team-card">
                <h3>{tm.name}</h3>
                <p>{tm.role} • {tm.match} Match</p>
                <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                  <button className="primary-btn" onClick={() => handleConnect(tm)}>Connect</button>
                  <button className="secondary-btn" onClick={() => navigate("/chat")}>Message</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="section" ref={projectsRef}>
          <h2>🚀 Startup Projects</h2>
          <div className="projects-grid">
            {filteredProjects.map((project) => {
              const isOwner = project.creator === currentUserEmail || project.creator === "Samiya";
              return (
                <div key={project.id} className="project-card">
                  <h3>{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="tags">
                    {(project.tags || []).map((t, i) => <span key={i} className="tag">{t}</span>)}
                  </div>
                  <div className="metrics">
                    <p>👥 {project.members || 0} Members</p>
                    <p>📩 {project.applicants || 0} Applicants</p>
                  </div>
                  <div className="project-actions">
                    <button className="primary-btn" onClick={() => navigate(`/project/${project.id}`)}>View</button>
                    {isOwner ? (
                      <button className="secondary-btn" onClick={() => navigate(`/manage/${project.id}`)}>Manage</button>
                    ) : (
                      <button className="secondary-btn" onClick={() => handleApply(project.id)}>Apply</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Project</h2>
            <input
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="modal-input"
            />
            <textarea
              placeholder="Project Description"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="modal-textarea"
            />
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button className="primary-btn" onClick={handleCreateProject}>Create</button>
              <button className="secondary-btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
