import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import TeamMatcher from "../components/TeamMatcher";   // ← We created this earlier

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDoc = await getDoc(doc(db, "projects", id));
        if (projectDoc.exists()) {
          setProject({ id: projectDoc.id, ...projectDoc.data() });
        } else {
          alert("Project not found");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  if (loading) return <div style={{ textAlign: "center", marginTop: "100px" }}>Loading project...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a, #001a14, #002b24)",
      color: "#e0f2f1",
      padding: "30px",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "2.8rem", margin: "0 0 8px 0", color: "#00ff9f" }}>
              {project.title || "Untitled Project"}
            </h1>
            <p style={{ color: "#80cbc4" }}>Created by {project.createdBy}</p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button 
              onClick={() => navigate(`/chat/${id}`)}
              style={{
                padding: "12px 28px",
                background: "#1e2937",
                border: "1px solid #00ff9f",
                color: "#00ff9f",
                borderRadius: "50px",
                cursor: "pointer"
              }}
            >
              💬 Open Team Chat
            </button>
            <button 
              onClick={() => navigate("/manage/" + id)}
              style={{
                padding: "12px 28px",
                background: "linear-gradient(90deg, #00ff9f, #00b8d4)",
                color: "#0a0a0a",
                border: "none",
                borderRadius: "50px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              Manage Project
            </button>
          </div>
        </div>

        {/* Project Info */}
        <div style={{
          background: "rgba(15, 23, 42, 0.95)",
          borderRadius: "16px",
          padding: "30px",
          marginBottom: "30px",
          border: "1px solid #334155"
        }}>
          <h3 style={{ color: "#00b8d4" }}>📝 Description</h3>
          <p style={{ lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
            {project.fullBrief || project.idea || project.description || "No description available."}
          </p>
        </div>

        {/* Team Matching */}
        <TeamMatcher project={project} />

        {/* Quick Actions */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <button 
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "14px 32px",
              background: "transparent",
              color: "#80cbc4",
              border: "2px solid #80cbc4",
              borderRadius: "50px",
              marginRight: "15px"
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
