import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function ProjectDiscovery() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(
          collection(db, "projects"),
          orderBy("createdAt", "desc"),
          limit(12)
        );
        const snapshot = await getDocs(q);
        
        const allProjects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProjects(allProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <h2 style={{ color: "#00ff9f", margin: 0 }}>🔍 Discover Projects</h2>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: "8px 20px",
            background: "transparent",
            color: "#80cbc4",
            border: "1px solid #80cbc4",
            borderRadius: "50px",
            cursor: "pointer"
          }}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#80cbc4" }}>Loading exciting projects...</p>
      ) : projects.length > 0 ? (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
          gap: "20px" 
        }}>
          {projects.map(project => (
            <div 
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              style={{
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid #334155",
                borderRadius: "16px",
                padding: "24px",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
            >
              <h3 style={{ margin: "0 0 12px 0", color: "#00ff9f" }}>
                {project.title || "Untitled Project"}
              </h3>
              
              <p style={{ 
                color: "#b2dfdb", 
                fontSize: "0.95rem", 
                marginBottom: "16px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}>
                {project.idea || project.description || "No description available"}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#80cbc4", fontSize: "0.9rem" }}>
                  👥 {project.members?.length || 1} member{project.members?.length !== 1 ? 's' : ''}
                </span>
                <span style={{ 
                  background: "#00ff9f", 
                  color: "#0a0a0a", 
                  padding: "4px 14px", 
                  borderRadius: "9999px",
                  fontSize: "0.85rem",
                  fontWeight: "600"
                }}>
                  Join
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No public projects yet. Be the first to create one!</p>
      )}
    </div>
  );
}
