import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardV2.css";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

export default function DashboardV2() {
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [projects, setProjects] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const recommendedProjects = [
    "AI Resume Analyzer",
    "Hackathon Finder",
    "AR/VR Learning Hub",
    "Founder Match",
  ];

  const teammates = [
    { name: "Sarah Khan", role: "UI/UX Designer", match: "89%" },
    { name: "Ali Ahmed", role: "Frontend Developer", match: "94%" },
  ];

  // 🔥 REAL-TIME FIREBASE FETCH
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

  // 🔥 CREATE PROJECT
  const handleCreateProject = async () => {
    if (!projectName || !projectDesc) return;

    await addDoc(collection(db, "projects"), {
      name: projectName,
      description: projectDesc,
      status: "Recruiting",
      applicants: 0,
      members: 1,
      creator: "Samiya",
      tags: ["Startup"],
      createdAt: Date.now(),
    });

    setProjectName("");
    setProjectDesc("");
    setShowCreateModal(false);
  };

  return (
    <div className="dashboard-container">
      const handleApply = async (projectId) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    await addDoc(collection(db, "applications"), {
      projectId: projectId,
      userEmail: user.email,
      status: "pending",
      createdAt: Date.now()
    });

    alert("Application sent!");
  } catch (err) {
    console.error(err);
    alert("Failed to apply");
  }
};

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">SyncUp</div>

        <div className="sidebar-menu">
          <button className="menu-btn">Dashboard</button>
          <button className="menu-btn">Explore Projects</button>
          <button className="menu-btn">Team Finder</button>

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

      {/* MAIN */}
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
            <input className="search-box" placeholder="Search projects..." />

            <button
              className="create-btn"
              onClick={() => setShowCreateModal(true)}
            >
              + Create Project
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">

          <div className="stat-card">
            <h3>Projects</h3>
            <p>{projects.length}</p>
          </div>

          <div className="stat-card">
            <h3>Applications</h3>
            <p>{projects.reduce((acc, p) => acc + (p.applicants || 0), 0)}</p>
          </div>

          <div className="stat-card">
            <h3>Teams</h3>
            <p>{projects.reduce((acc, p) => acc + (p.members || 0), 0)}</p>
          </div>

          <div className="stat-card">
            <h3>Communities</h3>
            <p>14</p>
          </div>
        </div>

        {/* RECOMMENDED */}
        <div className="section">
          <h2>🔥 Recommended For You</h2>

          <div className="recommended-grid">
            {recommendedProjects.map((p, i) => (
              <div key={i} className="recommended-card">
                <h3>{p}</h3>
                <p>Based on your startup activity.</p>
                <button className="explore-btn">Explore →</button>
              </div>
            ))}
          </div>
        </div>

        {/* PROJECTS */}
        <div className="section">
          <h2>🚀 Startup Projects</h2>

          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">

                <h3>{project.name}</h3>

                <p className="project-description">
                  {project.description}
                </p>

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
                  <button
  className="secondary-btn"
  onClick={() => handleApply(project.id)}
>
  Apply to Join
</button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* TEAM FINDER */}
        <div className="section">
          <h2>🤝 Team Finder</h2>

          <div className="team-grid">
            {teammates.map((m, i) => (
              <div key={i} className="team-card">
                <h3>{m.name}</h3>
                <p>{m.role}</p>
                <p>{m.match} match</p>

                <button className="primary-btn">Connect</button>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* CREATE MODAL */}
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

            <div className="modal-actions">

              <button
                className="primary-btn"
                onClick={handleCreateProject}
              >
                Create
              </button>

              <button
                className="secondary-btn"
                onClick={() => setShowCreateModal(false)}
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
