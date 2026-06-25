import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardV2.css";

export default function DashboardV2() {
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [projects] = useState([
    {
      id: 1,
      name: "Northern Airlines Booking System",
      description:
        "Real-time flight booking platform with AI recommendations.",
      status: "Active",
      applicants: 12,
      members: 5,
      creator: "Samiya",
      tags: ["AI", "Web", "Startup"],
    },
    {
      id: 2,
      name: "CampusVerse",
      description:
        "Student collaboration platform for projects and networking.",
      status: "Recruiting",
      applicants: 21,
      members: 7,
      creator: "Ayesha",
      tags: ["Community", "React", "Firebase"],
    },
  ]);

  const recommendedProjects = [
    "AI Resume Analyzer",
    "Hackathon Finder",
    "AR/VR Learning Hub",
    "Founder Match",
  ];

  const teammates = [
    {
      name: "Sarah Khan",
      role: "UI/UX Designer",
      match: "89%",
    },
    {
      name: "Ali Ahmed",
      role: "Frontend Developer",
      match: "94%",
    },
  ];

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">
          SyncUp
        </div>

        <div className="sidebar-menu">

          <button className="menu-btn">
            Dashboard
          </button>

          <button className="menu-btn">
            Explore Projects
          </button>

          <button className="menu-btn">
            Team Finder
          </button>

          <button
            className="menu-btn"
            onClick={() => navigate("/chat")}
          >
            Messages
          </button>

          <button
            className="menu-btn"
            onClick={() => navigate("/notifications")}
          >
            Notifications
          </button>

          <button
            className="menu-btn"
            onClick={() => navigate("/ai-copilot")}
          >
            AI Copilot
          </button>

          <button
            className="menu-btn"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="main-content">

        {/* TOP NAVBAR */}

        <div className="topbar">

          <div>

            <h1 className="welcome-title">
              Welcome back, Samiya 👋
            </h1>

            <p className="welcome-subtitle">
              Build startups. Find teammates. Ship products.
            </p>

          </div>

          <div className="topbar-actions">

            <input
              className="search-box"
              placeholder="Search projects..."
            />

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
            <p>8</p>
          </div>

          <div className="stat-card">
            <h3>Applications</h3>
            <p>24</p>
          </div>

          <div className="stat-card">
            <h3>Teams</h3>
            <p>6</p>
          </div>

          <div className="stat-card">
            <h3>Communities</h3>
            <p>14</p>
          </div>

        </div>
        {/* RECOMMENDED PROJECTS */}

        <div className="section">

          <div className="section-header">
            <h2>🔥 Recommended For You</h2>
          </div>

          <div className="recommended-grid">

            {recommendedProjects.map((project, index) => (
              <div key={index} className="recommended-card">

                <h3>{project}</h3>

                <p>
                  Recommended based on your interests and startup activity.
                </p>

                <button className="explore-btn">
                  Explore →
                </button>

              </div>
            ))}

          </div>

        </div>

        {/* PROJECTS */}

        <div className="section">

          <div className="section-header">

            <h2>🚀 Startup Projects</h2>

            <button className="browse-btn">
              Browse All
            </button>

          </div>

          <div className="projects-grid">

            {projects.map((project) => (

              <div key={project.id} className="project-card">

                <div className="project-top">

                  <div>
                    <h3>{project.name}</h3>

                    <p className="creator">
                      Created by {project.creator}
                    </p>
                  </div>

                  <span className="status-badge">
                    {project.status}
                  </span>

                </div>

                <p className="project-description">
                  {project.description}
                </p>

                <div className="tags">

                  {project.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}

                </div>

                <div className="metrics">

                  <div className="metric">
                    <span>👥</span>
                    <strong>{project.members}</strong>
                    <p>Members</p>
                  </div>

                  <div className="metric">
                    <span>📩</span>
                    <strong>{project.applicants}</strong>
                    <p>Applicants</p>
                  </div>

                  <div className="metric">
                    <span>🚀</span>
                    <strong>75%</strong>
                    <p>Progress</p>
                  </div>

                </div>

                <div className="project-actions">

                  <button
                    className="primary-btn"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    View Project
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => navigate(`/manage/${project.id}`)}
                  >
                    Manage
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => navigate(`/members/${project.id}`)}
                  >
                    Members
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>
        {/* TEAM FINDER */}

        <div className="section">

          <div className="section-header">
            <h2>🤝 Team Finder</h2>
          </div>

          <div className="team-grid">

            {teammates.map((member, index) => (
              <div key={index} className="team-card">

                <div className="team-header">
                  <div>
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>

                  <div className="match-badge">
                    {member.match}
                  </div>
                </div>

                <div className="team-buttons">
                  <button className="primary-btn">
                    Connect
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => navigate("/chat")}
                  >
                    Message
                  </button>
                </div>

              </div>
            ))}

          </div>

        </div>

        {/* COMMUNITIES + ACTIVITY */}

        <div className="bottom-grid">

          <div className="community-card">

            <h2>🌍 Communities</h2>

            <div className="community-tags">

              <span>AI</span>
              <span>Cybersecurity</span>
              <span>Web Dev</span>
              <span>Startups</span>
              <span>AR/VR</span>
              <span>Design</span>
              <span>Machine Learning</span>
              <span>Robotics</span>

            </div>

          </div>

          <div className="activity-card">

            <h2>📈 Activity Feed</h2>

            <div className="activity-item">
              Sarah joined CampusVerse.
            </div>

            <div className="activity-item">
              3 new applications received.
            </div>

            <div className="activity-item">
              AI Resume Analyzer reached milestone 2.
            </div>

            <div className="activity-item">
              Hackathon registration now open.
            </div>

          </div>

        </div>

        {/* QUICK ACCESS */}

        <div className="quick-grid">

          <div
            className="quick-card"
            onClick={() => navigate("/ai-copilot")}
          >
            <h3>🚀 AI Co-Founder</h3>
            <p>
              Generate startup ideas, roadmaps and MVP plans.
            </p>
          </div>

          <div
            className="quick-card"
            onClick={() => navigate("/notifications")}
          >
            <h3>🔔 Notifications</h3>
            <p>
              Review invitations, applications and updates.
            </p>
          </div>

          <div
            className="quick-card"
            onClick={() => navigate("/chat")}
          >
            <h3>💬 Team Chat</h3>
            <p>
              Collaborate with your team in real-time.
            </p>
          </div>

        </div>

      </main>

      {/* CREATE PROJECT MODAL */}

      {showCreateModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>Create New Project</h2>

            <input
              type="text"
              placeholder="Project Name"
              className="modal-input"
            />

            <textarea
              placeholder="Project Description"
              className="modal-textarea"
            />

            <div className="modal-actions">

              <button className="primary-btn">
                Create Project
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
