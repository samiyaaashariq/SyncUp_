import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // State for projects (you can later connect this to Firebase)
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Northern Airlines Booking System",
      description: "Real-time flight booking platform with AI recommendations.",
      status: "Active"
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  // Create new project
  const createProject = () => {
    if (!newProject.name.trim()) return;

    const project = {
      id: Date.now(),
      name: newProject.name,
      description: newProject.description,
      status: "Planning"
    };

    setProjects([...projects, project]);
    setNewProject({ name: "", description: "" });
    setShowCreateModal(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a, #1a1a1a, #121212)",
      color: "#e0e0e0",
      fontFamily: "system-ui, sans-serif",
      padding: "40px"
    }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "3rem", color: "#00ff9f" }}>Welcome back, Samiya</h1>
            <p style={{ color: "#aaa" }}>Let’s build something amazing today.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)} 
            style={{ padding: "14px 36px", background: "#00ff9f", color: "#000", border: "none", borderRadius: "50px", fontWeight: "700" }}
          >
            + Create New Project
          </button>
        </div>

        {/* Projects Section */}
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ color: "#00ff9f", marginBottom: "20px" }}>My Projects</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            {projects.map(project => (
              <div key={project.id} style={{ background: "#1f1f1f", padding: "25px", borderRadius: "16px", border: "1px solid #00ff9f" }}>
                <h3>{project.name}</h3>
                <p style={{ color: "#aaa" }}>{project.description}</p>
                <div style={{ marginTop: "15px" }}>
                  <button onClick={() => navigate(`/project/${project.id}`)} style={{ padding: "8px 20px", background: "#00ff9f", color: "#000", border: "none", borderRadius: "8px" }}>
                    View Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Features */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
          <div onClick={() => navigate("/ai-copilot")} style={{ background: "#1f1f1f", padding: "30px", borderRadius: "16px", border: "1px solid #00ff9f", cursor: "pointer" }}>
            <h3 style={{ color: "#00ff9f" }}>🚀 AI Project Copilot</h3>
            <p>Generate full project plans instantly.</p>
          </div>

          <div onClick={() => navigate("/chat")} style={{ background: "#1f1f1f", padding: "30px", borderRadius: "16px", border: "1px solid #00b8d4", cursor: "pointer" }}>
            <h3 style={{ color: "#00b8d4" }}>💬 Team Chat Room</h3>
            <p>Real-time communication with your team.</p>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{ background: "#1f1f1f", padding: "30px", borderRadius: "16px", width: "400px", border: "1px solid #00ff9f" }}>
            <h3 style={{ color: "#00ff9f", marginBottom: "20px" }}>Create New Project</h3>
            <input
              type="text"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              style={{ width: "100%", padding: "12px", marginBottom: "15px", background: "#0f0f0f", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
            />
            <textarea
              placeholder="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              style={{ width: "100%", padding: "12px", marginBottom: "20px", background: "#0f0f0f", border: "1px solid #333", borderRadius: "8px", color: "#fff", height: "100px" }}
            />
            <div style={{ display: "flex", gap: "15px" }}>
              <button onClick={createProject} style={{ flex: 1, padding: "12px", background: "#00ff9f", color: "#000", border: "none", borderRadius: "8px", fontWeight: "700" }}>
                Create Project
              </button>
              <button onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid #00ff9f", color: "#00ff9f", borderRadius: "8px" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
