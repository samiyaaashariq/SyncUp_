import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function ProjectDiscovery() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Explore Projects</h1>

      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div style={styles.grid}>
          {filteredProjects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            filteredProjects.map(project => (
              <div key={project.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{project.title}</h3>
                <p style={styles.desc}>{project.fullBrief?.substring(0, 120)}...</p>
                
                <div style={styles.tags}>
                  {project.tags?.map((tag, i) => <span key={i} style={styles.tag}>{tag}</span>) || "No tags"}
                </div>

                <button style={styles.joinBtn} onClick={() => alert("Joined project! (connect logic coming soon)")}>
                  Join Project
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "30px 20px", maxWidth: "1200px", margin: "0 auto" },
  title: { fontSize: "2.2rem", marginBottom: "20px", background: "linear-gradient(90deg, #67e8f9, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  search: {
    width: "100%",
    padding: "14px",
    marginBottom: "30px",
    background: "rgba(15,23,42,0.9)",
    border: "1px solid #67e8f9",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "1.1rem",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" },
  card: {
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(103,232,249,0.3)",
    borderRadius: "20px",
    padding: "24px",
  },
  cardTitle: { color: "#c084fc", marginBottom: "12px" },
  desc: { color: "#cbd5e1", marginBottom: "20px", lineHeight: "1.6" },
  tags: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" },
  tag: { background: "rgba(103,232,249,0.15)", color: "#67e8f9", padding: "4px 12px", borderRadius: "999px", fontSize: "0.85rem" },
  joinBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #ec4899, #c084fc)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontWeight: 600,
    cursor: "pointer",
  },
};
