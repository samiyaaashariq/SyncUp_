import React, { useEffect, useState } from "react";
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

  // 🔥 APPLY FUNCTION (FIXED LOCATION)
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
        createdAt: Date.now(),
      });

      alert("Application sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to apply");
    }
  };

  return (
    <div className="dashboard-container">

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
