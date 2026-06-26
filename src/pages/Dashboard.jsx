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

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email || "");
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time projects from Firebase
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

  // Filtered projects (search works on name, description, tags)
  const filteredProjects = projects.filter((project) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const nameMatch = project.name?.toLowerCase().includes(term);
    const descMatch = project.description?.toLowerCase().includes(term);
    const tagMatch = (project.tags || []).some((tag) =>
      tag.toLowerCase().includes(term)
    );
    return nameMatch || descMatch || tagMatch;
  });

  // Create Project (enhanced with current user)
  const handleCreateProject = async () => {
    if (!projectName.trim() || !projectDesc.trim()) {
      alert("Please fill in both project name and description");
      return;
    }

    try {
      await addDoc(collection(db, "projects"), {
        name: projectName.trim(),
        description: projectDesc.trim(),
        status: "Recruiting",
        applicants: 0,
        members: 1,
        creator: currentUserEmail || "Anonymous",
        tags: ["Startup", "New"],
        createdAt: Date.now(),
      });

      setProjectName("");
      setProjectDesc("");
      setShowCreateModal(false);
      alert("Project created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create project. Please try again.");
    }
  };

  // Apply to project
  const handleApply = async (projectId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please login first");
        return;
      }

      await addDoc(collection(db, "applications"), {
        projectId,
        userEmail: user.email,
        status: "pending",
        createdAt: Date.now(),
      });

      alert("Application sent successfully! The project creator will be notified.");
    } catch (err) {
      console.error(err);
      alert("Failed to send application. Please try again.");
    }
  };

  // Launch recommended project (prefills modal)
  const handleLaunchRecommended = (name) => {
    setProjectName(name);
    setProjectDesc(
      `Excited to build ${name}! This project aims to solve real problems for students and founders. Add your unique vision, tech stack, and goals here.`
    );
    setShowCreateModal(true);
  };

  // Connect with teammate (saves to Firestore)
  const handleConnect = async (teammate) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please login first");
        return;
      }

      await addDoc(collection(db, "connections"), {
        from: user.email,
        to: teammate.name,
        role: teammate.role,
        match: teammate.match,
        status: "pending",
        createdAt: Date.now(),
      });

      alert(`Connection request sent to ${teammate.name}! They'll be notified.`);
    } catch (err) {
      console.error(err);
      alert(`Connection request sent to ${teammate.name}! (Demo mode)`);
    }
  };

  // Sidebar navigation helpers
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToTeam = () => {
    teamRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">SyncUp</div>

        <div className="sidebar-menu">
          <button className="menu-btn" onClick={scrollToTop}>
            Dashboard
          </button>
          <button className="menu-btn" onClick={scrollToProjects}>
            Explore Projects
          </button>
          <button className="menu-btn" onClick={scrollToTeam}>
            Team Finder
          </button>

          <button className="menu-btn" onClick={() => navigate("/chat")}>
            Messages
          </button>
          <button className="menu-btn" onClick={() => navigate("/notifications")}>
            Notifications
          </button>
          <button className="menu-btn" onClick={() => navigate("/ai-copilot")}>
            AI Copilot
          </button>
          <button className="menu-btn" onClick={() => navigate("/profile")}>
            Profile
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <h1 className="welcome-title">Welcome back 👋</h1>
            <p className="welcome-subtitle">
              Build startups. Find teammates. Ship products.
            </p>
          </div>

          <div className="topbar-actions">
            <input
              className="search-box"
              placeholder="Search projects, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="create-btn"
              onClick={() => setShowCreateModal(true)}
            >
              + Create Project
            </button>
          </div>
        </div>

        {/* STATS ROW (glass cards from your CSS) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div className="stat-card">
            <h3>🚀 Total Projects</h3>
            <p>{projects.length}</p>
          </div>
          <div className="stat-card">
            <h3>🔥 Recruiting Now</h3>
            <p>
              {projects.filter((p) => (p.status || "").toLowerCase() === "recruiting").length}
            </p>
          </div>
          <div className="stat-card">
            <h3>👥 Teammates Ready</h3>
            <p>{teammates.length * 12 + 47}</p>
          </div>
          <div className="stat-card">
            <h3>📬 Applications Sent</h3>
            <p>—</p>
          </div>
        </div>

        {/* RECOMMENDED PROJECTS */}
        <div className="section">
          <h2>✨ Recommended for You</h2>
          <div
            className="projects-grid"
            style={{ marginBottom: "32px" }}
          >
            {recommendedProjects.map((rec, index) => (
              <div key={index} className="recommended-card">
                <h3 style={{ color: "#0f172a", marginBottom: "8px", fontSize: "15px" }}>
                  {rec}
                </h3>
                <p style={{ fontSize: "13px", color: "#475569", marginBottom: "14px" }}>
                  High demand • Great for portfolio &amp; startup experience
                </p>
                <button
                  className="primary-btn"
                  style={{ width: "100%" }}
                  onClick={() => handleLaunchRecommended(rec)}
                >
                  Launch this Project
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM FINDER */}
        <div className="section" ref={teamRef}>
          <h2>🤝 Find Teammates</h2>
          <p style={{ color: "#64748b", marginBottom: "16px", fontSize: "14px" }}>
            AI-matched collaborators ready to build with you
          </p>
          <div className="projects-grid" style={{ marginBottom: "32px" }}>
            {teammates.map((tm, index) => (
              <div key={index} className="team-card">
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #38bdf8, #6366f1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "700",
                      fontSize: "17px",
                      flexShrink: 0,
                    }}
                  >
                    {tm.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: "white", fontSize: "15px" }}>{tm.name}</h3>
                    <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>{tm.role}</p>
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <span
                    className="tag"
                    style={{
                      background: "rgba(52, 211, 153, 0.15)",
                      color: "#34d399",
                      border: "1px solid rgba(52, 211, 153, 0.3)",
                    }}
                  >
                    {tm.match} Match
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="primary-btn"
                    style={{ flex: 1 }}
                    onClick={() => handleConnect(tm)}
                  >
                    Connect
                  </button>
                  <button
                    className="secondary-btn"
                    style={{ flex: 1, color: "white", borderColor: "rgba(255,255,255,0.25)" }}
                    onClick={() => navigate("/chat")}
                  >
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STARTUP PROJECTS (from Firebase) */}
        <div className="section" ref={projectsRef}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2>🚀 Startup Projects</h2>
            <span style={{ color: "#64748b", fontSize: "14px" }}>
              {filteredProjects.length} {searchTerm ? "results" : "projects"}
            </span>
          </div>

          {filteredProjects.length === 0 && searchTerm && (
            <p style={{ color: "#64748b", padding: "20px 0" }}>
              No projects match your search. Try different keywords.
            </p>
          )}

          <div className="projects-grid">
            {filteredProjects.map((project) => {
              const isOwner =
                project.creator === currentUserEmail || project.creator === "Samiya";

              return (
                <div key={project.id} className="project-card">
                  <h3>{project.name}</h3>

                  <p className="project-description">{project.description}</p>

                  <div className="tags">
                    {(project.tags || []).map((t, i) => (
                      <span key={i} className="tag">{t}</span>
                    ))}
                  </div>

                  <div className="metrics">
                    <p>👥 {project.members || 0} Members</p>
                    <p>📩 {project.applicants || 0} Applicants</p>
                  </div>

                  <div className="project-actions">
                    <button
                      className="primary-btn"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      View
                    </button>

                    {isOwner && (
                      <button
                        className="secondary-btn"
                        onClick={() => navigate(`/manage/${project.id}`)}
                      >
                        Manage
                      </button>
                    )}

                    {!isOwner && (
                      <button
                        className="secondary-btn"
                        onClick={() => handleApply(project.id)}
                      >
                        Apply to Join
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {projects.length === 0 && !searchTerm && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
              No projects yet. Be the first to create one!
            </div>
          )}
        </div>
      </main>

      {/* CREATE PROJECT MODAL */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Project</h2>

            <input
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="modal-input"
            />

            <textarea
              placeholder="Describe your project idea, goals, and what kind of teammates you're looking for..."
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="modal-textarea"
              rows={5}
            />

            <div className="modal-actions">
              <button className="primary-btn" onClick={handleCreateProject}>
                Create Project
              </button>
              <button
                className="secondary-btn"
                onClick={() => {
                  setShowCreateModal(false);
                  setProjectName("");
                  setProjectDesc("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
